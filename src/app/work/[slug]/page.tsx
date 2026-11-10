import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyBySlug } from "@/content/work";
import { serviceById } from "@/content/services";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const c = caseStudyBySlug(slug);
  if (!c) return {};
  return pageMetadata({ title: `${c.title} — Case Study`, description: c.summary, path: `/work/${c.slug}`, image: c.hero.src });
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid-12 gap-y-6 border-t border-line py-12 md:py-16" data-reveal="up">
      <p className="text-label col-span-4 text-muted md:col-span-3">{label}</p>
      <div className="col-span-4 md:col-span-8 md:col-start-5">{children}</div>
    </div>
  );
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const c = caseStudyBySlug(slug);
  if (!c) notFound();
  const idx = caseStudies.findIndex((x) => x.slug === c.slug);
  const next = caseStudies.length > 1 ? caseStudies[(idx + 1) % caseStudies.length] : null;

  return (
    <article>
      <ScrollProgress />
      <header className="bg-paper-grid pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+4.5rem)]">
        <div className="container-x pb-12">
          <Breadcrumbs items={[{ name: "Work", path: "/work" }, { name: c.title, path: `/work/${c.slug}` }]} />
          <p className="text-label hero-fade mt-12 text-blue">{c.category} · {c.year}</p>
          <h1 className="text-display mt-6"><span className="hero-rise block overflow-hidden pb-[0.07em]"><span style={{ ["--d" as string]: "0.08s" }}>{c.title}</span></span></h1>
          <p className="text-lede hero-fade mt-8 max-w-3xl text-text-2" style={{ ["--d" as string]: "0.3s" }}>{c.summary}</p>
          <dl className="hero-fade mt-12 grid gap-6 border-t border-line pt-6 sm:grid-cols-3" style={{ ["--d" as string]: "0.4s" }}>
            <div><dt className="text-label text-muted">Client</dt><dd className="mt-1 font-medium">{c.client}</dd></div>
            <div><dt className="text-label text-muted">Scope</dt><dd className="mt-1 font-medium">{c.scope.join(", ")}</dd></div>
            <div><dt className="text-label text-muted">Year</dt><dd className="mt-1 font-medium">{c.year}</dd></div>
          </dl>
        </div>
      </header>

      <div className="container-x">
        <figure className="hero-fade overflow-hidden rounded-[var(--radius-card)] border border-line" style={{ ["--d" as string]: "0.5s" }}>
          <Image src={c.hero.src} alt={c.hero.alt} width={c.hero.width} height={c.hero.height} priority sizes="(min-width:1440px) 1330px, 100vw" className="h-auto w-full" />
          <figcaption className="text-label border-t border-line bg-surface px-5 py-3 text-muted">{c.hero.caption}</figcaption>
        </figure>

        <div className="mt-16 md:mt-24">
          <Block label="Context"><p className="text-[clamp(1.25rem,1rem+1vw,1.75rem)] font-medium leading-snug tracking-tight">{c.context}</p></Block>
          <Block label="The challenge"><p className="text-lede text-text-2">{c.challenge}</p></Block>
          <Block label="Approach">
            <ol className="grid gap-6 sm:grid-cols-2">
              {c.approach.map((a, i) => (
                <li key={a.title}>
                  <span className="text-label text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight">{a.title}</h2>
                  <p className="mt-2 text-text-2">{a.body}</p>
                </li>
              ))}
            </ol>
          </Block>
          <Block label="Design decisions">
            <ul className="divide-y divide-line border-y border-line">
              {c.decisions.map((d) => (
                <li key={d.title} className="py-5">
                  <h2 className="font-semibold">{d.title}</h2>
                  <p className="mt-1 text-text-2">{d.body}</p>
                </li>
              ))}
            </ul>
          </Block>
          <Block label="Deliverables">
            <ul className="flex flex-wrap gap-2.5">
              {c.deliverables.map((d) => <li key={d} className="rounded-full border border-line-strong px-4 py-2">{d}</li>)}
            </ul>
          </Block>
        </div>

        <div className="grid gap-4 pb-16 md:grid-cols-2">
          {c.gallery.map((g, i) => (
            <figure key={g.src} data-reveal="mask" className={i === 0 ? "md:col-span-2" : undefined}>
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
                <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes={i === 0 ? "100vw" : "(min-width:768px) 50vw, 100vw"} className="h-auto w-full" />
              </div>
              <figcaption className="text-label mt-3 text-muted">{g.caption}</figcaption>
            </figure>
          ))}
        </div>

        {c.outcomes.length > 0 && (
          <Block label="Outcomes">
            <ul className="space-y-2">{c.outcomes.map((o) => <li key={o}>{o}</li>)}</ul>
          </Block>
        )}

        <div className="grid-12 gap-y-8 border-t border-line py-12 md:py-16">
          <p className="text-label col-span-4 text-muted md:col-span-3">Related</p>
          <div className="col-span-4 flex flex-wrap gap-3 md:col-span-8 md:col-start-5">
            {c.productSlug && <ButtonLink href={`/products/${c.productSlug}`}>View the product</ButtonLink>}
            {c.services.map((id) => {
              const s = serviceById(id);
              return <ButtonLink key={id} href={`/services/${s.slug}`} variant="secondary">{s.shortName}</ButtonLink>;
            })}
          </div>
        </div>

        {next && (
          <Link href={`/work/${next.slug}`} className="group mb-16 block border-t border-line pt-10">
            <p className="text-label text-muted">Next project</p>
            <p className="mt-3 text-h2 group-hover:text-blue">{next.title} →</p>
          </Link>
        )}
      </div>

      <CtaBand lines={["Planning something", "similar?"]} />
    </article>
  );
}
