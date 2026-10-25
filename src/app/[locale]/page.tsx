import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ListingCard } from "@/components/listing/listing-card";
import { getFeaturedListings } from "@/lib/listings-repo";
import { shouldSkipOptionalDbReadsDuringPrerender } from "@/lib/is-next-build-phase";
import { FlipoKiBanner } from "@/components/flipo/flipo-ki-banner";
import { HomeServiceCards } from "@/components/home/home-service-cards";
import { SearchHero } from "./components/search-hero";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  let featured: Awaited<ReturnType<typeof getFeaturedListings>> = [];
  if (!shouldSkipOptionalDbReadsDuringPrerender()) {
    try {
      featured = await getFeaturedListings(3);
    } catch {
      /* DB unreachable at runtime */
    }
  }

  return (
    <>
      <SearchHero />
      <FlipoKiBanner />
      <HomeServiceCards />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16 sm:px-6">
        <section className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{t("heroTitle")}</h2>
          <p className="mt-3 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/inserat/neu"
              className="rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              {t("ctaList")}
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-20 w-full max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("featuredTitle")}</h2>
            <Link
              href="/suche"
              className="text-sm font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300 dark:hover:text-teal-200"
            >
              {t("featuredLink")} →
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <li key={listing.id}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-24 max-w-4xl">
          <h2 className="text-center text-xl font-semibold text-zinc-900 dark:text-zinc-50">{t("featuresTitle")}</h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            <li className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{t("featSearchTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t("featSearchBody")}</p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{t("featMapTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t("featMapBody")}</p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{t("featAlertsTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t("featAlertsBody")}</p>
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-24 w-full max-w-6xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
                Deutschlandweite Immobiliensuche
              </span>
              <h2 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                Wohnungen & Häuser nach Stadt und Stadtteil
              </h2>
            </div>
            <Link
              href="/staedte"
              className="text-sm font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300 dark:hover:text-teal-200"
            >
              Alle 150+ Städte & 950+ Stadtteile →
            </Link>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              { href: "/wohnung-bremen", label: "Wohnung Bremen", sub: "15 Stadtteile · ab 10,80 €/m²" },
              { href: "/wohnung-berlin", label: "Wohnung Berlin", sub: "18 Bezirke · Altbau & Neubau" },
              { href: "/wohnung-hamburg", label: "Wohnung Hamburg", sub: "14 Stadtteile · Alster & Elbe" },
              { href: "/wohnung-muenchen", label: "Wohnung München", sub: "12 Stadtteile · Top-Lagen" },
              { href: "/wohnung-koeln", label: "Wohnung Köln", sub: "10 Veedel · Rheinmetropole" },
              { href: "/wohnung-frankfurt-am-main", label: "Wohnung Frankfurt", sub: "10 Stadtteile · Rhein-Main" },
              { href: "/wohnung-leipzig", label: "Wohnung Leipzig", sub: "11 Stadtteile · Gründerzeit" },
              { href: "/wohnung-stuttgart", label: "Wohnung Stuttgart", sub: "10 Bezirke · Kessel & Höhen" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 transition hover:border-bd-primary hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-teal-400"
              >
                <p className="font-semibold text-zinc-900 group-hover:text-bd-primary dark:text-zinc-100 dark:group-hover:text-teal-300">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{item.sub}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
