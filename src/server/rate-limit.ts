import "server-only";

/**
 * Fixed-window in-memory rate limiter. Adequate for a single server instance.
 * On serverless / multi-instance hosting, replace the Map with a shared store
 * (e.g. Redis/Upstash) — see docs/deployment.md.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  b.count++;
  return b.count > limit ? { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) } : { ok: true, retryAfter: 0 };
}

/** Best-effort client key; never logged or stored. */
export function clientKey(request: Request, scope: string) {
  const h = request.headers;
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "anon";
  return `${scope}:${ip}`;
}
