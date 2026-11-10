import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";

/** Editorial inner-page hero. Headline lines animate in with CSS (no JS wait → good LCP). */
export function PageHero({
  crumbs,
  label,
  lines,
  intro,
  aside,
  dark,
  children,
  className,
}: {
  crumbs: Crumb[];
  label: string;
  lines: string[];
  intro?: ReactNode;
  aside?: ReactNode;
  dark?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+5rem)]", dark ? "surface-dark bg-tech-grid" : "bg-paper-grid", className)}>
      <div aria-hidden className={cn("pointer-events-none absolute inset-0", dark ? "bg-[radial-gradient(60%_60%_at_80%_10%,rgba(22,102,232,0.35),transparent_70%)]" : "bg-[linear-gradient(to_bottom,transparent_60%,var(--bg))]")} />
      <div className="container-x relative pb-16 md:pb-24">
        <div className={cn("flex items-center justify-between gap-6 border-b pb-4", dark ? "border-d-line" : "border-line")}>
          <Breadcrumbs items={crumbs} dark={dark} />
          <p className={cn("text-label hidden md:block", dark ? "text-d-muted" : "text-muted")}>CTL / {String(crumbs.length).padStart(2, "0")} — {crumbs[crumbs.length - 1]?.name}</p>
        </div>
        <div className="grid-12 mt-10 gap-y-10 md:mt-16">
          <div className={cn("col-span-4 md:col-span-12", aside ? "lg:col-span-8" : "lg:col-span-11")}>
            <p className={cn("text-label hero-fade", dark ? "text-cyan" : "text-blue")} style={{ ["--d" as string]: "0s" }}>{label}</p>
            <h1 className="mt-6 text-[clamp(2.6rem,1.2rem+5vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.048em]">
              {lines.map((l, i) => (
                <span key={i} className="hero-rise block overflow-hidden pb-[0.06em]">
                  <span className={cn(i === lines.length - 1 && (dark ? "text-chrome-dark" : "text-chrome"))} style={{ ["--d" as string]: `${0.08 + i * 0.09}s` }}>{l}</span>
                </span>
              ))}
            </h1>
            {intro && (
              <div className={cn("text-lede hero-fade mt-8 max-w-2xl", dark ? "text-d-text-2" : "text-text-2")} style={{ ["--d" as string]: "0.35s" }}>
                {intro}
              </div>
            )}
            {children && <div className="hero-fade mt-10" style={{ ["--d" as string]: "0.45s" }}>{children}</div>}
          </div>
          {aside && <div className="hero-fade col-span-4 md:col-span-12 lg:col-span-4 lg:self-end" style={{ ["--d" as string]: "0.4s" }}>{aside}</div>}
        </div>
      </div>
    </section>
  );
}
