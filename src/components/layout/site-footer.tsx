import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CookieSettingsButton } from "@/components/cookie-consent/cookie-settings-button";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  const topCityLinks = [
    { href: "/wohnung-bremen", label: "Wohnung Bremen" },
    { href: "/wohnung-berlin", label: "Wohnung Berlin" },
    { href: "/wohnung-hamburg", label: "Wohnung Hamburg" },
    { href: "/wohnung-muenchen", label: "Wohnung München" },
    { href: "/wohnung-koeln", label: "Wohnung Köln" },
    { href: "/wohnung-frankfurt-am-main", label: "Wohnung Frankfurt" },
    { href: "/wohnung-stuttgart", label: "Wohnung Stuttgart" },
    { href: "/wohnung-duesseldorf", label: "Wohnung Düsseldorf" },
    { href: "/wohnung-leipzig", label: "Wohnung Leipzig" },
    { href: "/wohnung-hannover", label: "Wohnung Hannover" },
    { href: "/wohnung-dresden", label: "Wohnung Dresden" },
    { href: "/wohnung-nuernberg", label: "Wohnung Nürnberg" },
  ];

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-[var(--bd-page)] py-10 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Beliebte Städte & Wohnungsmarkt in Deutschland
            </p>
            <Link
              href="/staedte"
              className="text-xs font-semibold text-bd-primary hover:text-bd-primary-hover dark:text-teal-300"
            >
              Alle Städte & Stadtteile →
            </Link>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            {topCityLinks.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="hover:text-bd-primary dark:hover:text-teal-300"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 text-sm text-zinc-600 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
          <p className="font-medium text-zinc-800 dark:text-zinc-200">© {new Date().getFullYear()} Buildeo</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/staedte" className="hover:text-bd-primary dark:hover:text-teal-300">
              Städte & Regionen
            </Link>
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
      </div>
    </footer>
  );
}
