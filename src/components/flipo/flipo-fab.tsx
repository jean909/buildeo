"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FlipoNodesIcon } from "./flipo-nodes-icon";
import { useFlipoSearch } from "./use-flipo-search";
import { FlipoResultList } from "./flipo-result-list";

export function FlipoFab() {
  const t = useTranslations("home.flipo");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const { search, loading, error, listings } = useFlipoSearch();

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[120] flex flex-col items-end gap-3 sm:bottom-8 sm:right-8">
      {open ? (
        <div
          className="pointer-events-auto w-[min(calc(100vw-2.5rem),22rem)] rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
          role="dialog"
          aria-label={t("fabTitle")}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                <FlipoNodesIcon className="h-4 w-4 text-bd-primary dark:text-teal-400" />
                {t("fabTitle")}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{t("fabTeaser")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label={t("fabClose")}
            >
              ×
            </button>
          </div>
          <form
            className="mt-3 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void search(q);
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("fabPlaceholder")}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-bd-primary focus:outline-none focus:ring-2 focus:ring-bd-primary/25 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-bd-primary py-2 text-sm font-bold text-bd-primary-fg hover:bg-bd-primary-hover disabled:opacity-60"
            >
              {loading ? "…" : t("fabSend")}
            </button>
          </form>
          {error ? <p className="mt-2 text-xs text-red-600 dark:text-red-400">{t("error")}</p> : null}
          <div className="mt-3 max-h-[50vh] overflow-y-auto">
            <FlipoResultList listings={listings} />
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 bg-white text-2xl shadow-xl transition hover:scale-105 hover:shadow-2xl dark:border-zinc-700 dark:bg-zinc-900"
        aria-expanded={open}
        aria-label={open ? t("fabClose") : t("openAssistant")}
      >
        ✨
      </button>
    </div>
  );
}
