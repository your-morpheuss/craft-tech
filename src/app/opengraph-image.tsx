import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#07101e",
          backgroundImage:
            "radial-gradient(60% 70% at 85% 20%, rgba(22,102,232,0.55), transparent 70%), linear-gradient(rgba(46,68,100,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(46,68,100,0.35) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 64px 64px, 64px 64px",
          color: "#f3f7ff",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#1dd7eb", textTransform: "uppercase" }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 700, lineHeight: 1, letterSpacing: -3 }}>
          <span>Built to stand out.</span>
          <span style={{ color: "#62f4f2" }}>Engineered to move forward.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#b7c6dc" }}>
          <span>Websites · Apps · SEO · Social · Brand · Design</span>
          <span>crafttech-labs.com</span>
        </div>
      </div>
    ),
    size,
  );
}
