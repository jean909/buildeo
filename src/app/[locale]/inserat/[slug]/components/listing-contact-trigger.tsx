"use client";

import { useOpenListingContact } from "./listing-contact-root";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function ListingContactTrigger({ className, children }: Props) {
  const open = useOpenListingContact();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
