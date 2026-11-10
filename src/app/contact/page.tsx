import { Mail, MapPin } from "lucide-react";
import { site } from "@/content/site";
import { generalFaqs } from "@/content/company";
import { PageHero } from "@/components/sections/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { TextLink } from "@/components/ui/Button";
import { ContactForm } from "@/features/contact/ContactForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact ${site.name} in ${site.location.city}. Email ${site.email} or send a message — we reply by email.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        label="Contact / Say hello"
        lines={["Let’s talk about", "what you’re building."]}
        intro={<p>Questions, ideas or a project you’d like a second opinion on — send a message and a person will reply by email. Planning a full project? The <TextLink href="/start-a-project">project brief</TextLink> helps us reply with more useful questions.</p>}
      />
      <section className="pb-24 md:pb-32">
        <div className="container-x grid-12 gap-y-14">
          <aside className="col-span-4 md:col-span-12 lg:col-span-4">
            <ul className="flex flex-col gap-4">
              <li className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <Mail className="h-5 w-5 text-blue" aria-hidden />
                <p className="text-label mt-6 text-muted">Email</p>
                <a href={`mailto:${site.email}`} className="mt-1 block break-all text-xl font-semibold tracking-tight hover:text-blue">{site.email}</a>
              </li>
              <li className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <MapPin className="h-5 w-5 text-blue" aria-hidden />
                <p className="text-label mt-6 text-muted">Based in</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">{site.location.city}, {site.location.country}</p>
                <p className="mt-1 text-sm text-muted">We work remotely; meetings by video call.</p>
              </li>
              <li className="rounded-[var(--radius-card)] border border-line bg-surface p-6">
                <p className="text-label text-muted">Social</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {site.social.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline pb-0.5 font-medium">{s.label} · {s.handle}<span className="sr-only"> (opens in a new tab)</span></a>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </aside>
          <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
            <h2 className="text-h3">Send a message</h2>
            <div className="mt-8">
              <ContactForm variant="contact" />
            </div>
          </div>
        </div>
      </section>
      <div className="border-t border-line">
        <FaqSection items={generalFaqs.slice(0, 6)} lines={["Before you", "get in touch."]} schema={false} />
      </div>
    </>
  );
}
