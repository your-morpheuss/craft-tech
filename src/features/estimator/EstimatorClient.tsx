"use client";

import dynamic from "next/dynamic";

/** The estimator restores state from the URL and session, so it renders on the client only. */
export const EstimatorClient = dynamic(() => import("./Estimator").then((m) => m.Estimator), {
  ssr: false,
  loading: () => (
    <div role="status" className="grid gap-10 lg:grid-cols-12" aria-busy="true" aria-label="Loading estimator">
      <div className="h-[28rem] animate-pulse rounded-[var(--radius-card)] bg-sunk lg:col-span-8" />
      <div className="h-64 animate-pulse rounded-[var(--radius-card)] bg-sunk lg:col-span-4" />
    </div>
  ),
});
