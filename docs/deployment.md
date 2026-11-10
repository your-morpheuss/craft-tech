# Deployment Guide

The app is portable: any host that runs Node 20.9+ with `next start` works. Vercel is the lowest-effort option and supplies the country header used for currency suggestions. Cloudflare (proxied) supplies `cf-ipcountry` too.

## 1. Environment

Copy `.env.example` and set the variables per environment:

| Variable | Staging | Production |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://staging.crafttech-labs.com` | `https://crafttech-labs.com` |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `false` | `true` |
| `NEXT_PUBLIC_PRICING_MODE` | `draft-preview` (owner review) | `approved-only` |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | key for a test inbox | key for the real inbox |
| `NEXT_PUBLIC_WEB3FORMS_HCAPTCHA` | `true` once hCaptcha is enabled in the Web3Forms dashboard | same |
| `ANTHROPIC_API_KEY` | optional | optional — without it the assistant runs in search mode |
| `EXCHANGE_RATES_URL` | optional | optional |

`NEXT_PUBLIC_*` values are inlined at build time, so **rebuild** after changing them.

**The Web3Forms key must be configured in production.** Otherwise forms show an honest "online enquiries are temporarily unavailable — please email us" notice and send nothing.

## 2. Enquiry forms (Web3Forms)

1. Create an access key at https://web3forms.com for the inbox that should receive enquiries (e.g. `info@crafttech-labs.com`). The key is public by design.
2. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` on staging and production, then **rebuild**: the key is inlined at build time.
3. In the Web3Forms dashboard, enable **hCaptcha** (free, shared sitekey). Then set `NEXT_PUBLIC_WEB3FORMS_HCAPTCHA=true`. The `botcheck` honeypot is always on.
4. Web3Forms blocks free sub-domains by default. Test on your custom staging domain, not a `*.vercel.app` preview, or upgrade the plan.
5. Submit each form once on staging and confirm every email arrives with reply-to set to the visitor. The five forms are: contact, pricing enquiry, project brief, estimate and Retail POS demo.
6. Keep submissions browser → Web3Forms. Do not proxy them through a server route: Web3Forms rejects server-side calls on the free plan.

## 3. Build & CI

```bash
npm ci
npm run check          # typecheck + lint + unit tests + build
npm run test:e2e       # Playwright against the production build (PW_CHANNEL=chromium in CI)
```

Suggested GitHub Actions job:

1. `npm ci`
2. `npx playwright install --with-deps chromium`
3. `npm run check`
4. `PW_CHANNEL=chromium npm run test:e2e`
5. Upload `playwright-report/` when the run fails.

## 4. Staging first

1. Deploy to a preview/staging URL with indexing disabled.
2. Owner review: content verification items (`docs/content-verification-report.md`) and draft prices. Approve prices by setting `approval: "approved"` in `src/features/pricing/catalog.ts`.
3. Legal review of `/privacy-policy` and `/terms-and-conditions`. Then remove the "Draft for review" note in `src/components/sections/LegalPage.tsx`.
4. Run the redirect checks in `docs/wordpress-migration-map.md`.

## 5. Domain cut-over (do not change DNS before approval)

1. Keep WordPress running at its current host until sign-off.
2. Lower the DNS TTL to 300 s 24–48 h before cut-over.
3. Add `crafttech-labs.com` and `www` to the new host and issue TLS certificates. HSTS is sent in production.
4. Switch the A/AAAA (or CNAME) records. Redirect `www` → apex (or the reverse) at the host.
5. Verify: home, a service page, a legacy URL redirect, `robots.txt`, `sitemap.xml`, and a test enquiry.
6. Submit the sitemap in Search Console.

## 6. Rollback

- **App regression:** redeploy the previous build (instant on Vercel/most hosts).
- **Domain-level rollback:** point DNS back to the WordPress host (low TTL makes this fast). Keep WordPress for 30 days.
- The service worker uses a versioned cache (`VERSION` in `public/sw.js`). Bump it if a bad asset needs flushing from clients.

## 7. Monitoring

- **Errors:** add Sentry (or your host's logging). Server logs are deliberately free of form and chat content.
- **Performance:** Vercel Speed Insights or CrUX for field Core Web Vitals.
- **Uptime:** ping `/` and `/api/rates` every 5 min.
- **Leads:** route the webhook to a sheet or CRM for an audit trail independent of email.

## 8. Scaling notes

- The rate limiter and duplicate-submission cache are in-memory per instance. On multi-instance or serverless hosting, back them with Upstash Redis (`src/server/rate-limit.ts`).
- **Lead storage:** the Web3Forms dashboard keeps a submissions log. For your own CRM, use the Web3Forms webhook (Pro) or add a database later.
- **Analytics:** none is installed. If added, load it only after consent, and fire conversion events only on `ok: true` responses (the hooks are in `useLeadSubmit`).
