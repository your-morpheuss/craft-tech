"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Link2, Minus, Plus, Printer } from "lucide-react";
import { cn } from "@/lib/cn";
import { services } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";
import { track } from "@/lib/analytics";
import { applyPreference, useCurrency } from "@/features/pricing/CurrencyProvider";
import { CurrencySelector } from "@/features/pricing/CurrencySelector";
import { DraftBanner } from "@/features/pricing/StartingPrices";
import { PriceTag } from "@/features/pricing/PriceTag";
import { addOnsFor, getPackage, groupsFor, packagesFor } from "@/features/pricing/catalog";
import { formatMoney, resolvePrice } from "@/features/pricing/engine";
import { SERVICE_IDS, type CurrencyCode, type ServiceId } from "@/features/pricing/types";
import { ContactForm } from "@/features/contact/ContactForm";
import { computeEstimate, estimateInputSchema, sanitizeSelection, type EstimateInput, type EstimateResult, type Selection } from "./compute";
import { estimateToFields } from "./summary";

const STEPS = ["Services", "Packages", "Add-ons & scope", "Region", "Estimate", "Enquire"] as const;
const HEADINGS = ["What do you need?", "Choose a package", "Add-ons and scope", "Where are you based?", "Your indicative estimate", "Send it to us"];
const STORE_KEY = "ctl-estimate-v2";

type State = { step: number; selected: ServiceId[]; selections: Partial<Record<ServiceId, Selection>> };

function encodeShare(s: State, region: string, currency: string) {
  return btoa(unescape(encodeURIComponent(JSON.stringify({ s: s.selected, x: s.selections, r: region, c: currency })))).replace(/=+$/, "");
}
function decodeShare(hash: string): { selected: ServiceId[]; selections: State["selections"]; region: string; currency: CurrencyCode } | null {
  try {
    const raw = JSON.parse(decodeURIComponent(escape(atob(hash)))) as { s?: unknown; x?: unknown; r?: unknown; c?: unknown };
    const p = estimateInputSchema.safeParse({ services: raw.s, selections: raw.x ?? {}, region: raw.r, currency: raw.c });
    if (!p.success) return null;
    return { selected: p.data.services, selections: p.data.selections as State["selections"], region: p.data.region, currency: p.data.currency };
  } catch {
    return null;
  }
}

/** Shared link (#e=…) wins over session progress; ?service=&package= preselect. */
function restoreInitial(): { state: State; shared: { region: string; currency: CurrencyCode } | null } {
  const m = window.location.hash.match(/#e=([A-Za-z0-9+/]+)/);
  const shared = m ? decodeShare(m[1]) : null;
  if (shared) return { state: { step: 4, selected: shared.selected, selections: shared.selections }, shared: { region: shared.region, currency: shared.currency } };
  let state: State = { step: 0, selected: [], selections: {} };
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as State;
      if (Array.isArray(saved.selected)) state = { step: Math.min(saved.step ?? 0, 4), selected: saved.selected.filter((x) => SERVICE_IDS.includes(x)), selections: saved.selections ?? {} };
    }
  } catch { /* ignore */ }
  const q = new URLSearchParams(window.location.search);
  const pre = SERVICE_IDS.find((id) => id === q.get("service"));
  if (pre) {
    const pkg = getPackage(q.get("package") ?? "");
    state = {
      ...state,
      selected: state.selected.includes(pre) ? state.selected : [...state.selected, pre],
      selections: pkg && pkg.service === pre ? { ...state.selections, [pre]: { package: pkg.id, addons: {} } } : state.selections,
    };
  }
  return { state, shared: null };
}

function Amount({ value, currency }: { value: number; currency: CurrencyCode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionAllowed()) { el.textContent = formatMoney(value, currency); shown.current = value; return; }
    const o = { v: shown.current };
    gsap.to(o, { v: value, duration: 0.6, ease: "power3.out", onUpdate: () => { el.textContent = formatMoney(Math.round(o.v), currency); }, onComplete: () => { shown.current = value; } });
  }, { dependencies: [value, currency] });
  return <span ref={ref}>{formatMoney(value, currency)}</span>;
}

function Totals({ r, compact }: { r: EstimateResult; compact?: boolean }) {
  return (
    <div className={cn("grid grid-cols-1 gap-3", !compact && "sm:grid-cols-2")}>
      <div className="rounded-[var(--radius-ctl)] bg-ink p-5 text-white">
        <p className="text-label text-d-muted">Estimated one-time{r.startingPrice && r.oneTime ? " · from" : ""}</p>
        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight" aria-live="polite">{r.oneTime ? <Amount value={r.oneTime} currency={r.currency} /> : "—"}</p>
      </div>
      <div className="rounded-[var(--radius-ctl)] border border-line bg-surface p-5">
        <p className="text-label text-muted">Estimated monthly{r.startingPrice && r.monthly ? " · from" : ""}</p>
        <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight" aria-live="polite">{r.monthly ? <><Amount value={r.monthly} currency={r.currency} /><span className="text-base text-muted"> /mo</span></> : "—"}</p>
      </div>
    </div>
  );
}

export function Estimator() {
  const { ctx, region, rates } = useCurrency();
  const [initial] = useState(restoreInitial);
  const [state, setState] = useState<State>(initial.state);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initial.shared) applyPreference(initial.shared.region, initial.shared.currency);
  }, [initial]);
  useEffect(() => {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const sel = (id: ServiceId) => sanitizeSelection(id, state.selections[id]);
  const input: EstimateInput | null = useMemo(() => {
    if (!state.selected.length) return null;
    const selections: Record<string, Selection> = {};
    for (const id of state.selected) selections[id] = sanitizeSelection(id, state.selections[id]);
    const p = estimateInputSchema.safeParse({ services: state.selected, selections, region: region.code, currency: ctx.currency });
    return p.success ? p.data : null;
  }, [state.selected, state.selections, region.code, ctx.currency]);
  const result = useMemo(() => (input ? computeEstimate(input, ctx) : null), [input, ctx]);
  const summary = useMemo(() => (result ? estimateToFields(result) : null), [result]);

  function go(step: number) {
    if (step > 0 && !state.selected.length) { setError("Choose at least one service to continue."); return; }
    setError(null);
    if (step === 1 && state.step === 0) track("estimate_started", { services: state.selected.length });
    if (step === 4) track("estimate_completed", { services: state.selected.length, currency: ctx.currency });
    setState((s) => ({ ...s, step }));
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: "start", behavior: motionAllowed() ? "smooth" : "auto" });
      const el = panelRef.current;
      if (el && motionAllowed()) gsap.fromTo(el, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", clearProps: "transform,opacity" });
    });
  }

  const toggleService = (id: ServiceId) => {
    setError(null);
    setState((s) => ({ ...s, selected: s.selected.includes(id) ? s.selected.filter((x) => x !== id) : [...s.selected, id] }));
  };
  const setPackage = (id: ServiceId, pkg: string) => setState((s) => ({ ...s, selections: { ...s.selections, [id]: { package: pkg, addons: {} } } }));
  const setAddon = (id: ServiceId, addon: string, qty: number) =>
    setState((s) => {
      const cur = sanitizeSelection(id, s.selections[id]);
      const addons = { ...cur.addons };
      if (qty <= 0) delete addons[addon];
      else addons[addon] = qty;
      return { ...s, selections: { ...s.selections, [id]: { ...cur, addons } } };
    });

  async function share() {
    const url = `${window.location.origin}/estimate#e=${encodeShare(state, region.code, ctx.currency)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  const step = state.step;
  const canJump = (i: number) => i <= step || (i <= 4 && state.selected.length > 0);
  const fromLabel = (id: ServiceId) => {
    const first = packagesFor(id).find((p) => p.price);
    if (!first) return "Custom quote";
    const r = resolvePrice(first.price, first.approval, ctx);
    return r.status === "priced" ? `From ${formatMoney(r.amount, r.currency)}${first.billing === "monthly" ? "/mo" : ""}` : "Quote on request";
  };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-8">
        <ol className="flex gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Estimate steps" data-no-print>
          {STEPS.map((label, i) => (
            <li key={label} className="min-w-[5.75rem] flex-1">
              <button type="button" onClick={() => canJump(i) && go(i)} disabled={!canJump(i)} aria-current={i === step ? "step" : undefined} className="w-full text-left disabled:cursor-not-allowed">
                <span className={cn("block h-1 rounded-full transition-colors duration-500", i <= step ? "bg-blue" : "bg-line")} />
                <span className={cn("text-label mt-3 block", i === step ? "text-text" : "text-muted")}>0{i + 1} · {label}</span>
              </button>
            </li>
          ))}
        </ol>

        <h2 ref={headingRef} tabIndex={-1} className="mt-10 scroll-mt-28 text-h3 outline-none">{HEADINGS[step]}</h2>

        <div ref={panelRef}>
          {step === 0 && (
            <fieldset className="mt-8">
              <legend className="sr-only">Select one or more services</legend>
              <p className="text-text-2">Select one or more. You can change this later.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {services.map((s) => {
                  const on = state.selected.includes(s.id);
                  return (
                    <label key={s.id} className={cn("group relative flex cursor-pointer gap-4 overflow-hidden rounded-[var(--radius-card)] border p-4 transition-[border-color,box-shadow] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue", on ? "border-ink bg-surface shadow-[0_0_0_1px_var(--ctl-ink)]" : "border-line bg-surface hover:border-line-strong")}>
                      <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleService(s.id)} />
                      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-ink"><Image src={s.art} alt="" fill sizes="80px" className="object-cover" /></span>
                      <span className="flex-1">
                        <span className="text-label text-blue">{s.index}</span>
                        <span className="mt-1 block font-semibold leading-snug">{s.name}</span>
                        <span className="mt-1 block text-xs text-muted">{fromLabel(s.id)}</span>
                      </span>
                      <span aria-hidden className={cn("mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors", on ? "border-ink bg-ink text-white" : "border-line-strong")}>{on && <Check className="h-3.5 w-3.5" />}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <div className="mt-8 flex flex-col gap-10">
              {state.selected.map((id) => {
                const svc = services.find((s) => s.id === id)!;
                const current = sel(id).package;
                return (
                  <fieldset key={id}>
                    <legend className="flex items-baseline gap-3"><span className="text-label text-blue">{svc.index}</span><span className="text-xl font-semibold tracking-tight">{svc.name}</span></legend>
                    {groupsFor(id).length > 1 && <p className="mt-1 text-sm text-muted">Includes company websites and online stores.</p>}
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {packagesFor(id).map((p) => (
                        <label key={p.id} className={cn("flex cursor-pointer flex-col gap-4 rounded-[var(--radius-card)] border p-5 transition-[border-color,box-shadow] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue", current === p.id ? "border-ink bg-surface shadow-[0_0_0_1px_var(--ctl-ink)]" : "border-line bg-surface hover:border-line-strong", !p.price && "border-dashed")}>
                          <input type="radio" className="sr-only" name={`pkg-${id}`} checked={current === p.id} onChange={() => setPackage(id, p.id)} />
                          <span className="flex items-start justify-between gap-4">
                            <span>
                              {p.group && <span className="text-label block text-muted">{p.group}</span>}
                              <span className="block text-lg font-semibold">{p.name}</span>
                              <span className="mt-1 block text-sm text-text-2">{p.description}</span>
                            </span>
                            <span aria-hidden className={cn("mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", current === p.id ? "border-ink bg-ink" : "border-line-strong")}>{current === p.id && <span className="h-2 w-2 rounded-full bg-white" />}</span>
                          </span>
                          <PriceTag book={p.price} approval={p.approval} billing={p.billing} priceType={p.priceType} size="sm" />
                          <span className="text-xs text-muted">{p.includes.slice(0, 3).join(" · ")}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="mt-8 flex flex-col gap-10">
              {state.selected.map((id) => {
                const svc = services.find((s) => s.id === id)!;
                const s = sel(id);
                const pkg = getPackage(s.package)!;
                const list = addOnsFor(id, pkg.group);
                return (
                  <section key={id} aria-labelledby={`ad-${id}`} className="rounded-[var(--radius-card)] border border-line bg-surface p-5 md:p-7">
                    <p className="text-label text-blue">{svc.index} · {pkg.name}</p>
                    <h3 id={`ad-${id}`} className="mt-2 text-xl font-semibold tracking-tight">{svc.name}</h3>
                    {list.length === 0 ? (
                      <p className="mt-4 text-text-2">No standard add-ons — anything extra is scoped in your quote.</p>
                    ) : (
                      <ul className="mt-5 divide-y divide-line border-y border-line">
                        {list.map((a) => {
                          const qty = s.addons[a.id] ?? 0;
                          const r = resolvePrice(a.price, a.approval, ctx);
                          const priceLabel = r.status === "priced" ? `${formatMoney(r.amount, r.currency)}${a.unit ? ` / ${a.unit.label}` : ""}${a.billing === "monthly" ? " /mo" : ""}` : "On request";
                          return (
                            <li key={a.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                              <span className="min-w-0">
                                <span className="block font-medium">{a.name}</span>
                                <span className="block text-sm text-muted">{a.description ? `${a.description} · ` : ""}{priceLabel}</span>
                              </span>
                              {a.unit ? (
                                <span className="flex items-center gap-2" role="group" aria-label={`${a.name} quantity`}>
                                  <button type="button" onClick={() => setAddon(id, a.id, qty - 1)} disabled={qty === 0} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong disabled:opacity-40" aria-label={`Remove one ${a.unit.label}`}><Minus className="h-4 w-4" aria-hidden /></button>
                                  <output className="w-8 text-center font-semibold tabular-nums" aria-live="polite">{qty}</output>
                                  <button type="button" onClick={() => setAddon(id, a.id, qty + 1)} disabled={qty >= a.unit.max} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong disabled:opacity-40" aria-label={`Add one ${a.unit.label}`}><Plus className="h-4 w-4" aria-hidden /></button>
                                </span>
                              ) : (
                                <label className={cn("inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-blue", qty ? "border-ink bg-ink text-white" : "border-line-strong hover:border-ink")}>
                                  <input type="checkbox" className="sr-only" checked={qty > 0} onChange={(e) => setAddon(id, a.id, e.target.checked ? 1 : 0)} aria-label={`Add ${a.name}`} />
                                  {qty ? <Check className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}{qty ? "Added" : "Add"}
                                </label>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-6 md:p-8">
              <p className="text-text-2">We suggest a country from your connection — you choose. Reference prices are in USD; other currencies are indicative conversions.</p>
              <CurrencySelector className="mt-6" />
              <p className="mt-6 text-sm text-muted">{region.taxNote} Rates: {rates.source}, {rates.asOf}.</p>
            </div>
          )}

          {step === 4 && result && (
            <div className="mt-8 flex flex-col gap-6" id="estimate-summary">
              {result.usesPendingPrices && <DraftBanner />}
              {result.outcome === "quote" ? (
                <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8">
                  <p className="text-xl font-semibold tracking-tight">This one needs a conversation.</p>
                  <p className="mt-2 text-text-2">Your selections are priced individually. Send them to us and we’ll come back with a scoped quote.</p>
                </div>
              ) : (
                <Totals r={result} />
              )}
              {result.outcome === "partial" && <p className="rounded-[var(--radius-ctl)] bg-sunk p-4 text-sm text-text-2">Some items need a custom quote and are <strong>not</strong> included in the totals above.</p>}

              {result.services.map((s) => (
                <section key={s.service} className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                  <h3 className="font-semibold">{s.name}</h3>
                  <table className="mt-4 w-full text-[0.9375rem]">
                    <caption className="sr-only">Line items for {s.name}</caption>
                    <tbody>
                      {s.lines.map((l, i) => (
                        <tr key={i} className="border-t border-line">
                          <th scope="row" className="py-3 pr-4 text-left font-normal">{l.label}{l.detail && <span className="block text-xs text-muted">{l.detail}</span>}</th>
                          <td className="py-3 text-right tabular-nums">
                            {l.quote ? <span className="text-muted">Custom quote</span> : (
                              <>{l.startingPrice ? "from " : ""}{formatMoney(l.amount!, result.currency)}<span className="block text-xs text-muted">{l.billing === "monthly" ? "per month" : "one-time"}{l.basis === "converted" ? " · converted" : ""}</span></>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 grid gap-4 text-sm text-muted sm:grid-cols-2">
                    <div><p className="font-medium text-text-2">Assumptions</p><ul className="mt-1 space-y-1">{s.assumptions.map((a) => <li key={a}>· {a}</li>)}</ul></div>
                    {s.excludes.length > 0 && <div><p className="font-medium text-text-2">Not included</p><ul className="mt-1 space-y-1">{s.excludes.map((a) => <li key={a}>· {a}</li>)}</ul></div>}
                  </div>
                </section>
              ))}

              <div className="rounded-[var(--radius-card)] border border-line p-6 text-sm text-text-2">
                <p className="font-medium text-text">About this estimate</p>
                <ul className="mt-2 space-y-1.5">
                  <li>· Package prices are starting points; your written proposal confirms scope and the final price.</li>
                  <li>· One-time and monthly costs are shown separately and never added together.</li>
                  <li>· {region.taxNote}</li>
                  {result.usesConversion && <li>· Converted from USD reference prices using {rates.source} rates ({rates.asOf}). Indicative only.</li>}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3" data-no-print>
                <Button variant="secondary" onClick={() => window.print()}><Printer className="mr-1 inline h-4 w-4" aria-hidden />Print summary</Button>
                <Button variant="secondary" onClick={share}><Link2 className="mr-1 inline h-4 w-4" aria-hidden />{copied ? "Link copied" : "Copy shareable link"}</Button>
              </div>
              <p className="text-xs text-muted" data-no-print>The shareable link contains only your selections — no personal details.</p>
            </div>
          )}

          {step === 5 && summary && (
            <div className="mt-8">
              <p className="mb-8 text-text-2">Your selected services, packages, add-ons and estimate are attached to the enquiry automatically.</p>
              <ContactForm
                variant="estimate"
                estimateSummary={summary.text}
                estimateFields={summary.fields}
                defaultCountry={region.code === "INTL" ? "" : region.name}
                messageLabel="Project summary"
                messagePlaceholder="A few lines about the project, your goals and any deadlines."
                submitLabel="Send estimate and enquiry"
                successTitle="Thanks — your estimate and enquiry have been received."
              />
            </div>
          )}
        </div>

        {error && <p role="alert" className="mt-6 text-sm text-error">{error}</p>}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6" data-no-print>
          {step > 0 ? <Button variant="secondary" onClick={() => go(step - 1)}>Back</Button> : <span />}
          {step < 3 && <Button arrow onClick={() => go(step + 1)}>Continue</Button>}
          {step === 3 && <Button arrow onClick={() => go(4)}>See my estimate</Button>}
          {step === 4 && <Button arrow onClick={() => go(5)}>{result?.outcome === "quote" ? "Request a quote" : "Send this estimate"}</Button>}
        </div>
      </div>

      <aside className="min-w-0 lg:col-span-4" aria-label="Live estimate" data-no-print>
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] rounded-[var(--radius-card)] border border-line bg-surface p-6">
          <p className="text-label text-muted">Your project</p>
          {!result ? (
            <p className="mt-4 text-text-2">Pick services and your estimate builds here as you go.</p>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {result.services.map((s) => (
                  <li key={s.service} className="flex justify-between gap-3 text-[0.9375rem]">
                    <span>
                      <span className="block font-medium">{services.find((x) => x.id === s.service)?.shortName}</span>
                      <span className="block text-xs text-muted">{s.packageName}{s.lines.length > 1 ? ` + ${s.lines.length - 1} add-on${s.lines.length > 2 ? "s" : ""}` : ""}</span>
                    </span>
                    <span className="text-right text-sm tabular-nums text-muted">
                      {s.oneTime > 0 && <span className="block">{formatMoney(s.oneTime, result.currency)}</span>}
                      {s.monthly > 0 && <span className="block">{formatMoney(s.monthly, result.currency)}/mo</span>}
                      {s.oneTime === 0 && s.monthly === 0 && "Quote"}
                    </span>
                  </li>
                ))}
              </ul>
              {result.outcome !== "quote" && <div className="mt-6"><Totals r={result} compact /></div>}
            </>
          )}
          <p className="mt-5 text-xs text-muted">Indicative only. Final pricing is confirmed in a written proposal.</p>
        </div>
      </aside>
    </div>
  );
}
