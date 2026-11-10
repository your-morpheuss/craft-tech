import { cacheLife } from "next/cache";
import { FALLBACK_RATES } from "@/features/pricing/regions";
import { CURRENCIES, type RateTable } from "@/features/pricing/types";

/**
 * Reference exchange rates (USD base) used only for *converted* prices.
 * Default source: ExchangeRate-API open endpoint (free, no key, attribution
 * required). Override with EXCHANGE_RATES_URL. Cached for hours via
 * Cache Components; on any failure the static fallback table is served.
 */
const DEFAULT_URL = "https://open.er-api.com/v6/latest/USD";

async function loadRates(): Promise<RateTable> {
  "use cache";
  cacheLife("hours");
  const url = process.env.EXCHANGE_RATES_URL || DEFAULT_URL;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return FALLBACK_RATES;
    const data = (await res.json()) as { result?: string; rates?: Record<string, unknown>; time_last_update_utc?: string };
    if (data.result && data.result !== "success") return FALLBACK_RATES;
    const rates = { ...FALLBACK_RATES.rates };
    let got = 0;
    for (const c of CURRENCIES) {
      const v = data.rates?.[c];
      if (typeof v === "number" && Number.isFinite(v) && v > 0) { rates[c] = v; got++; }
    }
    if (got < CURRENCIES.length - 1) return FALLBACK_RATES;
    rates.USD = 1;
    const asOf = data.time_last_update_utc ? new Date(data.time_last_update_utc).toISOString().slice(0, 10) : FALLBACK_RATES.asOf;
    return { base: "USD", asOf, source: url === DEFAULT_URL ? "Rates by ExchangeRate-API (exchangerate-api.com)" : "Configured exchange-rate feed", rates };
  } catch {
    return FALLBACK_RATES;
  }
}

export async function GET() {
  const table = await loadRates();
  return Response.json(table, { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } });
}
