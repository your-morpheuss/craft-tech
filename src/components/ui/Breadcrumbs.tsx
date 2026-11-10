import Link from "next/link";
import { breadcrumbSchema, JsonLd } from "@/lib/seo";
import { cn } from "@/lib/cn";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, dark }: { items: Crumb[]; dark?: boolean }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className={cn("text-label flex flex-wrap items-center gap-2", dark ? "text-d-muted" : "text-muted")}>
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className={dark ? "text-white" : "text-text"}>{c.name}</span>
              ) : (
                <Link href={c.path} className="link-underline pb-0.5 hover:text-current">{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  );
}
