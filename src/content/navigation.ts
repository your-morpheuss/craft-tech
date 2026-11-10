import { services } from "./services";
import { products } from "./products";

export type NavLink = { label: string; href: string; description?: string; index?: string };

export const serviceLinks: NavLink[] = services.map((s) => ({
  label: s.name,
  href: `/services/${s.slug}`,
  description: s.summary,
  index: s.index,
}));

export const productLinks: NavLink[] = products.map((p) => ({
  label: p.name,
  href: `/products/${p.slug}`,
  description: p.category,
}));

export const companyLinks: NavLink[] = [
  { label: "About", href: "/about", description: "Who we are and how we work" },
  { label: "Insights", href: "/insights", description: "Practical guides for planning digital work" },
  { label: "Contact", href: "/contact", description: "Email, social and the contact form" },
];

export const primaryNav = [
  { label: "Services", href: "/services", menu: "services" as const },
  { label: "Work", href: "/work" },
  { label: "Products", href: "/products", menu: "company" as const },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
] as const;

export const footerColumns: { title: string; links: NavLink[] }[] = [
  { title: "Services", links: [{ label: "All services", href: "/services" }, ...serviceLinks.map(({ label, href }) => ({ label, href }))] },
  { title: "Products", links: [{ label: "All products", href: "/products" }, ...productLinks.map(({ label, href }) => ({ label, href }))] },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Insights", href: "/insights" },
      { label: "Pricing", href: "/pricing" },
      { label: "Project estimator", href: "/estimate" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms and conditions", href: "/terms-and-conditions" },
];
