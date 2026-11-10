# Brand & Content Audit — Craft Tech Labs

Audit date: 2026-11-10
Sources inspected:

- Live WordPress site `https://crafttech-labs.com/` (all URLs from `/sitemap.xml` → `wp-sitemap-*`), fetched as rendered text.
- `robots.txt` on the live site.
- Owner-supplied `Craft_Tech_Labs_Premium_Assets_Kit.zip` (logos, bespoke SVG art, proposed palette).
- Owner-supplied `pos.zip` (16 Retail POS marketing images).
- `https://webminds-studio.com/pricing`, studied **only** for pricing UX patterns.

Limitations: the text-based audit could not read raw `<title>`/meta tags, CSS or fonts from the live site. Colours were taken from the supplied logo artwork and the asset kit's proposed palette. Privacy and terms pages were not found in the sitemap or navigation.

---

## 1. Verified

These come from the official website, owner-supplied assets, or the product's own interface.

| Item | Value | Source |
|---|---|---|
| Company name | **Craft Tech Labs** (plural) | Logo artwork, domain, footer tagline |
| Tagline | "Crafting Solutions. Powering Futures." | Logo artwork (horizontal + stacked) |
| Logo | CTL hex monogram + wide geometric wordmark, "TECH" in blue gradient | Asset kit `brand/` |
| Email | `info@crafttech-labs.com` | Live `/contact-us/`. **Deliverability still to be confirmed.** |
| City | Karachi (no street address published) | Live `/contact-us/` |
| Instagram | https://www.instagram.com/crafttech_labs/ | Live footer |
| LinkedIn | https://www.linkedin.com/company/craft-tech-labs/ | Live footer (tracking params removed) |
| Services offered | Website development, mobile app development (iOS/Android mentioned), social media marketing, SEO, brand identity / logo design, graphic design | Live `/services/` and homepage |
| Process (4 steps on live site) | Discovery → Research & planning → Creative execution → Launch & optimisation | Live homepage. The new site expands this to six stages using the same substance. |
| Retail POS | "Complete Windows POS Application" | Product marketing images |
| Retail POS capabilities shown in the product UI | Store setup (name, address, contact, currency code/symbol, owner account); isolated demo database; dashboard (net revenue, transactions, average sale, product count, low/out of stock); POS screen with search by name/SKU/brand, **Scan** button, category filters, cart, per-line discounts, walk-in customer, **Hold/Resume** sale; checkout with payment method, amount received and change; confirmation before stock deduction; printable/viewable receipt with invoice number and custom footer; products with SKU, barcode, category, sort, active status; inventory with stock status filters and **stock movement history** (initial stock, sale, return); sales list with receipts, **returns** and partial-return status; customers (name, optional phone/email/notes); reports for Today/Week/Month/custom dates (payment breakdown, top products, daily gross sales, inventory cost value); users: view users, **add cashier**, **audit history**; CSV product import, export products, export sales; **local backup and restore**; welcome screen copy "Your business works offline." | `pos.zip` images |

## 2. Requires confirmation (owner sign-off needed before treating as fact)

| Item | Why | Where it's used now |
|---|---|---|
| All prices | No approved price list exists. Draft figures are in `src/features/pricing/catalog.ts` with `approval: "draft"`. | Shown **only** when `NEXT_PUBLIC_PRICING_MODE=draft-preview`, under a visible "Draft pricing" banner. Production default (`approved-only`) shows "Quote on request". |
| Retail POS offline operation | The product's welcome screen says "Your business works offline". There is no technical documentation. | Described as "designed to run on the shop's own Windows PC, with data stored locally" and quotes the product's own claim. Flagged for confirmation. |
| Retail POS barcode scanning | A "Scan" button and barcode fields are visible. Which scanner hardware is supported is unknown. | Described as "scan or search"; no hardware claims. |
| Retail POS system requirements, licensing, pricing, multi-location | Not shown anywhere. | Not published. Demo-request form asks instead. |
| Whether the POS images are pixel-exact captures | Several composites contain re-drawn or garbled small text, which suggests they were rendered for marketing. | Captioned as "product visuals supplied by Craft Tech Labs". |
| Timelines ("standard website 2–4 weeks", "SEO results 3–6 months") | These appear on the live FAQ, but they are commitments. | Phrased as "typical", with a scope caveat, in FAQs. |
| Post-launch maintenance and support | The live FAQ says "Yes". Terms are not defined. | Mentioned as available; terms are agreed in the proposal. |
| Paid social ad management | The live copy mentions "strategic ad campaigns". | Offered as an add-on. Ad spend is always excluded. |
| Mobile frameworks (Flutter / React Native / native) | Not stated anywhere. | Copy says "cross-platform or native, chosen per project". No framework promise. |
| International clients | Not stated. | FAQ says remote collaboration is possible. To be confirmed. |
| Karachi coordinates in the hero annotation | Decorative, city-level only. | Keep or remove at the owner's preference. |
| Legal pages (privacy, terms) | Drafted to match what the new site actually does. | Marked "Draft — pending legal review" in the page body. |
| Insights articles (3) | Newly written, educational, with no company claims. | Published with an Organization byline. Owner to review. |

## 3. Rejected (not migrated)

| Item | Reason |
|---|---|
| "Lorem ipsum…" blocks (homepage ×2, services) | Placeholder text |
| All counters (0 Portfolio, 0 Our Team, +0 Company, 0K+ Happy Clients, 0K+ Projects, 0K+ Ratings, 0+ Years) | Zero or unverified metrics. No metrics are published on the new site. |
| Team: Aria Nora, Isla Eliana, Ivy Grace, Maya Zoey, "Team Digityze", "A small river named Duden…" bios, `info@example.com`, `+1 (859) 254-6589`, `facebook.com` links, stock portraits | Template artefacts. Not real people. |
| Phone `+92 XXX 1235678` | Placeholder. No phone is published until one is supplied. |
| Facebook link | No URL exists on the live site. |
| "We empower businesses with cutting-edge digital solutions", "dominate", "premier digital agency" | Generic or overstated claims. Rewritten. |
| "A WordPress Commenter" sample comment, `/hello-world/` slug | WordPress default content |
| `/elementor-hf/header/`, `/elementor-hf/footer/` | Builder template pages exposed publicly |
| Mismatched card copy (App Development card carried the Brand Identity text) | Copy error |
| "Paid Promote" footer column (all links → `/services/`), "404" footer link, "Help Center" with no URL | Dead or meaningless navigation |
| Newsletter signup | There is no evidence a mailing list exists. Not rebuilt; can be added once a provider exists. |
| POS image "Sales and customers" (`…-7.png`) | Demo customer records use the names of real public figures. Not suitable for publication. |
| POS image "Your store, one workspace" (`…-5.png`) | Contains garbled text in the settings panel |

## 4. Naming consistency

The live site mixes "Craft Tech Lab" (header, About, FAQ, footer sign-off) and "Craft Tech Labs" (logo, domain). **Decision: "Craft Tech Labs" everywhere.** `src/content/site.ts` is the single source of the name.

## 5. Brand system extracted

- **Palette:** taken from the logo gradient (deep navy → electric blue → cyan) and the asset kit's proposed values. Tokens are in `src/app/globals.css`:
  - ink `#07101E`, ink-2 `#0B1830`, blue `#1666E8`, blue-bright `#257AFF`, cyan `#1DD7EB`, paper `#F4F6FA`.
  - Light editorial surfaces for reading; ink "cinematic" sections for contrast. Cyan is used only on dark backgrounds, because it fails contrast on light ones.
- **Typography:** the logo wordmark is a wide geometric sans, which suits small mono and wide-tracked labels. For legibility the site uses **Geist** (display and body, SIL OFL) and **Geist Mono** (labels and indices), served through `next/font`.
- **Voice:** clear, direct and specific. The site describes what is delivered and how, rather than "solutions".

## 6. Pricing reference — patterns adopted (Webminds Studio)

Adopted as patterns, with no copy or prices copied:

- Services filter
- Package cards showing "from" price, typical scope and an inclusions list
- One-time vs monthly labels
- A comparison table
- A step estimator (services → scope → region → summary)
- A disclaimer near every total
- "What shapes a quote"

Deliberately **not** adopted:

- Countdown "limited-time offer"
- "Most chosen" popularity badges (no data to support them)
- Sound toggle
