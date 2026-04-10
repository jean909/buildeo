"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import type { Listing } from "@/types/listing";
import { ListingCardBody, type ListingCardCopy } from "@/components/listing/listing-card-body";

export function FlipoResultList({ listings }: { listings: Listing[] }) {
  const tListing = useTranslations("listing");

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

  if (listings.length === 0) return null;

  return (
    <ul className="mt-6 grid gap-5 sm:grid-cols-2">
      {listings.map((listing) => (
        <li key={listing.id}>
          <ListingCardBody listing={listing} copy={copy} />
        </li>
      ))}
    </ul>
  );
}
