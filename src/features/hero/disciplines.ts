/**
 * The signature brand interaction: six disciplines, each a different
 * arrangement of the three shards of the CT monogram (C-arc, T-bar, L-foot).
 * Transforms are in SVG user units of the 560×560 prism viewBox.
 */
export type Shard = { x: number; y: number; r: number; s: number; o?: number };
export type Discipline = {
  id: string;
  label: string;
  index: string;
  line: string;
  href: string;
  service: string;
  shards: { c: Shard; t: Shard; l: Shard };
  /** Which interface fragment is highlighted. */
  focus: "browser" | "phone" | "chart" | "type" | "grid" | "swatch";
  coord: string;
};

export const DISCIPLINES: Discipline[] = [
  {
    id: "build", label: "Build", index: "01", service: "Website Development", href: "/services/website-development",
    line: "Fast, editable websites that explain what you do and turn visits into enquiries.",
    shards: { c: { x: 0, y: 0, r: 0, s: 1 }, t: { x: 0, y: 0, r: 0, s: 1 }, l: { x: 0, y: 0, r: 0, s: 1 } },
    focus: "browser", coord: "X 000 · Y 000 · ASSEMBLED",
  },
  {
    id: "design", label: "Design", index: "02", service: "Brand Identity", href: "/services/brand-identity",
    line: "Marks, type and colour systems that make a business recognisable at a glance.",
    shards: { c: { x: -46, y: -8, r: -6, s: 1 }, t: { x: 24, y: -52, r: 4, s: 1.04 }, l: { x: 52, y: 40, r: 8, s: 0.96 } },
    focus: "type", coord: "X −046 · Y −052 · EXPLODED",
  },
  {
    id: "develop", label: "Develop", index: "03", service: "Mobile Application Development", href: "/services/mobile-app-development",
    line: "Android and iOS apps built around the few workflows your users repeat every day.",
    shards: { c: { x: -18, y: 26, r: 0, s: 0.94 }, t: { x: 0, y: -18, r: 0, s: 1 }, l: { x: 18, y: 8, r: 0, s: 1.02, o: 0.95 } },
    focus: "phone", coord: "Z +003 · LAYERED · STACK",
  },
  {
    id: "market", label: "Market", index: "04", service: "Social Media Management & Marketing", href: "/services/social-media-marketing",
    line: "Planned content and campaigns that keep your brand present, consistent and measured.",
    shards: { c: { x: -26, y: 0, r: -18, s: 1.02 }, t: { x: 30, y: -24, r: 14, s: 0.98 }, l: { x: 14, y: 34, r: -10, s: 1.04 } },
    focus: "chart", coord: "R 018° · BROADCAST",
  },
  {
    id: "optimize", label: "Optimize", index: "05", service: "SEO Services", href: "/services/seo",
    line: "Technical fixes, page structure and content planned around what people actually search.",
    shards: { c: { x: 12, y: 0, r: 0, s: 0.88 }, t: { x: 0, y: 10, r: 0, s: 0.92 }, l: { x: -12, y: -6, r: 0, s: 0.9 } },
    focus: "grid", coord: "GRID 08 · SNAPPED",
  },
  {
    id: "create", label: "Create", index: "06", service: "Graphic Design", href: "/services/graphic-design",
    line: "Campaign, social and print design applied consistently, week after week.",
    shards: { c: { x: -30, y: 30, r: 12, s: 1 }, t: { x: 40, y: -10, r: -22, s: 1.06 }, l: { x: -6, y: -40, r: 26, s: 0.94 } },
    focus: "swatch", coord: "R −022° · COMPOSED",
  },
];
