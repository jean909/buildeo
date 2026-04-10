"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CookieConsent } from "@/components/cookie-consent/cookie-consent";
import { FlipoFab } from "@/components/flipo/flipo-fab";
import { MerklisteProvider } from "@/components/merkliste/merkliste-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MerklisteProvider>
        {children}
        <FlipoFab />
        <CookieConsent />
      </MerklisteProvider>
    </SessionProvider>
  );
}
