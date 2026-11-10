import "server-only";
import { services } from "@/content/services";
import { retailPos } from "@/content/products";
import { generalFaqs, processStages } from "@/content/company";
import { articles } from "@/content/insights";
import { site } from "@/content/site";
import { ADDONS, PACKAGES } from "@/features/pricing/catalog";
import { SITE_PRICING_MODE, formatMoney } from "@/features/pricing/engine";

/**
 * Curated knowledge base for the assistant, generated from the same typed
 * content the website renders — so the assistant can never "know" something
 * the site doesn't publish. Retrieval is lexical (BM25-style), which is ample
 * for a corpus this size; swap in embeddings when content volume justifies it.
 */
export type KnowledgeChunk = { id: string; title: string; url: string; text: string };

function buildChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  chunks.push({
    id: "company",
    title: `About ${site.name}`,
    url: "/about",
    text: `${site.description} ${site.positioning} Based in ${site.location.city}, ${site.location.country}. Contact: ${site.email}. Social: ${site.social.map((s) => `${s.label} ${s.href}`).join(", ")}. No phone number is published. To start a project use /start-a-project; for an indicative estimate use /estimate.`,
  });
  chunks.push({
    id: "process",
    title: "How projects work",
    url: "/about#process",
    text: processStages.map((p) => `${p.index} ${p.name}: ${p.what} You receive: ${p.receive}.`).join(" "),
  });
  for (const f of generalFaqs) chunks.push({ id: `faq-${f.q}`, title: f.q, url: "/#faq", text: `${f.q} ${f.a}` });

  for (const s of services) {
    const url = `/services/${s.slug}`;
    chunks.push({ id: `svc-${s.id}`, title: s.name, url, text: `${s.name}. ${s.statement} ${s.hero.intro} Deliverables: ${s.deliverables.join("; ")}. Suitable for: ${s.projectTypes.join("; ")}. ${s.timeline}` });
    chunks.push({ id: `svc-cap-${s.id}`, title: `${s.name} — capabilities`, url, text: s.capabilities.map((c) => `${c.group}: ${c.items.join(", ")}`).join(". ") + (s.methodology ? ` ${s.methodology.title}: ${s.methodology.body}` : "") });
    for (const f of s.faqs) chunks.push({ id: `svc-faq-${s.id}-${f.q}`, title: `${s.name}: ${f.q}`, url, text: `${f.q} ${f.a}` });
  }

  const p = retailPos;
  chunks.push({ id: "pos", title: "Retail POS", url: "/products/retail-pos", text: `${p.name} (${p.category}). ${p.summary} Platform: ${p.platformNotes.join(" ")} Not yet confirmed for publication: ${p.unconfirmed.join("; ")}. Demo requests: /products/retail-pos#demo.` });
  chunks.push({ id: "pos-features", title: "Retail POS features", url: "/products/retail-pos#features", text: p.features.map((f) => `${f.title}: ${f.body}`).join(" ") });
  for (const f of p.faqs) chunks.push({ id: `pos-faq-${f.q}`, title: `Retail POS: ${f.q}`, url: "/products/retail-pos", text: `${f.q} ${f.a}` });

  // Pricing: only what the site itself shows in the current pricing mode.
  for (const s of services) {
    const pkgs = PACKAGES.filter((pk) => pk.service === s.id && pk.active);
    const lines = pkgs.map((pk) => {
      const visible = pk.price && (pk.approval === "approved" || SITE_PRICING_MODE === "draft-preview");
      const price = !pk.price
        ? "custom quote"
        : visible
          ? `${pk.priceType === "from" ? "from " : ""}${formatMoney(pk.price.USD ?? 0, "USD")}${pk.billing === "monthly" ? " per month" : " one-time"}${pk.approval === "pending" ? " (reference price, pending approval)" : ""}`
          : "price on request";
      return `${pk.group ? `${pk.group}: ` : ""}${pk.name} — ${pk.description} Includes: ${pk.includes.join(", ")}. Price: ${price}.`;
    });
    const addons = ADDONS.filter((a) => a.service === s.id && (a.approval === "approved" || SITE_PRICING_MODE === "draft-preview"))
      .map((a) => `${a.name} ${formatMoney(a.price.USD ?? 0, "USD")}${a.unit ? ` per ${a.unit.label}` : ""}${a.billing === "monthly" ? "/mo" : ""}`);
    if (addons.length) lines.push(`Add-ons: ${addons.join("; ")}.`);
    chunks.push({ id: `price-${s.id}`, title: `${s.name} pricing`, url: "/pricing", text: `${s.name} packages. ${lines.join(" ")} Prices are USD references (other currencies are indicative conversions on the pricing page), exclude taxes and third-party costs; the final price is confirmed in a written proposal. Estimator: /estimate.` });
  }

  for (const a of articles) {
    chunks.push({ id: `art-${a.slug}`, title: a.title, url: `/insights/${a.slug}`, text: `${a.title}. ${a.description} ${a.sections.map((s) => s.heading).join(". ")}` });
  }
  return chunks;
}

const STOP = new Set("a an and are as at be by can do does for from has have how i in is it its me my of on or our the to we what when where which who will with you your".split(" "));
const tokenize = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));

type Indexed = KnowledgeChunk & { tokens: string[]; tf: Map<string, number> };
let INDEX: { docs: Indexed[]; df: Map<string, number>; avgLen: number } | null = null;

function index() {
  if (INDEX) return INDEX;
  const docs = buildChunks().map((c) => {
    const tokens = tokenize(`${c.title} ${c.title} ${c.text}`);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { ...c, tokens, tf };
  });
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d.tokens)) df.set(t, (df.get(t) ?? 0) + 1);
  const avgLen = docs.reduce((n, d) => n + d.tokens.length, 0) / docs.length;
  INDEX = { docs, df, avgLen };
  return INDEX;
}

const SYNONYMS: Record<string, string[]> = {
  cost: ["pricing", "price"], price: ["pricing"], prices: ["pricing", "price"], much: ["pricing", "price"],
  app: ["mobile", "application"], apps: ["mobile", "application"], website: ["web", "website"], site: ["website"],
  logo: ["brand", "identity"], offline: ["offline", "internet"], internet: ["offline"], pos: ["retail", "pos"],
  instagram: ["social"], facebook: ["social"], ranking: ["seo", "search"], google: ["seo", "search"],
  talk: ["contact", "email"], speak: ["contact", "email"], human: ["contact"], someone: ["contact"],
};

export function retrieve(query: string, k = 6): KnowledgeChunk[] {
  const { docs, df, avgLen } = index();
  const q = tokenize(query).flatMap((t) => [t, ...(SYNONYMS[t] ?? [])]);
  if (!q.length) return [];
  const N = docs.length;
  const pricingIntent = /\b(cost|costs|price|prices|pricing|how much|fee|fees|budget|quote)\b/i.test(query);
  const scored = docs.map((d) => {
    let score = 0;
    for (const t of q) {
      const f = d.tf.get(t);
      if (!f) continue;
      const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
      score += idf * ((f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (d.tokens.length / avgLen))));
    }
    if (pricingIntent && d.id.startsWith("price-")) score *= 1.8;
    return { d, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(({ d }) => ({ id: d.id, title: d.title, url: d.url, text: d.text }));
}
