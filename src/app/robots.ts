import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Staging/preview deployments set NEXT_PUBLIC_ALLOW_INDEXING=false to stay out of search. */
export default function robots(): MetadataRoute.Robots {
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";
  return {
    rules: allow ? [{ userAgent: "*", allow: "/", disallow: ["/api/", "/offline"] }] : [{ userAgent: "*", disallow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
