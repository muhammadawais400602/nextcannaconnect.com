import { sendEmail, emailFooterHtml } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { escapeHtml } from "@/lib/escapeHtml";
import { rateLimit } from "@/lib/rateLimit";
import { EMAIL_RE, isHoneypotTripped, str } from "@/lib/formGuard";
import { ADMIN_EMAIL } from "@/lib/email";


export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!await rateLimit(`contact:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    if (isHoneypotTripped(body)) return NextResponse.json({ success: true });
    const name = str(body.name, 100);
    const email = str(body.email, 200);
    const subject = str(body.subject, 200);
    const message = str(body.message, 5000);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const eName = escapeHtml(name);
    const eEmail = escapeHtml(email);
    const eSubject = escapeHtml(subject);
    const eMessage = escapeHtml(message);

    await sendEmail({
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: `Contact form: ${eSubject} — ${eName}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <h2 style="color:#1A4A35">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Name</td><td style="padding:8px">${eName}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Email</td><td style="padding:8px"><a href="mailto:${eEmail}">${eEmail}</a></td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Subject</td><td style="padding:8px">${eSubject}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Message</td><td style="padding:8px;white-space:pre-wrap">${eMessage}</td></tr>
            </table>
          </div>
        `,
      });

    await sendEmail({
      to: email,
      subject: "We received your message — NextCanna Connect",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
          <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
          </div>
          <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
            <h2 style="color:#1A4A35;margin:0 0 16px">Thanks for reaching out!</h2>
            <p style="line-height:1.6;color:#4A5E4A">
              We've received your message and will get back to you within 1–2 business days.
            </p>
            <p style="line-height:1.6;color:#4A5E4A">
              In the meantime, feel free to explore our
              <a href="https://nextcannaconnect.com/directory" style="color:#1A4A35">business directory</a>
              or read our <a href="https://nextcannaconnect.com/blog" style="color:#1A4A35">blog</a>.
            </p>
            <p style="color:#4A5E4A">— The NextCanna Connect Team</p>
              ${emailFooterHtml()}
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
