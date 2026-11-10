"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";

type Item = { slug: string; index: string; name: string; shortName: string; statement: string; art: string; artAlt: string; deliverables: string[] };

/**
 * Editorial service index. Desktop: large outlined numerals and titles on the
 * left; a sticky dark "viewer" on the right that wipes to the focused
 * discipline's artwork. Touch/narrow: every row shows its own art and copy,
 * so nothing depends on hover.
 */
export function ServiceShowcase({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0);
  const viewer = useRef<HTMLDivElement>(null);
  useGSAP(() => undefined, { scope: viewer });

  function activate(i: number) {
    if (i === active) return;
    const dir = i > active ? 1 : -1;
    setActive(i);
    const art = viewer.current?.querySelector(`[data-art="${i}"]`);
    if (art && motionAllowed()) {
      gsap.fromTo(art, { clipPath: dir > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)", scale: 1.08 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 0.9, ease: "expo.out", overwrite: true, clearProps: "clipPath" });
    }
  }

  const a = items[active];

  return (
    <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-10">
      <ol className="lg:col-span-7" data-reveal="stagger">
        {items.map((s, i) => (
          <li key={s.slug} data-reveal-item className="border-t border-line last:border-b">
            <Link
              href={`/services/${s.slug}`}
              onMouseEnter={() => activate(i)}
              onFocus={() => activate(i)}
              className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 py-6 md:gap-x-8 md:py-8"
            >
              <span aria-hidden className={cn("absolute inset-y-0 -left-4 right-0 -z-0 origin-left rounded-xl bg-bg transition-transform duration-500 ease-[var(--ease-editorial)]", active === i ? "scale-x-100 lg:scale-x-100" : "scale-x-0")} />
              <span className={cn("text-outline relative text-[clamp(2.25rem,1.5rem+2.5vw,4.25rem)] font-semibold leading-none tracking-[-0.05em] transition-colors duration-300", active === i ? "text-blue" : "text-muted")}>{s.index}</span>
              <span className="relative">
                <span className="text-label block text-muted">{s.shortName}</span>
                <span className={cn("mt-1 block text-[clamp(1.4rem,1rem+1.6vw,2.6rem)] font-semibold leading-[1.04] tracking-[-0.035em] transition-colors duration-300", active === i ? "text-text" : "text-text/55 group-hover:text-text")}>
                  {s.name}
                </span>
                <span className={cn("mt-2 block max-w-xl text-[0.9375rem] text-text-2 transition-opacity duration-300 lg:opacity-0", active === i && "lg:opacity-100")}>{s.statement}</span>
              </span>
              <span className={cn("relative inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300", active === i ? "border-ink bg-ink text-white" : "border-line-strong text-text")}>
                <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" aria-hidden strokeWidth={1.75} />
                <span className="sr-only">Explore {s.name}</span>
              </span>
              <span className="relative col-span-3 mt-5 block overflow-hidden rounded-[var(--radius-card)] bg-ink lg:hidden">
                <Image src={s.art} alt="" width={920} height={660} sizes="100vw" className="h-auto w-full" />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <div className="hidden lg:col-span-5 lg:block">
        <div ref={viewer} className="sticky top-[calc(var(--header-h)+2rem)] overflow-hidden rounded-[var(--radius-card)] bg-ink text-white">
          <div className="text-label flex items-center justify-between border-b border-d-line px-5 py-3 text-d-muted">
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden />CTL viewer</span>
            <span><span className="text-cyan">{a.index}</span> / 06</span>
          </div>
          <div className="relative aspect-[920/660] overflow-hidden">
            {items.map((s, i) => (
              <Image
                key={s.slug}
                data-art={i}
                src={s.art}
                alt={active === i ? s.artAlt : ""}
                aria-hidden={active !== i}
                fill
                sizes="(min-width:1024px) 38vw, 1px"
                className={cn("object-cover", active === i ? "z-10 opacity-100" : "z-0 opacity-0")}
              />
            ))}
          </div>
          <div className="border-t border-d-line p-6">
            <p className="text-label text-d-muted">{a.shortName} · typical deliverables</p>
            <ul key={a.slug} className="ct-line-in mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-d-text-2">
              {a.deliverables.slice(0, 6).map((d) => (
                <li key={d} className="flex gap-2.5"><span aria-hidden className="mt-[0.6em] h-px w-3 shrink-0 bg-cyan" />{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
