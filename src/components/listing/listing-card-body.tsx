"use client";

import { Link } from "@/i18n/navigation";
import { ListingCoverMedia } from "@/components/listing/listing-cover-media";
import type { Listing } from "@/types/listing";
import { FavoriteToggle } from "@/components/merkliste/favorite-toggle";

export type ListingCardCopy = {
  roomsShort: string;
  badgeRent: string;
  badgeBuy: string;
  favoriteAdd: string;
  favoriteRemove: string;
  badgeNew: string;
};

export function ListingCardBody({
  listing,
  copy,
  showFavorite = true,
}: {
  listing: Listing;
  copy: ListingCardCopy;
  showFavorite?: boolean;
}) {
  const isRent = listing.kind === "rent";
  const badge = isRent ? copy.badgeRent : copy.badgeBuy;
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(listing.priceEur);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[var(--shadow-bd-card)] transition hover:border-bd-primary/35 hover:shadow-[var(--shadow-bd-float)] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-500/40">
      {showFavorite ? (
        <div className="absolute right-3 top-3 z-10">
          <FavoriteToggle
            slug={listing.slug}
            labelAdd={copy.favoriteAdd}
            labelRemove={copy.favoriteRemove}
          />
        </div>
      ) : null}
      <Link
        href={`/inserat/${listing.slug}`}
        className="flex flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-bd-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900">
          {listing.coverImageUrl ? (
            <ListingCoverMedia
              src={listing.coverImageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="transition duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : null}
          <span className="absolute left-3 top-3 rounded-md bg-white/95 px-2 py-1 text-xs font-bold text-bd-primary shadow-sm dark:bg-zinc-950/95 dark:text-teal-300">
            {formatted}
          </span>
          <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-zinc-900/85 px-2 py-1 text-xs font-semibold text-white dark:bg-zinc-100/90 dark:text-zinc-900">
              {badge}
            </span>
            {listing.isNew ? (
              <span className="rounded-md bg-bd-primary px-2 py-1 text-xs font-bold text-bd-primary-fg shadow-sm">
                {copy.badgeNew}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {listing.postalCode} {listing.city}
          </p>
          <h2 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-zinc-900 group-hover:text-bd-primary dark:text-zinc-50 dark:group-hover:text-teal-300">
            {listing.title}
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {listing.rooms} {copy.roomsShort} · {listing.livingAreaM2} m²
          </p>
        </div>
      </Link>
    </article>
  );
}
