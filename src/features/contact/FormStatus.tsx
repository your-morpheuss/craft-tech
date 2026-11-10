"use client";

import Script from "next/script";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, PlugZap } from "lucide-react";
import { site } from "@/content/site";
import { HCAPTCHA_ENABLED, WEB3FORMS_HCAPTCHA_SITEKEY, isWeb3FormsConfigured } from "@/lib/web3forms";
import type { SubmitState } from "./useLeadSubmit";

export function FormError({ state }: { state: SubmitState }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === "error" && state.kind !== "validation") ref.current?.focus();
  }, [state]);
  if (state.status !== "error") return null;
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="flex gap-3 rounded-[var(--radius-ctl)] border border-error/30 bg-error/5 p-4 text-sm text-error outline-none">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>
        {state.message}
        {state.kind && !["validation", "captcha"].includes(state.kind) && (
          <> You can also email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</>
        )}
      </p>
    </div>
  );
}

export function FormSuccess({ title = "Thanks for reaching out.", children }: { title?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div ref={ref} tabIndex={-1} role="status" className="ct-line-in rounded-[var(--radius-card)] border border-line bg-surface p-8 outline-none md:p-10">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10"><CheckCircle2 className="h-6 w-6 text-success" strokeWidth={1.75} aria-hidden /></span>
      <h3 className="mt-6 text-h3">{title}</h3>
      <p className="mt-3 max-w-prose text-text-2">{children ?? "Your enquiry has been received. We’ll reply by email."}</p>
    </div>
  );
}

/** Honest notice when the Web3Forms key isn't configured. */
export function FormConfigNotice() {
  if (isWeb3FormsConfigured()) return null;
  return (
    <div role="note" className="flex gap-3 rounded-[var(--radius-ctl)] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <PlugZap className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p>
        {process.env.NODE_ENV === "production"
          ? <>Online enquiries are temporarily unavailable. Please email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</>
          : <><strong>Configuration required:</strong> set <code>NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY</code> in <code>.env.local</code>. Submissions will fail honestly until then.</>}
      </p>
    </div>
  );
}

/** Web3Forms' official honeypot: an unchecked, visually hidden checkbox. */
export function Honeypot({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" style={{ display: "none" }} checked={checked} onChange={(e) => onChange(e.target.checked)} />
  );
}

type HCaptchaApi = { render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void }) => string; reset: (id?: string) => void };

/** Optional hCaptcha (free with Web3Forms' shared sitekey). Enabled by NEXT_PUBLIC_WEB3FORMS_HCAPTCHA=true. */
export function Captcha({ onToken }: { onToken: (t: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const rendered = useRef(false);
  const id = useId();
  useEffect(() => {
    if (!HCAPTCHA_ENABLED) return;
    const tryRender = () => {
      const api = (window as unknown as { hcaptcha?: HCaptchaApi }).hcaptcha;
      if (!api || !box.current || rendered.current) return false;
      api.render(box.current, { sitekey: WEB3FORMS_HCAPTCHA_SITEKEY, callback: onToken, "expired-callback": () => onToken("") });
      rendered.current = true;
      return true;
    };
    if (tryRender()) return;
    const t = window.setInterval(() => tryRender() && window.clearInterval(t), 300);
    return () => window.clearInterval(t);
  }, [onToken]);
  if (!HCAPTCHA_ENABLED) return null;
  return (
    <>
      <Script src="https://js.hcaptcha.com/1/api.js?render=explicit" strategy="lazyOnload" />
      <div id={id} ref={box} />
    </>
  );
}
