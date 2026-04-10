"use client";

import { createContext, useContext } from "react";

export type HeaderAppearance = "overlay" | "solid";

const HeaderAppearanceContext = createContext<HeaderAppearance>("solid");

export function HeaderAppearanceProvider({
  value,
  children,
}: {
  value: HeaderAppearance;
  children: React.ReactNode;
}) {
  return <HeaderAppearanceContext.Provider value={value}>{children}</HeaderAppearanceContext.Provider>;
}

export function useHeaderAppearance() {
  return useContext(HeaderAppearanceContext);
}
