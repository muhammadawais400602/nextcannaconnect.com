/**
 * Name of the hidden "honeypot" field added to public forms. Real users never
 * see or fill it; most spam bots fill every input. Keep in sync with
 * <HoneypotField />.
 */
export const HONEYPOT_FIELD = "company_website";

export function isHoneypotTripped(body: Record<string, unknown> | null | undefined): boolean {
  const v = body?.[HONEYPOT_FIELD];
  return typeof v === "string" && v.trim().length > 0;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function str(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
