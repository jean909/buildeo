import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4000;

function trimStr(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: Request, { params }: Params) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const fromName = trimStr(body.name, MAX_NAME);
  const fromEmail = trimStr(body.email, MAX_EMAIL).toLowerCase();
  const message = trimStr(body.message, MAX_MESSAGE);

  if (!fromName || !fromEmail || !message) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { slug },
    select: { id: true, ownerId: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (!listing.ownerId) {
    return NextResponse.json({ error: "no_owner" }, { status: 409 });
  }

  const session = await auth();
  if (session?.user?.id && session.user.id === listing.ownerId) {
    return NextResponse.json({ error: "own_listing" }, { status: 400 });
  }

  await prisma.contactInquiry.create({
    data: {
      listingId: listing.id,
      fromName,
      fromEmail,
      message,
    },
  });

  return NextResponse.json({ ok: true });
}
