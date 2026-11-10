import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/services", "/services/seo", "/about", "/pricing", "/estimate", "/work/retail-pos", "/products/retail-pos", "/contact", "/start-a-project", "/insights/choosing-a-pos-for-a-small-retail-shop", "/this-does-not-exist"];

for (const route of ROUTES) {
  test(`axe: no serious or critical violations on ${route}`, async ({ browser }) => {
    // Reduced motion so every element is at its final, visible state while scanning.
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(route);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const serious = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    const summary = serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    expect(summary, summary.join("\n")).toEqual([]);
    await ctx.close();
  });
}
