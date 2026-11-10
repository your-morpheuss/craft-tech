import { describe, expect, it } from "vitest";
import { ADDONS, PACKAGES, addOnsFor, getPackage, packagesFor } from "@/features/pricing/catalog";
import { defaultContext, formatMoney, resolvePrice, roundForCurrency } from "@/features/pricing/engine";
import { FALLBACK_RATES, regionFor } from "@/features/pricing/regions";
import { computeEstimate, estimateInputSchema, sanitizeSelection } from "@/features/estimator/compute";
import { SERVICE_IDS } from "@/features/pricing/types";

const preview = (c: Parameters<typeof defaultContext>[0]) => defaultContext(c, "draft-preview");
const live = (c: Parameters<typeof defaultContext>[0]) => defaultContext(c, "approved-only");

describe("reference catalogue (WebMinds Studio, captured 2026-11-10)", () => {
  it("keeps the published USD numbers unchanged", () => {
    const usd = (id: string) => getPackage(id)?.price?.USD;
    expect([usd("web-starter"), usd("web-professional"), usd("web-premium")]).toEqual([499, 1499, 3999]);
    expect([usd("store-starter"), usd("store-growth"), usd("store-professional")]).toEqual([799, 1999, 4499]);
    expect([usd("app-mvp"), usd("app-business"), usd("app-advanced")]).toEqual([2999, 6999, 13999]);
    expect([usd("smm-starter"), usd("smm-growth"), usd("smm-professional")]).toEqual([249, 499, 999]);
    expect([usd("seo-starter"), usd("seo-growth"), usd("seo-professional")]).toEqual([299, 599, 1199]);
    expect([usd("brand-starter"), usd("brand-professional"), usd("brand-premium")]).toEqual([50, 199, 499]);
  });
  it("marks every imported price as pending approval and cites the source", () => {
    for (const p of PACKAGES.filter((x) => x.price)) {
      expect(p.approval, p.id).toBe("pending");
      expect(p.source?.url, p.id).toContain("webminds-studio.com");
    }
    for (const a of ADDONS) expect(a.approval, a.id).toBe("pending");
  });
  it("keeps monthly services monthly and builds one-time", () => {
    for (const p of packagesFor("seo")) expect(p.billing).toBe("monthly");
    for (const p of packagesFor("social-media-marketing")) expect(p.billing).toBe("monthly");
    for (const p of packagesFor("website-development")) expect(p.billing).toBe("one-time");
  });
  it("has no invented prices for Graphic Design (custom quote only)", () => {
    for (const p of packagesFor("graphic-design")) expect(p.price).toBeNull();
    expect(addOnsFor("graphic-design")).toHaveLength(0);
  });
  it("ids are unique and every service has packages", () => {
    const ids = [...PACKAGES.map((p) => p.id), ...ADDONS.map((a) => a.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SERVICE_IDS) expect(packagesFor(s).length).toBeGreaterThan(0);
  });
});

describe("resolvePrice", () => {
  const starter = getPackage("web-starter")!;
  it("hides pending prices in approved-only mode", () => {
    expect(resolvePrice(starter.price, "pending", live("USD"))).toEqual({ status: "quote", reason: "not-approved" });
  });
  it("shows the USD reference in USD", () => {
    expect(resolvePrice(starter.price, "pending", preview("USD"))).toMatchObject({ status: "priced", amount: 499 });
  });
  it("converts other currencies and labels them converted", () => {
    expect(resolvePrice(starter.price, "pending", preview("PKR"))).toMatchObject({ basis: "converted", amount: roundForCurrency(499 * FALLBACK_RATES.rates.PKR, "PKR") });
    expect(resolvePrice({ USD: 39 }, "pending", preview("GBP"))).toMatchObject({ amount: Math.round(39 * FALLBACK_RATES.rates.GBP) });
  });
  it("uses an explicit regional price when one is approved", () => {
    expect(resolvePrice({ USD: 100, PKR: 25000 }, "approved", live("PKR"))).toMatchObject({ amount: 25000, basis: "regional" });
  });
  it("quotes when a rate is missing or the scope is custom", () => {
    const ctx = { ...preview("AED"), rates: { ...FALLBACK_RATES, rates: { ...FALLBACK_RATES.rates, AED: 0 } } };
    expect(resolvePrice({ USD: 100 }, "approved", ctx)).toEqual({ status: "quote", reason: "no-rate" });
    expect(resolvePrice(null, "approved", preview("USD"))).toEqual({ status: "quote", reason: "custom-scope" });
  });
});

describe("regions", () => {
  it("maps countries and falls back to international USD", () => {
    expect(regionFor("pk").currency).toBe("PKR");
    expect(regionFor("DE").currency).toBe("EUR");
    expect(regionFor("ZZ")).toMatchObject({ code: "INTL", currency: "USD" });
  });
});

describe("computeEstimate", () => {
  it("sums package + add-ons and keeps one-time and monthly separate (mirrors reference estimator)", () => {
    const r = computeEstimate({
      region: "US", currency: "USD", services: ["website-development", "seo"],
      selections: {
        "website-development": { package: "web-starter", addons: { "web-cms": 1, "web-extra-page": 3, "web-maintenance": 1 } },
        seo: { package: "seo-starter", addons: {} },
      },
    }, preview("USD"));
    expect(r.oneTime).toBe(499 + 350 + 3 * 60);
    expect(r.monthly).toBe(120 + 299);
    expect(r.startingPrice).toBe(true);
    expect(r.outcome).toBe("estimate");
  });
  it("reference scenario: six starter packages = USD 4,347 one-time + 548/mo as published", () => {
    // Website Starter, Mobile MVP, Logo Starter, SEO Starter, SMM Starter, E-commerce Starter.
    const one = computeEstimate({ region: "US", currency: "USD", services: ["website-development", "mobile-app-development", "brand-identity", "seo", "social-media-marketing"], selections: { "website-development": { package: "web-starter", addons: {} } } }, preview("USD"));
    const store = computeEstimate({ region: "US", currency: "USD", services: ["website-development"], selections: { "website-development": { package: "store-starter", addons: {} } } }, preview("USD"));
    expect(one.oneTime + store.oneTime).toBe(4347);
    expect(one.monthly).toBe(548);
  });
  it("graphic design yields a quote outcome without inventing a number", () => {
    const r = computeEstimate({ region: "US", currency: "USD", services: ["graphic-design"], selections: {} }, preview("USD"));
    expect(r.outcome).toBe("quote");
    expect(r.oneTime + r.monthly).toBe(0);
  });
  it("partial when a priced service is combined with a custom quote package", () => {
    const r = computeEstimate({ region: "US", currency: "USD", services: ["seo"], selections: { seo: { package: "seo-enterprise", addons: { "seo-content": 1 } } } }, preview("USD"));
    expect(r.outcome).toBe("partial");
    expect(r.monthly).toBe(240);
  });
  it("in approved-only mode, pending prices become quotes", () => {
    const r = computeEstimate({ region: "PK", currency: "PKR", services: ["seo"], selections: {} }, live("PKR"));
    expect(r.outcome).toBe("quote");
  });
  it("sanitises foreign packages, foreign add-ons and quantities", () => {
    const s = sanitizeSelection("website-development", { package: "app-mvp", addons: { "app-push": 1, "web-extra-page": 999, "store-catalogue": 2 } });
    expect(s.package).toBe("web-starter");
    expect(s.addons).toEqual({ "web-extra-page": 40 });
    const store = sanitizeSelection("website-development", { package: "store-growth", addons: { "store-catalogue": 2, "web-cms": 1 } });
    expect(store.addons).toEqual({ "store-catalogue": 2 });
  });
  it("schema rejects unknown services and currencies", () => {
    expect(estimateInputSchema.safeParse({ services: ["x"], region: "PK", currency: "PKR" }).success).toBe(false);
    expect(estimateInputSchema.safeParse({ services: ["seo"], region: "PK", currency: "BTC" }).success).toBe(false);
    expect(estimateInputSchema.safeParse({ services: ["seo"], region: "PK", currency: "PKR" }).success).toBe(true);
  });
});

describe("formatMoney", () => {
  it("formats with ISO code and no decimals", () => {
    expect(formatMoney(1499, "USD")).toMatch(/USD\s?1,499/);
  });
});
