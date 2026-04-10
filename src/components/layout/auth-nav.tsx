"use client";

import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useHeaderAppearance } from "@/components/layout/header-appearance-context";

export function AuthNav() {
  const t = useTranslations("auth");
  const { data: session, status } = useSession();
  const appearance = useHeaderAppearance();
  const ov = appearance === "overlay";

  if (status === "loading") {
    return (
      <span className={`hidden text-sm sm:inline ${ov ? "text-white/70" : "text-zinc-400"}`}>…</span>
    );
  }

  if (session?.user) {
    return (
      <div className="hidden items-center gap-3 sm:flex">
        <span
          className={`max-w-[140px] truncate text-sm ${ov ? "text-white/90 drop-shadow" : "text-zinc-600 dark:text-zinc-400"}`}
          title={session.user.email ?? ""}
        >
          {session.user.name || session.user.email}
        </span>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            ov
              ? "text-white hover:bg-white/15"
              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
          }`}
        >
          {t("signOut")}
        </button>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <Link
        href="/anmelden"
        className={`rounded-lg px-3 py-2 text-sm font-medium ${
          ov
            ? "text-white hover:bg-white/15"
            : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
        }`}
      >
        {t("signIn")}
      </Link>
      <Link
        href="/registrieren"
        className={`rounded-lg border px-3 py-2 text-sm font-medium ${
          ov
            ? "border-white/50 text-white hover:bg-white/10"
            : "border-zinc-300 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:bg-zinc-800"
        }`}
      >
        {t("register")}
      </Link>
    </div>
  );
}
