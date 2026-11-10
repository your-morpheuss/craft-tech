"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/MagneticButton";
import { gsap, motionAllowed, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CtPrism } from "./CtPrism";
import { DISCIPLINES } from "./disciplines";

/**
 * Homepage hero: architectural editorial headline (CSS-revealed, so it never
 * waits for JS) + the interactive CT prism (GSAP). The section is sticky; the
 * next section slides over it while the hero recedes — no scroll hijacking.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const prism = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const d = DISCIPLINES[active];

  // Entrance choreography + ambient motion + scroll exit.
  useGSAP(
    () => {
      if (!motionAllowed() || !root.current) return;
      const mm = gsap.matchMedia();
      const intro = !document.documentElement.classList.contains("intro-seen") ? 0.85 : 0;

      document.documentElement.classList.add("hero-ready");
      const tl = gsap.timeline({ delay: intro + 0.25, defaults: { ease: "expo.out" } });
      tl.fromTo("[data-hero='prism']", { opacity: 0, scale: 0.86, filter: "blur(12px)" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.4, clearProps: "filter" })
        .fromTo("[data-shard]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09 }, "<0.1")
        .fromTo("[data-frag]", { opacity: 0, scale: 0.8, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.05 }, "<0.4")
        .fromTo("[data-hero='copy']", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.15)
        .fromTo("[data-hero='chip']", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 }, "<0.3")
        .fromTo("[data-hero='meta']", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "<0.2");

      // Scroll exit: hero recedes while the next section slides over it.
      mm.add("(min-width: 768px)", () => {
        gsap.to("[data-hero='stage']", {
          yPercent: -8, scale: 0.94, opacity: 0.35, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.4 },
        });
        gsap.to("[data-hero='prism']", {
          yPercent: 10, rotate: -6, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });

      // Pointer depth on fine pointers only.
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const el = root.current!;
        const planes = gsap.utils.toArray<SVGGElement>("[data-shard]", el);
        const setters = planes.map((p, i) => ({
          x: gsap.quickTo(p, "xPercent", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(p, "yPercent", { duration: 0.9, ease: "power3.out" }),
          k: (i + 1) * 1.2,
        }));
        const move = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          setters.forEach((s) => { s.x(nx * s.k); s.y(ny * s.k); });
        };
        el.addEventListener("pointermove", move);
        return () => el.removeEventListener("pointermove", move);
      });

      // Pause ambient CSS orbit when the hero is off-screen.
      ScrollTrigger.create({
        trigger: root.current, start: "top bottom", end: "bottom top",
        onToggle: (self) => root.current?.classList.toggle("is-paused", !self.isActive),
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Re-arrange the prism for the selected discipline.
  useGSAP(
    () => {
      const svg = prism.current;
      if (!svg) return;
      const instant = !motionAllowed();
      (["c", "t", "l"] as const).forEach((k, i) => {
        const s = d.shards[k];
        gsap.to(svg.querySelector(`[data-shard='${k}']`), {
          x: s.x, y: s.y, rotation: s.r, scale: s.s, opacity: s.o ?? 1,
          transformOrigin: "50% 50%", duration: instant ? 0 : 1.1, delay: instant ? 0 : i * 0.05, ease: "expo.inOut", overwrite: "auto",
        });
      });
      svg.querySelectorAll<SVGGElement>("[data-frag]").forEach((f) => {
        const on = f.dataset.frag === d.focus;
        gsap.to(f, { opacity: on ? 1 : 0.32, duration: instant ? 0 : 0.6, overwrite: "auto" });
      });
    },
    { dependencies: [active], scope: root },
  );

  // Gentle auto-cycle until the visitor interacts (stops when hidden).
  useGSAP(
    () => {
      if (touched || !motionAllowed()) return;
      const id = window.setInterval(() => {
        if (document.hidden || root.current?.classList.contains("is-paused")) return;
        setActive((a) => (a + 1) % DISCIPLINES.length);
      }, 4200);
      return () => window.clearInterval(id);
    },
    { dependencies: [touched] },
  );

  const choose = (i: number) => { setTouched(true); setActive(i); };

  return (
    <section ref={root} className="hero-sticky surface-dark relative isolate overflow-hidden" aria-labelledby="hero-title">
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-tech-grid opacity-50 [mask-image:radial-gradient(90%_80%_at_60%_40%,black,transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -right-[10%] top-[-20%] h-[90vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(22,102,232,0.42),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -left-[10%] bottom-[-30%] h-[70vh] w-[50vw] rounded-full bg-[radial-gradient(closest-side,rgba(29,215,235,0.14),transparent)]" />

      <div data-hero="stage" className="container-x relative flex min-h-[100svh] flex-col pb-6 pt-[calc(var(--header-h)+1rem)]">
        {/* Meta rail */}
        <div data-hero="meta" className="text-label flex items-center justify-between border-b border-d-line pb-4 text-d-muted">
          <span className="flex items-center gap-3"><span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden />{site.name} · Digital &amp; technology studio</span>
          <span className="hidden md:block">{site.location.city} · 24.86°N 67.00°E</span>
          <span className="hidden lg:block">Index / {d.index} — {d.label}</span>
        </div>

        <div className="relative grid flex-1 grid-cols-1 items-center gap-y-4 py-6 lg:grid-cols-12 lg:gap-x-8 lg:py-2">
          {/* Headline */}
          <div className="relative z-10 lg:col-span-7">
            <h1 id="hero-title" className="text-[clamp(2.9rem,0.6rem+6.4vw,8.25rem)] font-semibold leading-[0.86] tracking-[-0.055em]">
              <span className="hero-rise block overflow-hidden pb-[0.06em]"><span style={{ ["--d" as string]: "0.1s" }}>Crafted</span></span>
              <span className="hero-rise block overflow-hidden pb-[0.06em]"><span className="text-d-text-2" style={{ ["--d" as string]: "0.18s" }}>to be seen.</span></span>
              <span className="hero-rise block overflow-hidden pb-[0.06em]"><span className="text-chrome-dark" style={{ ["--d" as string]: "0.26s" }}>Engineered</span></span>
              <span className="hero-rise block overflow-hidden pb-[0.08em]"><span className="text-d-text-2" style={{ ["--d" as string]: "0.34s" }}>to perform.</span></span>
            </h1>
          </div>

          {/* Prism */}
          <div className="relative lg:col-span-5 lg:-ml-16">
            <div data-hero="prism" className="relative mx-auto aspect-square w-[min(82vw,24rem)] lg:w-[min(36vw,34rem,58vh)]">
              <CtPrism ref={prism} id="hero-prism" className="h-full w-full overflow-visible" />
              <p aria-live="polite" className="text-label absolute inset-x-0 -bottom-1 text-center text-d-muted">{d.coord}</p>
            </div>
          </div>
        </div>

        {/* Lower band: copy, CTAs, discipline signature */}
        <div className="grid grid-cols-1 gap-8 border-t border-d-line pt-6 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <p data-hero="copy" className="max-w-md text-[1.0625rem] leading-relaxed text-d-text-2">
              We design and build websites, apps and brands — and the marketing that brings people to them. We also ship our own software, starting with <Link href="/products/retail-pos" className="text-white underline decoration-cyan/60 underline-offset-4 hover:decoration-cyan">Retail POS</Link>.
            </p>
            <div data-hero="copy" className="mt-6 flex flex-wrap items-center gap-3">
              <Magnetic><ButtonLink href="/start-a-project" variant="inverse" size="lg">Start a Project</ButtonLink></Magnetic>
              <ButtonLink href="/work" variant="inverse-outline" size="lg">Explore Our Work</ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div role="radiogroup" aria-label="Explore our disciplines" className="grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-ctl)] border border-d-line bg-d-line sm:grid-cols-6">
              {DISCIPLINES.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={active === i}
                  data-hero="chip"
                  onClick={() => choose(i)}
                  onMouseEnter={() => window.matchMedia("(hover: hover)").matches && choose(i)}
                  onFocus={() => choose(i)}
                  className={cn("group relative flex flex-col items-start gap-3 bg-ink px-3.5 py-3 text-left transition-colors duration-300", active === i ? "bg-ink-3" : "hover:bg-ink-2")}
                >
                  <span className={cn("text-label transition-colors", active === i ? "text-cyan" : "text-d-muted")}>{x.index}</span>
                  <span className="text-[0.95rem] font-medium">{x.label}</span>
                  <span aria-hidden className={cn("absolute inset-x-0 bottom-0 h-0.5 origin-left bg-cyan transition-transform duration-500", active === i ? "scale-x-100" : "scale-x-0")} />
                </button>
              ))}
            </div>
            <div data-hero="meta" className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
              <p key={d.id} className="ct-line-in max-w-lg text-[0.9375rem] text-d-text-2">{d.line}</p>
              <Link href={d.href} className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-white">
                <span className="link-underline pb-0.5">{d.service}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        <a href="#studio" data-hero="meta" className="text-label absolute bottom-8 right-[clamp(1rem,4vw,3.5rem)] hidden items-center gap-2 text-d-muted hover:text-white xl:flex">
          Scroll <ArrowDown className="ct-bob h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
