"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { addOnsFor, groupsFor, packagesFor } from "./catalog";
import { PriceTag } from "./PriceTag";
import { formatMoney, resolvePrice } from "./engine";
import { useCurrency } from "./CurrencyProvider";
import type { ServiceId } from "./types";

/**
 * Package cards for one service. Hierarchy comes from typography, borders and
 * surfaces — the custom-quote tier is quieter, the selected card is outlined.
 * No popularity badges (no evidence to support them).
 */
export function PackageCards({ service, showAddOns = true }: { service: ServiceId; showAddOns?: boolean }) {
  const groups = groupsFor(service);
  const [chosenGroup, setGroup] = useState<string | undefined>(groups[0]);
  // The component is reused across service tabs; ignore a group that doesn't belong to this service.
  const group = chosenGroup && groups.includes(chosenGroup) ? chosenGroup : groups[0];
  const pkgs = packagesFor(service).filter((p) => !group || p.group === group);
  const addons = addOnsFor(service, group);
  const { ctx } = useCurrency();

  return (
    <div>
      {groups.length > 1 && (
        <div role="group" aria-label="Package type" className="mb-6 inline-flex rounded-full border border-line bg-surface p-1">
          {groups.map((g) => (
            <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)} className={cn("h-9 rounded-full px-4 text-sm font-medium transition-colors", group === g ? "bg-ink text-white" : "text-text-2 hover:text-text")}>
              {g}
            </button>
          ))}
        </div>
      )}

      <ul className={cn("grid gap-3", pkgs.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : pkgs.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {pkgs.map((p, i) => {
          const isQuote = !p.price;
          return (
            <li key={p.id}>
              <article
                className={cn(
                  "group relative flex h-full flex-col rounded-[var(--radius-card)] border p-6 transition-[border-color,box-shadow,transform] duration-300 md:p-7",
                  isQuote ? "border-dashed border-line-strong bg-bg" : "border-line bg-surface hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_20px_40px_-28px_rgba(7,16,30,0.35)]",
                  "has-[a:focus-visible]:border-ink has-[a:hover]:border-ink",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className="text-label text-blue">{String(i + 1).padStart(2, "0")}</p>
                  <p className="text-label text-muted">{p.timeline}</p>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.025em]">{p.name}</h3>
                <p className="mt-2 min-h-[3lh] text-[0.9375rem] leading-relaxed text-text-2">{p.description}</p>
                <PriceTag className="mt-6 border-t border-line pt-6" book={p.price} approval={p.approval} billing={p.billing} priceType={p.priceType} />
                <ul className="mt-6 flex-1 space-y-2.5 text-[0.9375rem]">
                  {p.includes.map((x) => (
                    <li key={x} className="flex gap-2.5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-blue" aria-hidden />{x}</li>
                  ))}
                </ul>
                {p.excludes.length > 0 && (
                  <details className="mt-5 text-sm text-muted">
                    <summary className="cursor-pointer select-none font-medium text-text-2">Not included</summary>
                    <ul className="mt-2 space-y-1.5">
                      {p.excludes.map((x) => <li key={x} className="flex gap-2"><Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{x}</li>)}
                    </ul>
                  </details>
                )}
                <Link
                  href={isQuote ? `/start-a-project?service=${service}` : `/estimate?service=${service}&package=${p.id}`}
                  className={cn(
                    "mt-7 inline-flex h-11 items-center justify-center rounded-full px-5 text-[0.9375rem] font-medium transition-colors",
                    isQuote ? "border border-ink hover:bg-ink hover:text-white" : "bg-ink text-white hover:bg-blue",
                  )}
                >
                  {isQuote ? "Request a custom quote" : "Estimate with this package"}
                </Link>
              </article>
            </li>
          );
        })}
      </ul>

      {showAddOns && addons.length > 0 && (
        <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-7">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-label text-muted">Optional add-ons{group ? ` · ${group}` : ""}</p>
            <Link href={`/estimate?service=${service}`} className="text-sm font-medium text-blue underline-offset-4 hover:underline">Add them in the estimator</Link>
          </div>
          <ul className="mt-4 grid gap-x-10 md:grid-cols-2">
            {addons.map((a) => {
              const r = resolvePrice(a.price, a.approval, ctx);
              return (
                <li key={a.id} className="flex items-start justify-between gap-6 border-b border-line py-3.5">
                  <span>
                    <span className="block font-medium">{a.name}</span>
                    {a.description && <span className="block text-sm text-muted">{a.description}</span>}
                  </span>
                  <span className="shrink-0 text-right text-sm font-medium tabular-nums">
                    {r.status === "priced" ? (
                      <>{formatMoney(r.amount, r.currency)}{a.unit ? ` / ${a.unit.label}` : ""}{a.billing === "monthly" ? " /mo" : ""}</>
                    ) : <span className="text-muted">On request</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
