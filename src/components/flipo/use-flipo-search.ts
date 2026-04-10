"use client";

import { useCallback, useState } from "react";
import type { Listing } from "@/types/listing";

export function useFlipoSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [usedAi, setUsedAi] = useState(false);

  const search = useCallback(async (query: string) => {
    const q = query.trim();
    if (!q) {
      setListings([]);
      setError(null);
      setUsedAi(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/flipo/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = (await res.json()) as { listings?: Listing[]; usedAi?: boolean; error?: string };
      if (!res.ok) {
        throw new Error(data.error || "request_failed");
      }
      setListings(Array.isArray(data.listings) ? data.listings : []);
      setUsedAi(Boolean(data.usedAi));
    } catch {
      setError("fail");
      setListings([]);
      setUsedAi(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setListings([]);
    setError(null);
    setUsedAi(false);
  }, []);

  return { search, reset, loading, error, listings, usedAi };
}
