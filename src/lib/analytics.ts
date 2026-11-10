"use client";

/**
 * Provider-agnostic conversion events. Nothing is sent unless an analytics
 * provider has been installed AND the visitor has consented — the provider's
 * loader should set `window.__ctlAnalyticsConsent = true` and push events from
 * `window.dataLayer`. No personal data is ever included in event params.
 */
export type ConversionEvent =
  | "lead_submitted"
  | "estimate_started"
  | "estimate_completed"
  | "demo_requested"
  | "chat_opened"
  | "chat_handoff_clicked";

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    __ctlAnalyticsConsent?: boolean;
  }
}

export function track(event: ConversionEvent, params: Params = {}) {
  if (typeof window === "undefined" || !window.__ctlAnalyticsConsent) return;
  (window.dataLayer ??= []).push({ event, ...params });
}
