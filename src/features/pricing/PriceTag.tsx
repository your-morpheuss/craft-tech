"use client";

import { cn } from "@/lib/cn";
import { QUOTE_REASON_LABEL, formatMoney, resolvePrice } from "./engine";
import { useCurrency } from "./CurrencyProvider";
import type { Approval, BillingModel, PriceBook } from "./types";

/** One catalogue price in the visitor's currency, honestly labelled. */
export function PriceTag({
  book,
  approval,
  billing,
  priceType = "from",
  className,
  size = "lg",
  dark,
}: {
  book: PriceBook | null;
  approval: Approval;
  billing: BillingModel;
  priceType?: "from" | "fixed";
  className?: string;
  size?: "lg" | "sm";
  dark?: boolean;
}) {
  const { ctx } = useCurrency();
  const r = resolvePrice(book, approval, ctx);
  const muted = dark ? "text-d-muted" : "text-muted";

  if (r.status === "quote") {
    return (
      <div className={className}>
        <p className={cn("text-label", muted)}>Pricing</p>
        <p className={cn("mt-1 font-semibold tracking-tight", size === "lg" ? "text-3xl" : "text-lg")}>{QUOTE_REASON_LABEL[r.reason]}</p>
        <p className={cn("mt-1 text-xs", muted)}>{r.reason === "custom-scope" ? "Scoped and priced with you" : "Ask us for current pricing"}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className={cn("text-label", muted)}>{priceType === "from" ? "Starting from" : "Package price"}</p>
      <p className={cn("mt-1 font-semibold tabular-nums tracking-[-0.03em]", size === "lg" ? "text-[2.25rem] leading-none md:text-[2.6rem]" : "text-lg")}>
        {formatMoney(r.amount, r.currency)}
        {billing === "monthly" && <span className={cn("ml-1 text-base font-medium tracking-normal", muted)}>/mo</span>}
      </p>
      <p className={cn("mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs", muted)}>
        <span>{billing === "monthly" ? "Monthly" : "One-time"}</span>
        {r.basis === "converted" && <span>· Indicative conversion from USD</span>}
        {r.approval === "pending" && <span className="rounded bg-amber-100 px-1.5 py-0.5 font-medium text-amber-900">Pending approval</span>}
      </p>
    </div>
  );
}
