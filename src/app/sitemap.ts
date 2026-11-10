import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { products } from "@/content/products";
import { caseStudies } from "@/content/work";
import { articles } from "@/content/insights";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const core: [string, number][] = [
    ["/", 1], ["/services", 0.9], ["/pricing", 0.8], ["/estimate", 0.7], ["/work", 0.7], ["/products", 0.8],
    ["/about", 0.6], ["/contact", 0.6], ["/start-a-project", 0.7], ["/insights", 0.5],
    ["/privacy-policy", 0.2], ["/terms-and-conditions", 0.2],
  ];
  return [
    ...core.map(([p, priority]) => ({ url: u(p), priority })),
    ...services.map((s) => ({ url: u(`/services/${s.slug}`), priority: 0.9 })),
    ...products.map((p) => ({ url: u(`/products/${p.slug}`), priority: 0.9 })),
    ...caseStudies.map((c) => ({ url: u(`/work/${c.slug}`), priority: 0.6 })),
    ...articles.map((a) => ({ url: u(`/insights/${a.slug}`), lastModified: a.updated ?? a.published, priority: 0.5 })),
  ];
}
