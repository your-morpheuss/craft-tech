import { NextResponse } from "next/server";

/**
 * Country hint from the hosting edge (Vercel / Cloudflare / custom proxy).
 * Returns only an ISO country code — no IP, no precise location — and is
 * treated by the UI as a suggestion the visitor can change.
 */
export function GET(request: Request) {
  const h = request.headers;
  const raw = h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry") ?? h.get("x-country-code");
  const country = raw && /^[A-Za-z]{2}$/.test(raw) && raw.toUpperCase() !== "XX" ? raw.toUpperCase() : null;
  return NextResponse.json({ country }, { headers: { "Cache-Control": "private, no-store" } });
}
