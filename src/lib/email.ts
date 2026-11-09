import { escapeHtml } from "@/lib/escapeHtml";
import { SITE_URL } from "@/lib/siteUrl";

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "NextCanna Connect <noreply@nextcannaconnect.com>";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "help@nextcannaconnect.com";
/** Business mailing address shown in email footers (CAN-SPAM). Set COMPANY_POSTAL_ADDRESS in Vercel. */
const POSTAL_ADDRESS = process.env.COMPANY_POSTAL_ADDRESS || "";

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/** Sends an email through Resend. Returns false (and logs) instead of throwing. */
export async function sendEmail({ replyTo, ...payload }: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set — email NOT sent:", payload.subject);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM_EMAIL, ...payload, ...(replyTo ? { reply_to: replyTo } : {}) }),
      // Never let a slow email provider hold up signup, inquiries etc.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[email] Resend error:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

/** Footer line with the business mailing address (CAN-SPAM), empty if not configured. */
export function emailFooterHtml(): string {
  return POSTAL_ADDRESS
    ? `<p style="text-align:center;font-size:12px;color:#9CA3AF;margin:16px 0 0">NextCanna Connect · ${escapeHtml(POSTAL_ADDRESS)}</p>`
    : "";
}

/** Branded wrapper used by transactional emails. `bodyHtml` must already be escaped. */
export function emailLayout(heading: string, bodyHtml: string): string {
  return `
  <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
    <div style="background:#1A4A35;padding:28px;text-align:center;border-radius:12px 12px 0 0">
      <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
    </div>
    <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
      <h2 style="color:#1A4A35;margin:0 0 16px">${escapeHtml(heading)}</h2>
      ${bodyHtml}
      <p style="color:#4A5E4A;margin-top:24px">— The NextCanna Connect Team</p>
    </div>
    <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-top:12px">
      <a href="${SITE_URL}" style="color:#9CA3AF">nextcannaconnect.com</a>
      ${POSTAL_ADDRESS ? `<br />${escapeHtml(POSTAL_ADDRESS)}` : ""}
    </p>
  </div>`;
}

export function emailButton(href: string, label: string): string {
  return `<p style="margin:24px 0"><a href="${escapeHtml(href)}" style="background:#1A4A35;color:white;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">${escapeHtml(label)}</a></p>`;
}
