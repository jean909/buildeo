"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { AuthNav } from "@/components/layout/auth-nav";
import { MerklisteNavLink } from "@/components/layout/merkliste-nav-link";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { HeaderAppearanceProvider, type HeaderAppearance } from "@/components/layout/header-appearance-context";

export type SiteHeaderLabels = {
  search: string;
  listProperty: string;
};

function homePath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === "/") return true;
  const normalized = pathname.replace(/\/$/, "");
  return normalized === "" || normalized === "/de";
}

export function SiteHeaderClient({ labels }: { labels: SiteHeaderLabels }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHome = homePath(pathname);
  const appearance: HeaderAppearance = onHome && !scrolled ? "overlay" : "solid";

  const headerBase =
    "fixed left-0 right-0 top-0 z-[100] transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 ease-out";
  const headerSolid =
    "border-b border-zinc-200/90 bg-white/95 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95";
  const headerOverlay = "border-b border-transparent bg-transparent shadow-none backdrop-blur-none";

  return (
    <HeaderAppearanceProvider value={appearance}>
      <header className={`${headerBase} ${appearance === "overlay" ? headerOverlay : headerSolid}`}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-[3.5rem] sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3 sm:gap-5">
            <MobileNavDrawer />
            <Link
              href="/"
              className={`flex min-w-0 items-center gap-2 text-lg font-semibold tracking-tight transition-colors ${
                appearance === "overlay"
                  ? "text-white drop-shadow-md"
                  : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold shadow-sm transition-colors ${
                  appearance === "overlay"
                    ? "bg-white/20 text-white ring-1 ring-white/40 backdrop-blur-sm"
                    : "bg-bd-primary text-bd-primary-fg"
                }`}
              >
                B
              </span>
              <span className="truncate">Buildeo</span>
            </Link>
            <nav
              className={`hidden items-center gap-6 text-sm font-medium sm:flex md:gap-8 ${
                appearance === "overlay" ? "text-white/95" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Link
                href="/suche"
                className={
                  appearance === "overlay"
                    ? "shrink-0 font-semibold text-white drop-shadow hover:text-white"
                    : "shrink-0 text-bd-primary hover:text-bd-primary-hover dark:text-teal-400 dark:hover:text-teal-300"
                }
              >
                {labels.search}
              </Link>
              <MerklisteNavLink />
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <AuthNav />
              <Link
                href="/inserat/neu"
                className={`rounded-lg px-3 py-2 text-sm font-semibold shadow-sm transition ${
                  appearance === "overlay"
                    ? "bg-white text-zinc-900 hover:bg-white/90"
                    : "bg-bd-primary text-bd-primary-fg hover:bg-bd-primary-hover"
                }`}
              >
                {labels.listProperty}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </HeaderAppearanceProvider>
  );
}
