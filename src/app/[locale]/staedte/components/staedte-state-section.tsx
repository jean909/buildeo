import { Link } from "@/i18n/navigation";
import type { SeoCity } from "@/lib/seo";

export function StaedteStateSection({
  bundesland,
  cities,
}: {
  bundesland: string;
  cities: SeoCity[];
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-baseline justify-between gap-4 border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {bundesland}
        </h2>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {cities.length} {cities.length === 1 ? "Stadt" : "Städte"}
        </span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <div
            key={city.slug}
            className="flex flex-col justify-between rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/wohnung-${city.slug}`}
                  className="text-base font-semibold text-zinc-900 hover:text-bd-primary dark:text-zinc-100 dark:hover:text-teal-300"
                >
                  {city.name}
                </Link>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Ø {city.avgRentPerM2.toFixed(2).replace(".", ",")} €/m²
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                <Link
                  href={`/wohnung-${city.slug}`}
                  className="rounded bg-white px-2 py-0.5 font-medium text-bd-primary shadow-2xs hover:underline dark:bg-zinc-900 dark:text-teal-300"
                >
                  Wohnung
                </Link>
                <Link
                  href={`/wohnung-mieten-${city.slug}`}
                  className="rounded bg-white px-2 py-0.5 text-zinc-700 shadow-2xs hover:text-bd-primary dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Mieten
                </Link>
                <Link
                  href={`/wohnung-kaufen-${city.slug}`}
                  className="rounded bg-white px-2 py-0.5 text-zinc-700 shadow-2xs hover:text-bd-primary dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Kaufen
                </Link>
                <Link
                  href={`/haus-kaufen-${city.slug}`}
                  className="rounded bg-white px-2 py-0.5 text-zinc-700 shadow-2xs hover:text-bd-primary dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Haus
                </Link>
                <Link
                  href={`/immobilien-${city.slug}`}
                  className="rounded bg-white px-2 py-0.5 text-zinc-700 shadow-2xs hover:text-bd-primary dark:bg-zinc-900 dark:text-zinc-300"
                >
                  Immobilien
                </Link>
              </div>

              <div className="mt-3 border-t border-zinc-200/60 pt-2.5 dark:border-zinc-800">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Stadtteile ({city.districts.length}):
                </p>
                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {city.districts.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/wohnung-${city.slug}-${d.slug}`}
                      className="hover:text-bd-primary hover:underline dark:hover:text-teal-300"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
