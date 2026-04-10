import { getTranslations } from "next-intl/server";
import type { Listing } from "@/types/listing";
import { ListingCardBody } from "./listing-card-body";

export async function ListingCard({ listing }: { listing: Listing }) {
  const t = await getTranslations("listing");

  const copy = {
    roomsShort: t("roomsShort"),
    badgeRent: t("badgeRent"),
    badgeBuy: t("badgeBuy"),
    favoriteAdd: t("favoriteAdd"),
    favoriteRemove: t("favoriteRemove"),
    badgeNew: t("badgeNew"),
  };

  return <ListingCardBody listing={listing} copy={copy} />;
}
