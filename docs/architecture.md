# Architecture & Decisions

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack, Cache Components, Partial Prefetching, React Compiler) | Static-first rendering with streaming where needed, and modern defaults from the scaffold |
| Language | TypeScript (strict) | No `any`, no `@ts-ignore` |
| Styling | Tailwind CSS 4, with semantic tokens in `src/app/globals.css` | One source of truth for colour, type and spacing |
| Motion | GSAP + ScrollTrigger + `@gsap/react` | Scroll choreography with lifecycle-safe cleanup |
| Validation | Zod (shared by client and server) | One schema per boundary |
| Icons | lucide-react | Consistent stroke weight |
| AI | `@anthropic-ai/sdk`, server-only | API key never reaches the browser |
| Tests | Vitest (pricing engine), Playwright + axe (journeys, responsive, a11y) | |

Libraries deliberately **not** added:

- **React Hook Form:** forms are small, and native `FormData` plus Zod is enough.
- **TanStack Query:** there is no client-side server-state caching need.
- **Lenis:** native scrolling is the reliable default.
- **A PWA plugin:** a hand-written `public/sw.js` is about 80 lines, transparent, and avoids build-plugin coupling with Next 16.
- **Custom SMTP / Prisma / Postgres:** enquiries go browser → Web3Forms → owner inbox, as specified. A database adds operations work with no current consumer. Add it when a lead dashboard is needed (see deployment.md).

## Directory map

```
src/app/                 routes, metadata, route handlers (api/*), sitemap/robots/manifest/OG
src/components/layout/   SiteHeader (mega menu + mobile drawer), SiteFooter
src/components/ui/       Button/ButtonLink/TextLink, SectionHeading/RevealHeading, Field, Accordion, Breadcrumbs
src/components/motion/   PageMotion (scroll reveals), Magnetic, ScrollProgress, BackToTop
src/components/sections/ PageHero, CtaBand, FaqSection, ProcessTimeline, PrinciplesBento, InsightCards, LegalPage
src/components/system/   NetworkStatus (offline notice + SW registration)
src/features/pricing/    types, catalog (prices), regions (countries/currencies/rates), engine, Currency UI
src/features/estimator/  config (questions → catalogue mapping), compute (authoritative), Estimator UI
src/features/contact/    schema, ContactForm, ProjectBriefForm, submit hook
src/features/chat/       ChatLauncher (lazy), ChatPanel
src/features/services/   ServiceShowcase (homepage)
src/features/portfolio/  WorkGrid (filters)
src/content/             typed content: site, services, products, work, insights, company, navigation
src/server/              server-only: knowledge (RAG index), rate-limit (assistant)
src/lib/web3forms.ts     browser-side Web3Forms client (key check, `success` validation, error kinds)
src/lib/                 seo (metadata + JSON-LD), gsap (registration + motion constants), cn
public/assets/           owner-supplied brand kit
public/images/retail-pos approved POS visuals
tests/unit, tests/e2e
```

## Content management

The content layer is a **typed local content layer** (`src/content/*.ts`). TypeScript validates every entry at build time, and every page, the sitemap and the assistant's knowledge base read from the same objects. That means:

- Adding a service, product, case study or article means adding an object. Routes, navigation, the sitemap, structured data and assistant knowledge update automatically.
- Products and case studies are arrays, so `/products` and `/work` scale without layout changes. The work filters appear only when there is more than one category.

**Migration path to a CMS (e.g. Sanity):** the content types in `src/content/*.ts` map one-to-one to CMS document schemas. Replace each exported array with a cached fetch (`"use cache"` + `cacheTag`), and revalidate the tag from a CMS webhook. Pages need no changes.

## Pricing engine

- **One authoritative module:** `features/pricing/engine.ts` resolves prices, and `features/estimator/compute.ts` builds estimates. The browser runs them for live display. `/api/leads` runs them again on the server from the submitted *selections* and **ignores any client totals**.
- **Regional vs converted:** a package has a `PriceBook` of independent regional prices (USD reference, PKR regional). A currency without its own entry shows USD × reference rate, rounded per currency and labelled "Converted reference". There are no purchasing-power multipliers.
- **Approval gate:** `approval: "draft"` prices are visible only with `NEXT_PUBLIC_PRICING_MODE=draft-preview`.
- **One-time and monthly** totals are always separate. Custom-scope items become "quote required" lines and are excluded from totals. Every range is base × (1 + service spread).
- **Region detection:** `/api/geo` reads the hosting edge's country header (Vercel/Cloudflare). It is a *suggestion* only. Server-side rendering is always USD, so hydration is deterministic. The visitor's choice persists in `localStorage` through a `useSyncExternalStore` store.

## AI assistant

- `src/server/knowledge.ts` builds a curated knowledge base **from the same content objects the site renders**, so the assistant can't "know" anything the site doesn't publish. Pricing chunks respect the pricing mode.
- Retrieval is lexical BM25 with light synonyms and a pricing-intent boost. That suits a corpus this small. Swap in embeddings when content grows.
- `/api/chat`:
  - Validates input with Zod (max 12 messages, 1,500 characters each) and rate-limits to 20 messages per 10 minutes per IP.
  - Sends retrieved content as `<knowledge>` data in the user turn, behind a stable, cached system prompt that says to treat it as data, never invent facts, and never promise outcomes.
  - Uses server-side refusal fallbacks and `effort: "low"`.
  - Never logs message content.
- **Without `ANTHROPIC_API_KEY`**, the assistant runs in **site-search mode**: it returns excerpts with links, and the UI says so. It never pretends to be an AI.
- Nothing is stored server-side, so there is no retention to manage. The privacy policy says this.

## Motion system

- Content is visible by default. A pre-paint script adds `.js-motion` only when reduced motion is **not** requested, and only then do `[data-reveal]` targets start hidden. A CSS fallback reveals them after 2.5 s if GSAP never runs.
- **Hero entrances are CSS keyframes, not GSAP.** They start before hydration, which protects LCP.
- `PageMotion` (in `app/template.tsx`) scans each route for `data-reveal` (`up | fade | lines | mask | stagger`) **after an idle callback**, so it never mutates streamed sections before React hydrates them. Revealed nodes get `.is-revealed`, so a route restored from React `<Activity>` does not replay its entrance.
- `ProcessTimeline` uses a scrubbed rail and **no pinning**, so touch scrolling is never trapped. Magnetic buttons apply only on `(hover: hover) and (pointer: fine)`.
- Shared constants live in `lib/gsap.ts` (`MOTION`).
- The first-visit intro is CSS-only, once per session, never blocks input, and lasts about 1.2 s.

## Offline / PWA

`public/sw.js` handles requests as follows:

| Request | Strategy |
|---|---|
| `/_next/static`, `/assets` | Cache-first |
| `/_next/image`, `/images` | Stale-while-revalidate (bounded) |
| Navigations | Network-first → cached page → `/offline` |
| `/api/*`, POST, RSC/prefetch requests | Never cached |

Forms, the estimator enquiry and the assistant detect offline state and say nothing was sent. Drafts are kept in `sessionStorage` only. The site's offline caching is **not** presented as evidence of Retail POS offline capability.

## Security

- Security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, a minimal CSP (`frame-ancestors`, `base-uri`, `form-action`, `object-src`), and HSTS in production.
- **Forms:** server-side Zod validation, a honeypot, a minimum fill time, per-IP rate limiting, and duplicate protection by `submissionId`. HTML in emails is escaped. Errors returned to the visitor are generic.
- No secrets are in client code. `server-only` guards the server modules.
- **Known limitation:** the rate limiter and duplicate cache are in-memory per instance. Use a shared store (Upstash Redis) on multi-instance hosting.
- **A full nonce-based CSP for scripts is not yet enabled.** It needs middleware/proxy nonces and is listed in implementation-status.md.
