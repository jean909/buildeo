import { Link } from "@/i18n/navigation";
import type { ResolvedSeoPage } from "@/lib/seo";

export function SeoDistrictsGrid({ page }: { page: ResolvedSeoPage }) {
  const { city, district: activeDistrict, intent } = page;

  return (
    <section
      aria-labelledby="districts-heading"
      className="mt-12 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
            Stadtteile & Quartiere
          </span>
          <h2
            id="districts-heading"
            className="mt-1 text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-zinc-50"
          >
            {intent.label} nach Stadtteil in {city.name}
          </h2>
        </div>
        {activeDistrict ? (
          <Link
            href={`/${intent.prefix}-${city.slug}`}
            className="text-sm font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300"
          >
            ← Alle Stadtteile in {city.name}
          </Link>
        ) : null}
      </div>

      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Wählen Sie einen Stadtteil von {city.name}, um gezielt nach{" "}
        <strong>{intent.pluralLabel}</strong> und lokalen Miet- sowie Kaufpreisen im jeweiligen Quartier zu suchen:
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {city.districts.map((d) => {
          const isCurrent = activeDistrict?.slug === d.slug;
          const districtRent = (city.avgRentPerM2 * (d.priceFactor ?? 1)).toFixed(2).replace(".", ",");
          const href = `/${intent.prefix}-${city.slug}-${d.slug}`;

          return (
            <li key={d.slug}>
              <Link
                href={href}
                className={`group flex h-full flex-col justify-between rounded-xl border p-4 transition ${
                  isCurrent
                    ? "border-bd-primary bg-teal-50/50 dark:border-teal-400 dark:bg-teal-950/30"
                    : "border-zinc-200 bg-zinc-50/50 hover:border-bd-primary hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/50 dark:hover:border-teal-400 dark:hover:bg-zinc-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-zinc-900 group-hover:text-bd-primary dark:text-zinc-100 dark:group-hover:text-teal-300">
                      {city.name}-{d.name}
                    </h3>
                    {d.postalCode ? (
                      <span className="rounded bg-zinc-200/70 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        {d.postalCode}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {d.character}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-zinc-200/70 pt-2.5 text-xs dark:border-zinc-800">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    Ø Miete: <strong className="text-zinc-800 dark:text-zinc-200">{districtRent} €/m²</strong>
                  </span>
                  <span className="font-semibold text-bd-primary dark:text-teal-300">
                    {intent.label} →
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
