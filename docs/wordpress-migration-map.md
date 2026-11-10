# WordPress → Next.js Migration Map

Source inventory: `https://crafttech-labs.com/sitemap.xml` (WordPress core sitemaps), crawled on 2026-11-10. The live site uses root-level permalinks with trailing slashes.

All redirects are **308 (permanent)** and resolve in **one hop**. Trailing slash variants are matched directly, and `skipTrailingSlashRedirect` stops Next from adding a second hop. They are implemented in `next.config.ts` and covered by `tests/e2e/journeys.spec.ts` → "legacy WordPress URLs redirect permanently in one hop".

| Old URL | Type | New URL | Rationale |
|---|---|---|---|
| `/` | Page | `/` | Unchanged |
| `/about-us/` | Page | `/about` | Same intent |
| `/services/` | Page | `/services` | Same path; the trailing slash is normalised |
| `/contact-us/` | Page | `/contact` | Same intent |
| `/blogs/` | Page | `/insights` | Blog index renamed |
| `/seo-services/` | Post ("SEO Services") | `/services/seo` | The post was a short service description, so it maps to the dedicated service page, which has the same search intent and much more depth |
| `/hello-world/` | Post ("Graphic Design") | `/services/graphic-design` | Same reasoning. The WordPress default slug is dropped. |
| `/category/uncategorized/` | Taxonomy | `/insights` | No category structure is worth preserving |
| `/category/*` | Taxonomy | `/insights` | Catch-all |
| `/author/*` | User archive | `/about` | User archives are listed in `wp-sitemap-users-1.xml` |
| `/elementor-hf/header/`, `/elementor-hf/footer/` | Builder templates | `/` | Exposed template pages; they should never have been indexed |
| `/wp-sitemap.xml`, `/wp-sitemap-*.xml` | Sitemaps | `/sitemap.xml` | Old sitemap URLs submitted to Search Console |
| `/feed/` | RSS | `/insights` | No feed on the new site |
| Any other `/path/` | — | `/path` | Generic trailing-slash normalisation |

Not redirected (no evidence they exist): `/privacy-policy/`, `/terms/`. Both new legal pages sit at new URLs. If Search Console shows other indexed URLs, add them to `legacyRedirects` in `next.config.ts`.

## Metadata carried over

The live pages used generic titles (`"About Us – crafttech-labs.com"`) and had no visible meta descriptions. Every new page has a unique title, description and canonical URL, set through `pageMetadata()` in `src/lib/seo.ts`.

## Launch checklist (SEO)

1. Deploy to staging with `NEXT_PUBLIC_ALLOW_INDEXING=false`. Confirm `robots.txt` disallows everything.
2. Crawl staging (Screaming Frog or a similar tool) and confirm there are no 4xx/5xx errors and no redirect chains.
3. Run the legacy URL list against staging and confirm each returns a single 308 to the right target.
4. At launch, set `NEXT_PUBLIC_ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL=https://crafttech-labs.com`.
5. In Google Search Console, submit `https://crafttech-labs.com/sitemap.xml` and remove `wp-sitemap.xml`.
6. Watch Coverage and Pages reports for 4 weeks. Add a redirect for any legacy 404 that appears.
7. Keep the WordPress install (not public) for 30 days as a rollback source. Do not delete its media until the redirects are confirmed.
