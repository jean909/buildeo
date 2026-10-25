import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageBreadcrumbs, type Crumb } from "@/components/layout/page-breadcrumbs";
import { ListingCard } from "@/components/listing/listing-card";
import { SuchauftragTeaser } from "@/app/[locale]/suche/components/suchauftrag-teaser";
import { buildSearchQuery } from "@/lib/filter-listings";
import { listListings, getFeaturedListings } from "@/lib/listings-repo";
import { shouldSkipOptionalDbReadsDuringPrerender } from "@/lib/is-next-build-phase";
import {
  buildSeoPageJsonLd,
  resolveSeoSlug,
  seoPageToSearchFilters,
} from "@/lib/seo";
import type { Listing } from "@/types/listing";
import { SeoMarketStats } from "./components/seo-market-stats";
import { SeoCityGuide } from "./components/seo-city-guide";
import { SeoDistrictsGrid } from "./components/seo-districts-grid";
import { SeoFaqSection } from "./components/seo-faq-section";
import { SeoInternalLinks } from "./components/seo-internal-links";

type Props = {
  params: Promise<{ locale: string; seoSlug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { seoSlug } = await params;
  const page = resolveSeoSlug(seoSlug);
  if (!page) {
    return {};
  }

  const rentStr = page.effectiveRentPerM2.toFixed(2).replace(".", ",");
  const buyStr = page.effectiveBuyPerM2.toLocaleString("de-DE");

  let activeCount = 0;
  let minPriceEur: number | null = null;

  if (!shouldSkipOptionalDbReadsDuringPrerender()) {
    try {
      const filters = seoPageToSearchFilters(page);
      let matches = await listListings(filters);
      if (matches.length === 0 && page.district) {
        matches = await listListings({ ...filters, q: page.city.name });
      }
      activeCount = matches.length;
      if (matches.length > 0) {
        minPriceEur = Math.min(...matches.map((m) => m.priceEur));
      }
    } catch {
      /* DB offline */
    }
  }

  const countPrefix = activeCount > 0 ? `${activeCount} ` : "";
  const minPriceSuffix =
    minPriceEur != null ? ` ab ${minPriceEur.toLocaleString("de-DE")} €` : "";

  const title = `${countPrefix}${page.intent.label} ${page.locationName}${minPriceSuffix} – ${page.intent.pluralLabel} ${page.intent.actionLabel}`;
  const description = `${
    activeCount > 0
      ? `${activeCount} aktuelle Angebote für ${page.intent.label} in ${page.locationName}${minPriceSuffix}. `
      : `${page.intent.label} in ${page.locationName} (${page.city.bundesland}): `
  }Ø Miete ${rentStr} €/m², Ø Kaufpreis ${buyStr} €/m². Vergleichen Sie Stadtteile, historische Architektur & Marktpreise auf Buildeo.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${page.fullSlug}`,
    },
    openGraph: {
      title: `${title} · Buildeo`,
      description,
      type: "website",
      url: `/${page.fullSlug}`,
    },
  };
}

export default async function SeoLocationLandingPage({ params }: Props) {
  const { locale, seoSlug } = await params;
  setRequestLocale(locale);

  const page = resolveSeoSlug(seoSlug);
  if (!page) {
    notFound();
  }

  const filters = seoPageToSearchFilters(page);
  const searchQuery = buildSearchQuery(filters);

  let cityListings: Listing[] = [];
  let fallbackListings: Listing[] = [];

  if (!shouldSkipOptionalDbReadsDuringPrerender()) {
    try {
      cityListings = await listListings(filters);
      // If district filter was too specific, try city-wide listings
      if (cityListings.length === 0 && page.district) {
        cityListings = await listListings({
          ...filters,
          q: page.city.name,
        });
      }
      // If still no listings in this city yet, show latest Germany-wide featured listings as inspiration
      if (cityListings.length === 0) {
        fallbackListings = await getFeaturedListings(3);
      }
    } catch {
      /* DB offline */
    }
  }

  const siteBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildeo.de";
  const jsonLd = buildSeoPageJsonLd(page, cityListings, siteBaseUrl);

  const breadcrumbs: Crumb[] = [
    { href: "/", label: "Startseite" },
    { href: "/staedte", label: "Städte & Regionen" },
    ...(page.district
      ? [
          {
            href: `/${page.intent.prefix}-${page.city.slug}`,
            label: `${page.intent.label} ${page.city.name}`,
          },
          { label: page.district.name },
        ]
      : [{ label: `${page.intent.label} ${page.city.name}` }]),
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageBreadcrumbs items={breadcrumbs} />

      {/* Hero Header */}
      <header className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
          <span>{page.city.bundesland}</span>
          <span>·</span>
          <span>PLZ {page.district?.postalCode ?? page.city.postalCodes}</span>
          <span>·</span>
          <span>{page.city.districts.length} Stadtteile</span>
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-50">
          {page.intent.label} in {page.locationName}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Sie suchen nach <strong>{page.intent.pluralLabel}</strong> in{" "}
          <strong>{page.locationFullLabel}</strong>? Vergleichen Sie aktuelle Angebote,
          Quadratmeterpreise (Ø{" "}
          {page.effectiveRentPerM2.toFixed(2).replace(".", ",")} €/m² Miete · Ø{" "}
          {page.effectiveBuyPerM2.toLocaleString("de-DE")} €/m² Kauf), beliebte Quartiere
          sowie historische und architektonische Besonderheiten von {page.city.name}.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/suche${searchQuery}`}
            className="inline-flex items-center justify-center rounded-xl bg-bd-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-bd-primary-hover"
          >
            Alle Angebote in {page.locationName} auf der Karte filtern →
          </Link>
          <Link
            href="/inserat/neu"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Immobilie in {page.city.name} kostenlos inserieren
          </Link>
        </div>
      </header>

      {/* Active Listings or Search Alert CTA */}
      <section className="mt-10" aria-labelledby="listings-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="listings-heading"
              className="text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-zinc-50"
            >
              {cityListings.length > 0
                ? `Aktuelle Inserate: ${page.intent.pluralLabel} in ${page.locationName}`
                : `${page.intent.pluralLabel} in ${page.locationName} vormerken & entdecken`}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {cityListings.length > 0
                ? `${cityListings.length} passende Immobilienangebote für Ihre Suche in ${page.city.name}`
                : `Aktivieren Sie den kostenlosen Suchauftrag für ${page.locationName} oder veröffentlichen Sie das erste Inserat vor Ort.`}
            </p>
          </div>
          <Link
            href={`/suche${searchQuery}`}
            className="text-sm font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300"
          >
            Zur interaktiven Suche →
          </Link>
        </div>

        <div className="mt-6">
          <SuchauftragTeaser />
        </div>

        {cityListings.length > 0 ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cityListings.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        ) : fallbackListings.length > 0 ? (
          <div className="mt-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Empfohlene Immobilienangebote auf Buildeo
            </p>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackListings.map((listing) => (
                <li key={listing.id}>
                  <ListingCard listing={listing} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* Market Statistics & Price Table */}
      <SeoMarketStats page={page} />

      {/* History, Architecture & Living Guide */}
      <SeoCityGuide page={page} />

      {/* Districts / Stadtteile Grid */}
      <SeoDistrictsGrid page={page} />

      {/* Structured FAQ */}
      <SeoFaqSection page={page} />

      {/* Internal Linking Matrix */}
      <SeoInternalLinks page={page} />
    </main>
  );
}
