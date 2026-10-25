import type { ResolvedSeoPage } from "@/lib/seo";

export function SeoMarketStats({ page }: { page: ResolvedSeoPage }) {
  const { city, district, locationName, effectiveRentPerM2, effectiveBuyPerM2 } = page;

  const sizeExamples = [
    { label: "1-Zimmer-Apartment", m2: 35 },
    { label: "2-Zimmer-Wohnung", m2: 58 },
    { label: "3-Zimmer-Wohnung", m2: 82 },
    { label: "4-Zimmer-Familienwohnung", m2: 115 },
  ];

  const diffPercent = district?.priceFactor
    ? Math.round((district.priceFactor - 1) * 100)
    : 0;

  return (
    <section
      aria-labelledby="market-stats-heading"
      className="mt-14 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
            Marktüberblick & Richtwerte
          </span>
          <h2
            id="market-stats-heading"
            className="mt-1 text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-zinc-50"
          >
            Immobilienpreise & Mietspiegel in {locationName}
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {city.bundesland} · PLZ {district?.postalCode ?? city.postalCodes}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Ø Kaltmiete pro m²</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {effectiveRentPerM2.toFixed(2).replace(".", ",")} €
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {district && diffPercent !== 0
              ? `${diffPercent > 0 ? `+${diffPercent}` : diffPercent} % vs. Ø ${city.name}`
              : `Durchschnitt in ${city.name}`}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Ø Kaufpreis pro m²</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {effectiveBuyPerM2.toLocaleString("de-DE")} €
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Bestands- & Neubauobjekte
          </p>
        </div>

        <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Einwohner ({city.name})</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            ~{city.population.toLocaleString("de-DE")}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Bundesland {city.bundesland}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Erfasste Stadtteile</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
            {city.districts.length} Quartiere
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            PLZ {city.postalCodes}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="py-3 pr-4">Wohnungsgröße</th>
              <th className="py-3 px-4">Wohnfläche</th>
              <th className="py-3 px-4">Ø Kaltmiete / Monat</th>
              <th className="py-3 pl-4 text-right">Ø Kaufpreis (Richtwert)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
            {sizeExamples.map((ex) => {
              const rent = Math.round(ex.m2 * effectiveRentPerM2);
              const buy = Math.round((ex.m2 * effectiveBuyPerM2) / 1000) * 1000;
              return (
                <tr key={ex.label} className="text-zinc-700 dark:text-zinc-300">
                  <td className="py-3 pr-4 font-medium text-zinc-900 dark:text-zinc-100">{ex.label}</td>
                  <td className="py-3 px-4 tabular-nums">{ex.m2} m²</td>
                  <td className="py-3 px-4 font-semibold tabular-nums text-bd-primary dark:text-teal-300">
                    ca. {rent.toLocaleString("de-DE")} €
                  </td>
                  <td className="py-3 pl-4 text-right tabular-nums">
                    ca. {buy.toLocaleString("de-DE")} €
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
