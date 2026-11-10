import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/content/services";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="surface-dark relative flex min-h-[90dvh] items-center overflow-hidden pt-[var(--header-h)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-tech-grid opacity-60" />
      <p aria-hidden className="text-outline pointer-events-none absolute -right-6 bottom-[-0.15em] select-none text-[clamp(10rem,32vw,30rem)] font-semibold leading-none tracking-[-0.06em] text-cyan/25">404</p>
      <div className="container-x relative py-20">
        <p className="text-label hero-fade text-cyan">Error 404 · Page not found</p>
        <h1 className="text-h1 mt-6 max-w-[14ch]">
          <span className="hero-rise block overflow-hidden"><span>This page has</span></span>
          <span className="hero-rise block overflow-hidden"><span className="text-chrome-dark" style={{ ["--d" as string]: "0.1s" }}>moved on.</span></span>
        </h1>
        <p className="text-lede hero-fade mt-8 max-w-xl text-d-text-2" style={{ ["--d" as string]: "0.25s" }}>
          The link may be old — we recently rebuilt this website. Try one of these instead.
        </p>
        <div className="hero-fade mt-10 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.35s" }}>
          <ButtonLink href="/" variant="inverse" size="lg">Back to Home</ButtonLink>
          <ButtonLink href="/work" variant="inverse-outline" size="lg">See Our Work</ButtonLink>
        </div>
        <ul className="mt-14 flex flex-wrap gap-x-6 gap-y-2 text-d-text-2">
          {services.map((s) => <li key={s.id}><Link href={`/services/${s.slug}`} className="link-underline pb-0.5 hover:text-white">{s.shortName}</Link></li>)}
          <li><Link href="/contact" className="link-underline pb-0.5 hover:text-white">Contact</Link></li>
        </ul>
      </div>
    </section>
  );
}
