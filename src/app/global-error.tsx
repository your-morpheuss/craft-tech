"use client";

/** Last-resort boundary: renders its own document, so it uses inline styles only. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#07101e", color: "#f3f7ff", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ padding: 24, maxWidth: 560 }}>
          <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1dd7eb" }}>Craft Tech Labs</p>
          <h1 style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "16px 0" }}>The site hit an unexpected error.</h1>
          <p style={{ color: "#b7c6dc", lineHeight: 1.6 }}>Please try again. If the problem continues, email info@crafttech-labs.com.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <button onClick={reset} style={{ height: 48, padding: "0 22px", borderRadius: 999, border: 0, background: "#fff", color: "#07101e", fontWeight: 600, cursor: "pointer" }}>Try again</button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- the root layout isn't available here */}
            <a href="/" style={{ height: 48, padding: "0 22px", borderRadius: 999, border: "1px solid rgba(255,255,255,.3)", color: "#fff", display: "inline-flex", alignItems: "center", textDecoration: "none" }}>Home</a>
          </div>
        </main>
      </body>
    </html>
  );
}
