import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { MerklisteResults } from "./components/merkliste-results";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "merkliste" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function MerklistePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("merkliste");

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">{t("subtitle")}</p>
      <div className="mt-10">
        <MerklisteResults />
      </div>
    </main>
  );
}
