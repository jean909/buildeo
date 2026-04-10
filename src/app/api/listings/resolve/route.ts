import { NextResponse } from "next/server";
import { mapDbListing } from "@/lib/listings-repo";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  let body: { slugs?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slugs = Array.isArray(body.slugs) ? body.slugs.filter((s): s is string => typeof s === "string") : [];
  if (slugs.length === 0) {
    return NextResponse.json({ listings: [] });
  }

  const rows = await prisma.listing.findMany({
    where: { slug: { in: slugs } },
  });

  const order = new Map(slugs.map((s, i) => [s, i]));
  rows.sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));

  return NextResponse.json({ listings: rows.map(mapDbListing) });
}
