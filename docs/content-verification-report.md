# Content Verification Report

Every published claim that still needs owner sign-off is listed below. **Nothing here is invented as fact.** Where verification is missing, the site either leaves the claim out or words it so it does not overstate. Edit the content in `src/content/*` once each item is confirmed.

## A. Commercial

| # | Item | Location | Current treatment | Action needed |
|---|---|---|---|---|
| A1 | All package and add-on prices (USD reference + PKR regional) | `src/features/pricing/catalog.ts` | `approval: "draft"`. Hidden in production (`approved-only`) and shown only in `draft-preview` with a "Draft" badge. | Review each figure. Set `approval: "approved"` for each price you want published. |
| A2 | Regional price books for GBP/EUR/AED/CAD/AUD/INR | `catalog.ts` | None. These currencies show USD converted at reference rates, labelled "Converted reference". | Add per-currency prices if you want market-specific pricing |
| A3 | Reference exchange rates (as of 2026-11-01) | `src/features/pricing/regions.ts` | Static table | Update before launch or set `EXCHANGE_RATES_URL` |
| A4 | Tax wording per country | `regions.ts` (`taxNote`) | Generic "prices exclude …" | Confirm with an accountant |
| A5 | Typical timelines in packages ("1–3 weeks", etc.) | `catalog.ts` | Labelled "typically" | Confirm or remove |
| A6 | Revision rounds and fix windows (2–3 rounds, 30 days) | `catalog.ts` | Shown in package inclusions | Confirm |

## B. Services

| # | Item | Location | Action |
|---|---|---|---|
| B1 | Paid social campaign management offered | `services.ts`, `catalog.ts` | Confirm the service is offered. Ad spend is always stated as excluded. |
| B2 | Community management in business hours | `catalog.ts` | Confirm |
| B3 | Local SEO / Google Business Profile work | `services.ts` | Confirm |
| B4 | E-commerce builds and payment gateway setup | `services.ts` | Confirm platforms supported |
| B5 | Mobile: cross-platform vs native decided per project | `services.ts` | Confirm. No specific framework is named. |
| B6 | Copywriting offered as an add-on | `services.ts`, `catalog.ts` | Confirm |
| B7 | Ownership on final payment | `services.ts`, `company.ts` | Confirm this matches your contracts |
| B8 | "We don't buy links" | `services.ts` | Confirm policy |

## C. Retail POS

| # | Item | Treatment | Action |
|---|---|---|---|
| C1 | Offline operation | Quotes the product UI ("Your business works offline") and says behaviour will be confirmed in a demo | Provide technical confirmation |
| C2 | Barcode scanner / receipt printer compatibility | Not claimed. The demo form asks about hardware. | Provide a supported hardware list |
| C3 | Windows version and system requirements | Listed under "Confirmed on request" | Provide |
| C4 | Licensing and pricing | "Shared on request" | Provide |
| C5 | Multi-location / multi-terminal | "Not confirmed for publication" | Confirm or deny |
| C6 | Product images are faithful to the shipped build | Captioned "product visuals supplied by Craft Tech Labs" | Confirm, or replace with raw screen captures |
| C7 | Year "2026" on the case study | `work.ts` | Confirm |

## D. Company

| # | Item | Treatment | Action |
|---|---|---|---|
| D1 | City: Karachi, Pakistan | From the live contact page | Confirm. A street address is intentionally omitted. |
| D2 | `info@crafttech-labs.com` | From the live site | **Verify deliverability** and set SPF/DKIM/DMARC |
| D3 | Phone number | None published (the live one was a placeholder) | Supply if you want one shown |
| D4 | Instagram / LinkedIn URLs | From the live footer | Confirm both are active |
| D5 | Facebook | Omitted (no URL existed) | Supply if one exists |
| D6 | Hero annotation "24.86°N 67.00°E" (Karachi) | Decorative | Keep or remove |
| D7 | Positioning lines on the About page ("set up for businesses that need…") | Phrased as capability, not history | Review tone |
| D8 | "We work remotely; meetings by video call" / international clients | Contact page and FAQ | Confirm |
| D9 | Team | Not published | Supply real names, roles and photos if wanted |

## E. Editorial

| # | Item | Action |
|---|---|---|
| E1 | Three Insights articles (newly written, educational, Organization byline) | Read and approve. Add a named author if you want one. |
| E2 | Privacy policy and terms (drafts that match the site's actual behaviour) | **Legal review required.** Governing law is still to be confirmed. |
| E3 | General FAQ answers | Review |

## F. Rejected and not published

See `docs/brand-and-content-audit.md` §3: Lorem ipsum, zero counters, template team, placeholder phone, the default WordPress comment, and two POS images (one shows public figures' names as demo data; one has garbled text).
