import type { ResolvedSeoPage } from "@/lib/seo";

export function SeoCityGuide({ page }: { page: ResolvedSeoPage }) {
  const { city, district, intent, locationName } = page;

  return (
    <section
      aria-labelledby="city-guide-heading"
      className="mt-12 grid gap-6 lg:grid-cols-3"
    >
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] lg:col-span-2 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <span className="text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
          Stadtporträt & Historie
        </span>
        <h2
          id="city-guide-heading"
          className="mt-1 text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-zinc-50"
        >
          Geschichte, Architektur & Wohnen in {locationName}
        </h2>

        {district ? (
          <div className="mt-4 rounded-xl border border-teal-500/20 bg-teal-50/50 p-4 dark:border-teal-400/20 dark:bg-teal-950/20">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Quartier-Fokus: {district.name} ({city.name})
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {district.character} Wer gezielt nach <strong>{intent.label} in {locationName}</strong> sucht,
              profitiert hier von kurzen Wegen, gewachsener Nachbarschaft und einer direkten Anbindung an die
              Innenstadt von {city.name}.
            </p>
          </div>
        ) : null}

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Historische Entwicklung von {city.name}
            </h3>
            <p className="mt-1">{city.historyText}</p>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Architektur & typische Bausubstanz
            </h3>
            <p className="mt-1">{city.architectureText}</p>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
              Wirtschaft, Bildung & Infrastruktur
            </h3>
            <p className="mt-1">{city.economyAndInfraText}</p>
          </div>
        </div>
      </div>

      <aside className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-[var(--shadow-bd-card)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-bd-primary dark:text-teal-300">
            Wahrzeichen & Kultur
          </span>
          <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Bekannte Orte in {city.name}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Diese Sehenswürdigkeiten und Kulturorte prägen das Stadtbild und die Lebensqualität rund um Ihre
            zukünftige Immobilie in {city.name}:
          </p>

          <ul className="mt-4 space-y-2.5">
            {city.landmarks.map((landmark) => (
              <li
                key={landmark}
                className="flex items-center gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50 px-3.5 py-2.5 text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-bd-primary dark:bg-teal-400" />
                {landmark}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
            Standortdaten {city.name}
          </p>
          <p className="mt-1">
            Koordinaten: {city.lat.toFixed(3)}° N, {city.lng.toFixed(3)}° O
          </p>
          <p className="mt-0.5">Postleitzahlen: {city.postalCodes}</p>
        </div>
      </aside>
    </section>
  );
}
