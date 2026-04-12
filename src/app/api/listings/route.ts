import { Prisma } from "@prisma/client";
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

function parseNumInput(v: unknown, int: boolean): number | null {
  if (typeof v === "number" && Number.isFinite(v)) {
    const x = int ? Math.trunc(v) : v;
    return x;
  }
  if (typeof v !== "string") return null;
  const s = v.trim().replace(/\s/g, "").replace(",", ".");
  if (s === "") return null;
  const n = int ? Number.parseInt(s, 10) : Number.parseFloat(s);
  if (!Number.isFinite(n)) return null;
  return int ? Math.trunc(n) : n;
}

function numInRange(v: unknown, min: number, max: number, int: boolean): number | null {
  const n = parseNumInput(v, int);
  if (n == null) return null;
  if (n < min || n > max) return null;
  return n;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" as const }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" as const }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim().slice(0, MAX.title) : "";
  const city = typeof body.city === "string" ? body.city.trim().slice(0, MAX.city) : "";
  const postalCode = typeof body.postalCode === "string" ? body.postalCode.trim().slice(0, MAX.postal) : "";
  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, MAX.desc) : "";
  const kindRaw = typeof body.kind === "string" ? body.kind.trim() : "";
  const kind = kindRaw === "buy" || kindRaw === "kaufen" ? "buy" : "rent";

  const rooms = numInRange(body.rooms, 0.5, 20, false);
  const livingAreaM2 = numInRange(body.livingAreaM2, 5, 50_000, true);
  const priceEur = numInRange(body.priceEur, 1, 200_000_000, true);

  if (title.length < 3 || city.length < 2 || postalCode.length < 2 || description.length < 10) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  if (rooms == null || livingAreaM2 == null || priceEur == null) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const coverRaw = typeof body.coverImageUrl === "string" ? body.coverImageUrl.trim() : "";
  let coverImageUrl: string | null = null;
  if (coverRaw) {
    const u = coverRaw.slice(0, MAX.url);
    if (/^https:\/\//i.test(u)) {
      coverImageUrl = u;
    } else {
      return NextResponse.json({ error: "cover_invalid" }, { status: 400 });
    }
  }

  const latRaw = body.lat;
  const lngRaw = body.lng;
  const latEmpty =
    latRaw === undefined || latRaw === null || (typeof latRaw === "string" && latRaw.trim() === "");
  const lngEmpty =
    lngRaw === undefined || lngRaw === null || (typeof lngRaw === "string" && lngRaw.trim() === "");
  if (latEmpty !== lngEmpty) {
    return NextResponse.json({ error: "coords_partial" }, { status: 400 });
  }

  let lat: number | null = null;
  let lng: number | null = null;
  if (!latEmpty && !lngEmpty) {
    const latN = numInRange(latRaw, -90, 90, false);
    const lngN = numInRange(lngRaw, -180, 180, false);
    if (latN == null || lngN == null) {
      return NextResponse.json({ error: "validation" }, { status: 400 });
    }
    lat = latN;
    lng = lngN;
  }

  const isNew = body.isNew === true || body.isNew === "true" || body.isNew === "1";

  let slug = await allocateUniqueListingSlug(title);

  const data = {
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
  };

  try {
    const row = await prisma.listing.create({
      data,
      select: { slug: true },
    });
    return NextResponse.json({ ok: true as const, slug: row.slug });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      try {
        slug = await allocateUniqueListingSlug(`${title}-${Date.now().toString(36)}`);
        const row = await prisma.listing.create({
          data: { ...data, slug },
          select: { slug: true },
        });
        return NextResponse.json({ ok: true as const, slug: row.slug });
      } catch {
        return NextResponse.json({ error: "slug_conflict" }, { status: 409 });
      }
    }
    console.error("[api/listings] create", e);
    return NextResponse.json({ error: "server" as const }, { status: 500 });
  }
}
