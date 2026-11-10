import type { ServiceId } from "@/features/pricing/types";

export type FAQ = { q: string; a: string };

export type Service = {
  id: ServiceId;
  slug: string;
  index: string;
  name: string;
  shortName: string;
  /** One-line positioning used in menus and cards. */
  summary: string;
  /** Homepage/list statement. */
  statement: string;
  seo: { title: string; description: string };
  hero: { eyebrow: string; headline: [string, string]; intro: string };
  art: string;
  artAlt: string;
  /** Problems this service addresses. */
  problems: { title: string; body: string }[];
  deliverables: string[];
  capabilities: { group: string; items: string[] }[];
  process: { step: string; body: string }[];
  projectTypes: string[];
  methodology?: { title: string; body: string };
  timeline: string;
  faqs: FAQ[];
  related: ServiceId[];
};

export const services: Service[] = [
  {
    id: "website-development",
    slug: "website-development",
    index: "01",
    name: "Website Development",
    shortName: "Websites",
    summary: "Fast, considered websites and web apps.",
    statement:
      "Fast, considered websites built around what your visitors need to do — read, compare, enquire, buy.",
    seo: {
      title: "Website Development — Business, Corporate & E-commerce Websites",
      description:
        "Custom website development by Craft Tech Labs: responsive business websites, landing pages, e-commerce and web applications built for speed, SEO and easy editing.",
    },
    hero: {
      eyebrow: "Service 01 / Website Development",
      headline: ["Websites that", "earn their load time."],
      intro:
        "We design and build websites that explain your business clearly, load quickly on real phones, and are easy for your team to keep up to date — from a focused landing page to a custom web application.",
    },
    art: "/assets/services/website-development.svg",
    artAlt: "Illustration of a browser window with modular layout blocks and a performance line",
    problems: [
      { title: "Visitors leave before they understand you", body: "Unclear structure and slow pages cost enquiries. We start from the questions your visitors actually ask and design the page order around them." },
      { title: "Every small edit needs a developer", body: "We set up a content workflow your team can use for pages, posts and listings, so routine updates don't wait in a queue." },
      { title: "The site looks dated or inconsistent", body: "A design system — type, colour, spacing, components — keeps every new page consistent with the last." },
      { title: "Search engines can't read it properly", body: "Semantic markup, metadata, sitemaps and sensible URLs are part of the build, not an afterthought." },
    ],
    deliverables: [
      "Sitemap and page structure",
      "Responsive UI design for key templates",
      "Production front-end build",
      "CMS setup and editor guide (where included)",
      "Technical SEO foundations: metadata, sitemap, redirects",
      "Analytics and form integration",
      "Launch checklist and handover",
    ],
    capabilities: [
      { group: "Website types", items: ["Business and corporate websites", "Landing pages and campaign sites", "E-commerce stores", "Custom web applications and portals"] },
      { group: "Engineering", items: ["Responsive front-end development", "Headless or traditional CMS integration", "Forms, payments and third-party APIs", "Performance and Core Web Vitals work"] },
      { group: "After launch", items: ["Maintenance and security updates", "Content and feature additions", "Hosting and deployment guidance"] },
    ],
    process: [
      { step: "Scope", body: "Goals, audiences, page list and integrations agreed in writing." },
      { step: "Structure", body: "Sitemap and wireframes for the templates that matter most." },
      { step: "Design", body: "High-fidelity screens for desktop and mobile, built on a reusable system." },
      { step: "Build", body: "Development on a staging link you can review at any time." },
      { step: "Launch", body: "Redirects, analytics, final QA across devices, then go-live." },
    ],
    projectTypes: ["New company website", "Website redesign or migration", "Product or service landing page", "Online store", "Booking or enquiry portal", "Internal web tool"],
    methodology: {
      title: "Modern stack, chosen per project",
      body: "For most marketing sites we use a modern framework with a CMS your team can edit; for simpler needs a well-configured CMS is enough. We recommend the lightest setup that meets the brief, and explain the trade-offs before you commit.",
    },
    timeline:
      "A focused business website typically takes a few weeks from approved content; larger sites and web applications are scheduled in phases. You get a dated plan with the proposal.",
    faqs: [
      { q: "Will I own the website and its content?", a: "Yes. On final payment you own the design, content and code produced for your project. Third-party licences (fonts, plugins, hosting) remain under their own terms, and we list them in the handover." },
      { q: "Can you redesign my existing site without losing search traffic?", a: "Yes. We map your existing URLs to the new structure and set up permanent redirects so established pages keep their search history." },
      { q: "Do you write the content?", a: "We can. Copywriting is scoped as an add-on; otherwise we provide a content template and edit what you supply for clarity and length." },
      { q: "Can my team update the site?", a: "Where a CMS is included, yes — we configure it for your content types and provide a short editor guide." },
    ],
    related: ["seo", "brand-identity", "mobile-app-development"],
  },
  {
    id: "mobile-app-development",
    slug: "mobile-app-development",
    index: "02",
    name: "Mobile Application Development",
    shortName: "Mobile Apps",
    summary: "Android and iOS apps, designed around real use.",
    statement:
      "Mobile apps shaped around the few things your users do most — and built so those things feel effortless.",
    seo: {
      title: "Mobile App Development — Android, iOS & Cross-Platform Apps",
      description:
        "Mobile application development by Craft Tech Labs: product UI/UX, Android and iOS apps, backend and API integration, testing and store release guidance.",
    },
    hero: {
      eyebrow: "Service 02 / Mobile Application Development",
      headline: ["Apps people", "come back to."],
      intro:
        "We take an app from idea to release: defining the core workflows, designing an interface that's quick to learn, and engineering it for Android and iOS with the backend it needs.",
    },
    art: "/assets/services/mobile-app-development.svg",
    artAlt: "Illustration of two phone screens showing an onboarding view and a checklist",
    problems: [
      { title: "The idea is clear, the scope isn't", body: "We turn a feature wish-list into a first release with a small number of complete, well-tested workflows." },
      { title: "Two platforms, one budget", body: "Where it suits the product, a cross-platform codebase serves Android and iOS together; where it doesn't, we say so." },
      { title: "The app needs data from somewhere", body: "Authentication, APIs, admin dashboards and notifications are planned with the app, not bolted on later." },
    ],
    deliverables: [
      "Product scope and user flows",
      "UI/UX design and clickable prototype",
      "Android and/or iOS application builds",
      "Backend or API integration",
      "Admin dashboard (where scoped)",
      "Test builds for review on your devices",
      "Store submission guidance and release checklist",
    ],
    capabilities: [
      { group: "Product", items: ["Discovery and feature prioritisation", "User flows and wireframes", "UI design and prototyping"] },
      { group: "Engineering", items: ["Cross-platform or native development, chosen per project", "REST/GraphQL API integration", "Authentication and user accounts", "Push notifications", "Offline-friendly data handling where required"] },
      { group: "Release", items: ["Testing on real devices", "App store listing preparation", "Maintenance and OS-update support"] },
    ],
    process: [
      { step: "Define", body: "Who the app is for and the workflows a first release must do well." },
      { step: "Prototype", body: "Clickable flows you can test before code is written." },
      { step: "Build", body: "Development in short milestones with test builds on your phone." },
      { step: "Harden", body: "Device testing, edge cases, performance and error states." },
      { step: "Release", body: "Store preparation, submission support and a post-launch fix window." },
    ],
    projectTypes: ["Customer-facing app for an existing business", "Startup MVP", "Booking or ordering app", "Field or staff app", "Companion app for a web platform"],
    methodology: {
      title: "Store approval is earned, not promised",
      body: "Apple and Google review every release against their own guidelines. We build to those guidelines and help prepare your listing, but approval decisions are theirs.",
    },
    timeline:
      "A first release is usually planned in milestones over several weeks to a few months, depending on workflows and integrations. We confirm milestones after discovery.",
    faqs: [
      { q: "Do you build for both Android and iOS?", a: "Yes. We decide between a cross-platform codebase and separate native apps based on your features, budget and long-term plans." },
      { q: "Can you work with our existing backend?", a: "Yes, if it exposes a documented API. If not, we can scope the API work as part of the project." },
      { q: "Who publishes the app?", a: "The app is published under your own developer accounts so you keep ownership. We guide you through setup and submission." },
      { q: "What happens after launch?", a: "Every project includes a fix window after release. Ongoing maintenance and OS-update support can be arranged separately." },
    ],
    related: ["website-development", "brand-identity", "graphic-design"],
  },
  {
    id: "social-media-marketing",
    slug: "social-media-marketing",
    index: "03",
    name: "Social Media Management & Marketing",
    shortName: "Social Media",
    summary: "Planned content and campaigns with a consistent voice.",
    statement:
      "Planned content and campaigns that give your brand a consistent, recognisable presence — month after month.",
    seo: {
      title: "Social Media Management & Marketing Services",
      description:
        "Social media management by Craft Tech Labs: strategy, content calendars, creative production, account management, paid social campaigns and monthly reporting.",
    },
    hero: {
      eyebrow: "Service 03 / Social Media Management & Marketing",
      headline: ["Show up", "like you mean it."],
      intro:
        "We plan, design and publish social content that sounds like you, keep your accounts active and responsive, and — where you want it — run paid campaigns with clear reporting on what they did.",
    },
    art: "/assets/services/social-media-marketing.svg",
    artAlt: "Illustration of a video post card and an engagement chart",
    problems: [
      { title: "Posting is irregular", body: "A monthly content calendar, approved in advance, keeps accounts active without last-minute scrambling." },
      { title: "Every post looks different", body: "Templates and a visual direction make your feed recognisable at a glance." },
      { title: "Nobody knows what's working", body: "Monthly reports cover reach, engagement and follower trends — and what we'll change next month." },
    ],
    deliverables: [
      "Platform strategy and content pillars",
      "Monthly content calendar for approval",
      "Post and story designs, captions and hashtags",
      "Scheduling and publishing",
      "Comment and message monitoring (where included)",
      "Paid campaign setup and management (optional)",
      "Monthly performance report",
    ],
    capabilities: [
      { group: "Organic management", items: ["Instagram, Facebook, LinkedIn, TikTok and others as agreed", "Content calendars and copywriting", "Creative production: static, carousel and short video edits", "Community management"] },
      { group: "Paid social (optional)", items: ["Campaign planning and audience setup", "Ad creative and copy variations", "Budget pacing and optimisation", "Conversion tracking setup"] },
      { group: "Measurement", items: ["Monthly reporting", "Quarterly strategy review"] },
    ],
    process: [
      { step: "Audit", body: "Review of current accounts, audience and competitors." },
      { step: "Strategy", body: "Pillars, tone, formats and posting rhythm per platform." },
      { step: "Produce", body: "Monthly calendar and creatives, approved before publishing." },
      { step: "Publish & manage", body: "Scheduling, monitoring and community replies as scoped." },
      { step: "Report", body: "Monthly results and adjustments for the next cycle." },
    ],
    projectTypes: ["Ongoing monthly management", "Launch or campaign burst", "Account setup and refresh", "Paid social campaign management"],
    methodology: {
      title: "Management fee and ad spend are separate",
      body: "Our fee covers strategy, content and management. Advertising budgets are paid directly to the platforms and are never included in a management package unless stated in writing.",
    },
    timeline:
      "Management runs on a monthly cycle. Onboarding — audit, strategy and first calendar — usually takes one to two weeks before regular posting begins.",
    faqs: [
      { q: "Is ad spend included?", a: "No. Platform ad budgets are separate from our management fee and are billed by Meta, LinkedIn, TikTok or Google directly to you." },
      { q: "Do I approve content before it goes live?", a: "Yes. Each month's calendar is shared for approval before scheduling." },
      { q: "Can you guarantee follower growth?", a: "No one can honestly guarantee that. We commit to consistent, well-made content and transparent reporting, and adjust based on results." },
      { q: "Is there a minimum term?", a: "Terms are agreed in the proposal. Social media usually needs a few months of consistent activity before trends are meaningful." },
    ],
    related: ["graphic-design", "brand-identity", "seo"],
  },
  {
    id: "seo",
    slug: "seo",
    index: "04",
    name: "SEO Services",
    shortName: "SEO",
    summary: "Technical, on-page and content search work.",
    statement:
      "Search foundations, technical fixes and content strategy — so the people already looking for you can find you.",
    seo: {
      title: "SEO Services — Technical SEO, On-page & Content Optimisation",
      description:
        "SEO services by Craft Tech Labs: technical audits, on-page optimisation, keyword research, content strategy, local SEO and monthly reporting with honest expectations.",
    },
    hero: {
      eyebrow: "Service 04 / SEO Services",
      headline: ["Be found by", "people already looking."],
      intro:
        "We fix what stops search engines from understanding your site, improve the pages that should rank, and plan content around what your customers actually search for — with reporting you can follow.",
    },
    art: "/assets/services/seo-services.svg",
    artAlt: "Illustration of a search results panel and an upward trend gauge",
    problems: [
      { title: "Pages aren't indexed properly", body: "Crawl errors, duplicate pages, missing metadata and slow templates quietly hold sites back. A technical audit finds them." },
      { title: "You rank for the wrong things", body: "Keyword research maps real search intent to the right pages, so effort goes where demand is." },
      { title: "Local customers can't find you", body: "For businesses serving a city or region, local SEO and a well-kept business profile matter as much as the website." },
    ],
    deliverables: [
      "Technical SEO audit with prioritised fixes",
      "Keyword research and page mapping",
      "On-page optimisation: titles, headings, internal links, schema",
      "Content briefs or optimised content",
      "Google Search Console and analytics setup",
      "Local SEO setup (where relevant)",
      "Monthly ranking and traffic reporting",
    ],
    capabilities: [
      { group: "Technical", items: ["Crawlability and indexation", "Site speed and Core Web Vitals", "Structured data", "Redirects and migrations"] },
      { group: "On-page & content", items: ["Keyword research", "Metadata and heading structure", "Internal linking", "Content planning and optimisation"] },
      { group: "Local & reporting", items: ["Google Business Profile optimisation", "Local citations guidance", "Search Console monitoring", "Monthly reports"] },
    ],
    process: [
      { step: "Audit", body: "Technical crawl, content review and baseline metrics." },
      { step: "Prioritise", body: "A ranked list of fixes by likely impact and effort." },
      { step: "Fix & optimise", body: "Technical and on-page changes, implemented or briefed." },
      { step: "Create", body: "Content aligned to researched search intent." },
      { step: "Measure", body: "Monthly reporting and the next month's priorities." },
    ],
    projectTypes: ["One-off SEO audit", "Ongoing monthly SEO", "Website migration support", "Local SEO for a physical business", "Content strategy"],
    methodology: {
      title: "No ranking guarantees — ever",
      body: "Search engines control rankings, and their algorithms change. We commit to sound technical work, useful content and transparent reporting. Typically, meaningful movement takes several months of consistent work.",
    },
    timeline:
      "An audit is a one-time project. Ongoing SEO runs monthly; most sites need several months of consistent work before trends are reliable.",
    faqs: [
      { q: "Can you get us to the first page of Google?", a: "We can't promise specific rankings, and you should be wary of anyone who does. We can improve the factors you control and report honestly on progress." },
      { q: "How long before we see results?", a: "Technical fixes can show effects within weeks; content and authority work usually takes several months. It depends heavily on competition and your site's starting point." },
      { q: "Do you need access to our website?", a: "For implementation, yes — CMS and Search Console access. For an audit-only engagement, read access is enough." },
      { q: "Do you build backlinks?", a: "We don't buy links. We focus on content and outreach that earns legitimate references." },
    ],
    related: ["website-development", "social-media-marketing", "graphic-design"],
  },
  {
    id: "brand-identity",
    slug: "brand-identity",
    index: "05",
    name: "Brand Identity",
    shortName: "Brand Identity",
    summary: "Logos, identity systems and brand guidelines.",
    statement:
      "A coherent visual system — mark, type, colour and rules — that makes your business easier to recognise and remember.",
    seo: {
      title: "Brand Identity Design — Logo Design, Identity Systems & Guidelines",
      description:
        "Brand identity design by Craft Tech Labs: brand discovery, logo design, colour and typography systems, brand guidelines and applications across digital and print.",
    },
    hero: {
      eyebrow: "Service 05 / Brand Identity",
      headline: ["Recognisable", "before it's read."],
      intro:
        "We build identities from the inside out: understanding what your business stands for, then designing a mark and a visual system that express it consistently on every screen, sign and document.",
    },
    art: "/assets/services/brand-identity.svg",
    artAlt: "Illustration of a typographic specimen and a colour swatch grid",
    problems: [
      { title: "Your logo doesn't scale", body: "A mark that only works large, or only in colour, causes problems on favicons, stamps and embroidery. We design for every size." },
      { title: "Everyone uses the brand differently", body: "Clear guidelines — logo rules, colour codes, typography — stop the slow drift into inconsistency." },
      { title: "The brand no longer fits the business", body: "When a business grows or shifts focus, a refresh can modernise the identity while keeping the recognition you've earned." },
    ],
    deliverables: [
      "Brand discovery workshop and summary",
      "Logo concepts and refinement",
      "Final logo suite: primary, secondary, mark, mono",
      "Colour palette with digital and print values",
      "Typography system",
      "Brand guidelines document",
      "Core applications: stationery, social avatars, templates",
    ],
    capabilities: [
      { group: "Strategy", items: ["Discovery workshop", "Positioning and personality", "Competitor visual review"] },
      { group: "Identity", items: ["Logo design and refresh", "Colour and typography systems", "Iconography and graphic elements"] },
      { group: "Rollout", items: ["Brand guidelines", "Stationery and business cards", "Digital templates", "Signage and packaging direction"] },
    ],
    process: [
      { step: "Discover", body: "Workshop on audience, values, competitors and ambitions." },
      { step: "Explore", body: "Distinct concept directions presented with rationale." },
      { step: "Refine", body: "Develop the chosen direction across sizes and media." },
      { step: "Systemise", body: "Colour, type, spacing and usage rules." },
      { step: "Deliver", body: "Final files in all formats plus guidelines." },
    ],
    projectTypes: ["New business identity", "Logo refresh", "Full rebrand", "Sub-brand or product brand", "Brand guidelines for an existing logo"],
    timeline:
      "Logo-only projects are typically shorter; a full identity system with guidelines usually runs over several weeks, including review rounds.",
    faqs: [
      { q: "How many logo concepts do I get?", a: "The number of concept directions and revision rounds is stated in your package before work starts, so there are no surprises." },
      { q: "Can you refresh our current logo instead of replacing it?", a: "Yes. A refresh keeps the recognition you've built while fixing legibility, scaling and consistency issues." },
      { q: "What file formats will I receive?", a: "Vector (SVG, PDF/EPS) and raster (PNG, JPG) versions in colour, mono and reversed variants, organised for print and digital." },
      { q: "Do you register trademarks?", a: "No — trademark searches and registration should be handled by a legal professional. We can supply final artwork for the filing." },
    ],
    related: ["graphic-design", "website-development", "social-media-marketing"],
  },
  {
    id: "graphic-design",
    slug: "graphic-design",
    index: "06",
    name: "Graphic Design",
    shortName: "Graphic Design",
    summary: "Campaign, social and print design on demand.",
    statement:
      "Purposeful visual communication for campaigns, social channels, print and the everyday touchpoints of an established brand.",
    seo: {
      title: "Graphic Design Services — Social, Campaign & Print Design",
      description:
        "Graphic design by Craft Tech Labs: social media graphics, campaign creatives, brochures, presentations, stationery and print collateral that follow your brand.",
    },
    hero: {
      eyebrow: "Service 06 / Graphic Design",
      headline: ["Design that", "does a job."],
      intro:
        "Once a brand exists, it needs to be applied — week after week, across ads, posts, brochures and presentations. We produce that design work quickly and consistently, on a project or monthly basis.",
    },
    art: "/assets/services/graphic-design.svg",
    artAlt: "Illustration of a layout composition panel with a component palette",
    problems: [
      { title: "Design requests pile up", body: "A monthly design allowance gives your team a reliable place to send requests, with predictable turnaround." },
      { title: "Materials drift off-brand", body: "We work from your guidelines and build reusable templates so new material stays consistent." },
      { title: "Print goes wrong at the printer", body: "Correct bleed, colour profiles and file specs are part of every print deliverable." },
    ],
    deliverables: [
      "Social media post and story designs",
      "Campaign and digital ad creatives in required sizes",
      "Brochures, flyers and catalogues",
      "Presentations and pitch decks",
      "Business stationery",
      "Editable templates for repeat use",
      "Print-ready and web-optimised exports",
    ],
    capabilities: [
      { group: "Digital", items: ["Social graphics and carousels", "Display and social ad sets", "Email and web banners", "Presentation design"] },
      { group: "Print", items: ["Brochures and catalogues", "Flyers, posters and banners", "Stationery and menus", "Packaging graphics"] },
      { group: "Working model", items: ["One-off projects", "Monthly design retainers", "Template systems for in-house teams"] },
    ],
    process: [
      { step: "Brief", body: "What it's for, where it appears, sizes and deadline." },
      { step: "Design", body: "First version built on your brand system." },
      { step: "Revise", body: "Feedback rounds as agreed in scope." },
      { step: "Deliver", body: "Final exports for every placement, plus editable sources if included." },
    ],
    projectTypes: ["Campaign creative sets", "Monthly social design", "Company profile or brochure", "Pitch deck", "Event and trade-show material"],
    timeline:
      "Single assets are often turned around within days; larger documents such as brochures or decks are scheduled once content is ready.",
    faqs: [
      { q: "How is this different from Brand Identity?", a: "Brand Identity creates the system — logo, colours, typography, rules. Graphic Design applies that system to everyday materials like posts, ads and brochures." },
      { q: "Do you work with brands you didn't design?", a: "Yes. We work from your existing guidelines, or document the basics first if none exist." },
      { q: "Will I get editable source files?", a: "Source files can be included — this is stated in your quote. Templates for in-house use are always delivered editable." },
      { q: "Can you handle printing?", a: "We prepare print-ready files to your printer's specification. Printing itself is arranged with your printer, or we can recommend one." },
    ],
    related: ["brand-identity", "social-media-marketing", "website-development"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const serviceById = (id: ServiceId) => services.find((s) => s.id === id)!;
