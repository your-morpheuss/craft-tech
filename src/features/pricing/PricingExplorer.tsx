"use client";

import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import { services } from "@/content/services";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";
import { groupsFor, packagesFor } from "./catalog";
import { PackageCards } from "./PackageCards";
import { CurrencySelector } from "./CurrencySelector";
import { DraftBanner } from "./StartingPrices";
import { QUOTE_REASON_LABEL, SITE_PRICING_MODE, formatMoney, resolvePrice } from "./engine";
import { useCurrency } from "./CurrencyProvider";
import { SERVICE_IDS, type ServiceId } from "./types";

const noopSubscribe = () => () => undefined;

export function PricingExplorer() {
  // Deep link (/pricing?service=seo) is read from the URL after hydration; SSR shows the default.
  const urlService = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("service"),
    () => null,
  );
  const [chosen, setChosen] = useState<ServiceId | null>(null);
  const active: ServiceId = chosen ?? SERVICE_IDS.find((id) => id === urlService) ?? "website-development";
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panel = useRef<HTMLDivElement>(null);
  const { ctx, rates, region } = useCurrency();

  useGSAP(() => undefined, { scope: panel });
  function select(id: ServiceId) {
    setChosen(id);
    const url = new URL(window.location.href);
    url.searchParams.set("service", id);
    window.history.replaceState(null, "", url);
    const el = panel.current;
    if (el && motionAllowed()) gsap.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
  }

  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + services.length) % services.length;
    tabRefs.current[next]?.focus();
    select(services[next].id);
  }

  const svc = services.find((s) => s.id === active)!;
  const pkgs = packagesFor(active);
  const groups = groupsFor(active);

  return (
    <div>
      <div className="flex flex-col gap-8 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div role="tablist" aria-label="Services" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0">
          {services.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              role="tab"
              id={`tab-${s.id}`}
              aria-selected={active === s.id}
              aria-controls="pricing-panel"
              tabIndex={active === s.id ? 0 : -1}
              onClick={() => select(s.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-medium transition-colors",
                active === s.id ? "border-ink bg-ink text-white" : "border-line-strong text-text-2 hover:border-ink hover:text-text",
              )}
            >
              <span className={cn("text-label", active === s.id ? "text-cyan" : "text-blue")}>{s.index}</span>{s.shortName}
            </button>
          ))}
        </div>
        <CurrencySelector />
      </div>

      <div ref={panel} id="pricing-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="pt-10">
        {SITE_PRICING_MODE === "draft-preview" && <DraftBanner />}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-h3">{svc.name}</h2>
            <p className="mt-2 max-w-2xl text-text-2">{svc.statement}</p>
          </div>
        </div>
        <PackageCards service={active} />

        {(groups.length ? groups : [undefined]).map((g) => {
          const list = pkgs.filter((p) => !g || p.group === g);
          if (list.length < 2) return null;
          const rows = Array.from(new Set(list.flatMap((p) => p.includes)));
          return (
            <div key={g ?? "all"} className="mt-12 hidden md:block">
              <h3 className="text-xl font-semibold tracking-tight">Compare {(g ?? svc.shortName).toLowerCase()} packages</h3>
              <div className="mt-5 overflow-x-auto rounded-[var(--radius-card)] border border-line bg-surface">
                <table className="w-full min-w-[640px] border-collapse text-left text-[0.9375rem]">
                  <caption className="sr-only">Feature comparison for {g ?? svc.name} packages</caption>
                  <thead>
                    <tr className="border-b border-line">
                      <th scope="col" className="p-4 font-medium text-muted">Included</th>
                      {list.map((p) => {
                        const r = resolvePrice(p.price, p.approval, ctx);
                        return (
                          <th key={p.id} scope="col" className="p-4 align-bottom">
                            <span className="block font-semibold">{p.name}</span>
                            <span className="mt-1 block text-sm font-normal tabular-nums text-muted">
                              {r.status === "priced" ? `${p.priceType === "from" ? "from " : ""}${formatMoney(r.amount, r.currency)}${p.billing === "monthly" ? " /mo" : ""}` : QUOTE_REASON_LABEL[r.reason]}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-line">
                      <th scope="row" className="p-4 font-normal text-text-2">Billing</th>
                      {list.map((p) => <td key={p.id} className="p-4">{p.billing === "monthly" ? "Monthly" : "One-time"}</td>)}
                    </tr>
                    <tr className="border-b border-line">
                      <th scope="row" className="p-4 font-normal text-text-2">Typical timeline</th>
                      {list.map((p) => <td key={p.id} className="p-4">{p.timeline ?? "—"}</td>)}
                    </tr>
                    {rows.map((row) => (
                      <tr key={row} className="border-b border-line last:border-0">
                        <th scope="row" className="p-4 font-normal text-text-2">{row}</th>
                        {list.map((p) => (
                          <td key={p.id} className="p-4">
                            {p.includes.includes(row) ? <Check className="h-4 w-4 text-blue" aria-label="Included" /> : <Minus className="h-4 w-4 text-line-strong" aria-label="Not included" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        <p className="mt-8 text-sm text-muted">
          {region.taxNote} Reference prices are set in USD; other currencies are indicative conversions ({rates.source}, {rates.asOf}).
        </p>
      </div>
    </div>
  );
}
