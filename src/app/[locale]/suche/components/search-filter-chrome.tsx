"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  RENT_FEATURE_KEYS,
  toggleNeinNeubau,
  toggleNurNeu,
  toggleRentFeature,
  type RentFeatureKey,
  type SearchFilterState,
} from "@/lib/filter-listings";
import { SearchAdvancedFiltersModal } from "./search-advanced-filters-modal";

type Props = {
  filters: SearchFilterState;
  resultCount: number;
};

function pillClass(active: boolean) {
  return [
    "inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-sm transition",
    active
      ? "border-bd-primary bg-teal-50 font-semibold text-bd-primary ring-1 ring-bd-primary/25 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-500/25"
      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600",
  ].join(" ");
}

function pillKey(k: RentFeatureKey) {
  return `pill${k.charAt(0).toUpperCase()}${k.slice(1)}` as
    | "pillBalkon"
    | "pillGarten"
    | "pillGarage"
    | "pillEbk"
    | "pillKeller"
    | "pillAufzug";
}

/** Bară Filter + (opțional) mod Flipo și quick-pills doar pentru Miete */
export function SearchFilterChrome({ filters, resultCount }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const tRent = useTranslations("search.rent");
  const tSearch = useTranslations("search");
  const isRent = filters.typ === "mieten";

  return (
    <>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {isRent ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{tRent("modeLabel")}</span>
              <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
                <span className="rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100">
                  {tRent("modeClassic")}
                </span>
                <Link
                  href="/#flipo-heading"
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {tRent("modeFlipo")}
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{tSearch("filterSheetHint")}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              {tRent("filterButton")}
            </button>
            <Link
              href="#suchauftrag"
              className="inline-flex items-center gap-2 rounded-lg bg-bd-primary px-4 py-2 text-sm font-bold text-bd-primary-fg shadow-sm hover:bg-bd-primary-hover"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path
                  d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {tRent("saveSearch")}
            </Link>
          </div>
        </div>

        {isRent ? (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            {RENT_FEATURE_KEYS.map((k) => (
              <Link key={k} href={`/suche${toggleRentFeature(filters, k)}`} className={pillClass(!!filters.features[k])}>
                {tRent(pillKey(k))}
              </Link>
            ))}
            <Link href={`/suche${toggleNeinNeubau(filters)}`} className={pillClass(!!filters.neinNeubau)}>
              {tRent("pillNoNewBuilds")}
            </Link>
            <Link href={`/suche${toggleNurNeu(filters)}`} className={pillClass(!!filters.nurNeu)}>
              {tRent("pillAvailableSoon")}
            </Link>
          </div>
        ) : null}
      </div>

      <SearchAdvancedFiltersModal open={modalOpen} onClose={() => setModalOpen(false)} filters={filters} resultCount={resultCount} />
    </>
  );
}
