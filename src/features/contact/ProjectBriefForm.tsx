"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { services } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { Chip, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { BUDGETS, CONTACT_METHODS, TIMELINES, projectSchema } from "./schema";
import { Captcha, FormConfigNotice, FormError, FormSuccess, Honeypot } from "./FormStatus";
import { useLeadSubmit } from "./useLeadSubmit";
import type { ServiceId } from "@/features/pricing/types";

type Draft = {
  name: string; email: string; company: string; country: string; contactMethod: string;
  services: ServiceId[]; message: string; website: string; timeline: string; budget: string;
};
const EMPTY: Draft = { name: "", email: "", company: "", country: "", contactMethod: "", services: [], message: "", website: "", timeline: "", budget: "" };
const DRAFT_KEY = "ctl-brief-draft";
const STEPS = ["About you", "Your project", "Review"] as const;

/**
 * Three-step project enquiry. The draft is kept in sessionStorage (cleared when
 * the tab closes or after a successful send) so navigation or a dropped
 * connection doesn't lose work. Nothing is sent until the visitor submits.
 */
export function ProjectBriefForm({ initialService }: { initialService?: ServiceId }) {
  const [step, setStep] = useState(0);
  // Rendered client-side (behind useSearchParams/Suspense), so the draft can be restored lazily.
  const [d, setD] = useState<Draft>(() => {
    const base: Draft = { ...EMPTY, services: initialService ? [initialService] : [] };
    if (typeof window === "undefined") return base;
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      return raw ? { ...base, ...(JSON.parse(raw) as Partial<Draft>) } : base;
    } catch {
      return base;
    }
  });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { state, fieldErrors, submit } = useLeadSubmit("project", projectSchema);
  const [bot, setBot] = useState(false);
  const [token, setToken] = useState("");
  const onToken = useCallback((t: string) => setToken(t), []);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch { /* ignore */ }
  }, [d]);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((cur) => ({ ...cur, [k]: v }));

  // Validate only the fields on the current step, using the same Zod schema as submit.
  const STEP_FIELDS: Record<number, string[]> = { 0: ["name", "email", "country"], 1: ["services", "budget", "timeline", "message"] };
  function validate(s: number) {
    const e: Record<string, string> = {};
    const parsed = projectSchema.safeParse(d);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0]);
        if (STEP_FIELDS[s]?.includes(k) && !e[k]) e[k] = issue.message;
      }
    }
    if (s === 1 && d.website && !/^https?:\/\/\S+\.\S+/.test(d.website.trim())) e.website = "Please enter a full URL, e.g. https://example.com";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function go(next: number) {
    if (next > step && !validate(step)) return;
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  const [consentError, setConsentError] = useState("");
  async function send() {
    if (!consent) { setConsentError("Please confirm we may use these details to reply."); return; }
    setConsentError("");
    const serviceNames = d.services.map((id) => services.find((s) => s.id === id)?.name ?? id).join(", ");
    const ok = await submit(d, {
      fields: {
        name: d.name, email: d.email, company: d.company, country: d.country,
        services_required: serviceNames, budget_range: d.budget, timeline: d.timeline,
        existing_website: d.website.trim(), preferred_contact: d.contactMethod,
      },
      message: d.message,
      replyName: d.name, replyEmail: d.email, botcheck: bot, captchaToken: token || undefined,
    });
    if (ok) {
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    }
  }

  if (state.status === "success") {
    return <FormSuccess title="Thanks — your project brief has been received.">We’ll read it properly and reply by email with questions or a time to talk.</FormSuccess>;
  }

  const err = (k: string) => errors[k] ?? fieldErrors[k];

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface">
      <ol className="grid grid-cols-3 border-b border-line" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className={cn("relative px-4 py-4 text-sm md:px-6", i <= step ? "text-text" : "text-muted")} aria-current={i === step ? "step" : undefined}>
            <span className="text-label block text-blue">0{i + 1}</span>
            <span className="mt-1 block font-medium">{label}</span>
            <span aria-hidden className={cn("absolute inset-x-0 bottom-[-1px] h-0.5 origin-left bg-blue transition-transform duration-500", i <= step ? "scale-x-100" : "scale-x-0")} />
          </li>
        ))}
      </ol>

      <div className="p-6 md:p-10">
        <FormConfigNotice />
        <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-h3 outline-none first:mt-0">{["Who are we talking to?", "What are you planning?", "Check and send"][step]}</h2>

        {step === 0 && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <TextField label="Full name" name="name" autoComplete="name" maxLength={120} value={d.name} onChange={(e) => set("name", e.target.value)} error={err("name")} />
            <TextField label="Work email" name="email" type="email" autoComplete="email" value={d.email} onChange={(e) => set("email", e.target.value)} error={err("email")} />
            <TextField label="Company or brand" name="company" autoComplete="organization" optional value={d.company} onChange={(e) => set("company", e.target.value)} />
            <TextField label="Country" name="country" autoComplete="country-name" maxLength={80} value={d.country} onChange={(e) => set("country", e.target.value)} error={err("country")} />
            <SelectField label="Preferred contact method" name="contactMethod" options={CONTACT_METHODS} optional value={d.contactMethod} onChange={(e) => set("contactMethod", e.target.value)} />
          </div>
        )}

        {step === 1 && (
          <div className="mt-8 flex flex-col gap-7">
            <fieldset>
              <legend className="text-sm font-medium">Required services</legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {services.map((s) => (
                  <Chip key={s.id} name="services" value={s.id} checked={d.services.includes(s.id)} onChange={(on) => set("services", on ? [...d.services, s.id] : d.services.filter((x) => x !== s.id))}>
                    {s.shortName}
                  </Chip>
                ))}
              </div>
              {err("services") && <p className="mt-2 text-sm text-error">{err("services")}</p>}
            </fieldset>
            <TextArea label="Project description" name="message" maxLength={5000} value={d.message} onChange={(e) => set("message", e.target.value)} error={err("message")} placeholder="What do you want to build or improve, who is it for, and what would success look like?" />
            <div className="grid gap-6 sm:grid-cols-3">
              <TextField label="Existing website" name="website" type="url" inputMode="url" placeholder="https://" optional value={d.website} onChange={(e) => set("website", e.target.value)} error={err("website")} />
              <SelectField label="Estimated timeline" name="timeline" options={TIMELINES} value={d.timeline} onChange={(e) => set("timeline", e.target.value)} error={err("timeline")} />
              <SelectField label="Budget range" name="budget" options={BUDGETS} value={d.budget} onChange={(e) => set("budget", e.target.value)} error={err("budget")} hint="Helps us recommend the right scope." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 flex flex-col gap-6">
            <dl className="grid gap-x-8 gap-y-4 rounded-[var(--radius-ctl)] bg-sunk p-6 text-sm sm:grid-cols-2">
              {[
                ["Name", d.name], ["Email", d.email], ["Company", d.company || "—"], ["Country", d.country || "—"],
                ["Services", d.services.map((id) => services.find((s) => s.id === id)?.shortName).join(", ")],
                ["Timeline", d.timeline || "—"], ["Budget", d.budget || "—"], ["Website", d.website || "—"],
              ].map(([k, v]) => (
                <div key={k}><dt className="text-label text-muted">{k}</dt><dd className="mt-1 break-words font-medium">{v}</dd></div>
              ))}
              <div className="sm:col-span-2"><dt className="text-label text-muted">Description</dt><dd className="mt-1 whitespace-pre-wrap">{d.message}</dd></div>
            </dl>
            <label className="flex items-start gap-3 text-sm text-text-2">
              <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setConsentError(""); }} className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--ctl-blue)]" aria-invalid={!!consentError} />
              <span>I agree that Craft Tech Labs may use these details to respond to my enquiry, as described in the <Link href="/privacy-policy" className="text-blue underline underline-offset-2">privacy policy</Link>.</span>
            </label>
            {consentError && <p className="-mt-3 text-sm text-error">{consentError}</p>}
            <Honeypot checked={bot} onChange={setBot} />
            <Captcha onToken={onToken} />
            {Object.keys(fieldErrors).filter((k) => k !== "consent").length > 0 && (
              <p className="text-sm text-error">Some details need attention: {Object.values(fieldErrors).join(" ")}</p>
            )}
            <FormError state={state} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          {step > 0 ? <Button variant="secondary" onClick={() => go(step - 1)}>Back</Button> : <span />}
          {step < 2 ? (
            <Button arrow onClick={() => go(step + 1)}>Continue</Button>
          ) : (
            <Button arrow onClick={send} disabled={state.status === "submitting"} aria-busy={state.status === "submitting"}>
              {state.status === "submitting" ? "Sending…" : "Send project brief"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
