import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/listing/listing-card";
import { listListings } from "@/lib/listings-repo";
import { parseSearchFilters } from "@/lib/filter-listings";
import { SearchToolbar } from "./components/search-toolbar";
import { SearchMapPanel } from "./components/search-map-panel";
import { SuchauftragTeaser } from "./components/suchauftrag-teaser";
import { SearchFilterChrome } from "./components/search-filter-chrome";
import type { MapPin } from "@/types/map-pin";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const filters = parseSearchFilters(sp);

  const results = await listListings(filters);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? null;

  const pins: MapPin[] = results
    .filter((r) => r.lat != null && r.lng != null)
    .map((r) => ({
      slug: r.slug,
      lat: r.lat as number,
      lng: r.lng as number,
      title: r.title,
    }));

  const t = await getTranslations("search");
  const firstSlug = results[0]?.slug ?? "";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:max-w-none">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {filters.typ === "mieten" ? t("rent.pageTitle", { count: results.length }) : t("title")}
            </h1>
            <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              {filters.typ === "mieten" ? t("rent.pageSubtitle") : t("subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium tabular-nums text-zinc-700 dark:text-zinc-300">
              {t("resultsCount", { count: results.length })}
            </p>
            <span
              className="hidden h-8 items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-500 sm:inline-flex dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
              title={t("sortNewest")}
            >
              {t("sortLabel")}: {t("sortNewest")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:grid lg:min-h-[calc(100dvh-3.5rem)] lg:grid-cols-[minmax(0,1fr)_400px] lg:overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
          <SuchauftragTeaser />

          <div className="mt-6 space-y-6">
            <SearchToolbar filters={filters} />
            <SearchFilterChrome filters={filters} resultCount={results.length} />
          </div>

          <div className="mt-6 lg:hidden">
            <SearchMapPanel pins={pins} mapboxToken={mapboxToken} variant="compact" />
          </div>

          {results.length === 0 ? (
            <p className="mt-8 rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-600 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              {t("resultsEmpty")}
            </p>
          ) : (
            <ul className="mt-8 grid max-w-2xl gap-6 sm:grid-cols-1 lg:max-w-none xl:max-w-4xl xl:grid-cols-2">
              {results.map((listing) => (
                <li key={listing.id}>
                  <ListingCard listing={listing} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-white/60 p-5 dark:border-zinc-700 dark:bg-zinc-900/40">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t("hint")}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{t("mapHint")}</p>
            {firstSlug ? (
              <Link
                href={`/inserat/${firstSlug}`}
                className="mt-3 inline-block text-sm font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300"
              >
                {t("exampleLink")} →
              </Link>
            ) : null}
          </div>
        </div>

        <aside className="hidden min-h-0 border-l border-zinc-200 bg-[var(--bd-page)] lg:block dark:border-zinc-800">
          <div className="sticky top-14 h-[calc(100dvh-3.5rem)] p-4">
            <SearchMapPanel pins={pins} mapboxToken={mapboxToken} variant="tall" />
          </div>
        </aside>
      </div>
    </div>
  );
}
