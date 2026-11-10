"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Shared motion constants — the motion language in one place. */
export const MOTION = {
  ease: "expo.out",
  easeSoft: "power3.out",
  dur: { micro: 0.25, reveal: 0.8, line: 0.95 },
  stagger: { lines: 0.09, items: 0.07 },
  start: "top 88%",
} as const;

export function motionAllowed() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("js-motion");
}

export { gsap, ScrollTrigger, useGSAP };
