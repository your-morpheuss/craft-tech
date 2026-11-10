"use client";

import { useRef } from "react";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type Stage = { index: string; name: string; what: string; receive: string; next: string };

/**
 * Vertical process narrative. On scroll, a progress rail fills and each stage
 * activates — no pinning, so touch scrolling is never trapped.
 */
export function ProcessTimeline({ stages, dark }: { stages: readonly Stage[]; dark?: boolean }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed() || !root.current) return;
      gsap.fromTo(
        "[data-rail]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: 0.4 } },
      );
      gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.35 },
          { opacity: 1, duration: 0.4, scrollTrigger: { trigger: el, start: "top 72%", toggleActions: "play none none reverse" } },
        );
      });
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative">
      <span aria-hidden className={cn("absolute left-[11px] top-2 bottom-2 w-px md:left-[calc(25%+11px)]", dark ? "bg-d-line" : "bg-line")} />
      <span aria-hidden data-rail className="absolute left-[11px] top-2 bottom-2 w-px origin-top bg-blue md:left-[calc(25%+11px)]" />
      {stages.map((s) => (
        <li key={s.index} data-stage className="relative grid gap-4 pb-14 pl-12 last:pb-0 md:grid-cols-4 md:gap-8 md:pl-0">
          <div className="md:pr-10 md:text-right">
            <span className={cn("text-label", dark ? "text-cyan" : "text-blue")}>{s.index}</span>
            <h3 className="mt-2 text-h3">{s.name}</h3>
          </div>
          <span aria-hidden className={cn("absolute left-0 top-1 h-[23px] w-[23px] rounded-full border-2 md:left-[25%]", dark ? "border-cyan bg-ink" : "border-blue bg-bg")}>
            <span className="absolute inset-[5px] rounded-full bg-blue" />
          </span>
          <div className="grid gap-5 md:col-span-3 md:grid-cols-3 md:pl-14">
            <p className={cn("md:col-span-3 lg:col-span-1", dark ? "text-d-text-2" : "text-text-2")}>{s.what}</p>
            <div className="lg:col-span-1 md:col-span-3">
              <p className={cn("text-label", dark ? "text-d-muted" : "text-muted")}>You receive</p>
              <p className="mt-1.5 font-medium">{s.receive}</p>
            </div>
            <div className="lg:col-span-1 md:col-span-3">
              <p className={cn("text-label", dark ? "text-d-muted" : "text-muted")}>Why it matters</p>
              <p className={cn("mt-1.5", dark ? "text-d-text-2" : "text-text-2")}>{s.next}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
