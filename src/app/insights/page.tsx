import { articles } from "@/content/insights";
import { PageHero } from "@/components/sections/PageHero";
import { InsightCard } from "@/components/sections/InsightCards";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights — Guides for Planning Digital Work",
  description: "Practical guides from Craft Tech Labs on planning websites, reading project estimates and choosing retail software.",
  path: "/insights",
});

export default function InsightsPage() {
  const categories = Array.from(new Set(articles.map((a) => a.category)));
  return (
    <>
      <PageHero
        crumbs={[{ name: "Insights", path: "/insights" }]}
        label="Insights / Field notes"
        lines={["Practical notes on", "planning digital work."]}
        intro={<p>Short, useful guides — written to help you make better decisions, whether or not you work with us.</p>}
      >
        <p className="text-label text-muted">Topics: {categories.join(" · ")}</p>
      </PageHero>
      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
            {articles.map((a, i) => (
              <li key={a.slug} data-reveal-item><InsightCard a={a} index={i} /></li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
