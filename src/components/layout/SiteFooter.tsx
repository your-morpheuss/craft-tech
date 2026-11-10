import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { footerColumns, legalLinks } from "@/content/navigation";
import { BackToTop } from "@/components/motion/BackToTop";

export function SiteFooter() {
  return (
    <footer className="surface-dark relative overflow-hidden" aria-labelledby="footer-heading">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/assets/backgrounds/footer-constellation.svg')] bg-cover bg-center opacity-40" />
      <div className="container-x relative pb-10 pt-20 md:pt-28">
        <h2 id="footer-heading" className="sr-only">Site footer</h2>
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-5">
            <Image src={site.logo.stacked} alt={site.name} width={906} height={439} className="h-auto w-[180px]" />
            <p className="mt-8 max-w-sm text-lg leading-relaxed text-d-text-2">{site.positioning}</p>
            <div className="mt-8 flex flex-col gap-2 text-d-text-2">
              <a href={`mailto:${site.email}`} className="link-underline self-start pb-0.5 text-white">{site.email}</a>
              <span>{site.location.city}, {site.location.country}</span>
            </div>
          </div>
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="col-span-2 md:col-span-4 lg:col-span-2">
              <p className="text-label text-d-muted">{col.title}</p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline pb-0.5 text-[0.9375rem] text-d-text-2 hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="col-span-4 md:col-span-4 lg:col-span-1">
            <p className="text-label text-d-muted">Social</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {site.social.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline pb-0.5 text-[0.9375rem] text-d-text-2 hover:text-white">
                    {s.label}<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p aria-hidden className="mt-20 select-none text-[clamp(3rem,13.5vw,15rem)] font-semibold leading-[0.8] tracking-[-0.06em] text-white/[0.07]">
          Craft Tech Labs
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-d-line pt-6 text-sm text-d-muted md:flex-row md:items-center md:justify-between">
          <p>© {site.name}. {site.tagline}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="link-underline pb-0.5 hover:text-white">{l.label}</Link></li>
            ))}
            <li><BackToTop /></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
