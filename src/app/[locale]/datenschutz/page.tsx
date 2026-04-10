import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("privacy.metaTitle") };
}

export default async function DatenschutzPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{t("privacy.title")}</h1>

      <section
        id="datenschutz-manager"
        className="mt-8 scroll-mt-24 rounded-xl border border-zinc-200 bg-white p-5 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900"
        aria-labelledby="privacy-manager-heading"
      >
        <h2 id="privacy-manager-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {t("privacy.managerTitle")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t("privacy.managerBody")}</p>
      </section>

      <p className="mt-10 whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t("privacy.body")}
      </p>
    </main>
  );
}
