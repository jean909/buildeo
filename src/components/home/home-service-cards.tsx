import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function HomeServiceCards() {
  const t = await getTranslations("home");

  const cards = [
    {
      icon: "doc" as const,
      title: t("services.schufaTitle"),
      body: t("services.schufaBody"),
      href: "/suche",
    },
    {
      icon: "plus" as const,
      title: t("services.plusTitle"),
      body: t("services.plusBody"),
      href: "/suche",
    },
    {
      icon: "truck" as const,
      title: t("services.moveTitle"),
      body: t("services.moveBody"),
      href: "/suche",
    },
  ];

  return (
    <section className="border-b border-zinc-200 bg-zinc-100/80 py-16 dark:border-zinc-800 dark:bg-zinc-950" aria-labelledby="services-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="services-heading" className="text-center text-xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          {t("services.sectionTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {t("services.sectionSubtitle")}
        </p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {cards.map((c) => (
            <li key={c.title}>
              <article className="flex h-full flex-col rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-[0_4px_24px_-4px_rgb(0_0_0/0.08)] transition hover:border-zinc-300 hover:shadow-[0_8px_30px_-6px_rgb(0_0_0/0.12)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bd-primary/15 text-bd-primary dark:bg-teal-500/15 dark:text-teal-300">
                  {c.icon === "doc" ? <IconDoc /> : c.icon === "plus" ? <IconPlus /> : <IconTruck />}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{c.body}</p>
                <Link
                  href={c.href}
                  className="mt-5 inline-flex text-sm font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300 dark:hover:text-teal-200"
                >
                  {t("services.cta")} →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function IconDoc() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function IconTruck() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h2m8 0h2m-2 0h5l3-5v-2a2 2 0 00-2-2h-3V6"
      />
    </svg>
  );
}
