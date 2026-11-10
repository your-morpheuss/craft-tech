import { PageHero } from "@/components/sections/PageHero";
import { EstimatorClient } from "@/features/estimator/EstimatorClient";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Project Cost Estimator",
  description:
    "Estimate the cost of a website, mobile app, SEO, social media, branding or design project in your currency. One-time and monthly costs shown separately, with clear assumptions.",
  path: "/estimate",
});

export default function EstimatePage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Estimate", path: "/estimate" }]}
        label="Estimator / Five steps"
        lines={["What would it", "cost to build?"]}
        intro={<p>Answer a few scoping questions per service and get an indicative range in your currency — one-time and monthly costs kept apart, every assumption written down.</p>}
      />
      <section className="pb-24 md:pb-32">
        <div className="container-x">
          <EstimatorClient />
        </div>
      </section>
    </>
  );
}
