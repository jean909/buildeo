import type { MetadataRoute } from "next";
import { getAllListingSlugs } from "@/lib/listings-repo";
import { shouldSkipOptionalDbReadsDuringPrerender } from "@/lib/is-next-build-phase";
import { getSeoSitemapSlice, getTotalSeoPagesCount } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildeo.de").replace(/\/$/, "");
  const now = new Date();

  const staticPaths = [
    "",
    "/suche",
    "/staedte",
    "/merkliste",
    "/anfragen",
    "/inserat/neu",
    "/anmelden",
    "/registrieren",
    "/anbieterliste",
    "/impressum",
    "/datenschutz",
    "/agb",
  ];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: path === "" ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/suche" || path === "/staedte" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/staedte" ? 0.9 : 0.7,
  }));

  let slugs: string[] = [];
  if (!shouldSkipOptionalDbReadsDuringPrerender()) {
    try {
      slugs = await getAllListingSlugs();
    } catch {
      /* Offline / DB down */
    }
  }
  for (const slug of slugs) {
    entries.push({
      url: `${base}/inserat/${slug}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  // Programmatic SEO pages (Cities + Districts × Intents, capped safely below Google's 50k per-sitemap limit)
  const { totalPagesCount } = getTotalSeoPagesCount();
  const maxSeoEntries = Math.min(totalPagesCount, 48000);
  const seoEntries = getSeoSitemapSlice(0, maxSeoEntries);

  for (const item of seoEntries) {
    entries.push({
      url: `${base}/${item.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: item.priority,
    });
  }

  return entries;
}
