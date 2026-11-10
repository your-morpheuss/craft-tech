"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { packagesFor } from "./catalog";
import { PriceTag } from "./PriceTag";
import { SITE_PRICING_MODE } from "./engine";
import { useCurrency } from "./CurrencyProvider";
import { CurrencySelector } from "./CurrencySelector";

/** Editorial price index: one row per service, lowest package, visitor's currency. */
export function StartingPrices() {
  const { rates } = useCurrency();
  return (
    <div>
      {SITE_PRICING_MODE === "draft-preview" && <DraftBanner />}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <CurrencySelector compact />
      </div>
      <ul className="border-t border-line">
        {services.map((s) => {
          const pkgs = packagesFor(s.id);
          const first = pkgs.find((p) => p.price) ?? pkgs[0];
          return (
            <li key={s.id} className="border-b border-line">
              <Link href={`/pricing?service=${s.id}`} className="group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 py-6 transition-colors hover:bg-surface md:grid-cols-[4rem_1fr_16rem_3rem] md:px-3">
                <span className="text-label text-blue">{s.index}</span>
                <span className="text-[clamp(1.25rem,1rem+1vw,1.9rem)] font-semibold tracking-[-0.03em] group-hover:text-blue">{s.name}</span>
                <PriceTag className="col-span-2 md:col-span-1" book={first.price} approval={first.approval} billing={first.billing} priceType={first.priceType} size="sm" />
                <ArrowUpRight className="hidden h-6 w-6 justify-self-end text-muted transition-transform group-hover:rotate-45 group-hover:text-text md:block" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-sm text-muted">
        Prices are indicative and may change based on scope, integrations, project complexity and final requirements. Non-USD amounts are indicative conversions ({rates.source}, {rates.asOf}). Taxes and third-party costs are extra.
      </p>
    </div>
  );
}

export function DraftBanner() {
  return (
    <p role="note" className="mb-6 rounded-[var(--radius-ctl)] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <strong>Reference pricing preview.</strong> Prices marked “Pending approval” come from the agreed reference dataset and are not yet commercially approved offers.
    </p>
  );
}
