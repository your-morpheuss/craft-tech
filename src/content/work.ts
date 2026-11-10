import type { ServiceId } from "@/features/pricing/types";
import type { ProductImage } from "./products";

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  category: "Software Products" | "Websites" | "Mobile Applications" | "Branding" | "Graphic Design" | "Digital Marketing";
  year: string;
  scope: string[];
  summary: string;
  hero: ProductImage;
  context: string;
  challenge: string;
  approach: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  deliverables: string[];
  gallery: ProductImage[];
  /** Only evidence-backed outcomes. Empty array → section is not rendered. */
  outcomes: string[];
  services: ServiceId[];
  productSlug?: string;
};

const IMG = "/images/retail-pos";

/**
 * Approved portfolio entries only. Client case studies are added here once
 * the client has approved publication (see docs/content-verification-report.md).
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "retail-pos",
    title: "Retail POS",
    client: "Craft Tech Labs (in-house product)",
    category: "Software Products",
    year: "2026",
    scope: ["Product design", "Desktop application engineering", "Brand and launch visuals"],
    summary:
      "Designing and building a Windows point-of-sale application for independent shops — from first-run setup to receipts, stock history and backups.",
    hero: {
      src: `${IMG}/checkout-to-receipt.png`, width: 1672, height: 941,
      alt: "Retail POS checkout dialog, sale confirmation and printed receipt shown side by side",
      caption: "The sale flow: checkout, confirm, receipt",
    },
    context:
      "Small retailers often run on a mix of paper ledgers, spreadsheets and memory. Retail POS is our own product: a focused desktop application that covers the daily work of a shop counter without asking the owner to become a systems administrator.",
    challenge:
      "Keep the checkout fast enough for a queue, while still recording everything an owner needs later — stock movements, returns, who made each sale — and make the first-run experience understandable without training.",
    approach: [
      { title: "Start at the counter", body: "The POS screen was designed first: search, category chips and a scan action on the left, the current sale on the right, and a single dominant checkout button." },
      { title: "Make every number traceable", body: "Stock changes are written as movements — initial stock, sale, return — so an owner can see why a count changed, not just that it did." },
      { title: "Safe to explore", body: "An isolated demo database lets owners learn with sample data before entering real records." },
      { title: "Owner-controlled data", body: "CSV import and export plus local backup and restore keep the shop's data portable and in the owner's hands." },
    ],
    decisions: [
      { title: "Confirmation before stock deduction", body: "Completing a sale asks for a final confirmation that states the amount and payment method, preventing accidental stock changes." },
      { title: "Hold and resume", body: "Real counters get interrupted. Parking a sale avoids re-scanning a basket." },
      { title: "Plain-language reports", body: "Each metric carries a one-line definition — 'sales minus refunds in this period' — so owners read reports correctly." },
    ],
    deliverables: ["Information architecture and UI design", "Windows desktop application", "Store setup and demo environment", "Receipt layout", "Product marketing visuals"],
    gallery: [
      { src: `${IMG}/checkout-hero.png`, width: 1672, height: 941, alt: "Retail POS dashboard and point-of-sale screens", caption: "Dashboard and POS" },
      { src: `${IMG}/inventory.png`, width: 1448, height: 1086, alt: "Retail POS inventory with stock movement history", caption: "Inventory and movement history" },
      { src: `${IMG}/reports-settings-backups.png`, width: 1536, height: 1024, alt: "Retail POS reports, settings and backups", caption: "Reports, settings, backups" },
    ],
    outcomes: [],
    services: ["mobile-app-development", "graphic-design"],
    productSlug: "retail-pos",
  },
];

export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const workCategories = Array.from(new Set(caseStudies.map((c) => c.category)));
