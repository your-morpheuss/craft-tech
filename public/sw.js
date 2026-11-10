/* Craft Tech Labs service worker — marketing-site offline strategy.
 *  - Versioned static assets (/_next/static, /assets): cache-first.
 *  - Page navigations: network-first, cached copy as fallback, then /offline.
 *  - Optimised images: stale-while-revalidate (bounded).
 *  - /api/*, non-GET, RSC/prefetch requests and cross-origin: never cached.
 * Bump VERSION to invalidate all caches on deploy if the strategy changes.
 */
const VERSION = "ctl-v1";
const STATIC = `${VERSION}-static`;
const PAGES = `${VERSION}-pages`;
const IMAGES = `${VERSION}-images`;
const PRECACHE = ["/offline", "/assets/brand/favicon-192.png", "/assets/brand/craft-tech-labs-horizontal-tight.webp"];
const MAX_PAGES = 40;
const MAX_IMAGES = 60;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;
  if (req.headers.get("RSC") || req.headers.get("Next-Router-Prefetch") || url.searchParams.has("_rsc")) return;

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(STATIC).then((c) => c.put(req, copy)); }
        return res;
      })),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/image") || url.pathname.startsWith("/images/")) {
    event.respondWith(
      caches.open(IMAGES).then(async (cache) => {
        const hit = await cache.match(req);
        const network = fetch(req).then((res) => {
          if (res.ok) { cache.put(req, res.clone()); trim(IMAGES, MAX_IMAGES); }
          return res;
        }).catch(() => hit);
        return hit || network;
      }),
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok && res.headers.get("content-type")?.includes("text/html")) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy)).then(() => trim(PAGES, MAX_PAGES));
          }
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match("/offline")) || Response.error()),
    );
  }
});
