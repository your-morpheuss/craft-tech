import { z } from "zod";
import { addOnsFor, getAddOn, getPackage, packagesFor } from "@/features/pricing/catalog";
import { resolvePrice, roundForCurrency, type PricingContext } from "@/features/pricing/engine";
import { CURRENCIES, SERVICE_IDS, type Approval, type BillingModel, type CurrencyCode, type ServiceId } from "@/features/pricing/types";
import { serviceById } from "@/content/services";

/**
 * The single estimate calculator. The pricing page, estimator UI and the
 * enquiry summary all call this — prices live only in the catalogue.
 */
const selectionSchema = z.object({
  package: z.string().max(40),
  addons: z.record(z.string().max(40), z.number().int().min(0).max(100)).default({}),
});

export const estimateInputSchema = z.object({
  services: z.array(z.enum(SERVICE_IDS as [ServiceId, ...ServiceId[]])).min(1).max(6),
  selections: z.record(z.string(), selectionSchema).default({}),
  region: z.string().min(2).max(5),
  currency: z.enum(CURRENCIES),
});
export type EstimateInput = z.infer<typeof estimateInputSchema>;
export type Selection = z.infer<typeof selectionSchema>;

export type EstimateLine = {
  kind: "package" | "addon";
  label: string;
  detail?: string;
  billing: BillingModel;
  amount: number | null;
  basis: "regional" | "converted" | null;
  approval: Approval;
  quote: boolean;
  startingPrice: boolean;
};

export type ServiceEstimate = {
  service: ServiceId;
  name: string;
  packageName: string;
  lines: EstimateLine[];
  assumptions: string[];
  excludes: string[];
  needsQuote: boolean;
  oneTime: number;
  monthly: number;
};

export type EstimateResult = {
  currency: CurrencyCode;
  region: string;
  services: ServiceEstimate[];
  oneTime: number;
  monthly: number;
  /** Any package priced "from" → totals are starting points. */
  startingPrice: boolean;
  outcome: "estimate" | "partial" | "quote";
  usesConversion: boolean;
  usesPendingPrices: boolean;
  ratesAsOf: string;
};

const ASSUMPTIONS: Record<ServiceId, string[]> = {
  "website-development": ["Content (text and images) supplied by you unless copywriting is agreed.", "Domain, hosting and paid licences are billed at cost."],
  "mobile-app-development": ["Apple and Google developer accounts are in your name and paid by you.", "Store approval is decided by Apple and Google."],
  "social-media-marketing": ["Advertising budgets are paid directly to the platforms and are not included."],
  seo: ["No ranking or traffic outcome is guaranteed.", "SEO results typically take several months of consistent work."],
  "brand-identity": ["Trademark searches and registration are not included."],
  "graphic-design": ["Graphic design is scoped per brief and quoted individually."],
};

/** Default package for a service: its first priced package, else its first package. */
export function defaultPackageId(service: ServiceId) {
  const list = packagesFor(service);
  return (list.find((p) => p.price) ?? list[0]).id;
}

/** Keep only valid package/add-on ids and quantities for a service. */
export function sanitizeSelection(service: ServiceId, raw: Partial<Selection> | undefined): Selection {
  const pkg = getPackage(raw?.package ?? "");
  const packageId = pkg && pkg.service === service && pkg.active ? pkg.id : defaultPackageId(service);
  const group = getPackage(packageId)?.group;
  const allowed = new Map(addOnsFor(service, group).map((a) => [a.id, a]));
  const addons: Record<string, number> = {};
  for (const [id, qty] of Object.entries(raw?.addons ?? {})) {
    const a = allowed.get(id);
    if (!a || !Number.isFinite(qty) || qty <= 0) continue;
    addons[id] = a.unit ? Math.min(Math.max(1, Math.round(qty)), a.unit.max) : 1;
  }
  return { package: packageId, addons };
}

export function computeEstimate(input: EstimateInput, ctx: PricingContext): EstimateResult {
  let usesConversion = false;
  let usesPendingPrices = false;
  let startingPrice = false;
  let priced = 0;
  let quotes = 0;

  const services: ServiceEstimate[] = Array.from(new Set(input.services)).map((service) => {
    const sel = sanitizeSelection(service, input.selections[service]);
    const pkg = getPackage(sel.package)!;
    const est: ServiceEstimate = {
      service,
      name: serviceById(service).name,
      packageName: pkg.name,
      lines: [],
      assumptions: ASSUMPTIONS[service],
      excludes: pkg.excludes,
      needsQuote: false,
      oneTime: 0,
      monthly: 0,
    };

    const push = (kind: EstimateLine["kind"], label: string, book: Parameters<typeof resolvePrice>[0], approval: Approval, billing: BillingModel, qty: number, from: boolean, detail?: string) => {
      const r = resolvePrice(book, approval, ctx);
      if (r.status === "quote") {
        est.lines.push({ kind, label, detail, billing, amount: null, basis: null, approval, quote: true, startingPrice: false });
        est.needsQuote = true;
        quotes++;
        return;
      }
      const amount = roundForCurrency(r.amount * qty, ctx.currency);
      if (r.basis === "converted") usesConversion = true;
      if (r.approval === "pending") usesPendingPrices = true;
      if (from) startingPrice = true;
      priced++;
      est.lines.push({ kind, label, detail, billing, amount, basis: r.basis, approval, quote: false, startingPrice: from });
      if (billing === "monthly") est.monthly += amount;
      else est.oneTime += amount;
    };

    push("package", `${pkg.name} package`, pkg.price, pkg.approval, pkg.billing, 1, pkg.priceType === "from", pkg.group);
    for (const [id, qty] of Object.entries(sel.addons)) {
      const a = getAddOn(id)!;
      push("addon", a.unit ? `${a.name} × ${qty}` : a.name, a.price, a.approval, a.billing, qty, false, a.unit ? `per ${a.unit.label}` : a.description);
    }
    return est;
  });

  return {
    currency: ctx.currency,
    region: input.region,
    services,
    oneTime: services.reduce((n, s) => n + s.oneTime, 0),
    monthly: services.reduce((n, s) => n + s.monthly, 0),
    startingPrice,
    outcome: priced === 0 ? "quote" : quotes > 0 ? "partial" : "estimate",
    usesConversion,
    usesPendingPrices,
    ratesAsOf: ctx.rates.asOf,
  };
}
