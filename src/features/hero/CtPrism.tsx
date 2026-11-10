import { forwardRef } from "react";

/**
 * The CT prism — an original abstraction of the Craft Tech Labs monogram:
 * a hexagonal C-arc, a T-bar and an L-foot as translucent planes, framed by
 * technical linework and small interface fragments. Pure SVG: crisp at any
 * size, ~4 KB, animated only via transforms/opacity.
 */
export const CtPrism = forwardRef<SVGSVGElement, { className?: string; id?: string; decorative?: boolean }>(function CtPrism({ className, id = "p", decorative = false }, ref) {
  const u = (k: string) => `${id}-${k}`;
  return (
    <svg ref={ref} viewBox="0 0 560 560" className={className} focusable="false" {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-labelledby": u("title") })}>
      {!decorative && <title id={u("title")}>Abstract Craft Tech Labs monogram built from three layered planes</title>}
      <defs>
        <linearGradient id={u("c")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d4fd8" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#1666e8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#1dd7eb" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={u("t")} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#0b1830" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#13306b" stopOpacity="0.92" />
          <stop offset="1" stopColor="#257aff" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={u("l")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#1dd7eb" stopOpacity="0.85" />
          <stop offset="1" stopColor="#62f4f2" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={u("sheen")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={u("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#1666e8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1666e8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="280" cy="290" r="250" fill={`url(#${u("glow")})`} />

      {/* Technical frame */}
      <g data-prism="frame" fill="none" stroke="#2e4464" strokeWidth="1">
        <polygon points="280,40 488,160 488,400 280,520 72,400 72,160" />
        <polygon points="280,70 462,175 462,385 280,490 98,385 98,175" strokeDasharray="2 6" stroke="#3a5a86" />
        <line x1="280" y1="10" x2="280" y2="40" />
        <line x1="280" y1="520" x2="280" y2="550" />
        <line x1="20" y1="280" x2="72" y2="280" />
        <line x1="488" y1="280" x2="540" y2="280" />
      </g>

      {/* Orbit */}
      <g data-prism="orbit" className="ct-orbit">
        <ellipse cx="280" cy="280" rx="236" ry="92" fill="none" stroke="#1dd7eb" strokeOpacity="0.35" strokeWidth="1" transform="rotate(-24 280 280)" />
        <circle cx="496" cy="186" r="4" fill="#62f4f2" />
      </g>

      {/* Shards */}
      <g data-shard="c">
        <polygon points="280,96 120,188 120,372 280,464 280,404 172,342 172,218 280,156" fill={`url(#${u("c")})`} />
        <polygon points="280,96 120,188 120,372 280,464 280,404 172,342 172,218 280,156" fill={`url(#${u("sheen")})`} />
        <polyline points="280,96 120,188 120,372" fill="none" stroke="#bff6ff" strokeOpacity="0.7" strokeWidth="1.2" />
      </g>
      <g data-shard="t">
        <polygon points="214,206 452,206 426,250 190,250" fill={`url(#${u("t")})`} />
        <polygon points="292,250 340,250 340,436 292,436" fill={`url(#${u("t")})`} />
        <polygon points="214,206 452,206 426,250 190,250" fill={`url(#${u("sheen")})`} />
        <polyline points="190,250 214,206 452,206" fill="none" stroke="#8fb8ff" strokeOpacity="0.8" strokeWidth="1.2" />
      </g>
      <g data-shard="l">
        <polygon points="360,272 404,272 404,398 470,398 444,444 360,444" fill={`url(#${u("l")})`} />
        <polyline points="360,444 360,272 404,272" fill="none" stroke="#e8feff" strokeOpacity="0.8" strokeWidth="1.2" />
      </g>

      {/* Interface fragments — one per discipline focus */}
      <g fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1.2">
        <g data-frag="browser" transform="translate(372 92)">
          <rect width="128" height="76" rx="6" fill="#0b1830" stroke="#2e4464" />
          <circle cx="10" cy="10" r="2.5" fill="#1dd7eb" /><circle cx="19" cy="10" r="2.5" fill="#2e4464" /><circle cx="28" cy="10" r="2.5" fill="#2e4464" />
          <rect x="10" y="24" width="64" height="6" rx="3" fill="#1666e8" /><rect x="10" y="36" width="96" height="4" rx="2" fill="#2e4464" />
          <rect x="10" y="46" width="80" height="4" rx="2" fill="#2e4464" /><rect x="10" y="58" width="36" height="10" rx="5" fill="#1dd7eb" />
        </g>
        <g data-frag="phone" transform="translate(452 300)">
          <rect width="56" height="104" rx="12" fill="#0b1830" stroke="#2e4464" />
          <rect x="20" y="8" width="16" height="3" rx="1.5" fill="#2e4464" />
          <circle cx="28" cy="40" r="12" fill="#1666e8" /><rect x="10" y="62" width="36" height="5" rx="2.5" fill="#2e4464" />
          <rect x="10" y="76" width="36" height="14" rx="7" fill="#1dd7eb" />
        </g>
        <g data-frag="chart" transform="translate(58 70)">
          <rect width="112" height="70" rx="6" fill="#0b1830" stroke="#2e4464" />
          <polyline points="12,54 34,40 52,46 74,24 98,30" fill="none" stroke="#1dd7eb" strokeWidth="2" />
          <text x="12" y="16" fill="#90a9c7">REACH</text>
        </g>
        <g data-frag="type" transform="translate(40 410)">
          <rect width="96" height="74" rx="6" fill="#0b1830" stroke="#2e4464" />
          <text x="12" y="48" fill="#f7faff" fontFamily="system-ui, sans-serif" fontSize="34" fontWeight="700" letterSpacing="-1">Aa</text>
          <text x="58" y="20" fill="#90a9c7">TYPE</text>
        </g>
        <g data-frag="grid" transform="translate(212 492)">
          <rect width="136" height="44" rx="6" fill="#0b1830" stroke="#2e4464" />
          <rect x="10" y="12" width="20" height="20" rx="3" fill="#1666e8" /><rect x="36" y="12" width="20" height="20" rx="3" fill="#13306b" />
          <rect x="62" y="12" width="20" height="20" rx="3" fill="#13306b" /><text x="92" y="26" fill="#1dd7eb">#1</text>
        </g>
        <g data-frag="swatch" transform="translate(18 236)">
          <rect width="44" height="88" rx="6" fill="#0b1830" stroke="#2e4464" />
          <rect x="8" y="8" width="28" height="16" rx="3" fill="#1666e8" /><rect x="8" y="28" width="28" height="16" rx="3" fill="#1dd7eb" />
          <rect x="8" y="48" width="28" height="16" rx="3" fill="#f7faff" /><rect x="8" y="68" width="28" height="12" rx="3" fill="#07101e" stroke="#2e4464" />
        </g>
      </g>
    </svg>
  );
});
