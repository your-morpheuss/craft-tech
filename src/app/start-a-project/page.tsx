import { Suspense } from "react";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { ProjectBriefForm } from "@/features/contact/ProjectBriefForm";
import { ProjectBriefFromQuery } from "@/features/contact/ProjectBriefFromQuery";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Start a Project",
  description: "Send Craft Tech Labs a project brief: services, goals, timeline and budget. We reply with questions or a time to talk, then a written proposal.",
  path: "/start-a-project",
});

const NEXT = [
  { t: "We read it properly", b: "A person reviews every brief — no automated sales sequence." },
  { t: "We reply with questions", b: "Or suggest a short video call if that’s quicker." },
  { t: "You get a written proposal", b: "Scope, price, timeline and payment milestones, before any commitment." },
];

export default function StartProjectPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Start a Project", path: "/start-a-project" }]}
        label="Project enquiry / Three steps"
        lines={["Tell us what", "you’re planning."]}
        intro={<p>A few minutes now saves a lot of back-and-forth later. Prefer email? Write to <a className="text-blue underline underline-offset-2" href={`mailto:${site.email}`}>{site.email}</a>.</p>}
      />
      <section className="pb-24 md:pb-32">
        <div className="container-x grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-8">
            {/* searchParams are read client-side so this page stays fully static. */}
            <Suspense fallback={<ProjectBriefForm />}>
              <ProjectBriefFromQuery />
            </Suspense>
          </div>
          <aside className="col-span-4 md:col-span-12 lg:col-span-4">
            <div className="sticky top-[calc(var(--header-h)+1.5rem)] rounded-[var(--radius-card)] bg-ink p-8 text-white">
              <p className="text-label text-cyan">What happens next</p>
              <ol className="mt-6 space-y-6">
                {NEXT.map((n, i) => (
                  <li key={n.t} className="flex gap-4">
                    <span className="text-label pt-1 text-d-muted">0{i + 1}</span>
                    <span><span className="block font-semibold">{n.t}</span><span className="mt-1 block text-d-text-2">{n.b}</span></span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
