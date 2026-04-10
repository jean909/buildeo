import type { Prisma } from "@prisma/client";
import type { Listing as ListingDto, ListingKind } from "@/types/listing";
import { prisma } from "@/lib/prisma";
import type { SearchFilterState, SearchTyp } from "@/lib/filter-listings";
import { RENT_FEATURE_KEYS, type RentFeatureKey } from "@/lib/filter-listings";

function kindFromTyp(typ: SearchTyp): ListingKind | undefined {
  if (typ === "mieten") return "rent";
  if (typ === "kaufen") return "buy";
  return undefined;
}

const RENT_FEATURE_TERMS: Record<RentFeatureKey, string[]> = {
  balkon: ["balkon", "loggia", "terrasse"],
  garten: ["garten"],
  garage: ["garage", "stellplatz", "tiefgarage", "carport"],
  ebk: ["einbauküche", "ebk", "einbaukueche"],
  keller: ["keller"],
  aufzug: ["aufzug", "fahrstuhl", "personenaufzug"],
};

function rentFeatureConditions(features: Partial<Record<RentFeatureKey, boolean>>): Prisma.ListingWhereInput[] {
  const parts: Prisma.ListingWhereInput[] = [];
  for (const key of RENT_FEATURE_KEYS) {
    if (!features[key]) continue;
    const terms = RENT_FEATURE_TERMS[key];
    parts.push({
      OR: terms.flatMap((term) => [
        { title: { contains: term, mode: "insensitive" as const } },
        { description: { contains: term, mode: "insensitive" as const } },
      ]),
    });
  }
  return parts;
}

function buildWhere(filters: SearchFilterState): Prisma.ListingWhereInput {
  const kind = kindFromTyp(filters.typ);
  const parts: Prisma.ListingWhereInput[] = [];

  if (kind) parts.push({ kind });

  if (filters.preisMin != null || filters.preisMax != null) {
    parts.push({
      priceEur: {
        ...(filters.preisMin != null ? { gte: filters.preisMin } : {}),
        ...(filters.preisMax != null ? { lte: filters.preisMax } : {}),
      },
    });
  }

  if (filters.zimmerMin != null || filters.zimmerMax != null) {
    parts.push({
      rooms: {
        ...(filters.zimmerMin != null ? { gte: filters.zimmerMin } : {}),
        ...(filters.zimmerMax != null ? { lte: filters.zimmerMax } : {}),
      },
    });
  }

  if (filters.flaecheMin != null || filters.flaecheMax != null) {
    parts.push({
      livingAreaM2: {
        ...(filters.flaecheMin != null ? { gte: filters.flaecheMin } : {}),
        ...(filters.flaecheMax != null ? { lte: filters.flaecheMax } : {}),
      },
    });
  }

  if (kind === "rent") {
    if (filters.nurNeu) parts.push({ isNew: true });
    else if (filters.neinNeubau) parts.push({ isNew: false });
    parts.push(...rentFeatureConditions(filters.features));
  }

  return parts.length <= 1 ? (parts[0] ?? {}) : { AND: parts };
}

export function mapDbListing(row: {
  id: string;
  slug: string;
  title: string;
  city: string;
  postalCode: string;
  kind: string;
  rooms: number;
  livingAreaM2: number;
  priceEur: number;
  description: string;
  isNew: boolean;
  lat: number | null;
  lng: number | null;
  coverImageUrl: string | null;
}): ListingDto {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    city: row.city,
    postalCode: row.postalCode,
    kind: row.kind as ListingKind,
    rooms: row.rooms,
    livingAreaM2: row.livingAreaM2,
    priceEur: row.priceEur,
    description: row.description,
    isNew: row.isNew,
    lat: row.lat,
    lng: row.lng,
    coverImageUrl: row.coverImageUrl,
  };
}

export async function listListings(filters: SearchFilterState): Promise<ListingDto[]> {
  const where = buildWhere(filters);
  const rows = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const q = filters.q.trim().toLowerCase();
  const mapped = rows.map(mapDbListing);
  if (!q) return mapped;

  return mapped.filter((l) => {
    const hay = `${l.title} ${l.city} ${l.postalCode} ${l.description}`.toLowerCase();
    return hay.includes(q);
  });
}

export async function getListingBySlug(slug: string) {
  const row = await prisma.listing.findUnique({ where: { slug } });
  return row ? mapDbListing(row) : undefined;
}

export async function getFeaturedListings(limit: number) {
  const rows = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapDbListing);
}

export async function getAllListingSlugs() {
  const rows = await prisma.listing.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
