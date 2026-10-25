import { Link } from "@/i18n/navigation";
import { ALL_SEO_CITIES, SEO_SEARCH_INTENTS, type ResolvedSeoPage } from "@/lib/seo";

export function SeoInternalLinks({ page }: { page: ResolvedSeoPage }) {
  const { city, intent, locationSlug, locationName } = page;

  const sameStateCities = ALL_SEO_CITIES.filter(
    (c) => c.bundesland === city.bundesland && c.slug !== city.slug,
  ).slice(0, 12);

  const majorCities = ALL_SEO_CITIES.filter((c) => c.slug !== city.slug)
    .sort((a, b) => b.population - a.population)
    .slice(0, 16);

  return (
    <section
      aria-labelledby="internal-links-heading"
      className="mt-12 space-y-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
          Weitere Suchkategorien
        </span>
        <h2
          id="internal-links-heading"
          className="mt-1 text-lg font-semibold text-zinc-900 sm:text-xl dark:text-zinc-50"
        >
          Beliebte Immobiliensuchen in {locationName}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {SEO_SEARCH_INTENTS.map((item) => {
            const isCurrent = item.prefix === intent.prefix;
            return (
              <Link
                key={item.prefix}
                href={`/${item.prefix}-${locationSlug}`}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  isCurrent
                    ? "border-bd-primary bg-bd-primary text-white dark:border-teal-400 dark:bg-teal-500 dark:text-zinc-950"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-bd-primary hover:text-bd-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
                }`}
              >
                {item.label} {locationName}
              </Link>
            );
          })}
        </div>
      </div>

      {sameStateCities.length > 0 ? (
        <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {intent.label} in weiteren Städten in {city.bundesland}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {sameStateCities.map((other) => (
              <Link
                key={other.slug}
                href={`/${intent.prefix}-${other.slug}`}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-bd-primary hover:text-bd-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
              >
                {intent.label} {other.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Deutschlandweit nach {intent.label} suchen
          </h3>
          <Link
            href="/staedte"
            className="text-xs font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300"
          >
            Alle Städte & Regionen →
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {majorCities.map((major) => (
            <Link
              key={major.slug}
              href={`/${intent.prefix}-${major.slug}`}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-bd-primary hover:text-bd-primary dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-teal-400 dark:hover:text-teal-300"
            >
              {intent.label} {major.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
