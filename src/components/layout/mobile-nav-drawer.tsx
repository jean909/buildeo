"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useHeaderAppearance } from "@/components/layout/header-appearance-context";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/components/cookie-consent/constants";

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={22} height={16} viewBox="0 0 22 16" fill="none" aria-hidden>
      <path d="M0 1h22M0 8h22M0 15h22" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

type NavItem = { href: string; label: string };

export function MobileNavDrawer() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const appearance = useHeaderAppearance();
  const ov = appearance === "overlay";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const mainItems: NavItem[] = [
    { href: "/suche", label: t("drawerSearch") },
    { href: "/suche?typ=kaufen", label: t("drawerSell") },
    { href: "/suche?typ=mieten", label: t("drawerRent") },
    { href: "/suche", label: t("drawerModernize") },
    { href: "/suche", label: t("drawerFinance") },
    { href: "/suche", label: t("drawerMove") },
    { href: "/merkliste", label: t("favorites") },
    { href: "/suche", label: t("listProperty") },
    { href: "/#flipo-heading", label: t("drawerFlipo") },
  ];

  const accountItems: NavItem[] = [
    { href: "/anmelden", label: t("login") },
    { href: "/registrieren", label: t("register") },
  ];

  const legalItems: NavItem[] = [
    { href: "/datenschutz", label: tFooter("privacy") },
    { href: "/impressum", label: tFooter("imprint") },
    { href: "/agb", label: tFooter("terms") },
    { href: "/anbieterliste", label: tFooter("vendors") },
  ];

  const triggerClass = [
    "inline-flex shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-0 bg-transparent px-2 py-1.5 transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bd-primary/35 focus-visible:ring-offset-2",
    ov
      ? "text-[var(--bd-menu-trigger-overlay-fg)] hover:bg-[var(--bd-menu-trigger-overlay-hover-bg)] focus-visible:ring-white/45 focus-visible:ring-offset-0"
      : "text-[var(--bd-menu-trigger-fg)] hover:bg-[var(--bd-menu-trigger-hover-bg)] dark:focus-visible:ring-offset-zinc-950",
  ].join(" ");

  return (
    <>
      <button
        type="button"
        className={triggerClass}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-nav-drawer"
        aria-label={t("menuAriaOpen")}
      >
        <HamburgerIcon className="h-4 w-[22px]" />
        <span className="text-[11px] font-bold leading-none tracking-wide">{t("menu")}</span>
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[500]"
              id="site-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={t("menu")}
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/50 dark:bg-black/60"
                aria-label={t("menuAriaClose")}
                onClick={() => setOpen(false)}
              />
              <div
                className="absolute inset-y-0 left-0 flex w-[min(100%,420px)] min-w-0 flex-col bg-white shadow-2xl sm:w-[min(32vw,440px)] dark:bg-zinc-950"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 items-center gap-4 border-b border-zinc-100 px-4 py-4 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl font-light text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    aria-label={t("menuAriaClose")}
                  >
                    ×
                  </button>
                  <Link
                    href="/"
                    className="flex min-w-0 items-center gap-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-bd-primary text-sm font-bold text-bd-primary-fg">
                      B
                    </span>
                    <span className="truncate">Buildeo</span>
                  </Link>
                </div>

                <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 pb-10 pt-4" aria-label={t("menu")}>
                  <ul className="flex flex-col">
                    {mainItems.map((item) => (
                      <li key={`${item.href}-${item.label}`}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-4 py-3.5 text-left text-lg font-bold text-zinc-900 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t("drawerAccountSection")}
                  </p>
                  <ul className="mt-1 flex flex-col">
                    {accountItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-4 py-3 text-left text-base font-semibold text-zinc-800 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 px-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t("drawerLegalSection")}
                  </p>
                  <ul className="mt-1 flex flex-col">
                    {legalItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-4 py-2.5 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                          onClick={() => setOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        type="button"
                        className="w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                        onClick={() => {
                          setOpen(false);
                          window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
                        }}
                      >
                        {tFooter("cookies")}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
