"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";
import type { ProductImage } from "@/content/products";

/**
 * Layered product composition: one dominant screen, two supporting panels
 * behind it at different depths. Scroll gives gentle parallax between the
 * layers; hover lifts the stack. No continuous rotation.
 */
export function PosShowcase({ main, back, side, className }: { main: ProductImage; back: ProductImage; side: ProductImage; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!motionAllowed() || !root.current) return;
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
      gsap.fromTo("[data-layer='back']", { yPercent: 14 }, { yPercent: -10, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-layer='side']", { yPercent: 22 }, { yPercent: -16, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-layer='main']", { yPercent: 6, scale: 0.96 }, { yPercent: -4, scale: 1, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  const frame = "overflow-hidden rounded-[14px] border border-white/10 bg-ink-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)]";

  return (
    <div ref={root} className={cn("group relative mx-auto aspect-[16/11] w-full max-w-5xl", className)}>
      <div data-layer="back" className={cn(frame, "absolute left-0 top-[4%] w-[44%] -rotate-[4deg] opacity-70 transition-transform duration-700 group-hover:-translate-x-3 group-hover:-rotate-[6deg]")}>
        <Image src={back.src} alt={back.alt} width={back.width} height={back.height} sizes="30vw" className="h-auto w-full" />
      </div>
      <div data-layer="side" className={cn(frame, "absolute right-0 top-0 w-[38%] rotate-[3deg] opacity-80 transition-transform duration-700 group-hover:translate-x-3 group-hover:rotate-[5deg]")}>
        <Image src={side.src} alt={side.alt} width={side.width} height={side.height} sizes="26vw" className="h-auto w-full" />
      </div>
      <figure data-layer="main" className={cn(frame, "absolute inset-x-[6%] bottom-0 ring-1 ring-cyan/25 transition-transform duration-700 group-hover:-translate-y-2")}>
        <Image src={main.src} alt={main.alt} width={main.width} height={main.height} sizes="(min-width:1024px) 60vw, 90vw" className="h-auto w-full" />
        <figcaption className="text-label flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-d-muted">
          <span>{main.caption}</span><span className="text-cyan">Retail POS · Windows</span>
        </figcaption>
      </figure>
    </div>
  );
}
