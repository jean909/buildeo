import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buildSearchQuery, clearRentOnlyParams, type SearchFilterState } from "@/lib/filter-listings";
import { SearchHiddenFields } from "./search-hidden-fields";

type Props = {
  filters: SearchFilterState;
};

export async function SearchToolbar({ filters }: Props) {
  const t = await getTranslations("search");
  const q = (next: Partial<SearchFilterState>) => buildSearchQuery(filters, next);
  const cleared = clearRentOnlyParams(filters);

  const segment =
    "rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bd-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900";
  const active = "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900";
  const inactive = "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {t("filterSegmentLabel")}
            </span>
            <div className="inline-flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800/80">
              <Link
                href={`/suche${buildSearchQuery(cleared, { typ: undefined })}`}
                className={`${segment} ${filters.typ === undefined ? active : inactive}`}
              >
                {t("filterAll")}
              </Link>
              <Link href={`/suche${q({ typ: "mieten" })}`} className={`${segment} ${filters.typ === "mieten" ? active : inactive}`}>
                {t("filterRent")}
              </Link>
              <Link
                href={`/suche${buildSearchQuery(cleared, { typ: "kaufen" })}`}
                className={`${segment} ${filters.typ === "kaufen" ? active : inactive}`}
              >
                {t("filterBuy")}
              </Link>
            </div>
          </div>

          <form className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[min(100%,360px)]" action="" method="get">
            <SearchHiddenFields filters={filters} omit={["q"]} />
            <label htmlFor="suche-q" className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {t("queryLabel")}
            </label>
            <div className="flex gap-2">
              <input
                id="suche-q"
                name="q"
                type="search"
                defaultValue={filters.q}
                placeholder={t("queryPlaceholder")}
                className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-bd-primary focus:outline-none focus:ring-2 focus:ring-bd-primary/25 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-bd-primary px-5 py-2.5 text-sm font-semibold text-bd-primary-fg shadow-sm hover:bg-bd-primary-hover"
              >
                {t("submitSearch")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
