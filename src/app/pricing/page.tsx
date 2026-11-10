import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { FaqSection } from "@/components/sections/FaqSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { PricingExplorer } from "@/features/pricing/PricingExplorer";
import { ContactForm } from "@/features/contact/ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing — Website, App, SEO, Social Media & Design Packages",
  description:
    "Indicative starting prices for Craft Tech Labs services in your currency, with package comparisons, add-ons and a project estimator. Final prices are confirmed in a written proposal.",
  path: "/pricing",
});

const SHAPERS = [
  { t: "Scope", b: "Pages, screens, workflows or deliverables. The clearest driver of effort." },
  { t: "Integrations", b: "Payments, bookings, CRMs and APIs each add design, build and testing time." },
  { t: "Content", b: "Whether you supply final text and images, or we write and source them." },
  { t: "Timeline", b: "Fixed launch dates may need more people working in parallel." },
  { t: "Ongoing work", b: "Monthly retainers are priced separately from one-time builds — never blended." },
];

const PRICING_FAQ = [
  { q: "Are these prices final?", a: "No. They’re indicative starting points. After a short conversation we send a written proposal with confirmed scope, price and timeline — nothing starts before you approve it." },
  { q: "Why are prices shown in my currency?", a: "Reference prices are set in USD. When you choose another currency we convert at a current market rate and label the amount as an indicative conversion — it is a guide, not a separate local offer. Approved regional prices, where they exist, are shown as set." },
  { q: "Do prices include tax?", a: "No. Applicable taxes such as VAT, GST or sales tax on services are confirmed in the proposal based on where you’re billed." },
  { q: "What isn’t included?", a: "Third-party costs: domains, hosting, paid plugins, platform subscriptions, store developer accounts, stock images and advertising budgets. Each package lists its exclusions." },
  { q: "How are payments structured?", a: "Payment milestones are set out in the proposal. Monthly services are billed monthly." },
  { q: "Can I get a custom quote?", a: "Yes — for anything that doesn’t fit a package, send a brief and we’ll scope it with you." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Pricing", path: "/pricing" }]}
        label="Pricing / Indicative"
        lines={["Clear starting", "points. Honest", "quotes."]}
        intro={<p>Browse packages for every service in your currency, compare what’s included, then build an estimate that keeps one-time and monthly costs apart.</p>}
        aside={<Image src="/assets/ui/pricing-estimator-illustration.svg" alt="" width={680} height={500} className="h-auto w-full rounded-[var(--radius-card)]" />}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/estimate" size="lg">Build Your Estimate</ButtonLink>
          <ButtonLink href="#packages" variant="secondary" size="lg" arrow={false}>Browse Packages</ButtonLink>
        </div>
      </PageHero>

      <section id="packages" className="scroll-mt-24 pb-24 md:pb-32">
        <div className="container-x">
          <PricingExplorer />
        </div>
      </section>

      <section className="surface-dark section-y">
        <div className="container-x">
          <SectionHeading dark index="01" label="What shapes a quote" lines={["Five things", "move the number."]} intro={<p>Your proposal explains each of these so you can see where the budget goes — and where it can flex.</p>} />
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-d-line bg-d-line sm:grid-cols-2 lg:grid-cols-5" data-reveal="stagger">
            {SHAPERS.map((s, i) => (
              <li key={s.t} data-reveal-item className="bg-ink p-7">
                <span className="text-label text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-8 text-xl font-semibold tracking-tight">{s.t}</h3>
                <p className="mt-2 text-d-text-2">{s.b}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl text-d-text-2">
            Prices are indicative and may change based on scope, integrations, project complexity and final requirements. One-time fees, monthly retainers, third-party charges and taxes are always shown separately.
          </p>
        </div>
      </section>

      <section id="enquire" className="section-y scroll-mt-20 border-t border-line bg-surface">
        <div className="container-x grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <SectionHeading index="02" label="Pricing enquiry" lines={["Questions about", "a package?"]} className="!block" />
            <p className="mt-6 text-text-2">Ask about scope, timelines or a package that isn’t listed. For a full brief, use <a href="/start-a-project" className="text-blue underline underline-offset-2">Start a Project</a>.</p>
          </div>
          <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
            <ContactForm variant="pricing" messageLabel="Your question" submitLabel="Send pricing enquiry" successTitle="Thanks — your pricing enquiry has been received." />
          </div>
        </div>
      </section>

      <FaqSection items={PRICING_FAQ} index="03" label="Pricing FAQ" lines={["Pricing,", "explained."]} />

      <CtaBand lines={["Need something", "custom?"]} body="Send a short brief and we’ll scope it together — then send a written proposal you can compare like-for-like." primary={{ label: "Request a Quote", href: "/start-a-project" }} secondary={{ label: "Build an Estimate", href: "/estimate" }} />
    </>
  );
}
