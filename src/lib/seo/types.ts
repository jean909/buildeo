import type { RentFeatureKey, SearchTyp } from "@/lib/filter-listings";

export type SeoDistrict = {
  /** Slug segment, e.g. "schwachhausen" or "kreuzberg" */
  slug: string;
  /** Display name, e.g. "Schwachhausen" or "Kreuzberg" */
  name: string;
  /** Short characterization of living quality, architecture, or vibe */
  character: string;
  /** Price multiplier relative to the city average (e.g. 1.15 for +15%, 0.9 for -10%) */
  priceFactor?: number;
  /** Representative postal code for this district */
  postalCode?: string;
};

export type SeoCity = {
  /** URL-safe slug, e.g. "bremen", "muenchen", "frankfurt-am-main" */
  slug: string;
  /** Official display name, e.g. "Bremen", "München", "Frankfurt am Main" */
  name: string;
  /** German federal state, e.g. "Bremen", "Bayern", "Nordrhein-Westfalen" */
  bundesland: string;
  /** Approximate population */
  population: number;
  /** Average cold rent in EUR per m² */
  avgRentPerM2: number;
  /** Average purchase price in EUR per m² */
  avgBuyPerM2: number;
  /** Representative postal code range or primary PLZ, e.g. "28195–28779" */
  postalCodes: string;
  /** Latitude of city center */
  lat: number;
  /** Longitude of city center */
  lng: number;
  /** Historical background (2-3 rich sentences in German about history, founding, Hanseatic/royal/industrial heritage, landmarks) */
  historyText: string;
  /** Architectural & residential character (1-2 sentences in German about typical building styles like Altbremer Haus, Gründerzeit, Backstein, Neubauquartiere) */
  architectureText: string;
  /** Economy, universities & infrastructure summary in German */
  economyAndInfraText: string;
  /** Notable landmarks / sights in German */
  landmarks: string[];
  /** Districts / Stadtteile of this city */
  districts: SeoDistrict[];
};

export type SeoSearchIntent = {
  /** Prefix in URL before the location slug, e.g. "wohnung", "wohnung-mieten", "3-zimmer-wohnung" */
  prefix: string;
  /** Short German label, e.g. "Wohnung", "Wohnung mieten", "3-Zimmer-Wohnung" */
  label: string;
  /** Plural or headline noun in German, e.g. "Wohnungen", "Mietwohnungen", "3-Zimmer-Wohnungen" */
  pluralLabel: string;
  /** Verb phrase for titles, e.g. "finden & vergleichen", "mieten", "kaufen" */
  actionLabel: string;
  /** Maps to SearchFilterState.typ */
  typ: SearchTyp;
  /** Optional minimum rooms filter */
  zimmerMin?: number;
  /** Optional maximum rooms filter */
  zimmerMax?: number;
  /** Optional rent feature filter */
  feature?: RentFeatureKey;
  /** Optional neubau / altbau filter */
  nurNeu?: boolean;
  neinNeubau?: boolean;
  /** Category for grouping internal links */
  category: "core" | "rooms" | "features" | "house" | "special";
  /** Priority in sitemap (0.6 - 0.9) */
  sitemapPriority: number;
};

export type ResolvedSeoPage = {
  fullSlug: string;
  intent: SeoSearchIntent;
  city: SeoCity;
  district?: SeoDistrict;
  /** Effective location display name, e.g. "Bremen" or "Bremen-Schwachhausen" */
  locationName: string;
  /** Effective location short name, e.g. "Bremen" or "Schwachhausen (Bremen)" */
  locationFullLabel: string;
  /** Effective location slug, e.g. "bremen" or "bremen-schwachhausen" */
  locationSlug: string;
  /** Effective average rent per m² (adjusted for district if present) */
  effectiveRentPerM2: number;
  /** Effective average buy price per m² (adjusted for district if present) */
  effectiveBuyPerM2: number;
};
