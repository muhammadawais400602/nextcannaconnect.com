import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";

const TIER_LABELS: Record<string, string> = {
  free: "Claimed (Free)",
  select: "Select — $49.99/mo",
  elite: "Verified Pro — $99/mo",
};

async function sendEmail(payload: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "NextCanna Connect <hello@nextcannaconnect.com>";
  if (!apiKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...payload }),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const app = await SignupApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!app) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const tierLabel = TIER_LABELS[app.tier] ?? app.tier;

    // Send status email to applicant
    if (status === "approved") {
      await sendEmail({
        to: app.email,
        subject: "Your NextCanna Connect application is approved!",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
            <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
              <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
            </div>
            <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
              <h2 style="color:#1A4A35;margin:0 0 16px">Welcome aboard, ${app.fullName}!</h2>
              <p style="line-height:1.6;color:#4A5E4A">
                Your application for <strong>${app.companyName}</strong> on the <strong>${tierLabel}</strong> plan
                has been <strong style="color:#1A4A35">approved</strong>.
              </p>
              <p style="line-height:1.6;color:#4A5E4A">
                Our team will reach out to you at <strong>${app.email}</strong> within 1 business day
                with your login details and next steps to set up your listing.
              </p>
              <p style="color:#4A5E4A">— The NextCanna Connect Team</p>
            </div>
          </div>
        `,
      });
    } else if (status === "rejected") {
      await sendEmail({
        to: app.email,
        subject: "Update on your NextCanna Connect application",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
            <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
              <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
            </div>
            <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
              <h2 style="color:#1A4A35;margin:0 0 16px">Hi ${app.fullName},</h2>
              <p style="line-height:1.6;color:#4A5E4A">
                Thank you for applying to list <strong>${app.companyName}</strong> on NextCanna Connect.
                After review, we're unable to approve your application at this time.
              </p>
              <p style="line-height:1.6;color:#4A5E4A">
                If you have questions or would like to discuss further, please reply to this email
                or contact us at <a href="mailto:hello@nextcannaconnect.com" style="color:#1A4A35">hello@nextcannaconnect.com</a>.
              </p>
              <p style="color:#4A5E4A">— The NextCanna Connect Team</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, status: app.status });
  } catch (err) {
    console.error("[signups PATCH]", err);
    return NextResponse.json({ error: "Failed to update", detail: String(err) }, { status: 500 });
  }
}
