import Link from "next/link";
import { site } from "@/content/site";

export const metadata = { title: "Offline", robots: { index: false } };

/** Served by the service worker when a page isn't cached and there's no connection. */
export default function OfflinePage() {
  return (
    <section className="flex min-h-[80dvh] items-center pt-[var(--header-h)]">
      <div className="container-x py-20">
        <p className="text-label text-blue">You’re offline</p>
        <h1 className="text-h1 mt-6 max-w-[16ch]">This page isn’t saved on your device yet.</h1>
        <p className="text-lede mt-6 max-w-xl text-text-2">
          Pages you’ve already visited still work without a connection. Forms, the estimator’s enquiry step and the assistant need to be online — nothing is sent while you’re offline.
        </p>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-medium">
          <li><Link href="/" className="link-underline pb-0.5">Home</Link></li>
          <li><Link href="/services" className="link-underline pb-0.5">Services</Link></li>
          <li><Link href="/products/retail-pos" className="link-underline pb-0.5">Retail POS</Link></li>
          <li><Link href="/pricing" className="link-underline pb-0.5">Pricing</Link></li>
        </ul>
        <p className="mt-10 text-sm text-muted">Need us urgently? Email {site.email} once you’re back online.</p>
      </div>
    </section>
  );
}
