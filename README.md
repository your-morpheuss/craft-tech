# Craft Tech Labs — Website

Next.js 16 website for **Craft Tech Labs**, a design and technology studio in Karachi, and for its first product, **Retail POS**. The visual direction is Swiss editorial × restrained Y2K × bento grid.

## Quick start

```bash
npm install
cp .env.example .env.local        # set NEXT_PUBLIC_PRICING_MODE=draft-preview to review draft prices
npm run dev                       # http://localhost:3000
```

Enquiry forms submit to **Web3Forms** directly from the browser. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`; until you do, forms show an honest “configuration required” notice and send nothing. The assistant runs in site-search mode until `ANTHROPIC_API_KEY` is set.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run typecheck` | Strict TypeScript |
| `npm run lint` | ESLint, including React Compiler rules |
| `npm test` | Vitest unit tests (pricing engine) |
| `npm run test:e2e` | Playwright journeys, responsive, a11y (build first; uses local Chrome) |
| `npm run check` | typecheck + lint + test + build |

## Editing content

Everything lives in typed files. TypeScript checks every edit at build time.

| What | File |
|---|---|
| Company info, email, social | `src/content/site.ts` |
| Services (copy, deliverables, FAQs, SEO) | `src/content/services.ts` |
| Products (Retail POS features, images, FAQ) | `src/content/products.ts` |
| Case studies | `src/content/work.ts` |
| Articles | `src/content/insights.ts` |
| Process, principles, general FAQ | `src/content/company.ts` |
| **Prices and add-ons** | `src/features/pricing/catalog.ts` |
| Countries, currencies, tax notes, reference rates | `src/features/pricing/regions.ts` |
| Estimator questions → packages | `src/features/estimator/config.ts` |

**To publish a price:** check the figure, then change `approval: "draft"` to `"approved"`. In production (`approved-only`), only approved prices appear. Everything else shows "Quote on request".

**To add a product or case study:** add an object to the array. The route, navigation, sitemap and assistant knowledge update automatically.

The assistant answers only from these files. Update the content and the assistant updates with it.

## Documentation

- [Brand & content audit](docs/brand-and-content-audit.md)
- [Content verification report](docs/content-verification-report.md): what the owner must confirm
- [Architecture & decisions](docs/architecture.md)
- [WordPress migration map](docs/wordpress-migration-map.md)
- [Deployment guide](docs/deployment.md)
- [Testing report](docs/testing-report.md)
- [Implementation status](docs/implementation-status.md)

## Assets

The brand kit is in `public/assets/` (owner-supplied). Retail POS visuals are in `public/images/retail-pos/`. Conceptual POS illustrations from the kit are **not** used as product screenshots.
