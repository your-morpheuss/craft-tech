import type { CurrencyCode, RateTable, Region } from "./types";

const EURO_AREA: [string, string][] = [
  ["AT", "Austria"], ["BE", "Belgium"], ["HR", "Croatia"], ["CY", "Cyprus"], ["EE", "Estonia"],
  ["FI", "Finland"], ["FR", "France"], ["DE", "Germany"], ["GR", "Greece"], ["IE", "Ireland"],
  ["IT", "Italy"], ["LV", "Latvia"], ["LT", "Lithuania"], ["LU", "Luxembourg"], ["MT", "Malta"],
  ["NL", "Netherlands"], ["PT", "Portugal"], ["SK", "Slovakia"], ["SI", "Slovenia"], ["ES", "Spain"],
];

const EU_TAX = "Prices exclude VAT. Applicable VAT treatment is confirmed in the proposal.";

/** Countries with explicit configuration. Add more here — nothing else needs to change. */
export const REGIONS: Region[] = [
  { code: "PK", name: "Pakistan", currency: "PKR", taxNote: "Prices exclude applicable sales tax on services, confirmed in the proposal." },
  { code: "US", name: "United States", currency: "USD", taxNote: "Prices exclude any applicable taxes." },
  { code: "GB", name: "United Kingdom", currency: "GBP", taxNote: "Prices exclude VAT where applicable." },
  { code: "AE", name: "United Arab Emirates", currency: "AED", taxNote: "Prices exclude VAT where applicable." },
  { code: "CA", name: "Canada", currency: "CAD", taxNote: "Prices exclude GST/HST where applicable." },
  { code: "AU", name: "Australia", currency: "AUD", taxNote: "Prices exclude GST where applicable." },
  { code: "IN", name: "India", currency: "INR", taxNote: "Prices exclude GST where applicable." },
  ...EURO_AREA.map(([code, name]) => ({ code, name, currency: "EUR" as const, taxNote: EU_TAX })),
];

export const DEFAULT_REGION: Region = {
  code: "INTL",
  name: "Other country",
  currency: "USD",
  taxNote: "Prices exclude any applicable taxes, duties or transfer fees.",
};

export const ALL_REGIONS: Region[] = [...REGIONS].sort((a, b) => a.name.localeCompare(b.name)).concat(DEFAULT_REGION);

export function regionFor(code: string | null | undefined): Region {
  if (!code) return DEFAULT_REGION;
  const upper = code.toUpperCase();
  return REGIONS.find((r) => r.code === upper) ?? DEFAULT_REGION;
}

export const CURRENCY_META: Record<CurrencyCode, { label: string; locale: string; roundTo: number }> = {
  USD: { label: "US Dollar", locale: "en-US", roundTo: 1 },
  PKR: { label: "Pakistani Rupee", locale: "en-PK", roundTo: 100 },
  GBP: { label: "British Pound", locale: "en-GB", roundTo: 1 },
  EUR: { label: "Euro", locale: "en-IE", roundTo: 1 },
  AED: { label: "UAE Dirham", locale: "en-AE", roundTo: 5 },
  CAD: { label: "Canadian Dollar", locale: "en-CA", roundTo: 1 },
  AUD: { label: "Australian Dollar", locale: "en-AU", roundTo: 1 },
  INR: { label: "Indian Rupee", locale: "en-IN", roundTo: 50 },
};

/**
 * Reference exchange rates used only to *convert* the USD reference price when a
 * currency has no regional price. Replace via EXCHANGE_RATES_URL (see /api/rates)
 * or update here. Always labelled "converted reference" in the UI.
 */
export const FALLBACK_RATES: RateTable = {
  base: "USD",
  asOf: "2026-11-10",
  source: "Static fallback (ExchangeRate-API snapshot)",
  rates: { USD: 1, PKR: 276.54, GBP: 0.7447, EUR: 0.8924, AED: 3.6725, CAD: 1.4113, AUD: 1.448, INR: 93.93 },
};
