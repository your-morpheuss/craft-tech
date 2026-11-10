/**
 * Web3Forms client (https://docs.web3forms.com).
 * Submissions go straight from the browser to Web3Forms — their API blocks
 * server-side/proxied calls on the free plan. The access key is public by
 * design (it only routes mail to the owner's inbox), hence NEXT_PUBLIC_.
 */
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
export const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";
/** Web3Forms' published free hCaptcha sitekey (enable hCaptcha in the Web3Forms dashboard too). */
export const WEB3FORMS_HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";
export const HCAPTCHA_ENABLED = process.env.NEXT_PUBLIC_WEB3FORMS_HCAPTCHA === "true";

export const isWeb3FormsConfigured = () => /^[0-9a-f-]{36}$/i.test(WEB3FORMS_ACCESS_KEY);

export type Web3FormsResult =
  | { ok: true }
  | { ok: false; kind: "config" | "rate-limit" | "rejected" | "network" | "server"; message: string };

type Payload = Record<string, string | boolean | undefined>;

export async function submitToWeb3Forms(payload: Payload, fetchImpl: typeof fetch = fetch): Promise<Web3FormsResult> {
  if (!isWeb3FormsConfigured()) {
    return { ok: false, kind: "config", message: "The enquiry form isn’t connected yet (missing Web3Forms access key). Nothing was sent — please email us instead." };
  }
  const body: Record<string, string | boolean> = { access_key: WEB3FORMS_ACCESS_KEY };
  for (const [k, v] of Object.entries(payload)) if (v !== undefined && v !== "") body[k] = v;

  let res: Response;
  try {
    res = await fetchImpl(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, kind: "network", message: "We couldn’t reach the form service. Check your connection — nothing was sent." };
  }

  let data: { success?: boolean; message?: string; body?: { message?: string } } | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // An HTTP 200 alone is not enough: Web3Forms reports acceptance via `success`.
  if (res.ok && data?.success === true) return { ok: true };
  if (res.status === 429) return { ok: false, kind: "rate-limit", message: "Too many submissions from this connection. Please wait a while and try again, or email us." };
  if (res.status >= 500) return { ok: false, kind: "server", message: "The form service is having trouble right now. Nothing was sent — please try again shortly." };
  const reason = data?.body?.message ?? data?.message;
  return { ok: false, kind: "rejected", message: reason ? `The form service rejected the submission: ${reason}` : "The submission wasn’t accepted. Please try again or email us." };
}
