"use client";

import { useId } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/cn";
import { ALL_REGIONS, CURRENCY_META } from "./regions";
import { CURRENCIES, type CurrencyCode } from "./types";
import { useCurrency } from "./CurrencyProvider";

export function CurrencySelector({ className, dark, compact }: { className?: string; dark?: boolean; compact?: boolean }) {
  const { region, currency, source, setRegion, setCurrency } = useCurrency();
  const countryId = useId();
  const currencyId = useId();

  const field = cn(
    "h-11 appearance-none rounded-[var(--radius-ctl)] border bg-transparent pl-3 pr-8 text-[0.9375rem] font-medium",
    "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%235b6a82' stroke-width='1.6'%3E%3Cpath d='M2 4l4 4 4-4'/%3E%3C/svg%3E\")] bg-[right_0.75rem_center] bg-no-repeat",
    dark ? "border-d-line text-white [&>option]:text-ink" : "border-line-strong text-text",
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn("flex flex-wrap items-end gap-3", compact && "gap-2")}>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={countryId} className={cn("text-label", dark ? "text-d-muted" : "text-muted")}>Country</label>
          <select id={countryId} className={cn(field, "min-w-[12rem]")} value={region.code} onChange={(e) => setRegion(e.target.value)}>
            {ALL_REGIONS.map((r) => (
              <option key={r.code} value={r.code}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={currencyId} className={cn("text-label", dark ? "text-d-muted" : "text-muted")}>Currency</label>
          <select id={currencyId} className={cn(field, "min-w-[7.5rem]")} value={currency} onChange={(e) => setCurrency(e.target.value as CurrencyCode)}>
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c} — {CURRENCY_META[c].label}</option>
            ))}
          </select>
        </div>
      </div>
      <p aria-live="polite" className={cn("flex items-center gap-1.5 text-xs", dark ? "text-d-muted" : "text-muted")}>
        <Globe className="h-3.5 w-3.5" aria-hidden />
        {source === "suggested"
          ? `Suggested from your connection: ${region.name}. Change it any time.`
          : source === "default"
            ? "Showing international pricing in USD."
            : `Showing prices for ${region.name}.`}
      </p>
    </div>
  );
}
