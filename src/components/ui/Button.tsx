import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse" | "inverse-outline";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-medium tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow] duration-300 ease-[var(--ease-editorial)] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-blue rounded-full",
  secondary: "border border-line-strong text-text hover:border-ink hover:bg-ink hover:text-white rounded-full",
  ghost: "text-text hover:text-blue",
  inverse: "bg-white text-ink hover:bg-cyan rounded-full",
  "inverse-outline": "border border-white/30 text-white hover:border-white hover:bg-white hover:text-ink rounded-full",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], variant !== "ghost" && sizes[size], className);
}

function Arrow({ external }: { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <span aria-hidden className="relative inline-flex h-4 w-4 overflow-hidden">
      <Icon className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover/btn:translate-x-full" strokeWidth={1.75} />
      <Icon className="absolute inset-0 h-4 w-4 -translate-x-full transition-transform duration-300 ease-[var(--ease-editorial)] group-hover/btn:translate-x-0" strokeWidth={1.75} />
    </span>
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ variant = "primary", size = "md", arrow = true, className, children, ...props }: ButtonLinkProps) {
  const external = typeof props.href === "string" && /^(https?:|mailto:)/.test(props.href);
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      <span>{children}</span>
      {arrow && <Arrow external={external} />}
    </Link>
  );
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; arrow?: boolean };

export function Button({ variant = "primary", size = "md", arrow = false, className, children, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...props}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}

/** Editorial text link with animated underline and arrow. */
export function TextLink({ href, children, className, dark }: { href: string; children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/btn inline-flex items-center gap-2 font-medium",
        dark ? "text-white" : "text-text",
        className,
      )}
    >
      <span className="link-underline pb-0.5">{children}</span>
      <Arrow />
    </Link>
  );
}
