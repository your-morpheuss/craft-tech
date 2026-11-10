import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqSchema, JsonLd } from "@/lib/seo";
import { TextLink } from "@/components/ui/Button";

export function FaqSection({
  items,
  index = "",
  label = "Questions",
  lines = ["Questions,", "answered plainly."],
  id = "faq",
  schema = true,
}: {
  items: AccordionItem[];
  index?: string;
  label?: string;
  lines?: string[];
  id?: string;
  schema?: boolean;
}) {
  return (
    <section id={id} className="section-y scroll-mt-20">
      <div className="container-x">
        <SectionHeading index={index} label={label} lines={lines} />
        <div className="grid-12 mt-14">
          <div className="col-span-4 md:col-span-12 lg:col-span-9 lg:col-start-4" data-reveal="up">
            <Accordion items={items} />
            <p className="mt-8 text-text-2">
              Something else? <TextLink href="/contact">Ask us directly</TextLink>
            </p>
          </div>
        </div>
      </div>
      {schema && <JsonLd data={faqSchema(items)} />}
    </section>
  );
}
