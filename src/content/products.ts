import type { FAQ } from "./services";

export type ProductImage = { src: string; width: number; height: number; alt: string; caption: string };

export type ProductFeature = { title: string; body: string; tag: string };

export type Product = {
  slug: string;
  name: string;
  category: string;
  platform: string;
  status: "available-on-request" | "in-development";
  tagline: string;
  summary: string;
  seo: { title: string; description: string };
  hero: ProductImage;
  gallery: ProductImage[];
  features: ProductFeature[];
  workflows: { step: string; title: string; body: string }[];
  /** Editorial feature stories, each paired with a real product visual. */
  stories: { kicker: string; title: string; body: string; points: string[]; image: ProductImage }[];
  useCases: { title: string; body: string }[];
  platformNotes: string[];
  /** Items the owner must confirm before they can be published. */
  unconfirmed: string[];
  faqs: FAQ[];
};

const IMG = "/images/retail-pos";

export const retailPos: Product = {
  slug: "retail-pos",
  name: "Retail POS",
  category: "Point of sale · Windows desktop",
  platform: "Windows desktop application",
  status: "available-on-request",
  tagline: "Retail, running smoothly.",
  summary:
    "A Windows point-of-sale application for independent shops: fast checkout and receipts, traceable stock, sales and returns, customer records, reports, cashier accounts and local backups — in one workspace.",
  seo: {
    title: "Retail POS — Windows Point of Sale Software for Retail Shops",
    description:
      "Retail POS by Craft Tech Labs is a Windows point-of-sale application with checkout and receipts, inventory with stock movement history, sales and returns, reports, cashier accounts and local backups.",
  },
  hero: {
    src: `${IMG}/checkout-hero.png`, width: 1672, height: 941,
    alt: "Retail POS on Windows: the dashboard and the POS screen with a product grid, a three-item current sale and a checkout button",
    caption: "Dashboard and point-of-sale screens",
  },
  gallery: [
    { src: `${IMG}/checkout-to-receipt.png`, width: 1672, height: 941, alt: "Three Retail POS steps: entering amount received, confirming the sale and the printed receipt with invoice number", caption: "Checkout → confirm → receipt" },
    { src: `${IMG}/inventory.png`, width: 1448, height: 1086, alt: "Retail POS inventory list with unit counts and a stock movement history panel listing sales, returns and initial stock", caption: "Inventory and stock movement history" },
    { src: `${IMG}/products-catalogue.png`, width: 1254, height: 1254, alt: "Retail POS product catalogue with SKU, barcode, stock and price per product, category filter and search", caption: "Products: search, filter, categories" },
    { src: `${IMG}/reports-settings-backups.png`, width: 1536, height: 1024, alt: "Retail POS weekly report with revenue, transactions and stock alerts beside settings for store profile, CSV import/export and local backups", caption: "Reports, settings and backups" },
    { src: `${IMG}/welcome-setup.png`, width: 1254, height: 1254, alt: "Retail POS welcome screen and store setup form with store name, address, currency code and owner account", caption: "Welcome and store setup" },
  ],
  features: [
    { tag: "Checkout", title: "Fast billing at the counter", body: "Search by name, SKU or brand, filter by category or scan, adjust quantities, apply line discounts, then take payment with automatic change calculation." },
    { tag: "Receipts", title: "Receipts with your store details", body: "Every sale gets an invoice number and a receipt showing items, totals, payment, change and your own footer message." },
    { tag: "Hold", title: "Hold and resume sales", body: "Park a sale while a customer fetches one more item, serve the next person, then resume where you left off." },
    { tag: "Inventory", title: "Traceable stock", body: "Stock levels per product with low- and out-of-stock filters, plus a movement history that records initial stock, sales and returns." },
    { tag: "Returns", title: "Sales history and returns", body: "Search past invoices by customer or cashier, reprint receipts and process full or partial returns." },
    { tag: "Customers", title: "Optional customer records", body: "Sell to walk-in customers, or save a customer with optional phone, email and notes." },
    { tag: "Reports", title: "Reports for any period", body: "Net revenue, transactions, average sale, payment breakdown, top products, daily gross sales and inventory cost value — today, this week, this month or custom dates." },
    { tag: "Accountability", title: "Cashiers and audit history", body: "Add cashier accounts and review an audit history of activity in the store." },
    { tag: "Data", title: "CSV import, export and local backups", body: "Import products from CSV, export products and sales, and create or restore backups to a location you choose." },
  ],
  workflows: [
    { step: "01", title: "Set up the store", body: "Enter store name, address, contact, currency and an owner account — or explore first in an isolated demo database." },
    { step: "02", title: "Add your catalogue", body: "Create products and categories by hand or import them from a CSV with SKU, barcode, cost, price, stock and minimum stock." },
    { step: "03", title: "Sell", body: "Build the cart, apply discounts, choose the payment method and confirm. Stock is deducted on confirmation." },
    { step: "04", title: "Review and protect", body: "Check reports, follow stock movement, manage returns and keep backups of your data." },
  ],
  stories: [
    {
      kicker: "Sales & checkout", title: "From cart to receipt in three steps.",
      body: "Build the sale, take payment and confirm. The change is calculated for you, stock is deducted only after confirmation, and every sale gets an invoice-numbered receipt.",
      points: ["Search, category filters and scan", "Line discounts, hold and resume", "Receipt with your store details"],
      image: { src: `${IMG}/checkout-to-receipt.png`, width: 1672, height: 941, alt: "Retail POS checkout dialog, sale confirmation and printed receipt", caption: "Checkout → confirm → receipt" },
    },
    {
      kicker: "Product management", title: "A catalogue you can actually find things in.",
      body: "Every product carries a SKU, barcode, category, stock level and active status. Search by name, SKU or barcode, filter by category and sort the list your way.",
      points: ["SKU and barcode per product", "Categories and sorting", "CSV import for existing lists"],
      image: { src: `${IMG}/products-catalogue.png`, width: 1254, height: 1254, alt: "Retail POS product catalogue with search and category filter", caption: "Products: search, filter, categories" },
    },
    {
      kicker: "Inventory", title: "Stock counts you can explain.",
      body: "Filter low and out-of-stock items, and open any product’s movement history to see each initial stock entry, sale and return that changed the count.",
      points: ["Low- and out-of-stock filters", "Stock movement history", "Cost value per product"],
      image: { src: `${IMG}/inventory.png`, width: 1448, height: 1086, alt: "Retail POS inventory list with stock movement history panel", caption: "Inventory and movement history" },
    },
    {
      kicker: "Reports, settings & backups", title: "The numbers, the store profile, the safety net.",
      body: "Reports for today, this week, this month or custom dates. Store profile and receipt footer in settings, cashier accounts with audit history, CSV export and local backup and restore.",
      points: ["Revenue, transactions, top products", "Cashiers and audit history", "Local backup and restore"],
      image: { src: `${IMG}/reports-settings-backups.png`, width: 1536, height: 1024, alt: "Retail POS weekly report beside settings for data transfer and backups", caption: "Reports, settings and backups" },
    },
  ],
  useCases: [
    { title: "General stores and marts", body: "Large mixed catalogues across categories, with search and scan at the counter." },
    { title: "Electronics and accessories", body: "Product variants and packs with SKU and barcode tracking." },
    { title: "Stationery and household", body: "Low-stock visibility on fast-moving items." },
    { title: "Owner-run shops with a cashier", body: "Separate cashier accounts and an audit history for accountability." },
  ],
  platformNotes: [
    "Runs as a desktop application on Windows.",
    "Store data is kept on the shop's own computer, with backups saved where you choose.",
    "The product's welcome screen describes it as working offline — ask us to confirm details for your setup during a demo.",
  ],
  unconfirmed: [
    "Minimum Windows version and hardware requirements",
    "Supported barcode scanners and receipt printers",
    "Licensing and pricing",
    "Multi-location / multi-terminal support",
  ],
  faqs: [
    { q: "Does Retail POS work without an internet connection?", a: "Retail POS is a Windows desktop application that keeps store data on the shop's computer, and its welcome screen describes it as working offline. We'll confirm exactly how it behaves for your setup during a demo." },
    { q: "Which barcode scanners and receipt printers does it support?", a: "The POS screen includes a scan action and products carry barcodes. Specific hardware compatibility is confirmed per setup — tell us what you use in the demo request." },
    { q: "Can I import my existing product list?", a: "Yes. Products can be imported from a CSV file containing SKU, barcode, name, category, cost price, selling price, stock and minimum stock." },
    { q: "Can I try it before deciding?", a: "Retail POS includes an isolated demo database so you can explore with sample data without touching real records. Request a demo and we'll walk you through it." },
    { q: "How much does it cost?", a: "Pricing depends on your setup and is shared on request. Use the demo form and we'll reply with options." },
    { q: "Can it handle more than one shop?", a: "Multi-location use hasn't been confirmed for publication yet. Tell us about your shops and we'll answer directly." },
  ],
};

export const products: Product[] = [retailPos];
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
