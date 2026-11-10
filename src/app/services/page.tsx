import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { processStages } from "@/content/company";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CtaBand } from "@/components/sections/CtaBand";
import { StartingPrices } from "@/features/pricing/StartingPrices";
import { JsonLd, pageMetadata, serviceSchema } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Services — Websites, Apps, SEO, Social Media, Branding & Design",
  description:
    "Six connected services from Craft Tech Labs: website development, mobile app development, social media marketing, SEO, brand identity and graphic design.",
  path: "/services",
});

const COMBOS = [
  { title: "Launching a new business", body: "Brand identity first, then a website built on it, then social channels that look and sound the same.", ids: ["05", "01", "03"] },
  { title: "Growing an existing site", body: "A technical SEO audit, fixes to the templates that matter, and content planned around real searches.", ids: ["04", "01"] },
  { title: "Turning an idea into a product", body: "Discovery and UI design, a first app release, and a landing site to explain it.", ids: ["02", "01", "05"] },
  { title: "Staying consistent every week", body: "Monthly social management backed by an ongoing design allowance for campaigns and print.", ids: ["03", "06"] },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        label="Services / Six disciplines"
        lines={["Everything a", "digital presence", "needs to work."]}
        intro={<p>Design, engineering and growth services you can take on their own or together. Each has a dedicated page with deliverables, process and indicative pricing.</p>}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/estimate" size="lg">Get an Estimate</ButtonLink>
          <ButtonLink href="/pricing" variant="secondary" size="lg">Compare Pricing</ButtonLink>
        </div>
      </PageHero>

      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <ul className="grid gap-4 md:grid-cols-2" data-reveal="stagger">
            {services.map((s, i) => (
              <li key={s.id} data-reveal-item className={i === 0 || i === 3 ? "md:col-span-2" : undefined}>
                <Link href={`/services/${s.slug}`} className={`group grid h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface transition-colors hover:border-ink ${i === 0 || i === 3 ? "md:grid-cols-2" : ""}`}>
                  <div className="relative aspect-[920/660] overflow-hidden bg-ink">
                    <Image src={s.art} alt={s.artAlt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.04]" />
                  </div>
                  <div className="flex flex-col justify-between gap-8 p-7 md:p-9">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-label text-blue">{s.index} / {s.shortName}</span>
                        <ArrowUpRight className="h-5 w-5 text-muted transition-transform duration-300 group-hover:rotate-45 group-hover:text-text" aria-hidden />
                      </div>
                      <h2 className="mt-5 text-h3">{s.name}</h2>
                      <p className="mt-3 max-w-lg text-text-2">{s.statement}</p>
                    </div>
                    <div>
                      <p className="text-label text-muted">Good for</p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {s.projectTypes.slice(0, 3).map((t) => (
                          <li key={t} className="rounded-full border border-line px-3 py-1 text-sm text-text-2">{t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
                <JsonLd data={serviceSchema({ name: s.name, description: s.seo.description, path: `/services/${s.slug}` })} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="surface-dark section-y">
        <div className="container-x">
          <SectionHeading dark index="01" label="Integrated work" lines={["Better together —", "when it helps."]} intro={<p>We’ll recommend combinations only when they serve the goal. These are the patterns we see most often.</p>} />
          <ul className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-d-line bg-d-line md:grid-cols-2" data-reveal="stagger">
            {COMBOS.map((c) => (
              <li key={c.title} data-reveal-item className="bg-ink p-8 md:p-10">
                <p className="text-label text-cyan">{c.ids.map((id) => services.find((s) => s.index === id)?.shortName).join(" + ")}</p>
                <h3 className="mt-6 text-h3">{c.title}</h3>
                <p className="mt-3 max-w-md text-d-text-2">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionHeading index="02" label="Process" lines={["Same process,", "every discipline."]} />
          <div className="mt-16"><ProcessTimeline stages={processStages} /></div>
        </div>
      </section>

      <section className="section-y border-t border-line bg-surface">
        <div className="container-x">
          <SectionHeading index="03" label="Starting points" lines={["Indicative prices,", "in your currency."]} aside={<TextLink href="/pricing">Full pricing</TextLink>} />
          <div className="mt-14" data-reveal="up"><StartingPrices /></div>
          <p className="mt-5 text-sm text-muted">Indicative only — the final price is confirmed in a written proposal.</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-x">
          <SectionHeading index="04" label="Related work" lines={["See the craft", "in practice."]} intro={<p>Our Retail POS case study covers product design, desktop engineering and launch visuals from first sketch to shipped software.</p>} aside={<TextLink href="/work/retail-pos">Read the case study</TextLink>} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
