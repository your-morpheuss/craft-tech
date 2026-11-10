"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { gsap, motionAllowed, useGSAP } from "@/lib/gsap";

/**
 * Editorial statement whose words brighten as it scrolls through the viewport.
 * Words are only dimmed after GSAP initialises, so the text is always fully
 * readable without JS or with reduced motion. `**word**` marks an accent word.
 */
export function ScrubText({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: "p" | "h2" }) {
  const ref = useRef<HTMLParagraphElement & HTMLHeadingElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionAllowed()) return;
      el.classList.add("scrub-ready");
      gsap.fromTo(
        el.querySelectorAll(".scrub-word"),
        { opacity: 0.18 },
        { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.5 } },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn(className)}>
      {words.map((w, i) => {
        const accent = /^\*\*.+\*\*[.,]?$/.test(w);
        const clean = w.replace(/\*\*/g, "");
        return (
          <span key={i} className={cn("scrub-word", accent && "text-chrome")}>
            {clean}{i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}
