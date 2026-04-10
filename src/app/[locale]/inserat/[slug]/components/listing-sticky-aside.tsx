import { getTranslations } from "next-intl/server";
import type { Listing } from "@/types/listing";
import { ListingContactTrigger } from "./listing-contact-trigger";

type Props = {
  listing: Listing;
};

export async function ListingStickyAside({ listing }: Props) {
  const t = await getTranslations("listing");
  const isRent = listing.kind === "rent";
  const priceLabel = isRent ? t("rent") : t("price");
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(listing.priceEur);

  return (
    <aside className="rounded-xl border border-zinc-200 bg-white p-5 shadow-[var(--shadow-bd-card)] dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {priceLabel}
      </p>
      <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
        {formatted}
      </p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {listing.postalCode} {listing.city}
      </p>
      <ListingContactTrigger className="mt-6 w-full rounded-lg bg-bd-primary py-3 text-sm font-semibold text-bd-primary-fg shadow-sm transition hover:bg-bd-primary-hover">
        {t("contact")}
      </ListingContactTrigger>
      <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
        {t("asideDisclaimer")}
      </p>
    </aside>
  );
}
