import type { SearchFilterState } from "@/lib/filter-listings";
import { ALL_SEO_CITIES, CITY_BY_SLUG, CITY_SLUG_ALIASES } from "./cities";
import { SEO_SEARCH_INTENTS } from "./intents";
import type { ResolvedSeoPage, SeoCity, SeoDistrict, SeoSearchIntent } from "./types";

/**
 * Sort intents by prefix length descending so longer prefixes (e.g. "wohnung-mieten")
 * match before shorter ones (e.g. "wohnung").
 */
const INTENTS_SORTED_BY_LENGTH: SeoSearchIntent[] = [...SEO_SEARCH_INTENTS].sort(
  (a, b) => b.prefix.length - a.prefix.length,
);

type LocationRecord = {
  city: SeoCity;
  district?: SeoDistrict;
  locationSlug: string;
};

/** Pre-indexed map of locationSlug ("bremen", "bremen-schwachhausen") -> LocationRecord for O(1) lookup */
const LOCATION_BY_SLUG = new Map<string, LocationRecord>();

function initLocationIndex() {
  if (LOCATION_BY_SLUG.size > 0) return;

  for (const city of ALL_SEO_CITIES) {
    LOCATION_BY_SLUG.set(city.slug, {
      city,
      locationSlug: city.slug,
    });

    for (const district of city.districts) {
      const districtLocationSlug = `${city.slug}-${district.slug}`;
      LOCATION_BY_SLUG.set(districtLocationSlug, {
        city,
        district,
        locationSlug: districtLocationSlug,
      });
    }
  }

  // Also register short city aliases (e.g. "frankfurt", "frankfurt-sachsenhausen")
  for (const [alias, canonicalCitySlug] of Object.entries(CITY_SLUG_ALIASES)) {
    const city = CITY_BY_SLUG.get(canonicalCitySlug);
    if (!city) continue;
    if (!LOCATION_BY_SLUG.has(alias)) {
      LOCATION_BY_SLUG.set(alias, {
        city,
        locationSlug: city.slug,
      });
    }
    for (const district of city.districts) {
      const aliasDistrictSlug = `${alias}-${district.slug}`;
      if (!LOCATION_BY_SLUG.has(aliasDistrictSlug)) {
        LOCATION_BY_SLUG.set(aliasDistrictSlug, {
          city,
          district,
          locationSlug: `${city.slug}-${district.slug}`,
        });
      }
    }
  }
}

function buildResolvedPage(intent: SeoSearchIntent, loc: LocationRecord): ResolvedSeoPage {
  const { city, district } = loc;
  const factor = district?.priceFactor ?? 1;
  const effectiveRentPerM2 = Math.round(city.avgRentPerM2 * factor * 100) / 100;
  const effectiveBuyPerM2 = Math.round((city.avgBuyPerM2 * factor) / 10) * 10;

  const locationName = district ? `${city.name}-${district.name}` : city.name;
  const locationFullLabel = district ? `${district.name} (${city.name})` : city.name;
  const canonicalLocationSlug = district ? `${city.slug}-${district.slug}` : city.slug;
  const fullSlug = `${intent.prefix}-${canonicalLocationSlug}`;

  return {
    fullSlug,
    intent,
    city,
    district,
    locationName,
    locationFullLabel,
    locationSlug: canonicalLocationSlug,
    effectiveRentPerM2,
    effectiveBuyPerM2,
  };
}

/**
 * Resolves any SEO slug like:
 * - "wohnung-bremen"
 * - "wohnung-mieten-bremen"
 * - "wohnung-bremen-schwachhausen"
 * - "3-zimmer-wohnung-muenchen-schwabing"
 * - Or reverse order like "bremen-wohnung" / "bremen-immobilien"
 * - Or bare city slug like "bremen" (defaults to "immobilien-bremen" / city overview)
 */
export function resolveSeoSlug(rawSlug: string): ResolvedSeoPage | null {
  initLocationIndex();
  const slug = rawSlug.trim().toLowerCase();
  if (!slug) return null;

  // 1. Standard pattern: "{intent.prefix}-{locationSlug}"
  for (const intent of INTENTS_SORTED_BY_LENGTH) {
    const prefixWithDash = `${intent.prefix}-`;
    if (slug.startsWith(prefixWithDash)) {
      const remainder = slug.slice(prefixWithDash.length);
      const loc = LOCATION_BY_SLUG.get(remainder);
      if (loc) {
        return buildResolvedPage(intent, loc);
      }
    }
  }

  // 2. Reverse pattern: "{locationSlug}-{intent.prefix}" (e.g. "bremen-wohnung")
  for (const intent of INTENTS_SORTED_BY_LENGTH) {
    const suffixWithDash = `-${intent.prefix}`;
    if (slug.endsWith(suffixWithDash)) {
      const remainder = slug.slice(0, slug.length - suffixWithDash.length);
      const loc = LOCATION_BY_SLUG.get(remainder);
      if (loc) {
        return buildResolvedPage(intent, loc);
      }
    }
  }

  // 3. Bare city or city-district slug (e.g. "/bremen" or "/bremen-schwachhausen")
  const bareLoc = LOCATION_BY_SLUG.get(slug);
  if (bareLoc) {
    const defaultIntent = SEO_SEARCH_INTENTS[0]; // "wohnung"
    return buildResolvedPage(defaultIntent, bareLoc);
  }

  return null;
}

/**
 * Converts a ResolvedSeoPage into a SearchFilterState for querying Prisma listings
 * and generating "/suche?..." filter links.
 */
export function seoPageToSearchFilters(page: ResolvedSeoPage): SearchFilterState {
  const { intent, city, district } = page;
  return {
    typ: intent.typ,
    q: district ? `${city.name} ${district.name}` : city.name,
    zimmerMin: intent.zimmerMin,
    zimmerMax: intent.zimmerMax,
    nurNeu: intent.nurNeu,
    neinNeubau: intent.neinNeubau,
    features: intent.feature ? { [intent.feature]: true } : {},
  };
}

/**
 * Generates dynamic FAQ items tailored to the specific city, district, and property search intent.
 */
export function buildSeoFaqItems(page: ResolvedSeoPage): { question: string; answer: string }[] {
  const { city, district, intent, locationName, effectiveRentPerM2, effectiveBuyPerM2 } = page;
  const example60m2Rent = Math.round(effectiveRentPerM2 * 60);
  const example80m2Rent = Math.round(effectiveRentPerM2 * 80);
  const example75m2Buy = Math.round((effectiveBuyPerM2 * 75) / 1000) * 1000;

  const districtNames = city.districts.slice(0, 6).map((d) => d.name).join(", ");

  const faqs: { question: string; answer: string }[] = [
    {
      question: `Was kostet eine ${intent.label} in ${locationName} aktuell?`,
      answer: `In ${locationName} (${city.bundesland}) liegt die durchschnittliche Kaltmiete aktuell bei rund ${effectiveRentPerM2.toFixed(2).replace(".", ",")} € pro m². Eine 60-m²-Wohnung kostet damit im Schnitt etwa ${example60m2Rent.toLocaleString("de-DE")} € kalt im Monat, während 80 m² bei ca. ${example80m2Rent.toLocaleString("de-DE")} € liegen. Beim Immobilienkauf in ${locationName} bewegen sich die Quadratmeterpreise durchschnittlich um ${effectiveBuyPerM2.toLocaleString("de-DE")} €/m² (ca. ${example75m2Buy.toLocaleString("de-DE")} € für 75 m²).`,
    },
    {
      question: district
        ? `Was zeichnet den Stadtteil ${district.name} in ${city.name} besonders aus?`
        : `Welche Stadtteile in ${city.name} sind für ${intent.pluralLabel} besonders beliebt?`,
      answer: district
        ? `${district.name} gehört zu den gefragten Wohnlagen in ${city.name} (PLZ-Bereich ${district.postalCode ?? city.postalCodes}): ${district.character} Zudem profitieren Bewohner von der guten Anbindung an das Stadtzentrum von ${city.name} und Sehenswürdigkeiten wie ${city.landmarks.slice(0, 3).join(", ")}.`
        : `Zu den beliebtesten Stadtteilen und Quartieren in ${city.name} zählen unter anderem ${districtNames}. Je nach Lebensstil finden Suchende dort sowohl historische Altbauten als auch ruhige Familienlagen und moderne Neubauprojekte.`,
    },
    {
      question: `Welche Rolle spielen Geschichte und Architektur auf dem Wohnungsmarkt in ${city.name}?`,
      answer: `${city.historyText} ${city.architectureText}`,
    },
    {
      question: `Wie finde ich schnell passende ${intent.pluralLabel} in ${locationName} auf Buildeo?`,
      answer: `Auf Buildeo können Sie aktuelle Inserate für ${intent.pluralLabel} in ${locationName} direkt auf der interaktiven Karte vergleichen, nach Zimmeranzahl, Wohnfläche, Balkon oder Einbauküche filtern und über den kostenlosen Suchauftrag sofort per E-Mail informiert werden, sobald neue Objekte in ${locationName} erscheinen.`,
    },
  ];

  return faqs;
}

/**
 * Total count of all canonical pSEO combinations (Intents × (Cities + Districts)).
 */
export function getTotalSeoPagesCount(): {
  citiesCount: number;
  districtsCount: number;
  locationsCount: number;
  intentsCount: number;
  totalPagesCount: number;
} {
  initLocationIndex();
  const citiesCount = ALL_SEO_CITIES.length;
  const districtsCount = ALL_SEO_CITIES.reduce((acc, c) => acc + c.districts.length, 0);
  const locationsCount = citiesCount + districtsCount;
  const intentsCount = SEO_SEARCH_INTENTS.length;
  return {
    citiesCount,
    districtsCount,
    locationsCount,
    intentsCount,
    totalPagesCount: locationsCount * intentsCount,
  };
}

/**
 * Returns all canonical pSEO URL entries in deterministic order for chunked sitemaps.
 */
export function getSeoSitemapSlice(offset: number, limit: number): {
  slug: string;
  priority: number;
}[] {
  const allLocations: { slug: string; isDistrict: boolean }[] = [];
  for (const city of ALL_SEO_CITIES) {
    allLocations.push({ slug: city.slug, isDistrict: false });
    for (const d of city.districts) {
      allLocations.push({ slug: `${city.slug}-${d.slug}`, isDistrict: true });
    }
  }

  const totalLocations = allLocations.length;
  const intentsCount = SEO_SEARCH_INTENTS.length;
  const total = totalLocations * intentsCount;
  const end = Math.min(offset + limit, total);
  const results: { slug: string; priority: number }[] = [];

  for (let idx = offset; idx < end; idx++) {
    const locIdx = Math.floor(idx / intentsCount);
    const intentIdx = idx % intentsCount;
    const loc = allLocations[locIdx];
    const intent = SEO_SEARCH_INTENTS[intentIdx];
    if (!loc || !intent) continue;
    results.push({
      slug: `${intent.prefix}-${loc.slug}`,
      priority: loc.isDistrict ? Math.max(0.6, intent.sitemapPriority - 0.1) : intent.sitemapPriority,
    });
  }

  return results;
}
