import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/MagneticButton";
import { RevealHeading } from "@/components/ui/SectionHeading";

export function CtaBand({
  lines = ["Have something", "worth building?"],
  body = "Tell us what you’re planning — a new site, an app, a brand, or a smarter way to market. We’ll reply with honest questions and a clear next step.",
  primary = { label: "Start a Project", href: "/start-a-project" },
  secondary = { label: "Explore Our Services", href: "/services" },
}: {
  lines?: string[];
  body?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="surface-dark relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-tech-grid opacity-60 [mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(22,102,232,0.45),transparent_65%)]" />
      <div className="container-x section-y relative">
        <p className="text-label flex items-center gap-3 text-d-muted"><span aria-hidden className="inline-block h-px w-6 bg-cyan" />Next step</p>
        <RevealHeading as="h2" lines={lines} accentLast dark className="text-display mt-8 max-w-[14ch]" />
        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <p data-reveal="up" className="text-lede text-d-text-2 md:col-span-6">{body}</p>
          <div data-reveal="up" className="flex flex-wrap items-center gap-4 md:col-span-6 md:justify-end md:self-end">
            <Magnetic><ButtonLink href={primary.href} variant="inverse" size="lg">{primary.label}</ButtonLink></Magnetic>
            <ButtonLink href={secondary.href} variant="inverse-outline" size="lg">{secondary.label}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
