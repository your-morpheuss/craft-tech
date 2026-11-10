"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION, ScrollTrigger, motionAllowed, useGSAP } from "@/lib/gsap";

/**
 * Scroll-reveal orchestrator. Scans its subtree for [data-reveal] and builds
 * one-shot ScrollTriggers. Elements are only hidden when <html> has `.js-motion`
 * (set pre-paint when reduced motion is NOT requested), and a CSS fallback
 * reveals them if this never runs. Revealed elements get `.is-revealed`, so a
 * route restored from Activity does not replay its entrance.
 *
 * data-reveal: "up" | "fade" | "lines" | "mask" | "stagger"
 * data-reveal-delay: seconds
 */
export function PageMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (context) => {
      if (!motionAllowed() || !scope.current) return;
      // Streamed sections can hydrate after this effect runs. Mutating their inline
      // styles first would cause hydration mismatches, so wait for an idle moment.
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
      const run = () => context.add(() => setup(scope.current));
      if (w.requestIdleCallback) {
        const id = w.requestIdleCallback(run, { timeout: 600 });
        return () => w.cancelIdleCallback?.(id);
      }
      const t = window.setTimeout(run, 120);
      return () => window.clearTimeout(t);
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}

function setup(root: HTMLElement | null) {
  if (!root) return;
  document.documentElement.classList.add("motion-ready");
  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]:not(.is-revealed)", root);

  els.forEach((el) => {
    const kind = el.dataset.reveal;
    const delay = Number(el.dataset.revealDelay ?? 0);
    const done = () => el.classList.add("is-revealed");
    const st = { trigger: el, start: MOTION.start, once: true };

    if (kind === "lines") {
      const lines = el.querySelectorAll<HTMLElement>(".reveal-line > span");
      gsap.set(el, { opacity: 1 });
      gsap.fromTo(
        lines,
        { yPercent: 108 },
        { yPercent: 0, duration: MOTION.dur.line, ease: MOTION.ease, stagger: MOTION.stagger.lines, delay, scrollTrigger: st, onStart: done, clearProps: "transform" },
      );
    } else if (kind === "mask") {
      const media = el.querySelector<HTMLElement>("img, svg, [data-reveal-media]");
      const tl = gsap.timeline({ scrollTrigger: st, delay, onStart: done });
      tl.fromTo(el, { opacity: 1, clipPath: "inset(12% 6% 12% 6% round 14px)" }, { clipPath: "inset(0% 0% 0% 0% round 14px)", duration: 1.1, ease: MOTION.ease, clearProps: "clipPath" });
      if (media) tl.fromTo(media, { scale: 1.12 }, { scale: 1, duration: 1.3, ease: MOTION.ease, clearProps: "transform" }, 0);
    } else if (kind === "stagger") {
      const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
      gsap.set(el, { opacity: 1 });
      gsap.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: MOTION.dur.reveal, ease: MOTION.easeSoft, stagger: MOTION.stagger.items, delay, scrollTrigger: st, onStart: done, clearProps: "transform,opacity" });
    } else {
      const y = kind === "fade" ? 0 : 28;
      gsap.fromTo(el, { opacity: 0, y }, { opacity: 1, y: 0, duration: MOTION.dur.reveal, ease: MOTION.easeSoft, delay, scrollTrigger: st, onStart: done, clearProps: "transform,opacity" });
    }
  });

  // Layout can shift after fonts/images settle.
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh).catch(() => undefined);
  if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });
}
