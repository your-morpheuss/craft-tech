import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function IndexLabel({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p className={cn("text-label flex items-center gap-3", dark ? "text-d-muted" : "text-muted", className)}>
      <span aria-hidden className={cn("inline-block h-px w-6", dark ? "bg-cyan" : "bg-blue")} />
      {children}
    </p>
  );
}

/** Masked multi-line heading. Each line reveals on scroll (see PageMotion). */
export function RevealHeading({
  lines,
  as: Tag = "h2",
  className,
  accentLast,
  dark,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  accentLast?: boolean;
  dark?: boolean;
}) {
  return (
    <Tag className={cn("text-h2", className)} data-reveal="lines">
      {lines.map((line, i) => (
        <span key={i} className="reveal-line block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <span
            className={cn(
              "block",
              accentLast && i === lines.length - 1 && (dark ? "text-chrome-dark" : "text-chrome"),
            )}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}

export function SectionHeading({
  index,
  label,
  lines,
  intro,
  dark,
  className,
  accentLast = true,
  aside,
}: {
  index?: string;
  label: string;
  lines: string[];
  intro?: ReactNode;
  dark?: boolean;
  className?: string;
  accentLast?: boolean;
  aside?: ReactNode;
}) {
  return (
    <div className={cn("grid-12 gap-y-8", className)}>
      <div className="col-span-4 md:col-span-12 lg:col-span-3">
        <IndexLabel dark={dark}>
          {index && <span className={dark ? "text-cyan" : "text-blue"}>{index}</span>}
          {label}
        </IndexLabel>
      </div>
      <div className="col-span-4 md:col-span-12 lg:col-span-9">
        <RevealHeading lines={lines} accentLast={accentLast} dark={dark} />
        {(intro || aside) && (
          <div className="mt-8 grid gap-6 md:grid-cols-9 md:gap-x-7">
            {intro && (
              <div data-reveal="up" className={cn("text-lede md:col-span-6", dark ? "text-d-text-2" : "text-text-2")}>
                {intro}
              </div>
            )}
            {aside && <div data-reveal="up" className="md:col-span-3 md:justify-self-end md:self-end">{aside}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
