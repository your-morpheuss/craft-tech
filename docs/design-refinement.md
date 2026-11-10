# Phase 2 — Creative Refinement Notes

## 1. Audit of the Phase 1 homepage: why it felt ordinary

| Issue | Where |
|---|---|
| **The hero was safe.** A big headline on a light grid, plus the metallic logo in a framed square. There was no idea specific to Craft Tech Labs and nothing to interact with. | Hero |
| **Every section had the same skeleton:** a label on the left, a two-line heading on the right, an intro paragraph, then cards. With 8 repeats, the page had no rhythm. | Whole page |
| **One motion personality throughout:** fade-up for nearly everything, which made the page feel generated. | Motion |
| **The hero ended abruptly** at a hard edge into the next section. | Hero → studio |
| **The product was shown as a single flat screenshot** in a bordered box, so the product spotlight lacked depth. | Retail POS |
| **"Selected work" was one image beside two cards**, which read like a template. | Work |
| **Pricing appeared as six identical cards**, too similar to the bento sections. | Pricing preview |
| **The light header bar sat across dark sections**, a visual mismatch. | Header |
| **The light/dark sequence was flat:** most sections were light, so the dark sections didn't land as contrast. | Rhythm |

## 2. Hero concepts considered

- **A — Architectural editorial.** A strong grid and typography, but on its own it lacks a brand signature.
- **B — Creative technology canvas.** Layered UI panels risk clutter and the generic "SaaS dashboard hero" look.
- **C — Interactive brand system.** A memorable signature, but on its own it can tip into gimmick.

**Chosen: A + C.** The headline is architectural, oversized and asymmetric (A). The focal point is a custom **CT prism**: the three shards of the official monogram (C-arc, T-bar, L-foot) rebuilt as translucent SVG planes inside a technical hexagon frame (C). From B we kept only the small interface fragments that orbit the prism, which tie it to the actual services.

**Headline: "Crafted to be seen. Engineered to perform."** It builds on the brand name (*Craft* / *Tech*) and states both halves of the business: visible design and working engineering.

## 3. Signature interaction — the discipline prism

Six disciplines (Build, Design, Develop, Market, Optimize, Create) form a segmented control. Each one re-arranges the three shards into its own composition, highlights the related interface fragment, and shows a plain-language line and a link to the matching service:

| Discipline | Composition | Links to |
|---|---|---|
| Build | Assembled logo | Website Development |
| Design | Exploded view | Brand Identity |
| Develop | Layered stack | Mobile Application Development |
| Market | Rotated broadcast | Social Media Management & Marketing |
| Optimize | Snapped to grid | SEO Services |
| Create | Composed | Graphic Design |

Behaviour details:

- A gentle auto-cycle runs until the visitor interacts, and pauses off-screen or when the tab is hidden.
- On mobile it is a 3×2 tap grid; there is no hover dependency.
- With reduced motion, the arrangement changes instantly, without tweening.
- The control is a `radiogroup` and can be operated by keyboard.

The prism also appears, decoratively, in the capabilities bento and the closing CTA. That turns it into a recurring brand motif rather than a one-off effect.

## 4. Page rhythm (new)

| # | Section | Surface | Motion personality |
|---|---|---|---|
| 1 | Hero | **Dark**, immersive, sticky | CSS line reveals, GSAP prism timeline, pointer depth |
| 2 | Studio manifesto | **Light** card sliding over the hero (rounded top, shadow) | Words brighten on scroll (scrubbed) |
| 3 | Services index | White | Outlined numerals; the viewer wipes (clip-path) between artworks |
| 4 | Retail POS | **Dark** | Three-layer window composition with parallax at different depths |
| 5 | Selected work | Light | Asymmetric 8/4 editorial split, image mask reveal |
| 6 | Capabilities bento | White | Six panels of different sizes, including a dark prism panel and a solid-blue ownership panel |
| 7 | Process | **Dark** | Scrubbed progress rail |
| 8 | Pricing | Light | Editorial price index, not cards |
| 9 | Insights, FAQ | Alternating | Stagger and accordion |
| 10 | Closing CTA | **Dark** with a large prism | Masked line reveal |

## 5. Other refinements

- **Header:** switches to a dark tone over the homepage hero, using white monochrome versions of the official logo (via CSS filter) and the CTA. It returns to light after the hero.
- **Chat launcher:** stays hidden over the homepage hero, so it doesn't collide with the discipline controls.
- **Inner-page heroes:** a technical meta rail (`CTL / 02 — Section`) and stronger display type, to match the homepage.
- **Retail POS page:**
  - The cinematic dark hero now uses the layered composition.
  - Alternating white editorial feature stories each pair with a real screen: checkout, products, inventory, and reports/settings/backups.
  - A controlled screenshot carousel with keyboard navigation and no autoplay.
- **Pricing:** rebuilt on the WebMinds reference (see `pricing-reference.md`).
  - Website packages have a Websites / Online stores toggle.
  - Comparison tables appear on md+ only; mobile shows cards.
  - Restrained card hierarchy with no popularity badges.
  - A pricing enquiry form.
- **Estimator:** service → package → add-ons and quantities → region → review → Web3Forms enquiry. The structured estimate is attached to the submission.
- **Forms:** all five enquiry types post directly to Web3Forms with shared validation, a honeypot, optional hCaptcha, and duplicate-submit protection. Success is shown only when Web3Forms returns `success: true`.

## 6. Performance guard-rails kept

- The prism is pure SVG (no Three.js; nothing here needed 3D) and animates only transforms and opacity.
- The orbit is a CSS animation, paused off-screen.
- The hero headline is revealed by CSS, so LCP never waits for JavaScript.
- Product imagery uses `next/image` with responsive `sizes` and is lazy-loaded below the fold.
