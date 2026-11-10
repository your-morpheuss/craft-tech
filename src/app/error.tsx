"use client";

import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="flex min-h-[80dvh] items-center pt-[var(--header-h)]">
      <div className="container-x py-20">
        <p className="text-label text-blue">Something went wrong</p>
        <h1 className="text-h1 mt-6 max-w-[16ch]">This section didn’t load properly.</h1>
        <p className="text-lede mt-6 max-w-xl text-text-2">It’s on our side, not yours. Try again — if it keeps happening, email <a className="text-blue underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" onClick={reset} arrow>Try again</Button>
          <ButtonLink href="/" variant="secondary" size="lg">Back to Home</ButtonLink>
        </div>
        <p className="mt-10 text-sm text-muted">Or go to <Link className="underline" href="/services">Services</Link> · <Link className="underline" href="/contact">Contact</Link></p>
      </div>
    </section>
  );
}
