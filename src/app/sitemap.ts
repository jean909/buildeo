import type { MetadataRoute } from "next";
import { getAllListingSlugs } from "@/lib/listings-repo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const staticPaths = ["", "/suche", "/merkliste", "/impressum", "/datenschutz", "/agb"];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: path === "" ? base : `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/suche" ? "hourly" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const slugs = await getAllListingSlugs();
  for (const slug of slugs) {
    entries.push({
      url: `${base}/inserat/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    });
  }

  return entries;
}
