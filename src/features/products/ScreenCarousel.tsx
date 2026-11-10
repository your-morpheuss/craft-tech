"use client";

import Image from "next/image";
import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";
import type { ProductImage } from "@/content/products";

/**
 * Controlled screenshot carousel: no autoplay, arrow keys, visible captions,
 * thumbnail index. Slides cross-fade with a slight depth shift.
 */
export function ScreenCarousel({ items }: { items: ProductImage[] }) {
  const [i, setI] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  useGSAP(() => undefined, { scope: stage });

  function go(next: number) {
    const n = (next + items.length) % items.length;
    if (n === i) return;
    setI(n);
    const el = stage.current?.querySelector(`[data-slide="${n}"]`);
    if (el && motionAllowed()) gsap.fromTo(el, { opacity: 0, scale: 0.97, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "expo.out", overwrite: true });
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Retail POS screens" onKeyDown={onKey}>
      <div ref={stage} className="relative overflow-hidden rounded-[var(--radius-card)] border border-d-line bg-ink-2 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)]">
        <div className="relative aspect-[16/10]">
          {items.map((s, n) => (
            <figure
              key={s.src}
              data-slide={n}
              role="group"
              aria-roledescription="slide"
              aria-label={`${n + 1} of ${items.length}: ${s.caption}`}
              aria-hidden={n !== i}
              className={cn("absolute inset-0 flex items-center justify-center p-4 md:p-8", n === i ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0")}
            >
              <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(min-width:1280px) 1100px, 100vw" className="max-h-full w-auto rounded-lg object-contain" loading={n === 0 ? "eager" : "lazy"} />
            </figure>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-d-line px-4 py-3 md:px-6">
          <p className="text-label text-d-muted" aria-live="polite"><span className="text-cyan">{String(i + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")} — {items[i].caption}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(i - 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-d-line text-white hover:border-cyan" aria-label="Previous screen"><ArrowLeft className="h-4 w-4" aria-hidden /></button>
            <button type="button" onClick={() => go(i + 1)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-d-line text-white hover:border-cyan" aria-label="Next screen"><ArrowRight className="h-4 w-4" aria-hidden /></button>
          </div>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {items.map((s, n) => (
          <li key={s.src}>
            <button type="button" onClick={() => go(n)} aria-label={`Show ${s.caption}`} aria-current={n === i} className={cn("relative block aspect-[16/10] w-full overflow-hidden rounded-lg border transition-[border-color,opacity]", n === i ? "border-cyan opacity-100" : "border-d-line opacity-55 hover:opacity-90")}>
              <Image src={s.src} alt="" fill sizes="200px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
