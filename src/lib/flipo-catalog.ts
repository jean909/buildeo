import { prisma } from "@/lib/prisma";

export type FlipoListingBrief = {
  slug: string;
  title: string;
  city: string;
  postalCode: string;
  kind: string;
  rooms: number;
  livingAreaM2: number;
  priceEur: number;
  description: string;
};

export async function getListingsCatalogForFlipo(): Promise<FlipoListingBrief[]> {
  const rows = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    take: 80,
  });
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    city: r.city,
    postalCode: r.postalCode,
    kind: r.kind,
    rooms: r.rooms,
    livingAreaM2: r.livingAreaM2,
    priceEur: r.priceEur,
    description: r.description.length > 220 ? `${r.description.slice(0, 217)}…` : r.description,
  }));
}

export function fallbackSlugMatch(query: string, catalog: FlipoListingBrief[], limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return catalog.slice(0, limit).map((c) => c.slug);
  const tokens = q.split(/\s+/).filter((t) => t.length > 1);
  const scored = catalog.map((c) => {
    const hay = `${c.title} ${c.city} ${c.postalCode} ${c.description} ${c.kind}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      if (hay.includes(t)) score += 2;
    }
    if (c.city.toLowerCase().includes(q)) score += 5;
    return { slug: c.slug, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.slug);
}
