import { principles } from "@/content/company";
import { cn } from "@/lib/cn";

const span: Record<string, string> = {
  wide: "md:col-span-4 lg:col-span-7",
  tall: "md:col-span-2 lg:col-span-5 lg:row-span-2",
  compact: "md:col-span-3 lg:col-span-3",
  medium: "md:col-span-3 lg:col-span-6",
};

/** Bento of working principles. Card sizes vary by the weight of the idea, not for decoration. */
export function PrinciplesBento({ dark }: { dark?: boolean }) {
  return (
    <ul className="grid auto-rows-[minmax(13rem,auto)] grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12" data-reveal="stagger">
      {principles.map((p, i) => {
        const isTall = p.size === "tall";
        const isWide = p.size === "wide";
        return (
          <li
            key={p.title}
            data-reveal-item
            className={cn(
              "relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border p-7 md:p-8",
              span[p.size],
              dark ? "border-d-line bg-ink-2" : "border-line bg-surface",
              isTall && "surface-dark border-transparent bg-ink",
              isWide && !dark && "bg-[url('/assets/backgrounds/bento-gradient-light.svg')] bg-cover",
            )}
          >
            {isTall && <div aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/assets/backgrounds/bento-gradient-dark.svg')] bg-cover opacity-90" />}
            <span className={cn("text-label relative", isTall || dark ? "text-cyan" : "text-blue")}>{String(i + 1).padStart(2, "0")}</span>
            <div className="relative mt-10">
              <h3 className={cn("font-semibold tracking-tight", isWide || isTall ? "text-h3" : "text-xl")}>{p.title}</h3>
              <p className={cn("mt-3 max-w-md leading-relaxed", isTall || dark ? "text-d-text-2" : "text-text-2")}>{p.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
