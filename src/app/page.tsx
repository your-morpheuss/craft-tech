import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { retailPos } from "@/content/products";
import { caseStudies } from "@/content/work";
import { generalFaqs, processStages } from "@/content/company";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { IndexLabel, RevealHeading, SectionHeading } from "@/components/ui/SectionHeading";
import { Magnetic } from "@/components/motion/MagneticButton";
import { ScrubText } from "@/components/motion/ScrubText";
import { Hero } from "@/features/hero/Hero";
import { CtPrism } from "@/features/hero/CtPrism";
import { ServiceShowcase } from "@/features/services/ServiceShowcase";
import { PosShowcase } from "@/features/products/PosShowcase";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { InsightCards } from "@/components/sections/InsightCards";
import { FaqSection } from "@/components/sections/FaqSection";
import { StartingPrices } from "@/features/pricing/StartingPrices";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${site.name} — Websites, Apps, Brands & Retail POS`,
  description: site.description,
  path: "/",
});

const PILLARS = [
  { k: "Design", v: "Identities, interfaces and campaigns built on systems — so every new page and post looks like it belongs.", href: "/services/brand-identity", tag: "Brand · Graphic" },
  { k: "Engineering", v: "Websites and mobile apps written to load fast, read clearly and stay easy to change.", href: "/services/website-development", tag: "Web · Mobile" },
  { k: "Growth", v: "Search and social work that puts useful content in front of people already looking for it.", href: "/services/seo", tag: "SEO · Social" },
  { k: "Products", v: "Our own software, designed, shipped and supported in-house — starting with Retail POS.", href: "/products", tag: "Retail POS" },
];

export default function HomePage() {
  const featured = caseStudies[0];
  const gallery = retailPos.gallery;
  return (
    <>
      {/* Sticky scope: the hero only sticks while the manifesto slides over it. */}
      <div className="relative">
      <Hero />

      {/* ── Studio manifesto: slides over the sticky hero ───────────── */}
      <section id="studio" className="hero-follow bg-bg scroll-mt-0">
        <div className="container-x section-y">
          <div className="grid-12 gap-y-10">
            <div className="col-span-4 md:col-span-12 lg:col-span-2">
              <IndexLabel><span className="text-blue">01</span>The studio</IndexLabel>
            </div>
            <ScrubText
              as="h2"
              className="col-span-4 text-[clamp(1.9rem,1.1rem+3.4vw,4.6rem)] font-semibold leading-[1.02] tracking-[-0.04em] md:col-span-12 lg:col-span-10"
              text="One studio for how your business **looks,** how its software **works** and how people **find** it — so the decisions in one discipline never undo the work in another."
            />
          </div>
          <ul className="mt-20 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
            {PILLARS.map((p, i) => (
              <li key={p.k} data-reveal-item className="border-b border-line sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
                <Link href={p.href} className="group flex h-full flex-col justify-between gap-12 p-6 transition-colors hover:bg-surface lg:p-8">
                  <span className="flex items-center justify-between">
                    <span className="text-label text-muted">{String(i + 1).padStart(2, "0")} / {p.tag}</span>
                    <ArrowUpRight className="h-5 w-5 text-muted transition-[transform,color] group-hover:rotate-45 group-hover:text-blue" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-h3">{p.k}</span>
                    <span className="mt-3 block text-text-2">{p.v}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      </div>

      {/* ── Services: editorial index with live visual ──────────────── */}
      <section className="section-y border-t border-line bg-surface" aria-labelledby="services-h">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <IndexLabel><span className="text-blue">02</span>Services</IndexLabel>
              <RevealHeading lines={["Six disciplines.", "One connected vision."]} accentLast className="text-h1 mt-6" />
            </div>
            <p id="services-h" data-reveal="up" className="max-w-sm text-text-2">Each service stands on its own and gets stronger alongside the others. Hover a discipline to see what it produces — or open its page for scope and pricing.</p>
          </div>
          <div className="mt-16 md:mt-20">
            <ServiceShowcase items={services.map(({ slug, index, name, statement, art, artAlt, deliverables, shortName }) => ({ slug, index, name, statement, art, artAlt, deliverables, shortName }))} />
          </div>
        </div>
      </section>

      {/* ── Retail POS: layered product showcase ────────────────────── */}
      <section className="surface-dark relative overflow-hidden" aria-labelledby="pos-h">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-tech-grid opacity-40 [mask-image:linear-gradient(to_bottom,black_30%,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[30%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(22,102,232,0.45),transparent)]" />
        <div className="container-x section-y relative">
          <div className="grid-12 gap-y-10">
            <div className="col-span-4 md:col-span-12 lg:col-span-5">
              <IndexLabel dark><span className="text-cyan">03</span>Our product</IndexLabel>
              <RevealHeading lines={["Beyond client work.", "We build products."]} accentLast dark className="text-h1 mt-6" />
            </div>
            <div className="col-span-4 md:col-span-12 lg:col-span-6 lg:col-start-7 lg:self-end" data-reveal="up">
              <p className="text-lede text-d-text-2"><strong className="text-white">Retail POS</strong> is a complete Windows point-of-sale application for independent shops — designed and engineered by our team.</p>
            </div>
          </div>

          <PosShowcase className="mt-16 md:mt-24" main={retailPos.hero} back={gallery[1]} side={gallery[0]} />

          <div className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-d-line bg-d-line md:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
            {retailPos.features.filter((f) => ["Checkout", "Inventory", "Reports", "Data"].includes(f.tag)).map((f) => (
              <div key={f.tag} data-reveal-item className="bg-ink p-6">
                <p className="text-label text-cyan">{f.tag}</p>
                <h3 className="mt-6 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-d-text-2">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/products/retail-pos" variant="inverse" size="lg">View Retail POS</ButtonLink>
            <ButtonLink href="/products/retail-pos#demo" variant="inverse-outline" size="lg">Request a Demo</ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Selected work: asymmetric editorial feature ─────────────── */}
      <section className="section-y" aria-labelledby="work-h">
        <div className="container-x">
          <div className="flex items-end justify-between gap-6">
            <div>
              <IndexLabel><span className="text-blue">04</span>Selected work</IndexLabel>
              <RevealHeading lines={["Work we can show,", "shown honestly."]} accentLast className="text-h1 mt-6" />
            </div>
            <div className="hidden md:block"><TextLink href="/work">All work</TextLink></div>
          </div>

          <Link href={`/work/${featured.slug}`} className="group mt-16 grid gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink lg:col-span-8" data-reveal="mask">
              <Image src={featured.hero.src} alt={featured.hero.alt} width={featured.hero.width} height={featured.hero.height} sizes="(min-width:1024px) 62vw, 100vw" className="h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-editorial)] group-hover:scale-[1.03]" />
              <span className="text-label absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-white backdrop-blur">Case study · {featured.year}</span>
            </div>
            <div className="flex flex-col justify-between gap-10 lg:col-span-4" data-reveal="up">
              <div>
                <p className="text-label text-blue">{featured.category}</p>
                <h3 id="work-h" className="mt-4 text-[clamp(2.25rem,1.6rem+2.4vw,4rem)] font-semibold leading-[0.95] tracking-[-0.04em] group-hover:text-blue">{featured.title}</h3>
                <p className="mt-5 text-text-2">{featured.summary}</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm">
                <div><dt className="text-label text-muted">Client</dt><dd className="mt-1 font-medium">{featured.client}</dd></div>
                <div><dt className="text-label text-muted">Scope</dt><dd className="mt-1 font-medium">{featured.scope.join(" · ")}</dd></div>
              </dl>
              <span className="inline-flex items-center gap-2 font-medium">Read the case study <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" aria-hidden /></span>
            </div>
          </Link>

          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-card)] border border-dashed border-line-strong p-7 md:flex-row md:items-center" data-reveal="up">
            <p className="max-w-2xl text-lg font-medium tracking-tight">Client case studies are published only with permission. Planning something similar to your project? We’ll walk you through relevant work on a call.</p>
            <ButtonLink href="/contact" variant="secondary">Ask for Examples</ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Capabilities bento ─────────────────────────────────────── */}
      <section className="section-y border-t border-line bg-surface">
        <div className="container-x">
          <SectionHeading index="05" label="Why Craft Tech Labs" lines={["How we work", "is the difference."]} />
          <div className="mt-16 grid auto-rows-[minmax(12rem,auto)] gap-4 md:grid-cols-6 lg:grid-cols-12" data-reveal="stagger">
            <div data-reveal-item className="surface-dark relative overflow-hidden rounded-[var(--radius-card)] p-8 md:col-span-6 lg:col-span-7 lg:row-span-2">
              <div aria-hidden className="absolute -bottom-24 -right-20 w-[26rem] opacity-80"><CtPrism id="bento-prism" decorative className="h-auto w-full" /></div>
              <p className="text-label relative text-cyan">One team</p>
              <h3 className="relative mt-6 max-w-md text-h2">Design and engineering in the same room.</h3>
              <p className="relative mt-5 max-w-sm text-d-text-2">Designers who understand constraints and engineers who care about detail — one conversation from first sketch to launch.</p>
            </div>
            <div data-reveal-item className="rounded-[var(--radius-card)] border border-line bg-bg p-7 md:col-span-3 lg:col-span-5">
              <p className="text-label text-blue">Written scope</p>
              <p className="mt-8 text-xl font-semibold tracking-tight">Every project starts with a written scope, a price and a dated plan you approve.</p>
            </div>
            <div data-reveal-item className="rounded-[var(--radius-card)] border border-line bg-bg p-7 md:col-span-3 lg:col-span-2">
              <p className="text-label text-blue">Visibility</p>
              <p className="mt-8 font-semibold">A staging link you can open any time.</p>
            </div>
            <div data-reveal-item className="relative overflow-hidden rounded-[var(--radius-card)] bg-blue p-7 text-white md:col-span-3 lg:col-span-3">
              <p className="text-label text-white">Ownership</p>
              <p className="mt-8 text-xl font-semibold tracking-tight">On final payment, the work is yours.</p>
            </div>
            <div data-reveal-item className="rounded-[var(--radius-card)] border border-line bg-bg p-7 md:col-span-3 lg:col-span-4">
              <p className="text-label text-blue">Honest by default</p>
              <p className="mt-6 text-text-2">No invented metrics, no guaranteed rankings, no surprise invoices. We say what we know — and what we don’t.</p>
            </div>
            <div data-reveal-item className="flex items-end justify-between gap-6 rounded-[var(--radius-card)] border border-line bg-bg p-7 md:col-span-3 lg:col-span-8">
              <div>
                <p className="text-label text-blue">Builders of our own products</p>
                <p className="mt-6 max-w-lg text-text-2">Shipping and supporting Retail POS ourselves keeps us honest about what it takes to maintain software after launch.</p>
              </div>
              <Image src={site.logo.mark} alt="" width={364} height={273} className="hidden h-auto w-20 shrink-0 sm:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Process (dark) ─────────────────────────────────────────── */}
      <section className="surface-dark section-y">
        <div className="container-x">
          <SectionHeading dark index="06" label="Our approach" lines={["A process you", "can see into."]} intro={<p>Six stages, each ending in something you can review. Timelines are agreed per project in writing — never promised before scope is clear.</p>} />
          <div className="mt-16 md:mt-24"><ProcessTimeline stages={processStages} dark /></div>
        </div>
      </section>

      {/* ── Pricing preview ────────────────────────────────────────── */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading
            index="07"
            label="Pricing"
            lines={["Clarity before", "commitment."]}
            intro={<p>Starting points for every service in your currency, and an estimator that keeps one-time and monthly costs apart.</p>}
            aside={
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/estimate">Get an Estimate</ButtonLink>
                <ButtonLink href="/pricing" variant="secondary">View Pricing</ButtonLink>
              </div>
            }
          />
          <div className="mt-14" data-reveal="up"><StartingPrices /></div>
        </div>
      </section>

      <section className="section-y border-t border-line bg-surface">
        <div className="container-x">
          <SectionHeading index="08" label="Insights" lines={["Notes on planning", "digital work."]} aside={<TextLink href="/insights">All insights</TextLink>} />
          <div className="mt-14"><InsightCards /></div>
        </div>
      </section>

      <FaqSection items={generalFaqs} index="09" />

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="surface-dark relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -right-[12%] top-1/2 w-[min(70vw,56rem)] -translate-y-1/2 opacity-60"><CtPrism id="cta-prism" decorative className="h-auto w-full" /></div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ctl-ink)_35%,transparent)]" />
        <div className="container-x section-y relative">
          <IndexLabel dark><span className="text-cyan">10</span>Next step</IndexLabel>
          <RevealHeading as="h2" lines={["Have something", "worth building?"]} accentLast dark className="text-display mt-8 max-w-[13ch]" />
          <p data-reveal="up" className="text-lede mt-10 max-w-xl text-d-text-2">Tell us what you’re planning — a site, an app, a brand or a steadier way to market. We’ll reply with honest questions and a clear next step.</p>
          <div data-reveal="up" className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic><ButtonLink href="/start-a-project" variant="inverse" size="lg">Start a Project</ButtonLink></Magnetic>
            <ButtonLink href="/services" variant="inverse-outline" size="lg">Explore Our Services</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
