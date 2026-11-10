import type { FAQ } from "./services";

/** Six-stage working process, expanded from the four steps on the original site. */
export const processStages = [
  { index: "01", name: "Discover", what: "We learn your business, audience, goals and constraints through a call and a short questionnaire.", receive: "A written summary of goals and requirements", next: "Gives everyone the same definition of success." },
  { index: "02", name: "Plan", what: "Research, scope, sitemap or feature list, and a timeline with review points.", receive: "Proposal with scope, price and dated plan", next: "Turns ideas into commitments you can approve." },
  { index: "03", name: "Design", what: "Structure first, then visual design on a reusable system, reviewed in rounds.", receive: "Approved designs for desktop and mobile", next: "Settles look and behaviour before code is written." },
  { index: "04", name: "Build", what: "Development on a staging link you can open at any time; content added as it arrives.", receive: "A working build to review and test", next: "Problems surface early, while they're cheap to fix." },
  { index: "05", name: "Launch", what: "Final QA across devices, redirects, analytics and go-live, with a handover.", receive: "Live product, access details and editor guidance", next: "You own a working asset, not a dependency." },
  { index: "06", name: "Improve", what: "A post-launch fix window, then optional ongoing support, reporting and iteration.", receive: "Fixes, reports and a list of next improvements", next: "Keeps the work useful as your business changes." },
] as const;

export const principles = [
  { title: "Design with a reason", body: "Every layout, colour and animation should help someone understand, decide or act. If it doesn't, it goes.", size: "wide" },
  { title: "Engineering you can maintain", body: "Readable code, documented decisions and sensible tools — so the next change is as easy as the first.", size: "tall" },
  { title: "Clear communication", body: "Written scope, dated plans and a staging link you can always open. No surprises on invoices.", size: "compact" },
  { title: "Business first", body: "We recommend the smallest thing that meets the goal, and tell you when something isn't worth building.", size: "compact" },
  { title: "One consistent brand", body: "Design, development and marketing under one roof means your website, app and social channels speak the same language.", size: "medium" },
  { title: "Builders of our own products", body: "We ship and maintain our own software, so we understand the full life of a product — not just the launch.", size: "medium" },
] as const;

export const generalFaqs: FAQ[] = [
  { q: "How do we start a project?", a: "Send a short brief through the Start a Project form or the estimator. We reply with questions or a call invitation, then a written proposal with scope, price and timeline." },
  { q: "How is pricing decided?", a: "By scope: pages or workflows, integrations, content and timeline. Published figures are starting points; your proposal confirms the final price before work begins." },
  { q: "How many design revisions are included?", a: "The number of revision rounds is stated in each package and proposal, so you know in advance." },
  { q: "Who owns the website or app?", a: "You do. On final payment, the design, content and code produced for you are yours. Third-party licences remain under their own terms." },
  { q: "Do you offer maintenance after launch?", a: "Yes. Every build includes a fix window, and ongoing care plans can be arranged for updates, backups and small changes." },
  { q: "How long does a project take?", a: "It depends on scope and how quickly content and feedback arrive. A focused business website is typically a matter of weeks; apps and larger platforms are planned in milestones. Your proposal includes a dated plan." },
  { q: "Which technologies do you use?", a: "We choose per project — modern web frameworks and CMSs for websites, cross-platform or native toolkits for apps — and explain the trade-offs before you commit." },
  { q: "Can you guarantee SEO rankings?", a: "No. Search engines decide rankings. We commit to sound technical work, useful content and transparent reporting." },
  { q: "Do you work with clients outside Pakistan?", a: "We're based in Karachi and work remotely by email and video call. The pricing page lets you view indicative prices in your currency." },
  { q: "Can I see a demo of Retail POS?", a: "Yes — request one from the Retail POS page and we'll arrange a walkthrough." },
];
