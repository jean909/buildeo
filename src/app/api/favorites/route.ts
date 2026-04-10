import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { mapDbListing } from "@/lib/listings-repo";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ slugs: [] as string[], listings: [] });
  }

  const favs = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { listing: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    slugs: favs.map((f) => f.listing.slug),
    listings: favs.map((f) => mapDbListing(f.listing)),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const slug = body.slug?.trim();
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { slug } });
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: {
      userId_listingId: { userId: session.user.id, listingId: listing.id },
    },
    create: { userId: session.user.id, listingId: listing.id },
    update: {},
  });

  return NextResponse.json({ ok: true });
}
