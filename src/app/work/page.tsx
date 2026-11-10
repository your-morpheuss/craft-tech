import { caseStudies, workCategories } from "@/content/work";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { WorkGrid } from "@/features/portfolio/WorkGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Work — Case Studies",
  description: "Case studies from Craft Tech Labs, published with permission and with facts we can stand behind — starting with our own Retail POS product.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Work", path: "/work" }]}
        label="Work / Case studies"
        lines={["Work we can show,", "shown honestly."]}
        intro={<p>Every case study here is published with permission and limited to what we can verify. Client projects are added as approvals come in; until then, we’re happy to walk you through relevant examples on a call.</p>}
      />
      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <WorkGrid
            items={caseStudies.map(({ slug, title, category, year, summary, scope, hero }) => ({ slug, title, category, year, summary, scope, hero }))}
            categories={workCategories}
          />
        </div>
      </section>
      <CtaBand lines={["Want to see", "relevant examples?"]} body="Tell us about your project and we’ll share work that’s closest to it — including projects we can’t publish openly." primary={{ label: "Ask for Examples", href: "/contact" }} secondary={{ label: "Start a Project", href: "/start-a-project" }} />
    </>
  );
}
