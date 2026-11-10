"use client";

import Link from "next/link";
import { useCallback, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { CONTACT_METHODS, SERVICE_INTERESTS, contactSchema, demoSchema, estimateEnquirySchema } from "./schema";
import { Captcha, FormConfigNotice, FormError, FormSuccess, Honeypot } from "./FormStatus";
import { useLeadSubmit } from "./useLeadSubmit";

type Variant = "contact" | "pricing" | "demo" | "estimate";

type Props = {
  variant: Variant;
  /** Pre-selected service interest (contact/pricing). */
  interest?: string;
  defaultCountry?: string;
  /** Readable estimate summary appended to the message (estimate variant). */
  estimateSummary?: string;
  /** Structured estimate fields sent as separate Web3Forms fields. */
  estimateFields?: Record<string, string>;
  submitLabel?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  successTitle?: string;
};

const SCHEMAS = { contact: contactSchema, pricing: contactSchema, demo: demoSchema, estimate: estimateEnquirySchema } as const;

/**
 * One form component, four enquiry types — all submitted through Web3Forms
 * with the same validation, honeypot, captcha and error handling.
 */
export function ContactForm({
  variant,
  interest = "",
  defaultCountry = "",
  estimateSummary,
  estimateFields,
  submitLabel = "Send message",
  messageLabel = "How can we help?",
  messagePlaceholder,
  successTitle,
}: Props) {
  const kind = variant;
  const { state, fieldErrors, submit } = useLeadSubmit(kind, SCHEMAS[variant]);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [bot, setBot] = useState(false);
  const [token, setToken] = useState("");
  const onToken = useCallback((t: string) => setToken(t), []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const values = {
      name: v("name"), email: v("email"), phone: v("phone"), interest: v("interest"),
      company: v("company"), business: v("business"), country: v("country"), contactMethod: v("contactMethod"),
      message: v("message"),
    };
    if (!consent) {
      setConsentError("Please confirm we may use these details to reply.");
      return;
    }
    setConsentError("");
    const fields: Record<string, string> = { name: values.name, email: values.email };
    if (values.phone) fields.phone = values.phone;
    if (variant === "contact" || variant === "pricing") fields.service_interest = values.interest;
    if (variant === "demo") Object.assign(fields, { product: "Retail POS", business_name: values.business, country: values.country });
    if (variant === "estimate") Object.assign(fields, { company: values.company, country: values.country, preferred_contact: values.contactMethod }, estimateFields ?? {});
    const message = estimateSummary ? `${values.message}\n\n— — —\n${estimateSummary}` : values.message;
    await submit(values, { fields, message, replyName: values.name, replyEmail: values.email, botcheck: bot, captchaToken: token || undefined });
  }

  if (state.status === "success") {
    return <FormSuccess title={successTitle ?? "Thanks for reaching out."} />;
  }

  const busy = state.status === "submitting";
  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6" aria-busy={busy}>
      <FormConfigNotice />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Full name" name="name" autoComplete="name" maxLength={120} required error={fieldErrors.name} />
        <TextField label="Email" name="email" type="email" autoComplete="email" maxLength={200} required error={fieldErrors.email} />
        {variant === "demo" && <TextField label="Business name" name="business" autoComplete="organization" maxLength={160} required error={fieldErrors.business} />}
        {variant === "estimate" && <TextField label="Company or brand" name="company" autoComplete="organization" maxLength={160} optional error={fieldErrors.company} />}
        {(variant === "demo" || variant === "estimate") && <TextField label="Country" name="country" autoComplete="country-name" defaultValue={defaultCountry} maxLength={80} required error={fieldErrors.country} />}
        {variant !== "estimate" && <TextField label={variant === "demo" ? "Contact number" : "Phone"} name="phone" type="tel" autoComplete="tel" maxLength={40} optional error={fieldErrors.phone} />}
        {(variant === "contact" || variant === "pricing") && (
          <SelectField label="Service interest" name="interest" options={SERVICE_INTERESTS} defaultValue={interest} placeholder="Choose one…" required error={fieldErrors.interest} />
        )}
        {variant === "estimate" && <SelectField label="Preferred contact method" name="contactMethod" options={CONTACT_METHODS} optional error={fieldErrors.contactMethod} />}
      </div>
      <TextArea label={messageLabel} name="message" maxLength={5000} required placeholder={messagePlaceholder} error={fieldErrors.message} />
      <Honeypot checked={bot} onChange={setBot} />
      <Captcha onToken={onToken} />
      <label className="flex items-start gap-3 text-sm text-text-2">
        <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setConsentError(""); }} className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--ctl-blue)]" aria-invalid={!!consentError} aria-describedby={consentError ? `consent-${variant}` : undefined} />
        <span>I agree that Craft Tech Labs may use these details to reply to my enquiry, as described in the <Link href="/privacy-policy" className="text-blue underline underline-offset-2">privacy policy</Link>.</span>
      </label>
      {consentError && <p id={`consent-${variant}`} className="-mt-3 text-sm text-error">{consentError}</p>}
      <FormError state={state} />
      <div>
        <Button type="submit" size="lg" arrow disabled={busy} aria-disabled={busy}>
          {busy ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
