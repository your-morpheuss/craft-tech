import type { Metadata } from "next";
import { createElement } from "react";
import { site } from "@/content/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

/** Consistent metadata with canonical + OG/Twitter for every page. */
export function pageMetadata({ title, description, path, image, type = "website", noindex }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type, siteName: site.name, ...(image ? { images: [{ url: image }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image] } : {}) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export const absoluteUrl = (path: string) => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/assets/brand/favicon-512.png"),
    slogan: site.tagline,
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: site.location.city, addressCountry: site.location.countryCode },
    sameAs: site.social.map((s) => s.href),
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function serviceSchema(s: { name: string; description: string; path: string }): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    url: absoluteUrl(s.path),
    provider: { "@id": `${site.url}/#organization` },
    areaServed: "Worldwide",
  };
}

export function faqSchema(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Escape `<` so JSON can never close the script tag. */
export function JsonLd({ data }: { data: Json | Json[] }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") },
  });
}
