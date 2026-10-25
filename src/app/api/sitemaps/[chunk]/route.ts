import { NextResponse } from "next/server";
import { getSeoSitemapSlice, getTotalSeoPagesCount } from "@/lib/seo";

const CHUNK_SIZE = 10000;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ chunk: string }> },
) {
  const { chunk } = await context.params;
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildeo.de").replace(/\/$/, "");
  const lastMod = new Date().toISOString();
  const { totalPagesCount } = getTotalSeoPagesCount();
  const totalChunks = Math.ceil(totalPagesCount / CHUNK_SIZE);

  // /api/sitemaps/index -> Sitemap Index XML listing all chunks
  if (chunk === "index") {
    const sitemapsXml = Array.from({ length: totalChunks }, (_, idx) => {
      const loc = `${base}/api/sitemaps/${idx}`;
      return `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastMod}</lastmod>\n  </sitemap>`;
    }).join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapsXml}\n</sitemapindex>`;
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  const chunkIndex = Number.parseInt(chunk, 10);
  if (!Number.isFinite(chunkIndex) || chunkIndex < 0 || chunkIndex >= totalChunks) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const offset = chunkIndex * CHUNK_SIZE;
  const items = getSeoSitemapSlice(offset, CHUNK_SIZE);

  const urlsXml = items
    .map(
      (item) =>
        `  <url>\n    <loc>${escapeXml(`${base}/${item.slug}`)}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${item.priority.toFixed(2)}</priority>\n  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
