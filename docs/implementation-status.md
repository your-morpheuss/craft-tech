# Implementation Status

Updated 2026-11-10. ✅ = built **and** exercised by automated or manual testing. 🟡 = built, but it needs credentials or owner content to go live. ⬜ = not done.

## Completed

| Area | Status | Notes |
|---|---|---|
| Brand & content audit | ✅ | `docs/brand-and-content-audit.md` |
| Design system (tokens, fluid type, 12-col grid, surfaces) | ✅ | `src/app/globals.css` |
| Header: mega menu, Company dropdown, mobile drawer | ✅ | Keyboard and Escape support, click-outside, focus return, scroll lock, focus trap, closes on route change |
| Footer | ✅ | Verified social links only; legal links; back to top |
| Homepage: intro, hero, studio, services showcase, selected work, POS spotlight, process, principles bento, pricing intro, insights, FAQ, closing CTA | ✅ | |
| `/services` + 6 service pages | ✅ | Individually art-directed heroes, problems, deliverables, capabilities, process, project types, methodology, packages, FAQ, related services |
| `/about` | ✅ | No invented team, history or metrics |
| `/work` + `/work/[slug]` | ✅ | One approved case study (Retail POS). Filters appear automatically with more categories. |
| `/products` + `/products/retail-pos` | ✅ | Verified features only, demo request form, SoftwareApplication JSON-LD |
| Pricing data model, regions (PK, US, GB, AE, CA, AU, IN, 20 euro-area countries, INTL), currencies, reference rates | ✅ | Regional vs converted pricing kept separate; approval gate |
| `/pricing` (tabs, packages, comparison table, add-ons, quote factors, FAQ) | ✅ | |
| `/estimate` (5 steps, live summary, separate totals, ranges, quote lines, print, share link without personal data, session persistence) | ✅ | |
| Lead capture: contact, project brief, demo, estimate | ✅ | Server validation, honeypot, timing check, rate limit, de-duplication, server-side estimate recomputation |
| Lead delivery | 🟡 | Resend email and webhook implemented. Needs `RESEND_API_KEY` and/or `LEADS_WEBHOOK_URL`. Dev uses a file sink. |
| AI assistant | 🟡 | Curated RAG + Claude with guardrails implemented. Runs in honest search mode until `ANTHROPIC_API_KEY` is set. |
| Insights index + 3 articles | ✅ | Table of contents, reading time, Article JSON-LD, related services |
| Legal pages | 🟡 | Drafts that match actual data handling. **Legal review required.** |
| 404, route error, global error, offline page | ✅ | |
| PWA: manifest, icons, service worker, offline fallback, network notice | ✅ | |
| SEO: metadata, canonicals, OG image, sitemap, robots, Organization/WebSite/Breadcrumb/Service/FAQPage/Article/SoftwareApplication JSON-LD | ✅ | |
| WordPress redirects (single hop) | ✅ | `docs/wordpress-migration-map.md` |
| GSAP motion system with reduced-motion support | ✅ | |
| Security headers | ✅ | Minimal CSP. See "Known limitations". |
| Conversion event hooks | ✅ | No provider installed; fires only with consent and only on success |
| Tests: unit, E2E, responsive, a11y | ✅ | `docs/testing-report.md` |
| Docs: README, env template, architecture, deployment, verification report | ✅ | |

## Open integration requirements

1. **Email:** Resend account, domain verification, and SPF/DKIM/DMARC records.
2. **AI:** an Anthropic API key, if AI mode is wanted.
3. **Hosting:** a staging deployment with indexing disabled.
4. **Exchange rates:** a rates endpoint (optional; the static table is used otherwise).
5. **Analytics:** pick a provider and add a consent banner, if wanted.

## Content awaiting verification

See `docs/content-verification-report.md`. The headline items are:

- All prices (currently drafts).
- Retail POS offline behaviour, hardware support, system requirements and licensing.
- Email deliverability.
- Legal review.
- Approval of the Insights articles.
- Additional client case studies.

## Known limitations

- The rate limiter and de-duplication cache are in-memory per instance. Use Redis on serverless or multi-instance hosting.
- No nonce-based script CSP yet. It needs a proxy/middleware nonce and Next's nonce support.
- Retail POS imagery: two of the supplied images were excluded (see the audit).
- Only Chrome was tested automatically. A manual screen-reader pass is still to do.
- With the static reference table, exchange rates update only on rebuild.

---

## Phase 2 — Creative refinement (2026-11-11)

| Area | Status | Notes |
|---|---|---|
| New homepage hero: CT prism + discipline interaction | ✅ | `src/features/hero/*`. Sticky hero with the next section sliding over it. Reduced-motion and no-JS safe. See `docs/design-refinement.md`. |
| Homepage re-composition | ✅ | Scroll-scrubbed manifesto, services viewer, layered POS showcase, asymmetric work, varied bento, dark process, price index, prism CTA |
| Header dark tone over the hero; chat launcher hidden over the hero | ✅ | |
| Retail POS page: layered hero, feature stories, controlled carousel | ✅ | Real supplied screens only |
| Pricing on the WebMinds reference | 🟡 | Numbers imported unchanged (`docs/pricing-reference.md`) and marked **pending approval**. In production (`approved-only`) they show "Quote on request" until approved. Graphic Design is custom quote. |
| Live exchange rates | ✅ | ExchangeRate-API, cached for hours, with a static fallback |
| Estimator: service → package → add-ons → region → review → enquiry | ✅ | Reproduces the reference estimator's own total (unit test) |
| Web3Forms on all 5 forms (contact, pricing, project, estimate, demo) | 🟡 | Implemented and tested against a mocked API. **Real delivery is unverified: no access key has been provided yet.** |
| hCaptcha | 🟡 | Implemented behind `NEXT_PUBLIC_WEB3FORMS_HCAPTCHA`. It must also be enabled in the Web3Forms dashboard, and has not been tested live. |
| Removed | — | `/api/leads` and the server-side email/webhook/file delivery, replaced by Web3Forms |

**Still needed:**

- A Web3Forms access key, followed by one real submission per form.
- Commercial approval of the reference prices.
- Confirmation of the scope caveats in `pricing-reference.md`: Shopify stores, cross-platform apps, link outreach, and the USD 50 logo.
