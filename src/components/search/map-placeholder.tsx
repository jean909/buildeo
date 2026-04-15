"use client";

import { useTranslations } from "next-intl";

type Props = {
  variant?: "compact" | "tall";
};

export function MapPlaceholder({ variant = "tall" }: Props) {
  const t = useTranslations("search");

  const height =
    variant === "compact" ? "min-h-[200px] max-h-[220px]" : "min-h-[320px] lg:min-h-0 lg:h-full";

  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 ${height}`}
      role="img"
      aria-label={t("map.ariaLabel")}
    >
      <div
        className="absolute inset-0 opacity-40 dark:opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(var(--bd-map-pattern) 1px, transparent 1px),
            linear-gradient(90deg, var(--bd-map-pattern) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bd-primary/15 text-bd-primary dark:bg-teal-500/20 dark:text-teal-300">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </span>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{t("map.title")}</p>
        <p className="max-w-[220px] text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {t("map.hint")}
        </p>
      </div>
    </div>
  );
}
