import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { articles, readingTime, type Article } from "@/content/insights";

const fmtDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function InsightCard({ a, index }: { a: Article; index: number }) {
  return (
    <Link href={`/insights/${a.slug}`} className="group flex h-full flex-col justify-between gap-12 rounded-[var(--radius-card)] border border-line bg-surface p-7 transition-colors hover:border-ink md:p-8">
      <div className="flex items-center justify-between">
        <span className="text-label text-blue">{String(index + 1).padStart(2, "0")} · {a.category}</span>
        <ArrowUpRight className="h-5 w-5 text-muted transition-[transform,color] duration-300 group-hover:rotate-45 group-hover:text-text" aria-hidden />
      </div>
      <div>
        <h3 className="text-h3 group-hover:text-blue">{a.title}</h3>
        <p className="mt-4 text-text-2">{a.description}</p>
        <p className="text-label mt-8 text-muted">
          <time dateTime={a.published}>{fmtDate(a.published)}</time> · {readingTime(a)} min read
        </p>
      </div>
    </Link>
  );
}

export function InsightCards({ limit = 3, exclude }: { limit?: number; exclude?: string }) {
  const list = articles.filter((a) => a.slug !== exclude).slice(0, limit);
  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-reveal="stagger">
      {list.map((a, i) => (
        <li key={a.slug} data-reveal-item><InsightCard a={a} index={i} /></li>
      ))}
    </ul>
  );
}

export { fmtDate };
