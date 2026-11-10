import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function LegalPage({ title, path, updated, children }: { title: string; path: string; updated: string; children: ReactNode }) {
  return (
    <article className="pt-[calc(var(--header-h)+3rem)] md:pt-[calc(var(--header-h)+4.5rem)]">
      <div className="container-x pb-24">
        <Breadcrumbs items={[{ name: title, path }]} />
        <div className="grid-12 mt-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-8 lg:col-start-3">
            <h1 className="text-h1">{title}</h1>
            <p className="text-label mt-6 text-muted">Last updated {updated}</p>
            <p role="note" className="mt-8 rounded-[var(--radius-ctl)] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              Draft for review. This page describes how this website currently works and must be reviewed by a qualified legal adviser before being relied on.
            </p>
            <div className="prose-ctl mt-10">{children}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
