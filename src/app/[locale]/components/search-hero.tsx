import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Unsplash — modern residential (free to use). */
const HERO_IMAGE_SRC =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85";

const ctaPillClass =
  "inline-flex items-center justify-center gap-2 rounded-full bg-zinc-800/95 px-5 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-black/20 transition hover:bg-zinc-800 hover:ring-black/30 dark:bg-zinc-900/95 dark:ring-white/10 dark:hover:bg-zinc-900";

function IconChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth={2} />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

export async function SearchHero() {
  const t = await getTranslations("home");

  const selectClass =
    "h-12 w-full min-w-0 cursor-pointer appearance-none rounded-xl border border-zinc-200 bg-zinc-50 py-0 pl-4 pr-10 text-sm font-semibold text-zinc-900 outline-none transition focus-visible:ring-2 focus-visible:ring-bd-primary focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus-visible:ring-offset-zinc-950 sm:rounded-full sm:border-0 sm:bg-zinc-100 sm:dark:bg-zinc-800";

  return (
    <section
      className="relative -mt-14 isolate min-h-[min(100dvh,920px)] overflow-hidden border-b border-zinc-200/40 pt-14 dark:border-zinc-800/40"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 -z-20 overflow-hidden" aria-hidden>
        <div className="hero-ken-burns relative h-full min-h-[min(100dvh,920px)] w-full">
          <Image
            src={HERO_IMAGE_SRC}
            alt={t("heroSearch.heroImageAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_35%]"
          />
        </div>
      </div>

      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-black/20 to-black/75"
        aria-hidden
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-tr from-teal-900/25 via-transparent to-transparent opacity-90 dark:opacity-100"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[min(100dvh,920px)] max-w-6xl flex-col justify-end px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-200 drop-shadow">
            {t("heroSearch.eyebrow")}
          </p>
          <h1
            id="hero-heading"
            className="mt-3 text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-[2.75rem] lg:leading-tight"
          >
            {t("heroTagline")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-md">
            {t("heroSearch.subtitle")}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
          <Link href="/suche?typ=mieten" className={ctaPillClass}>
            <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
              {t("quickRentBadge")}
            </span>
            <span>{t("quickRentOut")}</span>
          </Link>
          <Link href="/suche?typ=kaufen" className={ctaPillClass}>
            {t("quickSell")}
          </Link>
          <span className="px-1 text-sm font-medium text-white/90 drop-shadow">{t("quickOr")}</span>
          <Link href="/suche" className={ctaPillClass}>
            {t("quickValuation")}
          </Link>
        </div>

        <form className="mt-8 w-full max-w-4xl" action="/suche" method="get">
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/[0.06] dark:border-zinc-600/50 dark:bg-zinc-950 dark:ring-white/[0.08] sm:rounded-full sm:p-1 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col sm:flex-row sm:items-stretch">
              <div className="flex min-h-[3.25rem] min-w-0 flex-1 items-stretch border-b border-zinc-100 sm:border-b-0 sm:border-r dark:border-zinc-800">
                <div
                  className="hidden shrink-0 select-none items-center gap-1.5 border-r border-zinc-100 px-3.5 sm:flex dark:border-zinc-800"
                  title={t("heroSearch.regionNote")}
                >
                  <span className="text-lg leading-none" aria-hidden>
                    🇩🇪
                  </span>
                  <IconChevronDown className="text-zinc-400" />
                </div>
                <div className="relative min-w-0 flex-1">
                  <label htmlFor="hero-q" className="sr-only">
                    {t("heroSearch.locationLabel")}
                  </label>
                  <input
                    id="hero-q"
                    name="q"
                    type="search"
                    autoComplete="street-address"
                    placeholder={t("heroSearch.locationPlaceholder")}
                    className="h-12 w-full min-w-0 border-0 bg-transparent px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 dark:text-zinc-100 dark:placeholder:text-zinc-500 sm:h-auto sm:py-3.5 sm:pl-3 sm:pr-4"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 p-2 sm:flex sm:w-auto sm:flex-row sm:items-stretch sm:gap-1.5 sm:p-1 sm:pl-0 sm:pr-1">
                <div className="relative min-w-0 flex-1 sm:min-w-[11.5rem] sm:max-w-[14rem]">
                  <label htmlFor="hero-typ" className="sr-only">
                    {t("heroSearch.dealLabel")}
                  </label>
                  <select id="hero-typ" name="typ" defaultValue="" className={selectClass}>
                    <option value="">{t("heroSearch.dealAll")}</option>
                    <option value="mieten">{t("heroSearch.dealRent")}</option>
                    <option value="kaufen">{t("heroSearch.dealBuy")}</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 sm:right-3.5">
                    <IconChevronDown className="h-4 w-4" />
                  </span>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-bd-primary px-6 text-sm font-bold text-bd-primary-fg shadow-md transition hover:bg-bd-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent sm:rounded-full sm:px-8"
                >
                  <IconSearch className="shrink-0 opacity-95" />
                  <span>{t("heroSearch.submit")}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        <p className="mt-8 text-right text-[10px] font-medium tracking-wide text-white/55">
          {t("heroSearch.photoCredit")}
        </p>
      </div>
    </section>
  );
}
