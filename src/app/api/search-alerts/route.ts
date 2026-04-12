import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_EMAIL = 254;
const MAX_QUERY = 2048;

function trimEmail(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.trim().toLowerCase().slice(0, MAX_EMAIL);
}

export async function POST(req: Request) {
  let body: { email?: unknown; filtersQuery?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const email = trimEmail(body.email);
  const filtersQuery =
    typeof body.filtersQuery === "string" ? body.filtersQuery.trim().slice(0, MAX_QUERY) : null;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  await prisma.searchAlertSignup.upsert({
    where: { email },
    create: { email, filtersQuery: filtersQuery || null },
    update: { filtersQuery: filtersQuery || null },
  });

  return NextResponse.json({ ok: true });
}
