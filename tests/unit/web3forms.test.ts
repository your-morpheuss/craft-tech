import { afterEach, describe, expect, it, vi } from "vitest";

const KEY = "11111111-2222-4333-8444-555555555555";

async function load(key: string | undefined) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY", key ?? "");
  return import("@/lib/web3forms");
}
const json = (status: number, body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } }));

afterEach(() => vi.unstubAllEnvs());

describe("submitToWeb3Forms", () => {
  it("refuses to send without an access key (honest config state)", async () => {
    const m = await load(undefined);
    const f = vi.fn();
    const r = await m.submitToWeb3Forms({ name: "A" }, f);
    expect(r).toMatchObject({ ok: false, kind: "config" });
    expect(f).not.toHaveBeenCalled();
  });

  it("posts JSON with the access key and accepts only success:true", async () => {
    const m = await load(KEY);
    const f = json(200, { success: true, body: { message: "Email sent successfully!" } });
    const r = await m.submitToWeb3Forms({ name: "Ada", email: "a@b.co", empty: "" }, f);
    expect(r).toEqual({ ok: true });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.web3forms.com/submit");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({ access_key: KEY, name: "Ada", email: "a@b.co" });
    expect(body).not.toHaveProperty("empty");
  });

  it("treats HTTP 200 with success:false as a rejection", async () => {
    const m = await load(KEY);
    const r = await m.submitToWeb3Forms({}, json(200, { success: false, body: { message: "Invalid access key" } }));
    expect(r).toMatchObject({ ok: false, kind: "rejected" });
    if (!r.ok) expect(r.message).toContain("Invalid access key");
  });

  it("reports API validation errors (400)", async () => {
    const m = await load(KEY);
    expect(await m.submitToWeb3Forms({}, json(400, { success: false, body: { message: "Email is required" } }))).toMatchObject({ ok: false, kind: "rejected" });
  });

  it("reports rate limiting (429)", async () => {
    const m = await load(KEY);
    expect(await m.submitToWeb3Forms({}, json(429, { success: false, message: "Too may requests. Please try later!" }))).toMatchObject({ ok: false, kind: "rate-limit" });
  });

  it("reports server errors (500) and non-JSON bodies", async () => {
    const m = await load(KEY);
    const f = vi.fn(async () => new Response("oops", { status: 500 }));
    expect(await m.submitToWeb3Forms({}, f)).toMatchObject({ ok: false, kind: "server" });
  });

  it("reports network failures without throwing", async () => {
    const m = await load(KEY);
    const f = vi.fn(async () => { throw new TypeError("Failed to fetch"); });
    expect(await m.submitToWeb3Forms({}, f)).toMatchObject({ ok: false, kind: "network" });
  });
});
