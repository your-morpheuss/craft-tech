"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export type AccordionItem = { q: string; a: string };

/** Accessible disclosure list (button + region). Height animates via grid rows — no layout thrash. */
export function Accordion({ items, dark, defaultOpen = -1 }: { items: AccordionItem[]; dark?: boolean; defaultOpen?: number }) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const base = useId();
  return (
    <ul className={cn("border-t", dark ? "border-d-line" : "border-line")}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btn = `${base}-b${i}`;
        const panel = `${base}-p${i}`;
        return (
          <li key={item.q} className={cn("border-b", dark ? "border-d-line" : "border-line")}>
            <h3>
              <button
                id={btn}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="text-lg font-medium leading-snug tracking-tight md:text-xl">{item.q}</span>
                <span className={cn("mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-[transform,background-color,border-color] duration-300", isOpen ? "rotate-45 border-blue bg-blue text-white" : dark ? "border-d-line" : "border-line-strong group-hover:border-ink")}>
                  <Plus className="h-4 w-4" aria-hidden />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={btn}
              className={cn("grid transition-[grid-template-rows] duration-500 ease-[var(--ease-editorial)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className={cn("max-w-3xl pb-7 pr-12 leading-relaxed", dark ? "text-d-text-2" : "text-text-2")}>{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
