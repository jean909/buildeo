"use client";

import type { ReactNode } from "react";
import { OPEN_COOKIE_SETTINGS_EVENT } from "./constants";

type Props = {
  children: ReactNode;
  className?: string;
};

/** Öffnet das Cookie-Modal erneut (z. B. aus dem Footer). */
export function CookieSettingsButton({ children, className }: Props) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}>
      {children}
    </button>
  );
}
