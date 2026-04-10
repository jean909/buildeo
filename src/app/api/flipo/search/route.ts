import { NextResponse } from "next/server";
import { mapDbListing } from "@/lib/listings-repo";
import { fallbackSlugMatch, getListingsCatalogForFlipo } from "@/lib/flipo-catalog";
import { prisma } from "@/lib/prisma";
import { runReplicateTextCompletion } from "@/lib/replicate-run";

export const maxDuration = 120;

function parseSlugArray(text: string): string[] {
  const trimmed = text.trim();
  try {
    const direct = JSON.parse(trimmed) as unknown;
    if (Array.isArray(direct) && direct.every((x) => typeof x === "string")) {
      return (direct as string[]).map((s) => s.trim()).filter(Boolean);
    }
  } catch {
    /* continue */
  }
  const m = trimmed.match(/\[[\s\S]*?\]/);
  if (!m) return [];
  try {
    const arr = JSON.parse(m[0]) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((x): x is string => typeof x === "string").map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function buildPrompt(userQuery: string, catalogJson: string): string {
  return `Du bist Buildeo Flipo KI, ein Immobilien-Assistent für Deutschland. Der Nutzer sucht in natürlicher Sprache.

Nutzeranfrage: "${userQuery.replace(/"/g, "'")}"

Verfügbare Inserate (nur diese Slugs existieren, erfinde keine neuen):
${catalogJson}

Antworte AUSSCHLIESSLICH mit einem JSON-Array der passendsten Slugs (Strings), sortiert nach Relevanz, maximal 8 Einträge. Kein Fließtext, keine Erklärung, kein Markdown. Beispielformat: ["slug-eins","slug-zwei"]`;
}

export async function POST(req: Request) {
  let body: { query?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query) {
    return NextResponse.json({ error: "query required" }, { status: 400 });
  }

  const catalog = await getListingsCatalogForFlipo();
  const catalogJson = JSON.stringify(catalog, null, 0);

  let slugs: string[] = [];
  let usedAi = false;

  if (process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_FLIPO_VERSION) {
    try {
      const prompt = buildPrompt(query, catalogJson);
      const out = await runReplicateTextCompletion(prompt);
      slugs = parseSlugArray(out);
      if (slugs.length > 0) usedAi = true;
    } catch (e) {
      console.error("[flipo] replicate error", e);
    }
  }

  if (slugs.length === 0) {
    slugs = fallbackSlugMatch(query, catalog);
  }

  const slugSet = new Set(catalog.map((c) => c.slug));
  const ordered = slugs.filter((s) => slugSet.has(s));
  const finalOrder = ordered.length > 0 ? ordered : fallbackSlugMatch(query, catalog);

  const rows = await prisma.listing.findMany({
    where: { slug: { in: finalOrder } },
  });

  const mapped = rows.map(mapDbListing);
  mapped.sort((a, b) => finalOrder.indexOf(a.slug) - finalOrder.indexOf(b.slug));

  return NextResponse.json({
    listings: mapped,
    usedAi,
  });
}
