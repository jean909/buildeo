"use client";

import { useListingContact } from "./listing-contact-root";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function ListingContactTrigger({ className, children }: Props) {
  const { open, enabled } = useListingContact();
  return (
    <button type="button" disabled={!enabled} onClick={open} className={className}>
      {children}
    </button>
  );
}
