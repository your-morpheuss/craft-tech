"use client";

import { useRef, useState } from "react";
import type { z } from "zod";
import { track } from "@/lib/analytics";
import { HCAPTCHA_ENABLED, submitToWeb3Forms } from "@/lib/web3forms";
import { fieldErrorsOf, type FieldErrors } from "./schema";

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string; kind?: string };

export type LeadKind = "contact" | "pricing" | "project" | "demo" | "estimate";

const SUBJECTS: Record<LeadKind, string> = {
  contact: "New contact enquiry",
  pricing: "New pricing enquiry",
  project: "New project brief",
  demo: "Retail POS demo request",
  estimate: "New project estimate",
};

/**
 * Shared form pipeline: validate with Zod → honeypot → (optional hCaptcha) →
 * Web3Forms → confirm `success`. Guards against double submits; never shows
 * success unless Web3Forms accepted the submission.
 */
export function useLeadSubmit<S extends z.ZodType>(kind: LeadKind, schema: S) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const inFlight = useRef(false);

  async function submit(
    values: unknown,
    opts: { fields: Record<string, string>; message: string; replyName: string; replyEmail: string; botcheck: boolean; captchaToken?: string },
  ): Promise<boolean> {
    if (inFlight.current || state.status === "success") return false;
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(fieldErrorsOf(parsed.error));
      setState({ status: "error", message: "Please check the highlighted fields.", kind: "validation" });
      return false;
    }
    setFieldErrors({});
    // Honeypot ticked → behave like success to the bot, send nothing.
    if (opts.botcheck) {
      setState({ status: "success" });
      return true;
    }
    if (HCAPTCHA_ENABLED && !opts.captchaToken) {
      setState({ status: "error", message: "Please complete the captcha.", kind: "captcha" });
      return false;
    }
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setState({ status: "error", message: "You’re offline. Your answers are still here — submit again once you’re connected. Nothing was sent.", kind: "network" });
      return false;
    }

    inFlight.current = true;
    setState({ status: "submitting" });
    const result = await submitToWeb3Forms({
      subject: `${SUBJECTS[kind]} — ${opts.replyName}`,
      from_name: "Craft Tech Labs Website",
      replyto: opts.replyEmail,
      enquiry_type: SUBJECTS[kind],
      ...opts.fields,
      message: opts.message,
      ...(opts.captchaToken ? { "h-captcha-response": opts.captchaToken } : {}),
    });
    inFlight.current = false;

    if (result.ok) {
      track(kind === "demo" ? "demo_requested" : "lead_submitted", { lead_type: kind });
      setState({ status: "success" });
      return true;
    }
    setState({ status: "error", message: result.message, kind: result.kind });
    return false;
  }

  return { state, fieldErrors, setFieldErrors, submit };
}
