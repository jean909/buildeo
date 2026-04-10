"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  OPEN_COOKIE_SETTINGS_EVENT,
  type StoredCookieConsent,
} from "./constants";

function readStored(): StoredCookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as StoredCookieConsent;
    if (
      p?.version !== COOKIE_CONSENT_VERSION ||
      typeof p.analytics !== "boolean" ||
      typeof p.marketing !== "boolean"
    ) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

function writeStored(c: StoredCookieConsent) {
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(c));
  window.dispatchEvent(new CustomEvent("buildeo-consent-updated", { detail: c }));
}

export function CookieConsent() {
  const t = useTranslations("cookies");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const syncOpenState = useCallback(() => {
    const existing = readStored();
    if (!existing) {
      setOpen(true);
      setDetailsOpen(false);
      setAnalytics(false);
      setMarketing(false);
      return;
    }
    setOpen(false);
    setAnalytics(existing.analytics);
    setMarketing(existing.marketing);
  }, []);

  useEffect(() => {
    setMounted(true);
    syncOpenState();
  }, [syncOpenState]);

  useEffect(() => {
    const onReopen = () => {
      const s = readStored();
      setAnalytics(s?.analytics ?? false);
      setMarketing(s?.marketing ?? false);
      setDetailsOpen(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onReopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onReopen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const acceptAll = useCallback(() => {
    writeStored({
      version: COOKIE_CONSENT_VERSION,
      analytics: true,
      marketing: true,
    });
    setOpen(false);
    setDetailsOpen(false);
  }, []);

  const essentialOnly = useCallback(() => {
    writeStored({
      version: COOKIE_CONSENT_VERSION,
      analytics: false,
      marketing: false,
    });
    setOpen(false);
    setDetailsOpen(false);
  }, []);

  const saveCustom = useCallback(() => {
    writeStored({
      version: COOKIE_CONSENT_VERSION,
      analytics,
      marketing,
    });
    setOpen(false);
    setDetailsOpen(false);
  }, [analytics, marketing]);

  if (!mounted || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
    >
      <div className="absolute inset-0 bg-zinc-950/55 backdrop-blur-md" aria-hidden />

      <div className="relative max-h-[min(92vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-[0_25px_80px_-12px_rgb(0_0_0/0.35)] dark:bg-zinc-900 dark:shadow-black/40 dark:ring-1 dark:ring-zinc-700">
        <div className="px-6 pb-6 pt-8 sm:px-8 sm:pb-8 sm:pt-10">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bd-primary text-base font-bold text-bd-primary-fg shadow-sm">
                B
              </span>
              <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                Buildeo
              </span>
            </div>
            <h2
              id="cookie-consent-title"
              className="mt-6 text-center text-xl font-bold leading-snug text-blue-900 dark:text-blue-200 sm:text-2xl"
            >
              {t("title")}
            </h2>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{t("intro")}</p>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {t("managerHintBefore")}
            <Link
              href="/datenschutz#datenschutz-manager"
              className="font-semibold text-bd-primary underline decoration-bd-primary/40 underline-offset-2 hover:decoration-bd-primary dark:text-teal-300 dark:decoration-teal-500/50"
            >
              {t("managerHintLink")}
            </Link>
            {t("managerHintAfter")}
          </p>

          <nav
            className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium"
            aria-label={t("navAria")}
          >
            <Link
              href="/datenschutz#datenschutz-manager"
              className="text-bd-primary underline decoration-bd-primary/40 underline-offset-2 hover:decoration-bd-primary dark:text-teal-300"
            >
              {t("navDatenschutzInfo")}
            </Link>
            <Link
              href="/impressum"
              className="text-bd-primary underline decoration-bd-primary/40 underline-offset-2 hover:decoration-bd-primary dark:text-teal-300"
            >
              {t("navImpressum")}
            </Link>
            <Link
              href="/anbieterliste"
              className="text-bd-primary underline decoration-bd-primary/40 underline-offset-2 hover:decoration-bd-primary dark:text-teal-300"
            >
              {t("navVendors")}
            </Link>
          </nav>

          <hr className="mt-5 border-t border-zinc-900 dark:border-zinc-100" />

          <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">{t("partnerHint")}</p>

          <button
            type="button"
            onClick={essentialOnly}
            className="mt-4 text-sm font-semibold text-bd-primary underline decoration-bd-primary/30 underline-offset-2 hover:decoration-bd-primary dark:text-teal-300"
          >
            {t("essentialOnly")}
          </button>

          {detailsOpen ? (
            <div className="mt-6 space-y-0 border-t border-zinc-200 pt-6 dark:border-zinc-700">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100" id="cookie-processing">
                {t("processingTitle")}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="border-b border-zinc-100 pb-2 dark:border-zinc-800">{t("purposeStorage")}</li>
                <li className="border-b border-zinc-100 pb-2 dark:border-zinc-800">{t("purposePersonalized")}</li>
              </ul>
              <h3 className="mt-5 text-sm font-bold text-zinc-900 dark:text-zinc-100">{t("specialTitle")}</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <li className="border-b border-zinc-100 pb-2 dark:border-zinc-800">{t("specialLocation")}</li>
                <li>{t("specialDevice")}</li>
              </ul>

              <div className="mt-6 space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-950/80">
                <ToggleRow
                  id="cookie-necessary"
                  checked
                  disabled
                  label={t("toggleNecessary")}
                  hint={t("toggleNecessaryHint")}
                />
                <ToggleRow
                  id="cookie-stats"
                  checked={analytics}
                  onChange={setAnalytics}
                  label={t("toggleStats")}
                  hint={t("toggleStatsHint")}
                />
                <ToggleRow
                  id="cookie-marketing"
                  checked={marketing}
                  onChange={setMarketing}
                  label={t("toggleMarketing")}
                  hint={t("toggleMarketingHint")}
                />
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              className="flex-1 rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              {detailsOpen ? t("closeSettings") : t("manage")}
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="flex-1 rounded-xl bg-bd-primary px-4 py-3.5 text-sm font-bold text-bd-primary-fg shadow-md transition hover:bg-bd-primary-hover"
            >
              {t("acceptAll")}
            </button>
          </div>

          {detailsOpen ? (
            <button
              type="button"
              onClick={saveCustom}
              className="mt-3 w-full rounded-xl border-2 border-bd-primary bg-white py-3 text-sm font-bold text-bd-primary transition hover:bg-bd-primary/5 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              {t("saveChoice")}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  id,
  checked,
  onChange,
  disabled,
  label,
  hint,
}: {
  id: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  label: string;
  hint: string;
}) {
  return (
    <label htmlFor={id} className={`flex gap-3 ${disabled ? "cursor-default" : "cursor-pointer"}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300 text-bd-primary focus:ring-2 focus:ring-bd-primary/30 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-800 dark:text-teal-500"
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</span>
        <span className="mt-0.5 block text-xs text-zinc-500 dark:text-zinc-500">{hint}</span>
      </span>
    </label>
  );
}
