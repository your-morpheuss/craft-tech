import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { products } from "@/content/products";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Products — Software Built by Craft Tech Labs",
  description: "Software products designed and engineered by Craft Tech Labs, starting with Retail POS — a Windows point-of-sale application for independent shops.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        dark
        crumbs={[{ name: "Products", path: "/products" }]}
        label="Products / Built in-house"
        lines={["Software we build,", "ship and support."]}
        intro={<p>Alongside client work, we design and engineer our own products — focused tools that solve one job well. Each is maintained by the same team that builds for our clients.</p>}
      />

      <section className="section-y">
        <div className="container-x">
          <ul className="flex flex-col gap-6">
            {products.map((p, i) => (
              <li key={p.slug} data-reveal="up">
                <article className="grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface lg:grid-cols-12">
                  <div className="relative bg-ink lg:col-span-7">
                    <Image src={p.hero.src} alt={p.hero.alt} width={p.hero.width} height={p.hero.height} sizes="(min-width:1024px) 58vw, 100vw" className="h-auto w-full" priority={i === 0} />
                  </div>
                  <div className="flex flex-col justify-between gap-10 p-8 md:p-10 lg:col-span-5">
                    <div>
                      <p className="text-label text-blue">Product {String(i + 1).padStart(2, "0")} · {p.category}</p>
                      <h2 className="mt-5 text-h2">{p.name}</h2>
                      <p className="mt-4 text-lede text-text-2">{p.summary}</p>
                      <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.9375rem]">
                        {p.features.slice(0, 6).map((f) => (
                          <li key={f.tag} className="flex gap-2"><span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-blue" />{f.tag}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <ButtonLink href={`/products/${p.slug}`} size="lg">View {p.name}</ButtonLink>
                      <ButtonLink href={`/products/${p.slug}#demo`} variant="secondary" size="lg">Request a Demo</ButtonLink>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-dashed border-line-strong p-8">
              <p className="text-label text-muted">How we choose products</p>
              <p className="mt-4 text-xl font-medium leading-snug tracking-tight">We build products where we see small businesses struggling with tools that are too complex or too expensive for the job.</p>
            </div>
            <Link href="/work/retail-pos" className="group flex flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-8 transition-colors hover:border-ink">
              <p className="text-label text-muted">Behind the build</p>
              <p className="mt-4 flex items-end justify-between gap-4 text-xl font-medium leading-snug tracking-tight">
                Read how Retail POS was designed and engineered.
                <ArrowUpRight className="h-6 w-6 shrink-0 transition-transform group-hover:rotate-45" aria-hidden />
              </p>
            </Link>
          </div>
        </div>
      </section>

      <CtaBand lines={["Need software", "built for you?"]} body="The team behind our products builds custom websites and applications for clients." primary={{ label: "Start a Project", href: "/start-a-project" }} secondary={{ label: "Website & App Services", href: "/services/website-development" }} />
    </>
  );
}
