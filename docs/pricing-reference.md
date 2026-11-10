# Pricing Reference — WebMinds Studio

**Source:** https://webminds-studio.com/pricing (live site, inspected in a browser on 2026-11-10).
**Why:** the owner specified this site as the pricing reference.
**What was copied:** published USD numbers, package scope facts (pages, screens, channels, keywords) and add-on prices.
**What was not copied:** branding, marketing copy, layout, the "Most chosen" badges and the limited-time offer.
**Status:** every imported price is `approval: "pending"` in `src/features/pricing/catalog.ts`. In production, pending prices show as "Quote on request". They appear only with `NEXT_PUBLIC_PRICING_MODE=draft-preview`, labelled "Pending approval".

## Reference behaviour observed

- **Services filter:** "Website, Web App, Mobile, Desktop/POS, AI, UI/UX, Branding, E-commerce, CMS, SEO, SMM, Data/BI, Games".
- **Budget and billing filters:** budget bands, plus "One-time" vs "Monthly".
- **Packages:** four per service. Three have a "from" price; Enterprise is "Custom quote". Each shows a typical timeline, a one-line description and inclusions.
- **Comparison table:** per service.
- **Country/currency picker:** a modal (Pakistan, UK, USA, UAE, Saudi Arabia, Canada, plus a full list). Prices are shown in USD by default. We could not confirm separate regional price books, because the selection did not apply under automation.
- **Estimator:** Services → Packages → Add-ons → Estimate. Totals are plain sums, shown as "Estimated one-time" and "Estimated monthly". There are no ranges. The disclaimer reads, in substance: indicative, final quote in a proposal.
- **Verification:** with every starter package selected, the reference estimator showed **USD 4,347 one-time + USD 548/mo**. Our engine reproduces this exactly (unit test).

## Mapping to Craft Tech Labs services

| Craft Tech Labs service | Reference category | Packages (USD) | Billing |
|---|---|---|---|
| Website Development (Websites) | Website | Starter from 499 · Professional from 1,499 · Premium from 3,999 · Enterprise custom quote | One-time |
| Website Development (Online stores) | E-commerce & Shopify | Starter from 799 · Growth from 1,999 · Professional from 4,499 | One-time |
| Mobile Application Development | Mobile App | MVP from 2,999 · Business from 6,999 · Advanced from 13,999 · Enterprise custom quote | One-time |
| Social Media Management & Marketing | Social Media Marketing | Starter from 249/mo · Growth from 499/mo · Professional from 999/mo · Enterprise custom quote | Monthly |
| SEO Services | SEO | Starter from 299/mo · Growth from 599/mo · Professional from 1,199/mo · Enterprise custom quote | Monthly |
| Brand Identity | Logo & Branding | Starter 50 (fixed) · Professional 199 (fixed) · Premium Identity from 499 · Enterprise custom quote | One-time |
| **Graphic Design** | *No comparable published category* | **Custom quote only.** No prices were invented. | — |

Reference categories **not** published, because there is no matching Craft Tech Labs service: Web App, Desktop/POS, AI & Automation, UI/UX, CMS, Data/BI, Games.

### Add-ons (USD)

| Service | Add-ons |
|---|---|
| Websites | Extra pages 60/page · CMS integration 350 · Advanced animations 450 · Multilingual 400 · SEO setup 250 · Analytics 150 · Blog setup 200 · Maintenance 120/mo |
| Online stores | Catalogue setup 120 per 50 products · Subscriptions 500 · Marketplace integration 400 · Email flows 300 · Store migration 450 · Store maintenance 200/mo |
| Mobile | Push 400 · In-app payments 600 · Admin panel 900 · Offline mode 700 · Analytics 200 · Store submission 250 · Maintenance 300/mo |
| Brand | Social kit 99 · Stationery 79 · Guidelines 149 · Extra concept 39/concept · Animated logo 149 |
| SEO | Content (4 articles) 240/mo · Local listings 120/mo · Technical audit 350 · Link building 300/mo |
| Social | Paid ads management 300/mo (ad spend separate) · Short-form video pack 400/mo · Content strategy 200 |

## Scope caveats requiring approval

- **Online stores:** the reference scope is Shopify, including a headless Next.js storefront. Confirm Craft Tech Labs offers this.
- **Mobile:** the reference scope is cross-platform (Flutter / React Native). Our copy says "cross-platform" without naming a framework.
- **SEO Growth "Link outreach" and the "Link building" add-on:** check these against our "We don't buy links" policy. Outreach is not buying links, but confirm the wording.
- **Brand Starter at USD 50 (fixed):** confirm this suits Craft Tech Labs positioning.

## Currency

USD is the reference book. No regional prices are set.

- **Other currencies:** converted at live rates from ExchangeRate-API (`open.er-api.com`, cached for hours), with a static fallback table. Converted amounts are labelled "Indicative conversion from USD".
- **No markups:** there are no country-specific markups or discounts.
- **Regional prices:** to set one, add for example `PKR: 120000` to a package's `price` and mark it `approval: "approved"`.
