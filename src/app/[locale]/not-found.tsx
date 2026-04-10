import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("listing");

  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">404</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{t("notFound")}</p>
      <Link href="/" className="mt-8 text-sm font-semibold text-bd-primary dark:text-teal-300">
        {t("backHome")}
      </Link>
    </main>
  );
}
