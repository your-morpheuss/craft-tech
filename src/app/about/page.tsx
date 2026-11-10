import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { processStages } from "@/content/company";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { PrinciplesBento } from "@/components/sections/PrinciplesBento";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About — A Design & Technology Studio in Karachi",
  description:
    "Craft Tech Labs is an independent design and technology studio in Karachi. We design and build websites, apps and brands for clients — and our own software products.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        label="About / The studio"
        lines={["Designers and", "engineers who", "ship."]}
        intro={<p>{site.name} is an independent studio in {site.location.city}. We design and build digital work for clients, and we build software of our own — which keeps us honest about what it takes to launch and maintain a product.</p>}
        aside={
          <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-10">
            <div aria-hidden className="absolute inset-0 bg-tech-grid opacity-60" />
            <Image src={site.logo.stacked} alt={site.name} width={906} height={439} className="relative mx-auto h-auto w-full max-w-[280px]" />
            <p className="text-label relative mt-8 text-center text-d-muted">{site.tagline}</p>
          </div>
        }
      />

      <section className="section-y">
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-12 lg:col-span-3"><p className="text-label text-muted">01 · Who we are</p></div>
          <div className="col-span-4 md:col-span-12 lg:col-span-8 lg:col-start-5">
            <p data-reveal="up" className="text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] font-medium leading-[1.25] tracking-[-0.02em]">
              {site.name} is built on a simple idea: the way a business looks, the way its software works and the way people find it should be designed together — by people who talk to each other.
            </p>
            <div data-reveal="up" className="mt-10 grid gap-8 text-text-2 md:grid-cols-2">
              <p>We’re set up for businesses that need a credible website, a mobile app, a brand they can be proud of, or a steadier marketing presence. Working as one studio means design, development and marketing decisions are made with the same context — nothing gets lost between agencies.</p>
              <p>We also build our own products. The first, <Link href="/products/retail-pos" className="text-blue underline underline-offset-2">Retail POS</Link>, is a Windows point-of-sale application for independent shops. Building and supporting it ourselves makes us better at building for clients.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="surface-dark section-y">
        <div className="container-x">
          <SectionHeading dark index="02" label="Philosophy" lines={["Design and technology,", "one conversation."]} />
          <div className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-d-line bg-d-line md:grid-cols-3" data-reveal="stagger">
            {[
              { t: "Clarity first", b: "If a visitor can’t tell what you do in a few seconds, no animation will save the page. We start with structure and words." },
              { t: "Systems over one-offs", b: "Brands, interfaces and codebases built as systems stay consistent as they grow — and cost less to change." },
              { t: "Honest by default", b: "No invented metrics, no guaranteed rankings, no surprise invoices. We say what we know and what we don’t." },
            ].map((x) => (
              <div key={x.t} data-reveal-item className="bg-ink p-8 md:p-10">
                <h3 className="text-h3">{x.t}</h3>
                <p className="mt-4 text-d-text-2">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionHeading index="03" label="Working principles" lines={["What you can", "expect from us."]} />
          <div className="mt-16"><PrinciplesBento /></div>
        </div>
      </section>

      <section className="section-y border-t border-line bg-surface">
        <div className="container-x">
          <SectionHeading index="04" label="Capabilities" lines={["Six disciplines,", "one team."]} aside={<TextLink href="/services">All services</TextLink>} />
          <ul className="mt-14 grid border-t border-line md:grid-cols-2" data-reveal="stagger">
            {services.map((s) => (
              <li key={s.id} data-reveal-item className="border-b border-line md:odd:border-r md:odd:pr-8 md:even:pl-8">
                <Link href={`/services/${s.slug}`} className="group flex items-baseline gap-5 py-6">
                  <span className="text-label text-blue">{s.index}</span>
                  <span>
                    <span className="block text-xl font-semibold tracking-tight group-hover:text-blue">{s.name}</span>
                    <span className="mt-1 block text-text-2">{s.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y" id="process">
        <div className="container-x">
          <SectionHeading index="05" label="Process" lines={["How a project", "moves forward."]} />
          <div className="mt-16"><ProcessTimeline stages={processStages} /></div>
        </div>
      </section>

      <section className="section-y-sm border-t border-line">
        <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-label text-muted">06 · Relevant work</p>
            <p className="mt-3 max-w-xl text-xl font-medium tracking-tight">See how we designed and built Retail POS — from first-run setup to receipts and backups.</p>
          </div>
          <ButtonLink href="/work/retail-pos" variant="secondary" size="lg">Read the case study</ButtonLink>
        </div>
      </section>

      <CtaBand lines={["Let’s build", "something useful."]} />
    </>
  );
}
