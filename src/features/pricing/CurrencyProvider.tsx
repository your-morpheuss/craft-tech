"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { DEFAULT_REGION, FALLBACK_RATES, regionFor } from "./regions";
import { SITE_PRICING_MODE, type PricingContext } from "./engine";
import { CURRENCIES, type CurrencyCode, type RateTable, type Region } from "./types";

type Source = "default" | "saved" | "suggested" | "manual";

type CurrencyState = {
  region: Region;
  currency: CurrencyCode;
  source: Source;
  rates: RateTable;
  ctx: PricingContext;
  setRegion: (code: string) => void;
  setCurrency: (c: CurrencyCode) => void;
};

const STORAGE_KEY = "ctl-region";
const CHANGE_EVENT = "ctl-region-change";
const Ctx = createContext<CurrencyState | null>(null);

/* ── Saved preference as an external store (localStorage) ─────────────── */
function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && cb();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, cb);
  };
}
function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
function parse(raw: string | null): { region: Region; currency: CurrencyCode } | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as { region?: unknown; currency?: unknown };
    if (typeof v.region !== "string") return null;
    const region = regionFor(v.region);
    const currency = CURRENCIES.find((c) => c === v.currency) ?? region.currency;
    return { region, currency };
  } catch {
    return null;
  }
}
function save(region: string, currency: CurrencyCode) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ region, currency }));
  } catch {
    /* storage unavailable — falls back to in-memory below */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/**
 * Server and first client render are always the default region (USD), so
 * hydration is deterministic. Afterwards: saved preference → geo suggestion.
 * Geo is a hint from the hosting edge (country only), never precise location.
 */
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const savedRaw = useSyncExternalStore(subscribe, readRaw, () => null);
  const saved = useMemo(() => parse(savedRaw), [savedRaw]);
  const [memory, setMemory] = useState<{ region: Region; currency: CurrencyCode } | null>(null);
  const [suggested, setSuggested] = useState<Region | null>(null);
  const [rates, setRates] = useState<RateTable>(FALLBACK_RATES);

  useEffect(() => {
    let cancelled = false;
    if (!readRaw()) {
      fetch("/api/geo", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { country?: string | null } | null) => {
          if (!cancelled && d?.country) setSuggested(regionFor(d.country));
        })
        .catch(() => undefined);
    }
    fetch("/api/rates")
      .then((r) => (r.ok ? r.json() : null))
      .then((t: RateTable | null) => {
        if (!cancelled && t?.rates) setRates(t);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const chosen = memory ?? saved;
  const region = chosen?.region ?? suggested ?? DEFAULT_REGION;
  const currency = chosen?.currency ?? region.currency;
  const source: Source = memory ? "manual" : saved ? "saved" : suggested ? "suggested" : "default";

  const setRegion = useCallback((code: string) => {
    const r = regionFor(code);
    setMemory({ region: r, currency: r.currency });
    save(r.code, r.currency);
  }, []);

  const setCurrency = useCallback(
    (c: CurrencyCode) => {
      setMemory({ region, currency: c });
      save(region.code, c);
    },
    [region],
  );

  const value = useMemo<CurrencyState>(
    () => ({ region, currency, source, rates, ctx: { currency, rates, mode: SITE_PRICING_MODE }, setRegion, setCurrency }),
    [region, currency, source, rates, setRegion, setCurrency],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCurrency must be used inside <CurrencyProvider>");
  return v;
}

/** Apply region + currency together (e.g. from a shared estimate link). */
export function applyPreference(region: string, currency: CurrencyCode) {
  save(region, currency);
}
