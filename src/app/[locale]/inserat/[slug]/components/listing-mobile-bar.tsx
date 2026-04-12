"use client";

import { Link } from "@/i18n/navigation";
import { useListingContact } from "./listing-contact-root";

type Props = {
  priceLabel: string;
  formatted: string;
  contactLabel: string;
  ownerInquiriesLabel: string;
  isOwner: boolean;
};

export function ListingMobileBar({
  priceLabel,
  formatted,
  contactLabel,
  ownerInquiriesLabel,
  isOwner,
}: Props) {
  const { open, enabled } = useListingContact();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 p-4 shadow-[0_-4px_20px_rgb(0_0_0/0.08)] backdrop-blur-md lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{priceLabel}</p>
          <p className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-50">{formatted}</p>
        </div>
        {isOwner ? (
          <Link
            href="/anfragen"
            className="shrink-0 rounded-lg bg-bd-primary px-5 py-3 text-sm font-semibold text-bd-primary-fg shadow-sm hover:bg-bd-primary-hover"
          >
            {ownerInquiriesLabel}
          </Link>
        ) : (
          <button
            type="button"
            disabled={!enabled}
            onClick={open}
            className="shrink-0 rounded-lg bg-bd-primary px-5 py-3 text-sm font-semibold text-bd-primary-fg shadow-sm hover:bg-bd-primary-hover disabled:opacity-50"
          >
            {contactLabel}
          </button>
        )}
      </div>
    </div>
  );
}
