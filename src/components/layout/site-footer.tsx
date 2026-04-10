import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CookieSettingsButton } from "@/components/cookie-consent/cookie-settings-button";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-[var(--bd-page)] py-10 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-zinc-400">
        <p className="font-medium text-zinc-800 dark:text-zinc-200">© {new Date().getFullYear()} Buildeo</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/impressum" className="hover:text-bd-primary dark:hover:text-teal-300">
            {t("imprint")}
          </Link>
          <Link href="/datenschutz" className="hover:text-bd-primary dark:hover:text-teal-300">
            {t("privacy")}
          </Link>
          <Link href="/anbieterliste" className="hover:text-bd-primary dark:hover:text-teal-300">
            {t("vendors")}
          </Link>
          <Link href="/agb" className="hover:text-bd-primary dark:hover:text-teal-300">
            {t("terms")}
          </Link>
          <CookieSettingsButton className="hover:text-bd-primary dark:hover:text-teal-300">
            {t("cookies")}
          </CookieSettingsButton>
        </div>
      </div>
    </footer>
  );
}
