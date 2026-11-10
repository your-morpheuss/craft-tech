# Testing Report

Run date: 2026-11-10, on a local machine: Windows 11, Node 24.21, Chrome stable via Playwright `channel: "chrome"`. The E2E, accessibility and performance results below were all taken against a **production build** (`next build && next start`). The build ran with `NEXT_PUBLIC_PRICING_MODE=draft-preview` so price displays could be exercised.

## Results

| Check | Command | Result |
|---|---|---|
| Type checking | `npm run typecheck` | ✅ 0 errors (strict) |
| Lint (incl. React Compiler rules) | `npm run lint` | ✅ 0 errors, 0 warnings |
| Unit tests: pricing engine & estimator | `npm test` | ✅ 21/21 passed |
| Production build | `npm run build` | ✅ 37 static pages, 3 dynamic API routes |
| Full E2E suite: journeys + responsive + a11y (desktop + Pixel 7) | `npm run test:e2e` | ✅ 56 passed, 2 skipped by design (desktop-only / mobile-only cases). Final run after fixes #7–8 below. |
| Automated accessibility (axe, WCAG 2.0–2.2 A/AA), part of the suite above | `tests/e2e/a11y.spec.ts` | ✅ 12/12 routes, no serious or critical violations |

### Unit coverage (pricing)

The unit tests cover:

- Draft prices hidden in `approved-only` mode.
- Regional vs converted pricing, per-currency rounding, missing rates, and custom-scope quotes.
- Catalogue integrity: unique IDs, every estimator line resolves to a real item, every price has a USD reference.
- Region mapping and the INTL fallback.
- PKR totals.
- Separation of one-time and monthly totals.
- Extra-page arithmetic.
- Quote lines excluded from totals.
- Web-app → quote outcome.
- Conversion for GBP.
- Social tier upgrade.
- Answer sanitisation of unknown values.
- Schema rejection of unknown services and currencies.
- Money formatting.

### E2E coverage

- Home hero and CTAs.
- Keyboard mega menu (Enter, Escape returns focus, click outside).
- Mobile drawer (scroll lock, navigation, close on route change).
- **All header and footer links return 200.**
- Pricing tabs with deep link, country → PKR, currency → GBP "converted reference", and persistence to service pages.
- **Full estimator** flow: validation, scope, region, separate totals, Back keeps state, real submission → reference shown.
- Contact form server validation, with no fake success.
- Project brief multi-step validation and preselected service.
- Assistant opens, answers with site links, discloses its mode, and closes on Escape.
- **Legacy WordPress URLs → single 308.**
- Branded 404 with a 404 status.
- Canonical URL, JSON-LD, sitemap and robots.
- **Offline:** a visited page is served from the SW cache and an unvisited page gets `/offline`.
- **No horizontal overflow on 22 routes at 320, 375, 430, 768, 1024, 1440 and 1920 px.**
- One `h1` and a `main` landmark per page.
- Reduced motion leaves all content visible and turns off `js-motion`.
- Reveal targets are all visible after scrolling.

### API checks (manual, via curl against the dev server)

- `/api/leads`: field errors, honeypot/timing rejection ("That was quick"), valid submission written to the dev sink, duplicate `submissionId` returns the same reference, and **a client-sent `total` is ignored with the estimate recomputed server-side**.
- `/api/geo`: `null` without an edge header, `PK` with `x-vercel-ip-country: pk`.
- `/api/chat`: search-mode answers for "Does Retail POS work without internet?", "How much does SEO cost in Pakistan?" (SEO pricing ranked first after a pricing-intent boost) and "Can I speak to someone?" (company contact chunk).

## Performance (local, production build, intro skipped)

| Profile | Route | LCP | CLS | JS transferred |
|---|---|---|---|---|
| Desktop 1440 | `/` | 536 ms | 0 | 224 KB |
| Desktop 1440 | `/services/website-development` | 308 ms | 0 | 225 KB |
| Desktop 1440 | `/products/retail-pos` | 320 ms | 0 | 262 KB |
| Desktop 1440 | `/pricing` | 236 ms | 0 | 226 KB |
| Mobile, 1.6 Mbps / 150 ms RTT, 4× CPU | `/` | 2,024 ms | 0 | 224 KB |
| Mobile, throttled | `/services/website-development` | 1,900 ms | 0 | 225 KB |
| Mobile, throttled | `/products/retail-pos` | 1,484 ms | 0 | 262 KB |
| Mobile, throttled | `/pricing` | 1,764 ms | 0 | 226 KB |

These are synthetic lab numbers from a local server. Real-user Core Web Vitals depend on hosting, CDN and audience, so verify them on staging with field data (CrUX / Vercel Speed Insights).

## Issues found and fixed during QA

1. **Horizontal overflow at 320 px on `/estimate`.** The stepper's minimum width stretched an implicit grid track. Fixed with explicit `grid-cols-1` and `min-w-0`.
2. **Hydration mismatch on first load.** GSAP was writing inline styles into streamed sections before React hydrated them. Fixed by deferring the reveal scan to an idle callback inside the GSAP context.
3. **Header contrast over dark heroes.** The transparent header let the dark wordmark disappear. The header is now always solid.
4. **Mobile chat launcher covered the hero CTA.** It is now an icon-only button below `sm`.
5. **Assistant ranked a POS FAQ above SEO pricing for "SEO cost".** Added a pricing-intent boost.
6. **React Compiler lint errors** (setState in effects, refs during render). Fixed by refactoring to `useSyncExternalStore`, deriving state at render time, and making the estimator client-only. No rule was disabled.
7. **axe `aria-prohibited-attr` on the estimator loading skeleton** (`aria-label` on a plain div). Fixed by adding `role="status"`.
8. **Responsive test timeouts.** Each test loads 22 routes, which ran past 60 s under parallel workers. The per-test timeout was raised. No overflow was found at any width.

## Not tested / limitations

- Manual screen-reader pass (NVDA/VoiceOver) not yet performed. Automated axe checks and keyboard tests are supporting evidence only.
- Safari/WebKit and Firefox were not run (Chrome only locally). Add `npx playwright install webkit firefox` in CI.
- Real email delivery (Resend) and AI mode (Anthropic) were not exercised: no credentials are configured. Both code paths fail safe: email → honest 503, AI → search-mode fallback.
- PWA install prompt and update flow verified only through SW caching behaviour, not install UI.

---

## Phase 2 run — 2026-11-11

Final run, all executed against a production build (`next build && next start`, Chrome):

| Check | Result |
|---|---|
| `tsc --noEmit` (strict) | ✅ 0 errors |
| ESLint, including React Compiler rules | ✅ 0 errors, 0 warnings |
| Vitest | ✅ 26/26: pricing engine on the reference dataset, plus the Web3Forms client |
| Production build | ✅ 36 static pages |
| Playwright: journeys, responsive (7 widths × 22 routes), axe a11y (12 routes), desktop + Pixel 7 | ✅ 60 passed, 2 skipped by design |

For the E2E run, the build used a dummy key (`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=00000000-…`). Every request to `api.web3forms.com` was intercepted by `page.route`, so **no real email was sent**.

### New coverage

**Unit tests (Web3Forms client):**
- Missing key → config error, and nothing is sent.
- JSON POST carries the access key.
- `success:false` on HTTP 200 → error.
- 400, 429 (rate limit), 500 and network failure each → their own error.

**E2E:**
- Estimator, full flow: Professional website + multilingual + 2 extra pages = USD 2,019, plus SEO at USD 299/mo. The submission is captured with the structured estimate fields, and a **double-click sends exactly one request**.
- Contact form: invalid input → nothing sent.
- Contact form: `success:false` → error shown, never success.
- Demo form: business name and country are required, and the submission is checked.
- Project brief: per-step validation, then submission.
- Pricing: tabs, PKR/GBP conversion labels, Graphic Design custom quote, preference persistence.
- Hero: the discipline radiogroup is operable.

**Unit test reproducing the reference:** the six starter packages reproduce the WebMinds estimator's published total of USD 4,347 + 548/mo.

### Bugs found and fixed in Phase 2 QA

1. **The sticky hero painted over every later section** because it stayed stuck across the whole page. Fixed by scoping the sticky to a wrapper around the hero and manifesto.
2. **Package cards kept a stale group** ("Websites") when switching to another service tab, so SEO showed no packages. Fixed by validating the group against the current service.
3. **Contrast:** inactive service numerals, and a 70%-white label on the blue bento card. Both fixed.
4. **Dark header tone didn't apply at first.** The dev server served a stale stylesheet, so the `--color-*` tokens are now remapped explicitly.

### Not verified

- **Real Web3Forms delivery:** there is no access key yet.
- **hCaptcha:** it needs dashboard enablement; not tested live.
- **Safari/Firefox:** not tested.
- **Manual screen-reader pass:** not done.
- **Screenshots** were taken with headless Chrome. The in-app browser pane couldn't render because the window was hidden.
