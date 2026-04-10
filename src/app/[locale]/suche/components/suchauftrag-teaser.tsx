"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";

export function SuchauftragTeaser() {
  const t = useTranslations("search.alert");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div
      id="suchauftrag"
      className="scroll-mt-24 rounded-xl border border-bd-primary/25 bg-gradient-to-r from-teal-50/90 to-white p-4 dark:from-teal-950/40 dark:to-zinc-900"
    >
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{t("title")}</p>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{t("body")}</p>
      {done ? (
        <p className="mt-3 text-sm font-medium text-bd-primary dark:text-teal-300">{t("thanks")}</p>
      ) : (
        <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={onSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-bd-primary px-4 py-2 text-sm font-semibold text-bd-primary-fg hover:bg-bd-primary-hover"
          >
            {t("submit")}
          </button>
        </form>
      )}
    </div>
  );
}
