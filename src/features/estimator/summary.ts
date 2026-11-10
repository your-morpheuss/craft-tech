import { formatMoney } from "@/features/pricing/engine";
import type { EstimateResult } from "./compute";

/** Readable, structured estimate for the Web3Forms email (no personal data). */
export function estimateToFields(r: EstimateResult): { text: string; fields: Record<string, string> } {
  const money = (n: number) => formatMoney(n, r.currency);
  const from = r.startingPrice ? "from " : "";
  const lines: string[] = [`PROJECT ESTIMATE (${r.currency}, region ${r.region})`];
  for (const s of r.services) {
    lines.push("", `■ ${s.name} — ${s.packageName}`);
    for (const l of s.lines) {
      lines.push(`  · ${l.label}: ${l.quote ? "custom quote" : `${l.startingPrice ? "from " : ""}${money(l.amount!)}${l.billing === "monthly" ? "/mo" : ""}`}`);
    }
  }
  lines.push("", `One-time: ${r.oneTime ? from + money(r.oneTime) : "—"}`, `Monthly: ${r.monthly ? from + money(r.monthly) + "/mo" : "—"}`);
  if (r.outcome !== "estimate") lines.push("Some items require a custom quote and are not included in the totals.");
  if (r.usesConversion) lines.push(`Converted from USD reference prices (rates as of ${r.ratesAsOf}).`);
  if (r.usesPendingPrices) lines.push("Reference prices pending commercial approval.");
  const assumptions = Array.from(new Set(r.services.flatMap((s) => s.assumptions)));
  lines.push("", "Assumptions:", ...assumptions.map((a) => `  · ${a}`));

  return {
    text: lines.join("\n"),
    fields: {
      estimate_services: r.services.map((s) => s.name).join(", "),
      estimate_packages: r.services.map((s) => `${s.name}: ${s.packageName}`).join("; "),
      estimate_addons: r.services.flatMap((s) => s.lines.filter((l) => l.kind === "addon").map((l) => l.label)).join(", ") || "None",
      estimate_one_time: r.oneTime ? `${from}${money(r.oneTime)}` : "—",
      estimate_monthly: r.monthly ? `${from}${money(r.monthly)}/mo` : "—",
      estimate_currency: r.currency,
      estimate_outcome: r.outcome,
    },
  };
}
