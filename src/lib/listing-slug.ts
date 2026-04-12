import { prisma } from "@/lib/prisma";

/** URL-safe slug from title (ASCII); German umlauts normalized. */
export function slugifyTitle(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return base || "inserat";
}

export async function allocateUniqueListingSlug(title: string): Promise<string> {
  const base = slugifyTitle(title);
  let slug = base;
  for (let i = 0; i < 16; i++) {
    const taken = await prisma.listing.findUnique({ where: { slug }, select: { id: true } });
    if (!taken) return slug;
    slug = `${base}-${Math.random().toString(36).slice(2, 9)}`;
  }
  return `${base}-${Date.now().toString(36)}`;
}
