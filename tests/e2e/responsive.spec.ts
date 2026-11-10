import { expect, test } from "@playwright/test";

const ROUTES = [
  "/", "/services", "/services/website-development", "/services/mobile-app-development", "/services/social-media-marketing",
  "/services/seo", "/services/brand-identity", "/services/graphic-design", "/about", "/pricing", "/estimate", "/work",
  "/work/retail-pos", "/products", "/products/retail-pos", "/contact", "/start-a-project", "/insights",
  "/insights/what-to-prepare-before-a-website-project", "/privacy-policy", "/terms-and-conditions", "/offline",
];
const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920];

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    test.setTimeout(240_000);
    await page.setViewportSize({ width, height: 900 });
    const failures: string[] = [];
    for (const route of ROUTES) {
      await page.goto(route, { waitUntil: "load" });
      const overflow = await page.evaluate(() => {
        const W = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth <= W) return null;
        const el = [...document.querySelectorAll<HTMLElement>("body *")].reverse().find((e) => {
          const r = e.getBoundingClientRect();
          return r.right > W + 1 && r.width > 0 && getComputedStyle(e).position !== "fixed";
        });
        return `${document.documentElement.scrollWidth}px (${el?.tagName}.${String(el?.className).slice(0, 80)})`;
      });
      if (overflow) failures.push(`${route}: ${overflow}`);
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });
}

test("every page has exactly one h1 and a main landmark", async ({ page }) => {
  test.setTimeout(180_000);
  for (const route of ROUTES) {
    await page.goto(route);
    await expect(page.locator("h1"), route).toHaveCount(1);
    await expect(page.locator("main#main"), route).toHaveCount(1);
  }
});

test("reduced motion: all content visible without animation", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const route of ["/", "/products/retail-pos", "/services/seo"]) {
    await page.goto(route);
    const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length);
    expect(hidden, route).toBe(0);
    expect(await page.evaluate(() => document.documentElement.classList.contains("js-motion"))).toBe(false);
  }
  await ctx.close();
});

test("motion: reveal targets become visible after scrolling", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(1500);
  const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length);
  expect(hidden).toBe(0);
});
