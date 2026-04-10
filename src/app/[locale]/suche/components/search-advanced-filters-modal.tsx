"use client";

import { useEffect, type FormEvent } from "react";
import { usePathname } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { RENT_FEATURE_KEYS, type SearchFilterState } from "@/lib/filter-listings";

type Props = {
  open: boolean;
  onClose: () => void;
  filters: SearchFilterState;
  resultCount: number;
};

function featureLabelKey(k: string) {
  return `pill${k.charAt(0).toUpperCase()}${k.slice(1)}` as const;
}

export function SearchAdvancedFiltersModal({ open, onClose, filters, resultCount }: Props) {
  const tRent = useTranslations("search.rent");
  const pathname = usePathname();
  const router = useRouter();
  const isRent = filters.typ === "mieten";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function applyFilters(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of fd.entries()) {
      if (typeof value !== "string" || value.trim() === "") continue;
      params.append(key, value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[210] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-filter-modal-title"
    >
      <button type="button" className="absolute inset-0 bg-black/45 dark:bg-black/60" aria-label={tRent("modalClose")} onClick={onClose} />
      <div className="relative flex max-h-[min(92dvh,880px)] w-full max-w-4xl flex-col rounded-t-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-950 sm:rounded-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-4 py-4 dark:border-zinc-800 sm:px-6">
          <h2 id="search-filter-modal-title" className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {tRent("modalTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label={tRent("modalClose")}
          >
            ×
          </button>
        </div>

        <form onSubmit={applyFilters} className="flex min-h-0 flex-1 flex-col">
          {filters.typ ? <input type="hidden" name="typ" value={filters.typ} /> : null}

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{tRent("modalSectionLocation")}</p>
            <input
              name="q"
              type="search"
              defaultValue={filters.q}
              placeholder={tRent("modalLocationPh")}
              className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-bd-primary focus:outline-none focus:ring-2 focus:ring-bd-primary/25 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />

            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{tRent("modalSectionPrice")}</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <input
                name="preisMin"
                type="number"
                min={0}
                step={1}
                placeholder={tRent("modalEgal")}
                defaultValue={filters.preisMin ?? ""}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <input
                name="preisMax"
                type="number"
                min={0}
                step={1}
                placeholder={tRent("modalEgal")}
                defaultValue={filters.preisMax ?? ""}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{tRent("modalSectionArea")}</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <input
                name="flaecheMin"
                type="number"
                min={0}
                step={1}
                placeholder={tRent("modalEgal")}
                defaultValue={filters.flaecheMin ?? ""}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <input
                name="flaecheMax"
                type="number"
                min={0}
                step={1}
                placeholder={tRent("modalEgal")}
                defaultValue={filters.flaecheMax ?? ""}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{tRent("modalSectionRooms")}</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <input
                name="zimmerMin"
                type="number"
                min={1}
                max={20}
                step={1}
                placeholder={tRent("modalEgal")}
                defaultValue={filters.zimmerMin ?? ""}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <input
                name="zimmerMax"
                type="number"
                min={1}
                max={20}
                step={1}
                placeholder={tRent("modalEgal")}
                defaultValue={filters.zimmerMax ?? ""}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            {isRent ? (
              <>
                <div className="mt-6 space-y-3 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                    <input
                      type="checkbox"
                      name="neinNeubau"
                      value="1"
                      defaultChecked={filters.neinNeubau}
                      className="h-4 w-4 rounded border-zinc-300 text-bd-primary focus:ring-bd-primary/30 dark:border-zinc-600"
                    />
                    {tRent("modalNoNewBuilds")}
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                    <input
                      type="checkbox"
                      name="nurNeu"
                      value="1"
                      defaultChecked={filters.nurNeu}
                      className="h-4 w-4 rounded border-zinc-300 text-bd-primary focus:ring-bd-primary/30 dark:border-zinc-600"
                    />
                    {tRent("modalOnlyNew")}
                  </label>
                </div>

                <p className="mt-6 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{tRent("modalSectionFeatures")}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {RENT_FEATURE_KEYS.map((k) => (
                    <label key={k} className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800 dark:text-zinc-200">
                      <input
                        type="checkbox"
                        name={k}
                        value="1"
                        defaultChecked={!!filters.features[k]}
                        className="h-4 w-4 rounded border-zinc-300 text-bd-primary focus:ring-bd-primary/30 dark:border-zinc-600"
                      />
                      {tRent(featureLabelKey(k))}
                    </label>
                  ))}
                </div>

                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{tRent("modalFeatureHint")}</p>
              </>
            ) : null}
          </div>

          <div className="shrink-0 border-t border-zinc-100 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                {tRent("modalCancel")}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
              >
                {tRent("modalSubmit", { count: resultCount })}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
