import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: t("terms.metaTitle") };
}

export default async function AgbPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <main className="mx-auto max-w-2xl flex-1 px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">{t("terms.title")}</h1>
      <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {t("terms.body")}
      </p>
    </main>
  );
}
