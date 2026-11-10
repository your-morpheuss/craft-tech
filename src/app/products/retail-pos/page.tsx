import Image from "next/image";
import { retailPos as p } from "@/content/products";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/MagneticButton";
import { FaqSection } from "@/components/sections/FaqSection";
import { ContactForm } from "@/features/contact/ContactForm";
import { ScreenCarousel } from "@/features/products/ScreenCarousel";
import { PosShowcase } from "@/features/products/PosShowcase";
import { JsonLd, absoluteUrl, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: p.seo.title, description: p.seo.description, path: "/products/retail-pos", image: p.hero.src });

const BENTO_SPAN = ["lg:col-span-5", "lg:col-span-4", "lg:col-span-3", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-3", "lg:col-span-4", "lg:col-span-5"];

export default function RetailPosPage() {
  return (
    <>
      {/* Product hero — its own sub-brand moment inside the parent site */}
      <section className="surface-dark relative overflow-hidden pt-[calc(var(--header-h)+3rem)]">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-tech-grid opacity-60" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_80%_at_50%_100%,rgba(22,102,232,0.55),transparent_70%)]" />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Products", path: "/products" }, { name: p.name, path: "/products/retail-pos" }]} dark />
          <div className="mx-auto mt-14 max-w-4xl text-center">
            <p className="text-label hero-fade text-cyan">{site.name} · {p.platform}</p>
            <h1 className="text-display mt-6">
              <span className="hero-rise block overflow-hidden pb-[0.07em]"><span style={{ ["--d" as string]: "0.08s" }}>{p.name}</span></span>
            </h1>
            <p className="hero-fade mt-4 text-[clamp(1.5rem,1rem+1.8vw,2.5rem)] font-medium tracking-tight text-chrome-dark" style={{ ["--d" as string]: "0.25s" }}>{p.tagline}</p>
            <p className="text-lede hero-fade mx-auto mt-6 max-w-2xl text-d-text-2" style={{ ["--d" as string]: "0.35s" }}>{p.summary}</p>
            <div className="hero-fade mt-10 flex flex-wrap justify-center gap-3" style={{ ["--d" as string]: "0.45s" }}>
              <Magnetic><ButtonLink href="#demo" variant="inverse" size="lg">Request a Demo</ButtonLink></Magnetic>
              <ButtonLink href="#features" variant="inverse-outline" size="lg" arrow={false}>See features</ButtonLink>
            </div>
          </div>
          <div className="hero-fade relative mx-auto mt-16 pb-16" style={{ ["--d" as string]: "0.55s" }}>
            <PosShowcase main={p.hero} back={p.gallery[1]} side={p.gallery[0]} />
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading index="01" label="Why Retail POS" lines={["The counter, the stock,", "the numbers — together."]} intro={<p>Independent shops often juggle a till, a notebook and a spreadsheet. Retail POS brings the daily work into one Windows application that’s quick to learn and keeps a clear record of every sale and stock movement.</p>} />
        </div>
      </section>

      {/* Features bento */}
      <section id="features" className="scroll-mt-24 pb-24 md:pb-32">
        <div className="container-x">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-12" data-reveal="stagger">
            {p.features.map((f, i) => (
              <li key={f.title} data-reveal-item className={cn("flex flex-col justify-between gap-10 rounded-[var(--radius-card)] border p-7", BENTO_SPAN[i], i === 0 || i === 8 ? "surface-dark border-transparent bg-ink" : "border-line bg-surface")}>
                <p className={cn("text-label", i === 0 || i === 8 ? "text-cyan" : "text-blue")}>{String(i + 1).padStart(2, "0")} · {f.tag}</p>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">{f.title}</h3>
                  <p className={cn("mt-2", i === 0 || i === 8 ? "text-d-text-2" : "text-text-2")}>{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Feature stories — alternating editorial rows with real screens */}
      <section className="border-t border-line bg-surface">
        <div className="container-x">
          {p.stories.map((st, i) => (
            <article key={st.title} className="grid items-center gap-10 border-b border-line py-20 last:border-0 md:py-28 lg:grid-cols-12 lg:gap-16">
              <div className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-2 lg:col-start-8")} data-reveal="up">
                <p className="text-label text-blue">{String(i + 1).padStart(2, "0")} · {st.kicker}</p>
                <h2 className="mt-5 text-h2">{st.title}</h2>
                <p className="mt-6 text-lede text-text-2">{st.body}</p>
                <ul className="mt-8 space-y-3 border-t border-line pt-6">
                  {st.points.map((pt) => <li key={pt} className="flex gap-3 font-medium"><span aria-hidden className="mt-[0.7em] h-px w-5 shrink-0 bg-blue" />{pt}</li>)}
                </ul>
              </div>
              <figure className={cn("group lg:col-span-7", i % 2 === 1 && "lg:order-1 lg:col-start-1")} data-reveal="mask">
                <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-ink shadow-[0_40px_80px_-40px_rgba(7,16,30,0.45)] transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:-translate-y-1.5">
                  <Image src={st.image.src} alt={st.image.alt} width={st.image.width} height={st.image.height} sizes="(min-width:1024px) 55vw, 100vw" className="h-auto w-full" />
                </div>
                <figcaption className="text-label mt-3 text-muted">{st.image.caption}</figcaption>
              </figure>
            </article>
          ))}
        </div>
      </section>

      {/* Controlled screenshot carousel */}
      <section className="surface-dark section-y">
        <div className="container-x">
          <SectionHeading dark index="02" label="Inside the app" lines={["Every screen,", "one workspace."]} intro={<p>Product visuals supplied by {site.name}, shown with demo data. Use the arrows or your keyboard to browse.</p>} />
          <div className="mt-14" data-reveal="up"><ScreenCarousel items={[p.hero, ...p.gallery]} /></div>
        </div>
      </section>

      {/* Workflows */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading index="03" label="Core workflows" lines={["From setup", "to end of day."]} />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-2 lg:grid-cols-4" data-reveal="stagger">
            {p.workflows.map((w) => (
              <li key={w.step} data-reveal-item className="bg-surface p-7">
                <span className="text-label text-blue">{w.step}</span>
                <h3 className="mt-10 text-xl font-semibold tracking-tight">{w.title}</h3>
                <p className="mt-2 text-text-2">{w.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Use cases + platform */}
      <section className="section-y-sm border-y border-line bg-surface">
        <div className="container-x grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-7">
            <p className="text-label text-muted">04 · Who it’s for</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2" data-reveal="stagger">
              {p.useCases.map((u) => (
                <li key={u.title} data-reveal-item className="rounded-[var(--radius-card)] border border-line p-6">
                  <h3 className="font-semibold">{u.title}</h3>
                  <p className="mt-2 text-sm text-text-2">{u.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-4 md:col-span-12 lg:col-span-4 lg:col-start-9" data-reveal="up">
            <p className="text-label text-muted">05 · Platform</p>
            <ul className="mt-6 space-y-3">
              {p.platformNotes.map((n) => <li key={n} className="flex gap-3 text-text-2"><span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-blue" />{n}</li>)}
            </ul>
            <p className="text-label mt-8 text-muted">Confirmed on request</p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted">
              {p.unconfirmed.map((u) => <li key={u}>· {u}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* Demo request */}
      <section id="demo" className="section-y scroll-mt-20">
        <div className="container-x grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <p className="text-label text-blue">06 · Demo &amp; pricing</p>
            <h2 className="mt-6 text-h2">See Retail POS with your own products in mind.</h2>
            <p className="mt-6 text-text-2">Tell us about your shop and we’ll arrange a walkthrough, answer hardware and setup questions, and share pricing options.</p>
          </div>
          <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
            <ContactForm
              variant="demo"
              messageLabel="Brief business requirements"
              messagePlaceholder="What do you sell, how many counters or shops, and what do you use today? Any scanner or printer you already own?"
              submitLabel="Request a demo"
              successTitle="Thanks — your demo request has been received."
            />
          </div>
        </div>
      </section>

      <div className="border-t border-line">
        <FaqSection items={p.faqs} lines={["Retail POS", "questions."]} />
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: p.name,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Windows",
          description: p.summary,
          url: absoluteUrl("/products/retail-pos"),
          image: absoluteUrl(p.hero.src),
          publisher: { "@id": `${site.url}/#organization` },
        }}
      />
    </>
  );
}
