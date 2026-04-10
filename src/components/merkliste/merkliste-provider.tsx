"use client";

import { useSession } from "next-auth/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "buildeo:merkliste";
const SYNC_EVENT = "buildeo:merkliste";

type MerklisteContextValue = {
  slugs: string[];
  ready: boolean;
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  count: number;
  mode: "local" | "server";
};

const MerklisteContext = createContext<MerklisteContextValue | null>(null);

function readLocalSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeLocalSlugs(slugs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(SYNC_EVENT));
}

export function MerklisteProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [localSlugs, setLocalSlugs] = useState<string[]>([]);
  const [serverSlugs, setServerSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const syncedRef = useRef(false);

  const isAuthed = status === "authenticated" && !!session?.user?.id;
  const mode: "local" | "server" = isAuthed ? "server" : "local";

  const syncFromStorage = useCallback(() => {
    setLocalSlugs(readLocalSlugs());
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) syncFromStorage();
    };
    const onCustom = () => syncFromStorage();
    window.addEventListener("storage", onStorage);
    window.addEventListener(SYNC_EVENT, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SYNC_EVENT, onCustom);
    };
  }, [syncFromStorage]);

  useEffect(() => {
    if (status === "loading") return;

    if (!isAuthed) {
      syncFromStorage();
      setReady(true);
      syncedRef.current = false;
      return;
    }

    (async () => {
      const local = readLocalSlugs();
      if (local.length > 0 && !syncedRef.current) {
        syncedRef.current = true;
        for (const slug of local) {
          try {
            await fetch("/api/favorites", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug }),
            });
          } catch {
            /* ignore */
          }
        }
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        window.dispatchEvent(new Event(SYNC_EVENT));
      }

      try {
        const res = await fetch("/api/favorites", { cache: "no-store" });
        const data = (await res.json()) as { slugs?: string[] };
        setServerSlugs(Array.isArray(data.slugs) ? data.slugs : []);
      } catch {
        setServerSlugs([]);
      }
      setReady(true);
    })();
  }, [status, isAuthed, syncFromStorage]);

  const slugs = mode === "server" ? serverSlugs : localSlugs;

  const refreshServer = useCallback(async () => {
    try {
      const res = await fetch("/api/favorites", { cache: "no-store" });
      const data = (await res.json()) as { slugs?: string[] };
      setServerSlugs(Array.isArray(data.slugs) ? data.slugs : []);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    async (slug: string) => {
      if (mode === "server") {
        const hasIt = serverSlugs.includes(slug);
        try {
          if (hasIt) {
            await fetch(`/api/favorites/${encodeURIComponent(slug)}`, { method: "DELETE" });
            setServerSlugs((prev) => prev.filter((s) => s !== slug));
          } else {
            await fetch("/api/favorites", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug }),
            });
            setServerSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
          }
        } catch {
          await refreshServer();
        }
        return;
      }

      setLocalSlugs((prev) => {
        const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
        writeLocalSlugs(next);
        return next;
      });
    },
    [mode, serverSlugs, refreshServer],
  );

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const value = useMemo(
    () => ({
      slugs,
      ready: ready && status !== "loading",
      toggle,
      has,
      count: slugs.length,
      mode,
    }),
    [slugs, ready, status, toggle, has, mode],
  );

  return <MerklisteContext.Provider value={value}>{children}</MerklisteContext.Provider>;
}

export function useMerkliste() {
  const ctx = useContext(MerklisteContext);
  if (!ctx) {
    throw new Error("useMerkliste must be used within MerklisteProvider");
  }
  return ctx;
}
