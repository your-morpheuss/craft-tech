import type { AddOn, Package, PriceSource, ServiceId } from "./types";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PRICING CATALOGUE
 *  Reference dataset: published USD prices from webminds-studio.com/pricing,
 *  captured 2026-11-10 at the owner's request (see docs/pricing-reference.md).
 *  Numbers are copied unchanged; package descriptions are rewritten for
 *  Craft Tech Labs while keeping the reference scope (pages, screens,
 *  channels, keywords…) so prices and scope stay comparable.
 *
 *  Every reference price is `approval: "pending"` — shown only with
 *  NEXT_PUBLIC_PRICING_MODE=draft-preview — until Craft Tech Labs approves it.
 *  Graphic Design has no comparable published reference → custom quote.
 *  No regional (non-USD) prices are set: other currencies are converted.
 * ─────────────────────────────────────────────────────────────────────────
 */
const REF: PriceSource = { name: "WebMinds Studio published pricing", url: "https://webminds-studio.com/pricing", capturedAt: "2026-11-10" };
const EFFECTIVE = "2026-11-10";

type PkgIn = Omit<Package, "approval" | "effectiveDate" | "active" | "source" | "priceType"> & Partial<Pick<Package, "priceType">>;
const ref = (p: PkgIn): Package => ({ priceType: "from", approval: "pending", source: REF, effectiveDate: EFFECTIVE, active: true, ...p });
const quote = (p: Omit<PkgIn, "price">): Package => ({ priceType: "from", approval: "approved", effectiveDate: EFFECTIVE, active: true, price: null, ...p });
const addon = (a: Omit<AddOn, "approval" | "active" | "source">): AddOn => ({ approval: "pending", source: REF, active: true, ...a });

export const PACKAGES: Package[] = [
  // ── Website Development — company websites ─────────────────────────────
  ref({
    id: "web-starter", service: "website-development", group: "Websites", sort: 1, billing: "one-time",
    name: "Starter", price: { USD: 499 }, timeline: "1–2 weeks typical",
    description: "A focused, fast site for a new business, product or campaign.",
    includes: ["Up to 5 pages or one long landing page", "Responsive design and build", "Contact form and WhatsApp link", "Basic on-page SEO", "Launch support"],
    excludes: ["Domain and hosting", "CMS (add-on)", "Copywriting"],
  }),
  ref({
    id: "web-professional", service: "website-development", group: "Websites", sort: 2, billing: "one-time",
    name: "Professional", price: { USD: 1499 }, timeline: "2–4 weeks typical",
    description: "A complete company website your team can keep up to date.",
    includes: ["Up to 10 pages", "Custom design system", "CMS for pages and blog", "Scroll animations", "Technical SEO and analytics", "30 days of post-launch fixes"],
    excludes: ["Domain and hosting", "Paid plugins or licences"],
  }),
  ref({
    id: "web-premium", service: "website-development", group: "Websites", sort: 3, billing: "one-time",
    name: "Premium", price: { USD: 3999 }, timeline: "4–8 weeks typical",
    description: "An art-directed site with a motion system, built to be remembered.",
    includes: ["Up to 20 pages", "Creative direction and motion system", "Advanced GSAP / 3D moments", "CMS and integrations", "Performance budget and QA", "60 days of post-launch fixes"],
    excludes: ["Domain and hosting", "Third-party subscriptions"],
  }),
  quote({
    id: "web-enterprise", service: "website-development", group: "Websites", sort: 4, billing: "one-time",
    name: "Enterprise", timeline: "Scoped together",
    description: "Multi-site, multi-language or heavily integrated web platforms.",
    includes: ["Multiple sites or brands", "Custom integrations", "Security review", "Dedicated project lead", "SLA-based support options"],
    excludes: ["Infrastructure costs"],
  }),
  // ── Website Development — online stores ───────────────────────────────
  ref({
    id: "store-starter", service: "website-development", group: "Online stores", sort: 5, billing: "one-time",
    name: "Store Starter", price: { USD: 799 }, timeline: "1–2 weeks typical",
    description: "A Shopify store set up properly on a premium theme.",
    includes: ["Store setup and theme", "Up to 50 products", "Payments and shipping", "Basic SEO"],
    excludes: ["Platform subscription", "Theme licence", "Payment fees"],
  }),
  ref({
    id: "store-growth", service: "website-development", group: "Online stores", sort: 6, billing: "one-time",
    name: "Store Growth", price: { USD: 1999 }, timeline: "3–5 weeks typical",
    description: "A custom-designed Shopify theme built around your brand.",
    includes: ["Custom theme design", "Up to 200 products", "Reviews and upsells", "Email marketing setup", "Analytics"],
    excludes: ["Platform subscription", "App subscriptions", "Payment fees"],
  }),
  ref({
    id: "store-professional", service: "website-development", group: "Online stores", sort: 7, billing: "one-time",
    name: "Store Professional", price: { USD: 4499 }, timeline: "6–10 weeks typical",
    description: "Headless or custom commerce with advanced features.",
    includes: ["Headless storefront (Next.js)", "Subscriptions or bundles", "ERP or inventory sync", "Performance tuning"],
    excludes: ["Platform and infrastructure costs"],
  }),

  // ── Mobile Application Development ────────────────────────────────────
  ref({
    id: "app-mvp", service: "mobile-app-development", sort: 1, billing: "one-time",
    name: "MVP", price: { USD: 2999 }, timeline: "4–6 weeks typical",
    description: "A focused first version to put in front of real users.",
    includes: ["iOS and Android (cross-platform)", "Up to 8 core screens", "Authentication", "API integration", "Store-ready builds"],
    excludes: ["Apple / Google developer accounts", "Server costs"],
  }),
  ref({
    id: "app-business", service: "mobile-app-development", sort: 2, billing: "one-time",
    name: "Business", price: { USD: 6999 }, timeline: "6–10 weeks typical",
    description: "A complete app with backend, notifications and analytics.",
    includes: ["Up to 20 screens", "Backend and admin panel", "Push notifications", "Analytics", "Store submission"],
    excludes: ["Developer accounts", "Infrastructure costs"],
  }),
  ref({
    id: "app-advanced", service: "mobile-app-development", sort: 3, billing: "one-time",
    name: "Advanced", price: { USD: 13999 }, timeline: "3–5 months typical",
    description: "Complex apps with payments, offline mode and real-time features.",
    includes: ["Payments and subscriptions", "Offline support", "Real-time features", "Advanced animations", "Automated testing"],
    excludes: ["Developer accounts", "Infrastructure and third-party fees"],
  }),
  quote({
    id: "app-enterprise", service: "mobile-app-development", sort: 4, billing: "one-time",
    name: "Enterprise", timeline: "Scoped together",
    description: "Large apps, multiple user types and enterprise integrations.",
    includes: ["Multiple apps or roles", "Enterprise SSO", "Security review", "Dedicated team", "Long-term roadmap"],
    excludes: ["Infrastructure costs"],
  }),

  // ── Social Media Management & Marketing ───────────────────────────────
  ref({
    id: "smm-starter", service: "social-media-marketing", sort: 1, billing: "monthly",
    name: "Starter", price: { USD: 249 }, timeline: "Monthly",
    description: "A consistent presence on two channels.",
    includes: ["12 designed posts", "2 channels", "Content calendar", "Monthly report"],
    excludes: ["Advertising spend", "Video production"],
  }),
  ref({
    id: "smm-growth", service: "social-media-marketing", sort: 2, billing: "monthly",
    name: "Growth", price: { USD: 499 }, timeline: "Monthly",
    description: "More content, stories and community engagement.",
    includes: ["20 posts and stories", "3 channels", "Community replies", "Monthly strategy"],
    excludes: ["Advertising spend"],
  }),
  ref({
    id: "smm-professional", service: "social-media-marketing", sort: 3, billing: "monthly",
    name: "Professional", price: { USD: 999 }, timeline: "Monthly",
    description: "Full social management with short-form video and campaigns.",
    includes: ["30+ posts and reels", "4 channels", "Short-form video", "Campaign planning"],
    excludes: ["Advertising spend", "Influencer fees"],
  }),
  quote({
    id: "smm-enterprise", service: "social-media-marketing", sort: 4, billing: "monthly",
    name: "Enterprise", timeline: "Ongoing",
    description: "Multi-brand and multi-market social programmes.",
    includes: ["Multi-brand", "Dedicated team", "Influencer coordination", "Custom reporting"],
    excludes: ["Advertising spend"],
  }),

  // ── SEO Services ──────────────────────────────────────────────────────
  ref({
    id: "seo-starter", service: "seo", sort: 1, billing: "monthly",
    name: "Starter", price: { USD: 299 }, timeline: "Monthly · 3-month minimum suggested",
    description: "Foundations fixed and tracked for a small site.",
    includes: ["Technical audit and fixes", "Up to 10 keywords tracked", "On-page optimisation", "Monthly report"],
    excludes: ["Content writing (add-on)", "Paid links"],
  }),
  ref({
    id: "seo-growth", service: "seo", sort: 2, billing: "monthly",
    name: "Growth", price: { USD: 599 }, timeline: "Monthly · 6-month plan suggested",
    description: "Content and authority work to grow traffic steadily.",
    includes: ["Up to 30 keywords", "Content briefs and optimisation", "Local SEO", "Link outreach", "Monthly strategy call"],
    excludes: ["Paid links"],
  }),
  ref({
    id: "seo-professional", service: "seo", sort: 3, billing: "monthly",
    name: "Professional", price: { USD: 1199 }, timeline: "Monthly · ongoing",
    description: "Competitive SEO for online stores and larger sites.",
    includes: ["Up to 80 keywords", "E-commerce SEO", "Content production", "Conversion optimisation", "Dashboard reporting"],
    excludes: ["Paid links"],
  }),
  quote({
    id: "seo-enterprise", service: "seo", sort: 4, billing: "monthly",
    name: "Enterprise", timeline: "Ongoing",
    description: "Multi-site, international and enterprise SEO programmes.",
    includes: ["International SEO", "Large-site technical SEO", "Dedicated strategist", "Custom reporting"],
    excludes: [],
  }),

  // ── Brand Identity ────────────────────────────────────────────────────
  ref({
    id: "brand-starter", service: "brand-identity", sort: 1, billing: "one-time", priceType: "fixed",
    name: "Starter", price: { USD: 50 }, timeline: "2–4 days typical",
    description: "A clean logo for a new business or side project.",
    includes: ["2 logo concepts", "2 revision rounds", "PNG and JPG files", "Colour and mono versions"],
    excludes: ["Vector source files", "Trademark search"],
  }),
  ref({
    id: "brand-professional", service: "brand-identity", sort: 2, billing: "one-time", priceType: "fixed",
    name: "Professional", price: { USD: 199 }, timeline: "5–7 days typical",
    description: "A professional logo suite ready for every channel.",
    includes: ["4 logo concepts", "Unlimited minor revisions", "Vector source files", "Favicon and social avatar", "Mini style sheet"],
    excludes: ["Full guidelines", "Trademark search"],
  }),
  ref({
    id: "brand-premium", service: "brand-identity", sort: 3, billing: "one-time",
    name: "Premium Identity", price: { USD: 499 }, timeline: "2–3 weeks typical",
    description: "A complete identity system with guidelines.",
    includes: ["Logo suite", "Colour and type system", "Brand guidelines", "Stationery set", "Social media kit"],
    excludes: ["Printing", "Paid font licences", "Trademark search"],
  }),
  quote({
    id: "brand-enterprise", service: "brand-identity", sort: 4, billing: "one-time",
    name: "Enterprise", timeline: "Scoped together",
    description: "Rebrands, brand architecture and multi-brand systems.",
    includes: ["Brand strategy workshop", "Brand architecture", "Full guidelines", "Rollout support"],
    excludes: ["Printing and production"],
  }),

  // ── Graphic Design — no comparable published reference ────────────────
  quote({
    id: "gd-project", service: "graphic-design", sort: 1, billing: "one-time",
    name: "Design Project", timeline: "Scoped per brief",
    description: "Campaign sets, brochures, presentations or print collateral.",
    includes: ["Brief and direction", "Designs for each placement", "Agreed revision rounds", "Print-ready and web exports"],
    excludes: ["Stock licences", "Printing"],
  }),
  quote({
    id: "gd-monthly", service: "graphic-design", sort: 2, billing: "monthly",
    name: "Monthly Design Support", timeline: "Monthly",
    description: "An ongoing design allowance for teams with regular requests.",
    includes: ["Agreed monthly asset allowance", "Priority queue", "Editable templates", "Monthly planning call"],
    excludes: ["Stock licences", "Printing", "Video production"],
  }),
];

export const ADDONS: AddOn[] = [
  // Website — company websites
  addon({ id: "web-extra-page", service: "website-development", group: "Websites", name: "Extra pages", billing: "one-time", price: { USD: 60 }, unit: { label: "page", max: 40 } }),
  addon({ id: "web-cms", service: "website-development", group: "Websites", name: "CMS integration", description: "WordPress, Webflow or headless CMS", billing: "one-time", price: { USD: 350 } }),
  addon({ id: "web-animations", service: "website-development", group: "Websites", name: "Advanced animations", description: "GSAP scroll stories and micro-interactions", billing: "one-time", price: { USD: 450 } }),
  addon({ id: "web-multilingual", service: "website-development", group: "Websites", name: "Multilingual setup", billing: "one-time", price: { USD: 400 } }),
  addon({ id: "web-seo-setup", service: "website-development", group: "Websites", name: "SEO setup", description: "Technical SEO, schema, sitemap", billing: "one-time", price: { USD: 250 } }),
  addon({ id: "web-analytics", service: "website-development", group: "Websites", name: "Analytics and tracking", billing: "one-time", price: { USD: 150 } }),
  addon({ id: "web-blog", service: "website-development", group: "Websites", name: "Blog setup", billing: "one-time", price: { USD: 200 } }),
  addon({ id: "web-maintenance", service: "website-development", group: "Websites", name: "Maintenance plan", description: "Updates, monitoring, small changes", billing: "monthly", price: { USD: 120 } }),
  // Website — online stores
  addon({ id: "store-catalogue", service: "website-development", group: "Online stores", name: "Product catalogue setup", billing: "one-time", price: { USD: 120 }, unit: { label: "50 products", max: 20 } }),
  addon({ id: "store-subscriptions", service: "website-development", group: "Online stores", name: "Subscriptions", billing: "one-time", price: { USD: 500 } }),
  addon({ id: "store-marketplace", service: "website-development", group: "Online stores", name: "Marketplace integration", billing: "one-time", price: { USD: 400 } }),
  addon({ id: "store-email", service: "website-development", group: "Online stores", name: "Email marketing flows", billing: "one-time", price: { USD: 300 } }),
  addon({ id: "store-migration", service: "website-development", group: "Online stores", name: "Store migration", billing: "one-time", price: { USD: 450 } }),
  addon({ id: "store-maintenance", service: "website-development", group: "Online stores", name: "Store maintenance", billing: "monthly", price: { USD: 200 } }),
  // Mobile
  addon({ id: "app-push", service: "mobile-app-development", name: "Push notifications", billing: "one-time", price: { USD: 400 } }),
  addon({ id: "app-payments", service: "mobile-app-development", name: "In-app payments", billing: "one-time", price: { USD: 600 } }),
  addon({ id: "app-admin", service: "mobile-app-development", name: "Admin panel", billing: "one-time", price: { USD: 900 } }),
  addon({ id: "app-offline", service: "mobile-app-development", name: "Offline mode", billing: "one-time", price: { USD: 700 } }),
  addon({ id: "app-analytics", service: "mobile-app-development", name: "Analytics", billing: "one-time", price: { USD: 200 } }),
  addon({ id: "app-store-submission", service: "mobile-app-development", name: "App store submission", billing: "one-time", price: { USD: 250 } }),
  addon({ id: "app-maintenance", service: "mobile-app-development", name: "Maintenance and updates", billing: "monthly", price: { USD: 300 } }),
  // Brand
  addon({ id: "brand-social-kit", service: "brand-identity", name: "Social media kit", billing: "one-time", price: { USD: 99 } }),
  addon({ id: "brand-stationery", service: "brand-identity", name: "Stationery set", billing: "one-time", price: { USD: 79 } }),
  addon({ id: "brand-guidelines", service: "brand-identity", name: "Brand guidelines", billing: "one-time", price: { USD: 149 } }),
  addon({ id: "brand-extra-concept", service: "brand-identity", name: "Extra logo concept", billing: "one-time", price: { USD: 39 }, unit: { label: "concept", max: 6 } }),
  addon({ id: "brand-animated-logo", service: "brand-identity", name: "Animated logo", billing: "one-time", price: { USD: 149 } }),
  // SEO
  addon({ id: "seo-content", service: "seo", name: "Content writing (4 articles)", billing: "monthly", price: { USD: 240 } }),
  addon({ id: "seo-local-listings", service: "seo", name: "Local listings management", billing: "monthly", price: { USD: 120 } }),
  addon({ id: "seo-audit", service: "seo", name: "In-depth technical audit", billing: "one-time", price: { USD: 350 } }),
  addon({ id: "seo-links", service: "seo", name: "Link building", billing: "monthly", price: { USD: 300 } }),
  // Social
  addon({ id: "smm-ads", service: "social-media-marketing", name: "Paid ads management", description: "Ad spend billed separately by the platform", billing: "monthly", price: { USD: 300 } }),
  addon({ id: "smm-video", service: "social-media-marketing", name: "Short-form video pack", billing: "monthly", price: { USD: 400 } }),
  addon({ id: "smm-strategy", service: "social-media-marketing", name: "Brand content strategy", billing: "one-time", price: { USD: 200 } }),
];

export const packagesFor = (service: ServiceId) =>
  PACKAGES.filter((p) => p.service === service && p.active).sort((a, b) => a.sort - b.sort);
export const addOnsFor = (service: ServiceId, group?: string) =>
  ADDONS.filter((a) => a.service === service && a.active && (!a.group || !group || a.group === group));
export const getPackage = (id: string) => PACKAGES.find((p) => p.id === id);
export const getAddOn = (id: string) => ADDONS.find((a) => a.id === id);
export const groupsFor = (service: ServiceId) => Array.from(new Set(packagesFor(service).map((p) => p.group).filter((g): g is string => !!g)));
