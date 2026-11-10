import Link from "next/link";
import { notFound } from "next/navigation";
import { articleBySlug, articles, readingTime } from "@/content/insights";
import { serviceById } from "@/content/services";
import { site } from "@/content/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { InsightCards, fmtDate } from "@/components/sections/InsightCards";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, absoluteUrl, pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(props: PageProps<"/insights/[slug]">) {
  const { slug } = await props.params;
  const a = articleBySlug(slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.description, path: `/insights/${a.slug}`, type: "article" });
}

export default async function ArticlePage(props: PageProps<"/insights/[slug]">) {
  const { slug } = await props.params;
  const a = articleBySlug(slug);
  if (!a) notFound();
  const mins = readingTime(a);

  return (
    <>
      <ScrollProgress />
      <article>
        <header className="bg-paper-grid pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+4.5rem)]">
          <div className="container-x pb-14">
            <Breadcrumbs items={[{ name: "Insights", path: "/insights" }, { name: a.title, path: `/insights/${a.slug}` }]} />
            <div className="mt-12 max-w-4xl">
              <p className="text-label hero-fade text-blue">{a.category}</p>
              <h1 className="text-h1 mt-6">
                <span className="hero-rise block overflow-hidden pb-[0.06em]"><span style={{ ["--d" as string]: "0.08s" }}>{a.title}</span></span>
              </h1>
              <p className="text-lede hero-fade mt-8 text-text-2" style={{ ["--d" as string]: "0.3s" }}>{a.description}</p>
              <p className="text-label hero-fade mt-8 text-muted" style={{ ["--d" as string]: "0.4s" }}>
                By {a.author} · <time dateTime={a.published}>{fmtDate(a.published)}</time>
                {a.updated && <> · Updated <time dateTime={a.updated}>{fmtDate(a.updated)}</time></>} · {mins} min read
              </p>
            </div>
          </div>
        </header>

        <div className="container-x grid-12 gap-y-12 pb-20">
          <nav aria-label="On this page" className="col-span-4 md:col-span-12 lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <p className="text-label text-muted">On this page</p>
              <ol className="mt-4 space-y-2 border-l border-line text-sm">
                {a.sections.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`} className="-ml-px block border-l border-transparent pl-4 text-text-2 hover:border-blue hover:text-text">{s.heading}</a></li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-5">
            <div className="prose-ctl">
            {a.sections.map((s) => (
              <section key={s.id} aria-labelledby={s.id}>
                <h2 id={s.id}>{s.heading}</h2>
                {s.blocks.map((b, i) =>
                  b.type === "p" ? <p key={i}>{b.text}</p> : b.type === "h3" ? <h3 key={i}>{b.text}</h3> : (
                    <ul key={i}>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
                  ),
                )}
              </section>
            ))}
            </div>
            <aside className="mt-14 rounded-[var(--radius-card)] border border-line bg-surface p-7">
              <p className="text-label text-muted">Related services</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {a.relatedServices.map((id) => {
                  const s = serviceById(id);
                  return <li key={id}><Link href={`/services/${s.slug}`} className="inline-block rounded-full border border-line-strong px-4 py-2 text-sm font-medium hover:border-ink">{s.name}</Link></li>;
                })}
                <li><Link href="/estimate" className="inline-block rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-blue">Try the estimator</Link></li>
              </ul>
            </aside>
          </div>
        </div>
      </article>

      <section className="section-y-sm border-t border-line">
        <div className="container-x">
          <p className="text-label text-muted">Keep reading</p>
          <div className="mt-8"><InsightCards exclude={a.slug} limit={2} /></div>
        </div>
      </section>
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.description,
          datePublished: a.published,
          dateModified: a.updated ?? a.published,
          author: { "@type": "Organization", name: a.author, url: site.url },
          publisher: { "@id": `${site.url}/#organization` },
          mainEntityOfPage: absoluteUrl(`/insights/${a.slug}`),
        }}
      />
    </>
  );
}
