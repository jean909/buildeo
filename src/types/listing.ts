export type ListingKind = "rent" | "buy";

export type Listing = {
  id: string;
  slug: string;
  title: string;
  city: string;
  postalCode: string;
  kind: ListingKind;
  rooms: number;
  livingAreaM2: number;
  priceEur: number;
  description: string;
  /** „Neu“-Badge in Listen (z. B. letzte 14 Tage simuliert) */
  isNew?: boolean;
  lat?: number | null;
  lng?: number | null;
  /** Cover-Foto (z. B. Unsplash), für Karten & Detailseite */
  coverImageUrl?: string | null;
};
