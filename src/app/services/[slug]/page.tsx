import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { serviceBySlug, serviceById, services } from "@/content/services";
import { caseStudies } from "@/content/work";
import { cn } from "@/lib/cn";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/MagneticButton";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { PackageCards } from "@/features/pricing/PackageCards";
import { CurrencySelector } from "@/features/pricing/CurrencySelector";
import { DraftBanner } from "@/features/pricing/StartingPrices";
import { SITE_PRICING_MODE } from "@/features/pricing/engine";
import { JsonLd, pageMetadata, serviceSchema } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return pageMetadata({ title: s.seo.title, description: s.seo.description, path: `/services/${s.slug}` });
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  // Alternate hero treatments so each discipline feels individually directed.
  const dark = ["website-development", "social-media-marketing", "brand-identity"].includes(s.id);
  const related = s.related.map(serviceById);
  const work = caseStudies.filter((c) => c.services.includes(s.id));
  const path = `/services/${s.slug}`;

  return (
    <>
      {/* Hero */}
      <section className={cn("relative overflow-hidden pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+4.5rem)]", dark ? "surface-dark bg-tech-grid" : "bg-paper-grid")}>
        <div aria-hidden className={cn("pointer-events-none absolute inset-0", dark ? "bg-[radial-gradient(50%_60%_at_85%_40%,rgba(22,102,232,0.4),transparent_70%)]" : "bg-[radial-gradient(45%_55%_at_85%_40%,rgba(29,215,235,0.18),transparent_70%)]")} />
        <div className="container-x relative pb-16 md:pb-24">
          <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: s.shortName, path }]} dark={dark} />
          <div className="grid-12 mt-10 items-end gap-y-12 md:mt-14">
            <div className="col-span-4 md:col-span-12 lg:col-span-7">
              <p className={cn("text-label hero-fade", dark ? "text-cyan" : "text-blue")}>{s.hero.eyebrow}</p>
              <h1 className="text-h1 mt-6">
                {s.hero.headline.map((l, i) => (
                  <span key={l} className="hero-rise block overflow-hidden pb-[0.06em]">
                    <span className={cn(i === 1 && (dark ? "text-chrome-dark" : "text-chrome"))} style={{ ["--d" as string]: `${0.08 + i * 0.1}s` }}>{l}</span>
                  </span>
                ))}
              </h1>
              <p className={cn("text-lede hero-fade mt-8 max-w-xl", dark ? "text-d-text-2" : "text-text-2")} style={{ ["--d" as string]: "0.35s" }}>{s.hero.intro}</p>
              <div className="hero-fade mt-10 flex flex-wrap gap-3" style={{ ["--d" as string]: "0.45s" }}>
                <Magnetic><ButtonLink href={`/start-a-project?service=${s.id}`} size="lg" variant={dark ? "inverse" : "primary"}>Start a Project</ButtonLink></Magnetic>
                <ButtonLink href={`/estimate?service=${s.id}`} size="lg" variant={dark ? "inverse-outline" : "secondary"}>Get an Estimate</ButtonLink>
              </div>
            </div>
            <div className="hero-fade col-span-4 md:col-span-12 lg:col-span-5" style={{ ["--d" as string]: "0.3s" }}>
              <div className={cn("relative overflow-hidden rounded-[var(--radius-card)] border", dark ? "border-d-line" : "border-line")}>
                <Image src={s.art} alt={s.artAlt} width={920} height={660} priority sizes="(min-width:1024px) 40vw, 100vw" className="h-auto w-full" />
                <span className="text-label absolute right-4 top-4 rounded bg-black/40 px-2 py-1 text-cyan backdrop-blur">{s.index} / 06</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning + problems */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading index="01" label="Why it matters" lines={["Problems we", "help you solve."]} intro={<p>{s.statement}</p>} />
          <ul className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
            {s.problems.map((p, i) => (
              <li key={p.title} data-reveal-item className={cn("rounded-[var(--radius-card)] border border-line bg-surface p-7 md:p-8", i === 0 && s.problems.length === 4 && "lg:col-span-2")}>
                <p className="text-label text-muted">Problem {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-text-2">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Deliverables + capabilities */}
      <section className="surface-dark section-y">
        <div className="container-x">
          <SectionHeading dark index="02" label="What you get" lines={["Deliverables", "and scope."]} />
          <div className="grid-12 mt-16 gap-y-12">
            <div className="col-span-4 md:col-span-12 lg:col-span-5" data-reveal="up">
              <p className="text-label text-d-muted">Deliverables</p>
              <ol className="mt-6 border-t border-d-line">
                {s.deliverables.map((d, i) => (
                  <li key={d} className="flex gap-5 border-b border-d-line py-4 text-lg">
                    <span className="text-label pt-1.5 text-cyan">{String(i + 1).padStart(2, "0")}</span>{d}
                  </li>
                ))}
              </ol>
            </div>
            <div className="col-span-4 md:col-span-12 lg:col-span-6 lg:col-start-7">
              <p className="text-label text-d-muted">Capabilities</p>
              <div className="mt-6 grid gap-4" data-reveal="stagger">
                {s.capabilities.map((c) => (
                  <div key={c.group} data-reveal-item className="rounded-[var(--radius-card)] border border-d-line bg-ink-2 p-6">
                    <h3 className="font-semibold">{c.group}</h3>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {c.items.map((it) => <li key={it} className="rounded-full border border-d-line px-3 py-1 text-sm text-d-text-2">{it}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading index="03" label="How it works" lines={["From brief", "to delivery."]} intro={<p>{s.timeline}</p>} />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5" data-reveal="stagger">
            {s.process.map((p, i) => (
              <li key={p.step} data-reveal-item className="flex flex-col bg-surface p-6">
                <span className="text-label text-blue">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 text-lg font-semibold tracking-tight">{p.step}</h3>
                <p className="mt-2 text-[0.9375rem] text-text-2">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Project types + methodology */}
      <section className="section-y-sm border-y border-line bg-surface">
        <div className="container-x grid-12 gap-y-10">
          <div className="col-span-4 md:col-span-6 lg:col-span-5" data-reveal="up">
            <p className="text-label text-muted">Suitable projects</p>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {s.projectTypes.map((t) => <li key={t} className="rounded-full border border-line-strong px-4 py-2 text-[0.9375rem]">{t}</li>)}
            </ul>
          </div>
          {s.methodology && (
            <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-7" data-reveal="up">
              <p className="text-label text-muted">Our approach</p>
              <h3 className="mt-6 text-h3">{s.methodology.title}</h3>
              <p className="mt-3 text-text-2">{s.methodology.body}</p>
            </div>
          )}
        </div>
      </section>

      {/* Related work */}
      {work.length > 0 && (
        <section className="section-y">
          <div className="container-x">
            <SectionHeading index="04" label="Related work" lines={["From our", "own studio."]} />
            <ul className="mt-14 grid gap-4">
              {work.map((w) => (
                <li key={w.slug} data-reveal="up">
                  <Link href={`/work/${w.slug}`} className="group grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface md:grid-cols-2">
                    <div className="relative aspect-[16/9] overflow-hidden bg-ink">
                      <Image src={w.hero.src} alt={w.hero.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                    <div className="flex flex-col justify-between gap-8 p-8">
                      <div>
                        <p className="text-label text-blue">{w.category} · {w.year}</p>
                        <h3 className="mt-4 text-h3">{w.title}</h3>
                        <p className="mt-3 text-text-2">{w.summary}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 font-medium">Read the case study <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" aria-hidden /></span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Pricing */}
      <section className="section-y border-t border-line bg-surface" id="pricing">
        <div className="container-x">
          <SectionHeading
            index={work.length ? "05" : "04"}
            label="Pricing"
            lines={["Indicative", "starting points."]}
            intro={<p>Packages are starting points. Your proposal confirms scope and price before any work begins.</p>}
            aside={<CurrencySelector />}
          />
          <div className="mt-12">
            {SITE_PRICING_MODE === "draft-preview" && <DraftBanner />}
            <PackageCards service={s.id} />
            <p className="mt-5 text-sm text-muted">Prices are indicative and may change based on scope, integrations, complexity and final requirements. Taxes and third-party costs are extra. <TextLink href={`/estimate?service=${s.id}`}>Build a detailed estimate</TextLink></p>
          </div>
        </div>
      </section>

      <FaqSection items={s.faqs} index="" label={`${s.shortName} FAQ`} lines={["Common", "questions."]} />

      {/* Related services */}
      <section className="section-y-sm border-t border-line">
        <div className="container-x">
          <p className="text-label text-muted">Related services</p>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}>
                <Link href={`/services/${r.slug}`} className="group flex h-full flex-col justify-between gap-6 rounded-[var(--radius-card)] border border-line bg-surface p-6 transition-colors hover:border-ink">
                  <span className="text-label text-blue">{r.index}</span>
                  <span>
                    <span className="block text-xl font-semibold tracking-tight group-hover:text-blue">{r.name}</span>
                    <span className="mt-2 block text-sm text-text-2">{r.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand lines={[`Ready to talk`, `${s.shortName.toLowerCase()}?`]} secondary={{ label: "Get an Estimate", href: `/estimate?service=${s.id}` }} primary={{ label: "Start a Project", href: `/start-a-project?service=${s.id}` }} />
      <JsonLd data={serviceSchema({ name: s.name, description: s.seo.description, path })} />
    </>
  );
}
