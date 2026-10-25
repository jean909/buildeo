import type { MetadataRoute } from "next";
import { getTotalSeoPagesCount } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://buildeo.de").replace(/\/$/, "");
  const { totalPagesCount } = getTotalSeoPagesCount();
  const totalChunks = Math.ceil(totalPagesCount / 10000);

  const chunkSitemaps = Array.from(
    { length: totalChunks },
    (_, idx) => `${base}/api/sitemaps/${idx}`,
  );

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/sitemaps/"],
      disallow: ["/api/"],
    },
    sitemap: [`${base}/sitemap.xml`, `${base}/api/sitemaps/index`, ...chunkSitemaps],
  };
}
