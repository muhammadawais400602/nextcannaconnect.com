import { NextRequest, NextResponse } from "next/server";

async function sendEmail(payload: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "NextCanna Connect <noreply@nextcannaconnect.com>";
  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — skipping email");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...payload }),
  });
  if (!res.ok) console.error("[contact] Resend error:", await res.text());
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Notify team
    await sendEmail({
        to: "help@nextcannaconnect.com",
        subject: `Contact form: ${subject} — ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <h2 style="color:#1A4A35">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Name</td><td style="padding:8px">${name}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Subject</td><td style="padding:8px">${subject}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Message</td><td style="padding:8px;white-space:pre-wrap">${message}</td></tr>
            </table>
          </div>
        `,
      });

    // Auto-reply to sender
    await sendEmail({
      to: email,
      subject: "We received your message — NextCanna Connect",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
          <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
          </div>
          <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
            <h2 style="color:#1A4A35;margin:0 0 16px">Thanks for reaching out, ${name}!</h2>
            <p style="line-height:1.6;color:#4A5E4A">
              We've received your message and will get back to you within 1–2 business days.
            </p>
            <div style="background:white;border:1px solid #E8EDE8;border-radius:8px;padding:16px;margin:24px 0">
              <p style="margin:0 0 8px;font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;font-weight:600">Your message</p>
              <p style="font-size:14px;color:#374151;margin:0;white-space:pre-wrap">${message}</p>
            </div>
            <p style="line-height:1.6;color:#4A5E4A">
              In the meantime, feel free to explore our
              <a href="https://nextcannaconnect.com/directory" style="color:#1A4A35">business directory</a>
              or read our <a href="https://nextcannaconnect.com/blog" style="color:#1A4A35">blog</a>.
            </p>
            <p style="color:#4A5E4A">— The NextCanna Connect Team</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
