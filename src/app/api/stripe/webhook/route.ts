import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";
import { escapeHtml } from "@/lib/escapeHtml";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

async function sendEmail(payload: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "NextCanna Connect <noreply@nextcannaconnect.com>";
  if (!apiKey) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...payload }),
  });
  if (!res.ok) console.error("[webhook] Resend error:", await res.text());
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const applicationId = session.metadata?.applicationId;

    if (!applicationId) {
      console.warn("[webhook] No applicationId in session metadata");
      return NextResponse.json({ received: true });
    }

    try {
      await connectDB();
      const app = await SignupApplication.findByIdAndUpdate(
        applicationId,
        { paymentStatus: "paid", status: "pending" },
        { new: true }
      );

      if (!app) {
        console.warn("[webhook] Application not found:", applicationId);
        return NextResponse.json({ received: true });
      }

      const tierLabels: Record<string, string> = {
        select: "Select — $49.99/mo",
        elite: "Verified Pro — $99/mo",
      };
      const tierLabel = tierLabels[app.tier] ?? app.tier;
      const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;

      // Confirmation to applicant
      await sendEmail({
        to: app.email,
        subject: "Payment confirmed — NextCanna Connect",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
            <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
              <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
            </div>
            <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
              <h2 style="color:#1A4A35;margin:0 0 16px">Payment Confirmed!</h2>
              <p style="line-height:1.6;color:#4A5E4A">
                Thank you, <strong>${escapeHtml(app.fullName)}</strong>! Your payment for the
                <strong>${tierLabel}</strong> plan has been confirmed.
                Our team will review your application for <strong>${escapeHtml(app.companyName)}</strong>
                and activate your listing within 1–2 business days.
              </p>
              <div style="background:white;border:1px solid #E8EDE8;border-radius:8px;padding:16px;margin:24px 0">
                <p style="margin:0 0 8px;font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;font-weight:600">Subscription Details</p>
                <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse">
                  <tr><td style="padding:4px 0;color:#6B7280">Plan</td><td style="padding:4px 0"><strong>${tierLabel}</strong></td></tr>
                  <tr><td style="padding:4px 0;color:#6B7280">Company</td><td style="padding:4px 0">${escapeHtml(app.companyName)}</td></tr>
                  <tr><td style="padding:4px 0;color:#6B7280">Email</td><td style="padding:4px 0">${escapeHtml(app.email)}</td></tr>
                </table>
              </div>
              <p style="line-height:1.6;color:#4A5E4A">
                Questions? Email us at
                <a href="mailto:hello@nextcannaconnect.com" style="color:#1A4A35">hello@nextcannaconnect.com</a>.
              </p>
              <p style="color:#4A5E4A">— The NextCanna Connect Team</p>
            </div>
          </div>
        `,
      });

      // Notification to admin
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `Payment received: ${escapeHtml(app.companyName)} (${tierLabel})`,
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
              <h2 style="color:#1A4A35">New Paid Signup</h2>
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Name</td><td style="padding:8px">${escapeHtml(app.fullName)}</td></tr>
                <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Company</td><td style="padding:8px">${escapeHtml(app.companyName)}</td></tr>
                <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Email</td><td style="padding:8px"><a href="mailto:${escapeHtml(app.email)}">${escapeHtml(app.email)}</a></td></tr>
                <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Plan</td><td style="padding:8px">${tierLabel}</td></tr>
                <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Stripe Session</td><td style="padding:8px">${session.id}</td></tr>
              </table>
              <p style="margin-top:16px;font-size:13px;color:#6B7280">Application ID: ${app._id}</p>
            </div>
          `,
        });
      }
    } catch (err) {
      console.error("[webhook] DB update error:", err);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
