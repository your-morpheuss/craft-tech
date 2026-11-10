"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { companyLinks, productLinks, serviceLinks } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/Button";

type MenuId = "services" | "company" | null;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesId = useId();
  const companyId = useId();

  // Close everything on navigation (routes stay mounted under Activity).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setPastHero(window.scrollY > window.innerHeight - 90);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback((returnFocus = false) => {
    setOpen((current) => {
      if (returnFocus && current) triggerRefs.current[current]?.focus();
      return null;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  const hoverOpen = (id: MenuId) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(id), id ? 80 : 160);
  };
  const isFinePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const navItem = "relative inline-flex h-10 items-center gap-1 px-3 text-[0.9375rem] font-medium text-text-2 transition-colors hover:text-text";

  // Over the dark homepage hero the header switches to its dark tone (tokens are remapped in CSS).
  const dark = pathname === "/" && !pastHero && !open && !mobileOpen;

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        // Always solid: several heroes are dark, and the wordmark is dark — transparency would fail contrast.
        dark ? "header-dark bg-ink/70 backdrop-blur-xl" : "bg-bg/92 backdrop-blur-xl",
        scrolled || open ? "border-b border-line" : "border-b border-transparent",
      )}
      onMouseLeave={() => isFinePointer() && hoverOpen(null)}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 shrink-0" aria-label={`${site.name} — home`}>
          <Image src={site.logo.horizontal} alt="" width={1548} height={221} priority className="header-logo h-[22px] w-auto sm:h-[26px]" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center">
            <li>
              <button
                ref={(el) => { triggerRefs.current.services = el; }}
                type="button"
                className={cn(navItem, isActive(pathname, "/services") && "text-text")}
                aria-expanded={open === "services"}
                aria-controls={servicesId}
                onClick={() => setOpen(open === "services" ? null : "services")}
                onMouseEnter={() => isFinePointer() && hoverOpen("services")}
              >
                Services
                <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform", open === "services" && "rotate-180")} strokeWidth={1.75} />
              </button>
            </li>
            {[
              { label: "Work", href: "/work" },
              { label: "Pricing", href: "/pricing" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(navItem)}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  onMouseEnter={() => isFinePointer() && hoverOpen(null)}
                >
                  <span className="link-underline pb-0.5" aria-current={isActive(pathname, l.href) ? "page" : undefined}>{l.label}</span>
                </Link>
              </li>
            ))}
            <li>
              <button
                ref={(el) => { triggerRefs.current.company = el; }}
                type="button"
                className={cn(navItem, (isActive(pathname, "/about") || isActive(pathname, "/products") || isActive(pathname, "/insights") || isActive(pathname, "/contact")) && "text-text")}
                aria-expanded={open === "company"}
                aria-controls={companyId}
                onClick={() => setOpen(open === "company" ? null : "company")}
                onMouseEnter={() => isFinePointer() && hoverOpen("company")}
              >
                Company
                <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform", open === "company" && "rotate-180")} strokeWidth={1.75} />
              </button>
            </li>
          </ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link href="/estimate" className="text-label link-underline pb-0.5 text-text-2 hover:text-text" aria-current={isActive(pathname, "/estimate") ? "page" : undefined}>
            Get an estimate
          </Link>
          <ButtonLink href="/start-a-project" size="md" className="header-cta">Start a Project</ButtonLink>
        </div>

        <button
          type="button"
          className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      {/* Services mega menu */}
      <div
        id={servicesId}
        hidden={open !== "services"}
        className="absolute inset-x-0 top-full border-b border-line bg-bg shadow-[0_24px_48px_-24px_rgba(7,16,30,0.18)]"
        onMouseEnter={() => isFinePointer() && hoverOpen("services")}
      >
        <div className="container-x grid grid-cols-12 gap-7 py-10">
          <div className="col-span-3 flex flex-col justify-between border-r border-line pr-7">
            <div>
              <p className="text-label text-muted">Six disciplines</p>
              <p className="mt-4 text-2xl font-semibold leading-tight tracking-tight">Design, engineering and growth — under one roof.</p>
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/services" className="font-medium link-underline self-start pb-0.5">All services →</Link>
              <Link href="/pricing" className="text-text-2 link-underline self-start pb-0.5">Pricing</Link>
              <Link href="/estimate" className="text-text-2 link-underline self-start pb-0.5">Project estimator</Link>
            </div>
          </div>
          <ul className="col-span-9 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line">
            {serviceLinks.map((s) => (
              <li key={s.href} className="bg-bg">
                <Link
                  href={s.href}
                  aria-current={isActive(pathname, s.href) ? "page" : undefined}
                  className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-surface aria-[current=page]:bg-surface"
                >
                  <span className="text-label text-blue">{s.index}</span>
                  <span className="text-lg font-semibold leading-snug tracking-tight">{s.label}</span>
                  <span className="text-sm text-muted">{s.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Company dropdown */}
      <div
        id={companyId}
        hidden={open !== "company"}
        className="absolute inset-x-0 top-full border-b border-line bg-bg shadow-[0_24px_48px_-24px_rgba(7,16,30,0.18)]"
        onMouseEnter={() => isFinePointer() && hoverOpen("company")}
      >
        <div className="container-x grid grid-cols-12 gap-7 py-10">
          <div className="col-span-4">
            <p className="text-label text-muted">Company</p>
            <ul className="mt-5 flex flex-col">
              {companyLinks.map((l) => (
                <li key={l.href} className="border-t border-line last:border-b">
                  <Link href={l.href} aria-current={isActive(pathname, l.href) ? "page" : undefined} className="group flex items-baseline justify-between gap-4 py-4">
                    <span className="text-xl font-semibold tracking-tight group-hover:text-blue">{l.label}</span>
                    <span className="text-sm text-muted">{l.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-8 col-start-5 rounded-[var(--radius-card)] border border-line bg-surface p-7">
            <div className="flex items-baseline justify-between">
              <p className="text-label text-muted">Our products</p>
              <Link href="/products" className="text-sm font-medium link-underline pb-0.5">All products →</Link>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-4">
              {productLinks.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="group flex items-center gap-4 rounded-[var(--radius-ctl)] border border-line p-4 transition-colors hover:border-blue">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-label text-cyan">POS</span>
                    <span>
                      <span className="block font-semibold group-hover:text-blue">{p.label}</span>
                      <span className="block text-sm text-muted">{p.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
    </header>
  );
}

function MobileNavigation({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [section, setSection] = useState<"services" | "company" | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const opener = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  const row = "flex w-full items-center justify-between border-b border-line py-4 text-2xl font-semibold tracking-tight";

  return (
    <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Site menu" className="fixed inset-0 z-[60] flex flex-col bg-bg lg:hidden">
      <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-line">
        <Image src={site.logo.horizontal} alt={site.name} width={1548} height={221} className="h-[22px] w-auto" />
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line">
          <X className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto overscroll-contain pb-10 pt-4">
        <Link href="/" className={row} aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
        <button type="button" className={row} aria-expanded={section === "services"} onClick={() => setSection(section === "services" ? null : "services")}>
          Services <ChevronDown aria-hidden className={cn("h-5 w-5 transition-transform", section === "services" && "rotate-180")} />
        </button>
        {section === "services" && (
          <ul className="border-b border-line py-3">
            <li><Link href="/services" className="block py-2.5 font-medium">All services</Link></li>
            {serviceLinks.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="flex gap-3 py-2.5 text-text-2" aria-current={pathname === s.href ? "page" : undefined}>
                  <span className="text-label pt-1 text-blue">{s.index}</span>{s.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/work" className={row}>Work</Link>
        <Link href="/pricing" className={row}>Pricing</Link>
        <button type="button" className={row} aria-expanded={section === "company"} onClick={() => setSection(section === "company" ? null : "company")}>
          Company <ChevronDown aria-hidden className={cn("h-5 w-5 transition-transform", section === "company" && "rotate-180")} />
        </button>
        {section === "company" && (
          <ul className="border-b border-line py-3">
            {companyLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="block py-2.5 text-text-2">{l.label}</Link></li>
            ))}
            <li><Link href="/products" className="block py-2.5 text-text-2">All products</Link></li>
            {productLinks.map((p) => (
              <li key={p.href}><Link href={p.href} className="block py-2.5 text-text-2">{p.label}</Link></li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex flex-col gap-3">
          <ButtonLink href="/start-a-project" size="lg">Start a Project</ButtonLink>
          <ButtonLink href="/estimate" size="lg" variant="secondary">Get an Estimate</ButtonLink>
        </div>
        <p className="mt-8 text-sm text-muted">
          <a href={`mailto:${site.email}`} className="link-underline pb-0.5">{site.email}</a>
        </p>
      </nav>
    </div>
  );
}
