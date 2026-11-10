export type ServiceId =
  | "website-development"
  | "mobile-app-development"
  | "social-media-marketing"
  | "seo"
  | "brand-identity"
  | "graphic-design";

export const SERVICE_IDS: ServiceId[] = [
  "website-development",
  "mobile-app-development",
  "social-media-marketing",
  "seo",
  "brand-identity",
  "graphic-design",
];

export const CURRENCIES = ["USD", "PKR", "GBP", "EUR", "AED", "CAD", "AUD", "INR"] as const;
export type CurrencyCode = (typeof CURRENCIES)[number];

export type BillingModel = "one-time" | "monthly";

/**
 * "approved" — commercially approved, publishable.
 * "pending"  — imported reference price awaiting Craft Tech Labs approval;
 *              shown only in `draft-preview` mode, always labelled.
 */
export type Approval = "approved" | "pending";

/** Explicit prices per currency, whole units. USD is the reference book. */
export type PriceBook = Partial<Record<CurrencyCode, number>>;

export type PriceSource = { name: string; url: string; capturedAt: string };

export type Package = {
  id: string;
  service: ServiceId;
  /** Optional sub-group within a service (e.g. "Online stores" under websites). */
  group?: string;
  name: string;
  description: string;
  billing: BillingModel;
  /** null → "Request a custom quote". */
  price: PriceBook | null;
  /** "from" = starting price; "fixed" = stated package price. */
  priceType: "from" | "fixed";
  timeline?: string;
  includes: string[];
  excludes: string[];
  approval: Approval;
  source?: PriceSource;
  effectiveDate: string;
  active: boolean;
  sort: number;
};

export type AddOn = {
  id: string;
  service: ServiceId;
  /** Restrict to a package group (e.g. e-commerce add-ons). */
  group?: string;
  name: string;
  description?: string;
  billing: BillingModel;
  price: PriceBook;
  /** Unit-priced add-ons let visitors choose a quantity ("per page"). */
  unit?: { label: string; max: number };
  approval: Approval;
  source?: PriceSource;
  active: boolean;
};

export type PricingMode = "approved-only" | "draft-preview";

export type Region = {
  code: string;
  name: string;
  currency: CurrencyCode;
  taxNote: string;
};

export type RateTable = {
  base: "USD";
  asOf: string;
  source: string;
  rates: Record<CurrencyCode, number>;
};

export type ResolvedPrice =
  | { status: "priced"; amount: number; currency: CurrencyCode; basis: "regional" | "converted"; approval: Approval }
  | { status: "quote"; reason: "custom-scope" | "not-approved" | "no-rate" };
