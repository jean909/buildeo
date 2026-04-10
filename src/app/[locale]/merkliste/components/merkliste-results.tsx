"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ListingCardBody, type ListingCardCopy } from "@/components/listing/listing-card-body";
import { useMerkliste } from "@/components/merkliste/merkliste-provider";
import type { Listing } from "@/types/listing";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

export function MerklisteResults() {
  const t = useTranslations("merkliste");
  const tListing = useTranslations("listing");
  const { slugs, ready, mode } = useMerkliste();
  const { status } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);

  const copy: ListingCardCopy = useMemo(
    () => ({
      roomsShort: tListing("roomsShort"),
      badgeRent: tListing("badgeRent"),
      badgeBuy: tListing("badgeBuy"),
      favoriteAdd: tListing("favoriteAdd"),
      favoriteRemove: tListing("favoriteRemove"),
      badgeNew: tListing("badgeNew"),
    }),
    [tListing],
  );

  const slugsKey = slugs.join("|");

  useEffect(() => {
    if (!ready || status === "loading") return;

    if (slugs.length === 0) {
      setListings([]);
      return;
    }

    if (mode === "server") {
      (async () => {
        try {
          const res = await fetch("/api/favorites", { cache: "no-store" });
          const data = (await res.json()) as { listings?: Listing[] };
          setListings(Array.isArray(data.listings) ? data.listings : []);
        } catch {
          setListings([]);
        }
      })();
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/listings/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slugs }),
        });
        const data = (await res.json()) as { listings?: Listing[] };
        setListings(Array.isArray(data.listings) ? data.listings : []);
      } catch {
        setListings([]);
      }
    })();
  }, [ready, status, mode, slugsKey, slugs]);

  if (!ready || status === "loading") {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("loading")}</p>;
  }

  if (slugs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-600 dark:bg-zinc-900">
        <p className="text-zinc-600 dark:text-zinc-400">{t("empty")}</p>
        <Link
          href="/suche"
          className="mt-6 inline-flex rounded-lg bg-bd-primary px-5 py-2.5 text-sm font-semibold text-bd-primary-fg hover:bg-bd-primary-hover"
        >
          {t("goSearch")}
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex max-w-2xl flex-col gap-5">
      {listings.map((listing) => (
        <li key={listing.id}>
          <ListingCardBody listing={listing} copy={copy} />
        </li>
      ))}
    </ul>
  );
}
