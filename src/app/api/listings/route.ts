import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { allocateUniqueListingSlug } from "@/lib/listing-slug";
import { prisma } from "@/lib/prisma";

const MAX = {
  title: 120,
  city: 80,
  postal: 12,
  desc: 8000,
  url: 500,
} as const;

function num(v: unknown, min: number, max: number, int = false): number | null {
  const n = typeof v === "string" ? Number.parseFloat(v) : typeof v === "number" ? v : NaN;
  if (!Number.isFinite(n)) return null;
  const x = int ? Math.trunc(n) : n;
  if (x < min || x > max) return null;
  return x;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim().slice(0, MAX.title) : "";
  const city = typeof body.city === "string" ? body.city.trim().slice(0, MAX.city) : "";
  const postalCode = typeof body.postalCode === "string" ? body.postalCode.trim().slice(0, MAX.postal) : "";
  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, MAX.desc) : "";
  const kindRaw = typeof body.kind === "string" ? body.kind.trim() : "";
  const kind = kindRaw === "buy" || kindRaw === "kaufen" ? "buy" : "rent";

  const rooms = num(body.rooms, 0.5, 20, false);
  const livingAreaM2 = num(body.livingAreaM2, 5, 50_000, true);
  const priceEur = num(body.priceEur, 1, 200_000_000, true);

  if (title.length < 3 || city.length < 2 || postalCode.length < 2 || description.length < 10) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  if (rooms == null || livingAreaM2 == null || priceEur == null) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  let coverImageUrl: string | null = null;
  if (typeof body.coverImageUrl === "string" && body.coverImageUrl.trim()) {
    const u = body.coverImageUrl.trim().slice(0, MAX.url);
    if (/^https:\/\//i.test(u)) coverImageUrl = u;
  }

  let lat: number | null = null;
  let lng: number | null = null;
  const latN = num(body.lat, -90, 90, false);
  const lngN = num(body.lng, -180, 180, false);
  if (latN != null && lngN != null) {
    lat = latN;
    lng = lngN;
  }

  const isNew = body.isNew === true || body.isNew === "true" || body.isNew === "1";

  const slug = await allocateUniqueListingSlug(title);

  const row = await prisma.listing.create({
    data: {
      slug,
      title,
      city,
      postalCode,
      kind,
      rooms,
      livingAreaM2,
      priceEur,
      description,
      isNew,
      lat,
      lng,
      coverImageUrl,
      ownerId: session.user.id,
    },
    select: { slug: true },
  });

  return NextResponse.json({ ok: true, slug: row.slug });
}
