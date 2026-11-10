import { CURRENCY_META, FALLBACK_RATES } from "./regions";
import type { Approval, CurrencyCode, PriceBook, PricingMode, RateTable, ResolvedPrice } from "./types";

export type PricingContext = {
  currency: CurrencyCode;
  mode: PricingMode;
  rates: RateTable;
};

export function pricingModeFromEnv(value: string | undefined): PricingMode {
  return value === "draft-preview" ? "draft-preview" : "approved-only";
}

/** The site-wide pricing mode. Production default is approved-only. */
export const SITE_PRICING_MODE: PricingMode = pricingModeFromEnv(process.env.NEXT_PUBLIC_PRICING_MODE);

export function defaultContext(currency: CurrencyCode = "USD", mode: PricingMode = SITE_PRICING_MODE): PricingContext {
  return { currency, mode, rates: FALLBACK_RATES };
}

export function roundForCurrency(amount: number, currency: CurrencyCode): number {
  const step = CURRENCY_META[currency].roundTo;
  return Math.round(amount / step) * step;
}

/**
 * Resolve a price book to a displayable price, keeping the two concepts apart:
 *  - regional: an independently approved price for that currency's market
 *  - converted: the USD reference price converted at a recorded reference rate
 */
export function resolvePrice(book: PriceBook | null, approval: Approval, ctx: PricingContext): ResolvedPrice {
  if (!book) return { status: "quote", reason: "custom-scope" };
  if (approval === "pending" && ctx.mode !== "draft-preview") return { status: "quote", reason: "not-approved" };

  const regional = book[ctx.currency];
  if (typeof regional === "number") {
    return { status: "priced", amount: regional, currency: ctx.currency, basis: "regional", approval };
  }
  const reference = book.USD;
  const rate = ctx.rates.rates[ctx.currency];
  if (typeof reference !== "number" || !rate || !Number.isFinite(rate)) {
    return { status: "quote", reason: "no-rate" };
  }
  return {
    status: "priced",
    amount: roundForCurrency(reference * rate, ctx.currency),
    currency: ctx.currency,
    basis: "converted",
    approval,
  };
}

export function formatMoney(amount: number, currency: CurrencyCode): string {
  const meta = CURRENCY_META[currency];
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency,
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace(/ /g, " ");
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("en-US")}`;
  }
}

export function formatRange(min: number, max: number, currency: CurrencyCode): string {
  if (min === max) return formatMoney(min, currency);
  return `${formatMoney(min, currency)} – ${formatMoney(max, currency).replace(`${currency} `, "")}`;
}

export const QUOTE_REASON_LABEL: Record<Extract<ResolvedPrice, { status: "quote" }>["reason"], string> = {
  "custom-scope": "Custom quote",
  "not-approved": "Quote on request",
  "no-rate": "Quote on request",
};
