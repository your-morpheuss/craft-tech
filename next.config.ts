import type { NextConfig } from "next";

/**
 * Legacy WordPress URLs → new routes (permanent). See docs/wordpress-migration-map.md.
 * `{/}?` matches with or without the trailing slash WordPress used, so every
 * legacy URL resolves in a single hop (no slash-strip → redirect chain).
 */
const legacyRedirects: { source: string; destination: string }[] = [
  { source: "/about-us{/}?", destination: "/about" },
  { source: "/contact-us{/}?", destination: "/contact" },
  { source: "/blogs{/}?", destination: "/insights" },
  { source: "/seo-services{/}?", destination: "/services/seo" },
  { source: "/hello-world{/}?", destination: "/services/graphic-design" },
  { source: "/category/:slug*", destination: "/insights" },
  { source: "/author/:slug*", destination: "/about" },
  { source: "/elementor-hf/:slug*", destination: "/" },
  { source: "/wp-sitemap.xml", destination: "/sitemap.xml" },
  { source: "/wp-sitemap-:rest(.*)", destination: "/sitemap.xml" },
  { source: "/feed{/}?", destination: "/insights" },
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
  ...(process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  poweredByHeader: false,
  // Handled below so legacy URLs redirect in one hop.
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      ...legacyRedirects.map((r) => ({ ...r, permanent: true })),
      // Generic trailing-slash normalisation for everything else.
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache" }, { key: "Service-Worker-Allowed", value: "/" }] },
    ];
  },
};

export default nextConfig;
