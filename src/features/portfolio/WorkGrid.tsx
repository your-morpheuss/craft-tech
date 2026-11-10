"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CaseStudy } from "@/content/work";

type Item = Pick<CaseStudy, "slug" | "title" | "category" | "year" | "summary" | "scope" | "hero">;

/**
 * Portfolio listing with category filters. Filters only appear for categories
 * that actually have work, and only when there's more than one.
 */
export function WorkGrid({ items, categories }: { items: Item[]; categories: string[] }) {
  const [filter, setFilter] = useState<string>("All");
  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);
  const [featured, ...rest] = visible;

  return (
    <div>
      {categories.length > 1 && (
        <div role="group" aria-label="Filter by category" className="mb-10 flex flex-wrap gap-2">
          {["All", ...categories].map((c) => (
            <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)} className={cn("h-10 rounded-full border px-4 text-sm font-medium transition-colors", filter === c ? "border-ink bg-ink text-white" : "border-line-strong hover:border-ink")}>
              {c}
            </button>
          ))}
        </div>
      )}

      {featured && (
        <Link href={`/work/${featured.slug}`} className="group grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface lg:grid-cols-12" data-reveal="up">
          <div className="relative aspect-[16/9] overflow-hidden bg-ink lg:col-span-8 lg:aspect-auto lg:min-h-[28rem]">
            <Image src={featured.hero.src} alt={featured.hero.alt} fill sizes="(min-width:1024px) 66vw, 100vw" className="object-cover transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.03]" priority />
          </div>
          <div className="flex flex-col justify-between gap-10 p-8 md:p-10 lg:col-span-4">
            <div>
              <p className="text-label text-blue">Featured · {featured.category} · {featured.year}</p>
              <h2 className="mt-5 text-h2">{featured.title}</h2>
              <p className="mt-4 text-text-2">{featured.summary}</p>
            </div>
            <div>
              <ul className="mb-8 flex flex-wrap gap-2">
                {featured.scope.map((s) => <li key={s} className="rounded-full border border-line px-3 py-1 text-sm text-text-2">{s}</li>)}
              </ul>
              <span className="inline-flex items-center gap-2 font-medium">Read the case study <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" aria-hidden /></span>
            </div>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <ul className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((w) => (
            <li key={w.slug}>
              <Link href={`/work/${w.slug}`} className="group block overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
                <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                  <Image src={w.hero.src} alt={w.hero.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="p-6">
                  <p className="text-label text-blue">{w.category} · {w.year}</p>
                  <h2 className="mt-3 text-h3">{w.title}</h2>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {visible.length === 0 && <p className="rounded-[var(--radius-card)] border border-dashed border-line-strong p-10 text-center text-text-2">No published case studies in this category yet.</p>}
    </div>
  );
}
