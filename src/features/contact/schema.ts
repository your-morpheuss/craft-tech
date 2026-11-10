import { z } from "zod";
import { services } from "@/content/services";

export const BUDGETS = ["Under USD 1,000", "USD 1,000–5,000", "USD 5,000–15,000", "Over USD 15,000", "Not sure yet"] as const;
export const TIMELINES = ["As soon as possible", "Within 1–3 months", "In 3–6 months", "Flexible / exploring"] as const;
export const CONTACT_METHODS = ["Email", "Phone / WhatsApp", "Video call"] as const;
export const SERVICE_INTERESTS = [...services.map((s) => s.name), "Retail POS", "Something else"] as const;

const name = z.string().trim().min(2, "Please enter your full name.").max(120, "Please keep this under 120 characters.");
const email = z.string().trim().min(1, "Please enter your email address.").email("Please enter a valid email address.").max(200);
const optional = (max: number) => z.string().trim().max(max, `Please keep this under ${max} characters.`).optional().or(z.literal(""));
const required = (label: string, max: number) => z.string().trim().min(1, `Please enter ${label}.`).max(max, `Please keep this under ${max} characters.`);
const phone = z.string().trim().max(40).regex(/^[+()\d\s-]*$/, "Use digits, spaces, + ( ) and - only.").optional().or(z.literal(""));
const message = (min: number) => z.string().trim().min(min, `Please write at least ${min} characters.`).max(5000, "Please keep this under 5,000 characters.");
const pick = <T extends readonly [string, ...string[]]>(values: T, msg: string) => z.enum(values, { error: msg });

export const contactSchema = z.object({
  name, email, phone,
  interest: z.string().refine((v) => (SERVICE_INTERESTS as readonly string[]).includes(v), "Please choose what you’re interested in."),
  message: message(10),
});

export const projectSchema = z.object({
  name, email,
  company: optional(160),
  country: required("your country", 80),
  services: z.array(z.string()).min(1, "Choose at least one service."),
  budget: pick(BUDGETS, "Please choose a budget range."),
  timeline: pick(TIMELINES, "Please choose a timeline."),
  message: message(20),
});

export const demoSchema = z.object({
  name, email,
  business: required("your business name", 160),
  country: required("your country", 80),
  phone,
  message: message(10),
});

export const estimateEnquirySchema = z.object({
  name, email,
  company: optional(160),
  country: required("your country", 80),
  contactMethod: z.enum(CONTACT_METHODS).optional().or(z.literal("")),
  message: message(10),
});

export type FieldErrors = Record<string, string>;

export function fieldErrorsOf(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
