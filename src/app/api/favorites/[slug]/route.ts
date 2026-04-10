import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const listing = await prisma.listing.findUnique({ where: { slug: decodeURIComponent(slug) } });
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, listingId: listing.id },
  });

  return NextResponse.json({ ok: true });
}
