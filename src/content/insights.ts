import type { ServiceId } from "@/features/pricing/types";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "h3"; text: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: "Planning" | "Pricing" | "Retail";
  published: string;
  updated?: string;
  /** Organisation byline unless a verified individual author is supplied. */
  author: string;
  relatedServices: ServiceId[];
  sections: { id: string; heading: string; blocks: ArticleBlock[] }[];
};

export const articles: Article[] = [
  {
    slug: "what-to-prepare-before-a-website-project",
    title: "What to prepare before a website project",
    description:
      "Seven things to gather before briefing a designer or developer — so your quote is accurate and your project starts moving on day one.",
    category: "Planning",
    published: "2026-11-10",
    author: "Craft Tech Labs",
    relatedServices: ["website-development", "seo", "brand-identity"],
    sections: [
      {
        id: "why-preparation-matters",
        heading: "Why preparation changes the quote",
        blocks: [
          { type: "p", text: "Most website delays don't come from design or code. They come from waiting — for content, for access to an old domain, for a decision on which pages are actually needed. A little preparation before the first call gives you a more accurate quote and a faster start." },
          { type: "p", text: "You don't need all of the following to begin a conversation. But the more of it you have, the less a studio has to assume — and assumptions are where budgets drift." },
        ],
      },
      {
        id: "goals",
        heading: "1. One sentence about what the site must do",
        blocks: [
          { type: "p", text: "Write down the single most important action a visitor should take: request a quote, book an appointment, buy a product, apply for a job. Every structural decision follows from that sentence." },
        ],
      },
      {
        id: "pages",
        heading: "2. A rough page list",
        blocks: [
          { type: "p", text: "List the pages you think you need. It doesn't need to be final, but page count is one of the clearest drivers of effort. Group them: core pages (home, about, contact), service or product pages, and content such as articles or case studies." },
        ],
      },
      {
        id: "content",
        heading: "3. Who will write the content",
        blocks: [
          { type: "p", text: "Decide early whether you'll supply text and images or want them written and sourced for you. Content that arrives late is the most common reason launches slip." },
          { type: "list", items: ["Existing brochures or presentations are a good starting point.", "Real photos of your team, premises or products outperform generic stock.", "Check you have the rights to every image you plan to use."] },
        ],
      },
      {
        id: "access",
        heading: "4. Access to what you already have",
        blocks: [
          { type: "p", text: "Find the login details — or at least the account owner — for your domain registrar, current hosting, analytics and search console. If you're replacing an existing site, a list of its current URLs lets your studio plan redirects so you don't lose search visibility." },
        ],
      },
      {
        id: "brand",
        heading: "5. Your brand assets",
        blocks: [
          { type: "p", text: "Gather your logo in the highest quality available (ideally vector), colour codes, and any brand guidelines. If they don't exist yet, that's worth knowing before design starts — it may be a separate piece of work." },
        ],
      },
      {
        id: "integrations",
        heading: "6. The systems the site must talk to",
        blocks: [
          { type: "p", text: "Booking tools, payment providers, CRMs, email marketing platforms, inventory systems. Each integration has its own effort and sometimes its own subscription cost." },
        ],
      },
      {
        id: "budget-and-timing",
        heading: "7. A budget range and a real deadline",
        blocks: [
          { type: "p", text: "Sharing a range isn't a negotiating weakness; it lets a studio recommend the right scope instead of guessing. Likewise, say whether a date is fixed (an event, a launch) or a preference." },
          { type: "p", text: "If you'd like a starting point, our project estimator turns your answers into an indicative range and a summary you can send with your brief." },
        ],
      },
    ],
  },
  {
    slug: "one-time-vs-monthly-costs-in-digital-projects",
    title: "One-time vs monthly: reading a digital project estimate",
    description:
      "Why honest estimates separate build fees from recurring costs, and which third-party charges sit outside the agency's quote.",
    category: "Pricing",
    published: "2026-11-10",
    author: "Craft Tech Labs",
    relatedServices: ["website-development", "social-media-marketing", "seo"],
    sections: [
      {
        id: "two-kinds-of-cost",
        heading: "Two kinds of cost, two different totals",
        blocks: [
          { type: "p", text: "A website build, a logo or an app release is a project: it has a defined scope and ends. Social media management, ongoing SEO and maintenance are services: they repeat every month. Adding the two into a single number makes an estimate look tidier, but it hides what you'll actually pay over a year." },
          { type: "p", text: "A clear estimate shows them separately — a one-time total and a monthly total — so you can see both the upfront investment and the running cost." },
        ],
      },
      {
        id: "third-party",
        heading: "Costs that aren't the studio's",
        blocks: [
          { type: "p", text: "Some costs are paid to other companies, usually directly by you. They belong in your budget even though they aren't in the studio's fee:" },
          { type: "list", items: ["Domain registration and hosting", "Paid plugins, themes, fonts or stock images", "Platform subscriptions for online stores", "App store developer accounts", "Advertising budgets on social and search platforms", "Payment gateway transaction fees"] },
          { type: "p", text: "Advertising spend deserves special mention: a social media management fee pays for planning, creative and management. The ad budget itself is paid to the platform." },
        ],
      },
      {
        id: "ranges",
        heading: "Why a range is more honest than a single figure",
        blocks: [
          { type: "p", text: "Early on, nobody knows exactly how many design rounds a project will need or how cleanly an integration will go. A range acknowledges that. The final price in a proposal should come after scope is defined in writing." },
          { type: "p", text: "Be cautious of estimates that are precise to the last unit before anyone has asked about your content, integrations or deadlines." },
        ],
      },
      {
        id: "tax-and-currency",
        heading: "Tax and currency",
        blocks: [
          { type: "p", text: "Check whether prices include applicable taxes such as VAT, GST or sales tax on services, and which currency you'll be invoiced in. A price converted from another currency is a reference, not a commitment — exchange rates move." },
        ],
      },
      {
        id: "questions-to-ask",
        heading: "Questions worth asking about any estimate",
        blocks: [
          { type: "list", items: ["What exactly is included, and what is explicitly excluded?", "How many revision rounds are covered?", "What happens after launch — is there a fix window?", "Which costs will I pay to third parties directly?", "Who owns the work on final payment?"] },
        ],
      },
    ],
  },
  {
    slug: "choosing-a-pos-for-a-small-retail-shop",
    title: "Choosing a POS for a small retail shop: a practical checklist",
    description:
      "The questions to ask before you choose point-of-sale software — from checkout speed to stock history, returns, user accounts and backups.",
    category: "Retail",
    published: "2026-11-10",
    author: "Craft Tech Labs",
    relatedServices: ["mobile-app-development", "website-development"],
    sections: [
      {
        id: "start-at-the-counter",
        heading: "Start at the counter",
        blocks: [
          { type: "p", text: "A point-of-sale system is used hundreds of times a day, often with a queue waiting. Before comparing feature lists, watch how a sale actually happens in your shop and judge each option by that." },
          { type: "list", items: ["Can staff find a product by name, code or barcode in a second or two?", "Can a sale be put on hold while a customer fetches something?", "Are discounts and change calculated without mental arithmetic?", "Is there a clear confirmation before the sale is recorded?"] },
        ],
      },
      {
        id: "stock",
        heading: "Stock you can trust",
        blocks: [
          { type: "p", text: "A stock count is only useful if you can explain it. Look for systems that keep a movement history — every sale, return and adjustment — rather than simply overwriting a number." },
          { type: "p", text: "Minimum-stock alerts and simple low-stock and out-of-stock filters save a surprising amount of time on reordering." },
        ],
      },
      {
        id: "returns-and-receipts",
        heading: "Returns and receipts",
        blocks: [
          { type: "p", text: "Returns happen. Check that the software can find the original invoice, process a partial return, and put the item back into stock correctly. Receipts should carry your store details and an invoice number customers can quote." },
        ],
      },
      {
        id: "people",
        heading: "People and accountability",
        blocks: [
          { type: "p", text: "If anyone besides the owner works the till, separate user accounts matter. An activity or audit history protects both the owner and honest staff." },
        ],
      },
      {
        id: "data",
        heading: "Your data, your control",
        blocks: [
          { type: "list", items: ["Can you import your existing product list from a spreadsheet?", "Can you export products and sales if you ever switch systems?", "How are backups made, and can you restore one yourself?", "What happens if the internet connection drops?"] },
        ],
      },
      {
        id: "try-first",
        heading: "Try before you commit",
        blocks: [
          { type: "p", text: "A good POS will let you explore with sample data before entering real records. Run a few realistic sales, a return and an end-of-day report before deciding." },
          { type: "p", text: "We built Retail POS around these questions. If you'd like to see how it handles them, you can request a demo." },
        ],
      },
    ],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);

export function readingTime(article: Article): number {
  const words = article.sections
    .flatMap((s) => [s.heading, ...s.blocks.map((b) => (b.type === "list" ? b.items.join(" ") : b.text))])
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
