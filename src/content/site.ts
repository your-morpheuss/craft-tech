/**
 * Global company information — the single source of truth.
 * Only verified facts live here. See docs/brand-and-content-audit.md.
 */
export const site = {
  name: "Craft Tech Labs",
  shortName: "CTL",
  tagline: "Crafting Solutions. Powering Futures.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://crafttech-labs.com").replace(/\/$/, ""),
  description:
    "Craft Tech Labs is a digital and technology studio in Karachi designing websites, mobile apps, brand identities and marketing — and building its own software, starting with Retail POS.",
  positioning:
    "An independent design and technology studio. We build for clients, and we build our own products.",
  email: "info@crafttech-labs.com",
  /** Phone intentionally empty until a real number is supplied. */
  phone: null as string | null,
  location: { city: "Karachi", country: "Pakistan", countryCode: "PK" },
  social: [
    { label: "Instagram", href: "https://www.instagram.com/crafttech_labs/", handle: "@crafttech_labs" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/craft-tech-labs/", handle: "Craft Tech Labs" },
  ],
  logo: {
    horizontal: "/assets/brand/craft-tech-labs-horizontal-tight.webp",
    stacked: "/assets/brand/craft-tech-labs-stacked-tight.webp",
    mark: "/assets/brand/brand-mark-metallic.webp",
    markFlat: "/assets/brand/brand-mark-flat.svg",
    markWhite: "/assets/brand/brand-mark-white.svg",
  },
} as const;

export type Site = typeof site;
