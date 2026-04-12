import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Listing } from "@/types/listing";
import { ListingContactTrigger } from "./listing-contact-trigger";

type Props = {
  listing: Listing;
  contactEnabled: boolean;
  isOwner: boolean;
};

export async function ListingStickyAside({ listing, contactEnabled, isOwner }: Props) {
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
      {isOwner ? (
        <Link
          href="/anfragen"
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-bd-primary py-3 text-sm font-semibold text-bd-primary-fg shadow-sm transition hover:bg-bd-primary-hover"
        >
          {t("ownerInquiriesCta")}
        </Link>
      ) : contactEnabled ? (
        <ListingContactTrigger className="mt-6 w-full rounded-lg bg-bd-primary py-3 text-sm font-semibold text-bd-primary-fg shadow-sm transition hover:bg-bd-primary-hover disabled:cursor-not-allowed disabled:opacity-50">
          {t("contact")}
        </ListingContactTrigger>
      ) : (
        <p className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-400">
          {t("contactUnavailable")}
        </p>
      )}
      <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
        {t("asideDisclaimer")}
      </p>
    </aside>
  );
}
