"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { FlipoNodesIcon } from "./flipo-nodes-icon";
import { useFlipoSearch } from "./use-flipo-search";
import { FlipoResultList } from "./flipo-result-list";

const BANNER_SRC =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80";

export function FlipoKiBanner() {
  const t = useTranslations("home.flipo");
  const [q, setQ] = useState("");
  const { search, loading, error, listings, usedAi } = useFlipoSearch();

  return (
    <section
      className="border-b border-zinc-200 bg-[var(--bd-page)] dark:border-zinc-800"
      aria-labelledby="flipo-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="relative isolate overflow-hidden rounded-3xl shadow-[var(--shadow-bd-float)] ring-1 ring-zinc-200/60 dark:ring-zinc-700/50">
          <div className="absolute inset-0 -z-10">
            <Image
              src={BANNER_SRC}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 1280px) calc(100vw - 2rem), 1200px"
            />
            <div className="absolute inset-0 bg-zinc-900/50 dark:bg-zinc-950/65" />
          </div>

          <div className="px-4 py-14 sm:px-6 sm:py-16">
            <div className="rounded-3xl border border-white/25 bg-white/[0.14] p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/30 sm:p-8 lg:p-10">
              {/* Zeile wie IS24: links Claim, rechts weiße KI-Pille mit Glow */}
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
                <div className="max-w-xl shrink-0 lg:pr-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal-100/95">{t("title")}</p>
                  <h2
                    id="flipo-heading"
                    className="mt-3 text-2xl font-bold leading-snug text-white sm:text-3xl lg:text-[1.75rem] lg:leading-tight"
                  >
                    {t("subtitle")}
                  </h2>
                </div>

                <form
                  className="flex w-full min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:max-w-[min(100%,28rem)] lg:justify-end xl:max-w-[32rem]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void search(q);
                  }}
                >
                  <div className="relative flex min-h-[3.25rem] flex-1 items-center gap-3 rounded-full border border-white/40 bg-white pl-4 pr-2 shadow-[0_0_32px_-6px_rgba(34,211,238,0.55),0_8px_24px_-8px_rgba(0,0,0,0.25)] dark:border-cyan-400/25 dark:shadow-[0_0_36px_-4px_rgba(34,211,238,0.35)]">
                    <FlipoNodesIcon className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={t("placeholder")}
                      className="min-w-0 flex-1 bg-transparent py-2 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                      aria-label={t("placeholder")}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-[3.25rem] min-w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-bd-primary px-4 text-sm font-bold text-bd-primary-fg shadow-lg transition hover:bg-bd-primary-hover disabled:opacity-60 sm:min-w-0 sm:px-7"
                    aria-label={t("submit")}
                  >
                    {loading ? (
                      <span className="text-lg leading-none">…</span>
                    ) : (
                      <>
                        <span className="hidden sm:inline">{t("submit")}</span>
                        <span className="sm:hidden" aria-hidden>
                          →
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-white/70 lg:max-w-2xl">{t("hint")}</p>
              {usedAi ? (
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-200/90">{t("usedAiBadge")}</p>
              ) : null}

              {error ? <p className="mt-4 text-sm font-medium text-amber-200">{t("error")}</p> : null}
              {loading ? <p className="mt-3 text-sm text-white/90">{t("loading")}</p> : null}
              {!loading && listings.length === 0 && q && !error ? (
                <p className="mt-3 text-sm text-white/90">{t("noResults")}</p>
              ) : null}

              {listings.length > 0 ? (
                <div className="mt-8 border-t border-white/15 pt-8 dark:border-white/10">
                  <FlipoResultList listings={listings} />
                </div>
              ) : null}

              <div className="mt-8 text-center lg:text-left">
                <Link
                  href="/suche"
                  className="text-sm font-semibold text-white underline decoration-white/45 underline-offset-4 hover:decoration-white"
                >
                  {t("classicSearchLink")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
