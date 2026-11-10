import { expect, test, type Page } from "@playwright/test";

const isMobile = (w: number | undefined) => (w ?? 1440) < 1024;
const ALERT = "[role=alert]:not(#__next-route-announcer__)";

/** Intercept Web3Forms — E2E never sends real email. Returns the captured request bodies. */
async function mockWeb3Forms(page: Page, reply: { status: number; body: unknown } = { status: 200, body: { success: true, body: { message: "Email sent successfully!" } } }) {
  const bodies: Record<string, unknown>[] = [];
  await page.route("https://api.web3forms.com/submit", async (route) => {
    bodies.push(JSON.parse(route.request().postData() ?? "{}"));
    await new Promise((r) => setTimeout(r, 300));
    await route.fulfill({ status: reply.status, contentType: "application/json", body: JSON.stringify(reply.body) });
  });
  return bodies;
}

test("home: hero headline, CTAs and the discipline interaction", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Crafted");
  await expect(page.getByRole("link", { name: "Explore Our Work" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start a Project" }).first()).toBeVisible();
  const group = page.getByRole("radiogroup", { name: "Explore our disciplines" });
  await group.getByRole("radio", { name: /Optimize/ }).click();
  await expect(group.getByRole("radio", { name: /Optimize/ })).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("link", { name: "SEO Services" }).first()).toBeVisible();
});

test("desktop navigation: services mega menu is keyboard operable", async ({ page, viewport }) => {
  test.skip(isMobile(viewport?.width), "desktop only");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Services" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: /SEO Services/ }).first()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.mouse.click(10, 600);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("mobile navigation: opens, locks scroll, navigates, closes", async ({ page, viewport }) => {
  test.skip(!isMobile(viewport?.width), "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
  await dialog.getByRole("button", { name: "Services" }).click();
  await dialog.getByRole("link", { name: /Brand Identity/ }).click();
  await expect(page).toHaveURL(/\/services\/brand-identity$/);
  await expect(dialog).toBeHidden();
});

test("every nav and footer link resolves (no dead links)", async ({ page, request }) => {
  await page.goto("/about");
  const hrefs = await page.$$eval("header a[href^='/'], footer a[href^='/']", (as) => Array.from(new Set(as.map((a) => a.getAttribute("href")!))));
  for (const h of hrefs) {
    const res = await request.get(h.split("#")[0]);
    expect(res.status(), h).toBe(200);
  }
});

test("pricing: reference packages, tabs, currency conversion and persistence", async ({ page }) => {
  await page.goto("/pricing?service=seo");
  await expect(page.getByRole("tab", { name: /SEO/ })).toHaveAttribute("aria-selected", "true");
  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("USD 299");
  await page.getByLabel("Country", { exact: true }).first().selectOption("PK");
  await expect(panel).toContainText("PKR");
  await expect(panel).toContainText("Indicative conversion from USD");
  await page.getByLabel("Currency", { exact: true }).first().selectOption("GBP");
  await expect(panel).toContainText("GBP");
  await page.getByRole("tab", { name: /Mobile Apps/ }).click();
  await expect(panel).toContainText("MVP");
  await page.getByRole("tab", { name: /Graphic Design/ }).click();
  await expect(panel).toContainText("Custom quote");
  await page.goto("/services/seo");
  await expect(page.locator("#pricing")).toContainText("GBP");
});

test("estimator: service → package → add-ons → region → estimate → Web3Forms enquiry", async ({ page }) => {
  const sent = await mockWeb3Forms(page);
  await page.goto("/estimate");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.locator(ALERT)).toContainText("Choose at least one service");
  await page.locator("label", { hasText: "Website Development" }).click();
  await page.locator("label", { hasText: "SEO Services" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("label", { hasText: "A complete company website" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator("label", { has: page.getByRole("checkbox", { name: "Add Multilingual setup" }) }).click();
  await expect(page.getByRole("checkbox", { name: "Add Multilingual setup" })).toBeChecked();
  await page.getByRole("button", { name: "Add one page" }).click();
  await page.getByRole("button", { name: "Add one page" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Country", { exact: true }).selectOption("US");
  await page.getByRole("button", { name: "See my estimate" }).click();
  const summary = page.locator("#estimate-summary");
  // Professional 1,499 + multilingual 400 + 2 × 60 pages = 2,019 one-time; SEO Starter 299/mo
  await expect(summary).toContainText("USD 2,019");
  await expect(summary).toContainText("USD 299");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByLabel("Country", { exact: true })).toHaveValue("US");
  await page.getByRole("button", { name: "See my estimate" }).click();
  await page.getByRole("button", { name: "Send this estimate" }).click();
  await page.getByLabel("Full name", { exact: true }).fill("Playwright Test");
  await page.getByLabel("Email", { exact: true }).fill("qa@example.com");
  await page.getByLabel("Country", { exact: true }).fill("United States");
  await page.getByLabel("Project summary").fill("Automated end-to-end test of the estimator enquiry.");
  await page.getByRole("checkbox", { name: /I agree/ }).check();
  await page.getByRole("button", { name: "Send estimate and enquiry" }).dblclick();
  await expect(page.getByRole("status")).toContainText("estimate and enquiry have been received");
  expect(sent).toHaveLength(1);
  expect(sent[0]).toMatchObject({ estimate_one_time: "from USD 2,019", estimate_currency: "USD", email: "qa@example.com", replyto: "qa@example.com" });
  expect(String(sent[0].message)).toContain("Multilingual setup");
});

test("contact form: client validation blocks invalid input, nothing is sent", async ({ page }) => {
  const sent = await mockWeb3Forms(page);
  await page.goto("/contact");
  await page.getByLabel("Full name", { exact: true }).fill("A");
  await page.getByLabel("Email", { exact: true }).fill("not-an-email");
  await page.getByLabel("How can we help?").fill("short");
  await page.getByRole("checkbox", { name: /I agree/ }).check();
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(ALERT)).toContainText("Please check the highlighted fields");
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Please choose what you’re interested in.")).toBeVisible();
  expect(sent).toHaveLength(0);
});

test("contact form: Web3Forms success:false is shown as an error, not success", async ({ page }) => {
  await mockWeb3Forms(page, { status: 200, body: { success: false, body: { message: "Invalid access key" } } });
  await page.goto("/contact");
  await page.getByLabel("Full name", { exact: true }).fill("Real Person");
  await page.getByLabel("Email", { exact: true }).fill("person@example.com");
  await page.getByLabel("Service interest").selectOption({ label: "SEO Services" });
  await page.getByLabel("How can we help?").fill("We would like an SEO audit for our site.");
  await page.getByRole("checkbox", { name: /I agree/ }).check();
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(ALERT)).toContainText("Invalid access key");
  await expect(page.getByText("Thanks for reaching out.")).toHaveCount(0);
});

test("demo request: required business fields and successful submission", async ({ page }) => {
  const sent = await mockWeb3Forms(page);
  await page.goto("/products/retail-pos#demo");
  await page.getByLabel("Full name", { exact: true }).fill("Shop Owner");
  await page.getByLabel("Email", { exact: true }).fill("owner@example.com");
  await page.getByLabel("Brief business requirements").fill("Two counters, general store, need barcode scanning.");
  await page.getByRole("checkbox", { name: /I agree/ }).check();
  await page.getByRole("button", { name: "Request a demo" }).click();
  await expect(page.getByText("Please enter your business name.")).toBeVisible();
  await page.getByLabel("Business name").fill("Smart Store");
  await page.getByLabel("Country", { exact: true }).fill("Pakistan");
  await page.getByRole("button", { name: "Request a demo" }).click();
  await expect(page.getByRole("status")).toContainText("demo request has been received");
  expect(sent[0]).toMatchObject({ product: "Retail POS", business_name: "Smart Store", country: "Pakistan" });
});

test("project brief: multi-step validation, preselected service, submission", async ({ page }) => {
  const sent = await mockWeb3Forms(page);
  await page.goto("/start-a-project?service=seo");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await page.getByLabel("Full name", { exact: true }).fill("Brief Tester");
  await page.getByLabel("Work email").fill("brief@example.com");
  await page.getByLabel("Country", { exact: true }).fill("UAE");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("checkbox", { name: "SEO" })).toBeChecked();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Please choose a budget range.")).toBeVisible();
  await page.getByLabel("Project description").fill("We need a technical SEO audit for our online store.");
  await page.getByLabel("Estimated timeline").selectOption({ index: 2 });
  await page.getByLabel("Budget range").selectOption({ index: 2 });
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Brief Tester")).toBeVisible();
  await page.getByRole("checkbox", { name: /I agree/ }).check();
  await page.getByRole("button", { name: "Send project brief" }).click();
  await expect(page.getByRole("status")).toContainText("project brief has been received");
  expect(sent[0]).toMatchObject({ country: "UAE", services_required: "SEO Services" });
});

test("chat assistant: opens, answers from site content, shows mode disclosure", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("button", { name: /Ask Craft Tech Labs/ }).click();
  const dialog = page.getByRole("dialog", { name: "Craft Tech Labs assistant" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/assistant/i);
  await dialog.getByRole("button", { name: "Does Retail POS work without internet?" }).click();
  await expect(dialog.getByRole("link", { name: /Retail POS/ }).first()).toBeVisible({ timeout: 20_000 });
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("legacy WordPress URLs redirect permanently in one hop", async ({ request }) => {
  const map: Record<string, string> = {
    "/about-us/": "/about", "/contact-us/": "/contact", "/blogs/": "/insights",
    "/seo-services/": "/services/seo", "/hello-world/": "/services/graphic-design",
    "/category/uncategorized/": "/insights", "/elementor-hf/header/": "/",
  };
  for (const [from, to] of Object.entries(map)) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(308);
    expect(new URL(res.headers().location, "http://x").pathname, from).toBe(to);
  }
});

test("404 page is branded and links home", async ({ page }) => {
  const res = await page.goto("/this-does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("moved on");
  await expect(page.getByRole("link", { name: "Back to Home" })).toBeVisible();
});

test("SEO: metadata, canonical, sitemap and robots", async ({ page, request }) => {
  await page.goto("/services/seo");
  await expect(page).toHaveTitle(/SEO Services/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/services\/seo$/);
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join(" ")).toContain('"@type":"Service"');
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/products/retail-pos");
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
});

test("offline: previously visited page is served from cache", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.goto("/about");
  await page.reload();
  await context.setOffline(true);
  await page.goto("/about");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Designers and");
  await page.goto("/insights");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/offline|page isn’t saved/i);
  await context.setOffline(false);
});
