import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import {
  getCitiesByBundesland,
  getTotalSeoPagesCount,
  SEO_SEARCH_INTENTS,
} from "@/lib/seo";
import { StaedteStateSection } from "./components/staedte-state-section";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateMetadata(): Metadata {
  const stats = getTotalSeoPagesCount();
  return {
    title: "Städte & Stadtteile in Deutschland – Wohnungen & Immobilien",
    description: `Entdecken Sie Wohnungen, Häuser und Immobilienpreise in ${stats.citiesCount} deutschen Städten und ${stats.districtsCount} Stadtteilen (${stats.totalPagesCount.toLocaleString("de-DE")}+ regionale Immobilienseiten) auf Buildeo.`,
    alternates: {
      canonical: "/staedte",
    },
  };
}

export default async function StaedteDirectoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const byState = getCitiesByBundesland();
  const stateNames = Object.keys(byState).sort((a, b) => a.localeCompare(b, "de"));
  const stats = getTotalSeoPagesCount();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <PageBreadcrumbs
        items={[
          { href: "/", label: "Startseite" },
          { label: "Städte & Regionen in Deutschland" },
        ]}
      />

      <header className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
          Regionales Immobilienverzeichnis
        </span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Immobilien, Wohnungen & Stadtteile in ganz Deutschland
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Finden Sie Mietwohnungen, Eigentumswohnungen, Häuser sowie historische Stadtporträts und
          aktuelle Quadratmeterpreise in <strong>{stats.citiesCount} Städten</strong> und{" "}
          <strong>{stats.districtsCount} Stadtteilen</strong> (über{" "}
          <strong>{stats.totalPagesCount.toLocaleString("de-DE")} spezialisierte Immobilienseiten</strong>).
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {SEO_SEARCH_INTENTS.slice(0, 14).map((intent) => (
            <Link
              key={intent.prefix}
              href={`/${intent.prefix}-bremen`}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-bd-primary hover:text-bd-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
            >
              Beispiel: {intent.label} Bremen
            </Link>
          ))}
        </div>
      </header>

      <div className="mt-10 space-y-8">
        {stateNames.map((state) => (
          <StaedteStateSection
            key={state}
            bundesland={state}
            cities={byState[state]}
          />
        ))}
      </div>
    </main>
  );
}
