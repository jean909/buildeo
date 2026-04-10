"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useMerkliste } from "@/components/merkliste/merkliste-provider";
import { useHeaderAppearance } from "@/components/layout/header-appearance-context";

export function MerklisteNavLink() {
  const t = useTranslations("nav");
  const { count, ready } = useMerkliste();
  const appearance = useHeaderAppearance();
  const ov = appearance === "overlay";

  return (
    <Link
      href="/merkliste"
      className={`inline-flex items-center gap-2 ${
        ov
          ? "text-white/95 drop-shadow hover:text-white"
          : "text-zinc-600 hover:text-bd-primary dark:text-zinc-400 dark:hover:text-teal-300"
      }`}
    >
      <span>{t("favorites")}</span>
      {ready && count > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-bd-primary px-1.5 text-[10px] font-bold text-bd-primary-fg">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
