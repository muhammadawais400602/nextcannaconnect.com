import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";

const TIER_LABELS: Record<string, string> = {
  free: "Claimed (Free)",
  select: "Select — $49.99/mo",
  elite: "Verified Pro — $99/mo",
};

const TIER_PRICES: Record<string, { unit_amount: number; name: string }> = {
  select: { unit_amount: 4999, name: "NextCanna Select — $49.99/mo" },
  elite:  { unit_amount: 9900, name: "NextCanna Verified Pro — $99/mo" },
};

const isDemoMode = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "demo";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === "demo") throw new Error("Stripe not configured");
  return new Stripe(key);
}

async function sendEmail(payload: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "NextCanna Connect <noreply@nextcannaconnect.com>";
  if (!apiKey) {
    console.warn("[signup] RESEND_API_KEY not set — skipping email");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...payload }),
  });
  if (!res.ok) console.error("[signup] Resend error:", await res.text());
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const { fullName, companyName, email, phone, stateProvince, category,
            tier, website, description, publicPhone, serviceArea,
            certifications, socialLink, contactName } = body;

    if (!fullName || !companyName || !email || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isPaid = tier === "select" || tier === "elite";

    // Save application
    const app = await SignupApplication.create({
      fullName, companyName, email, phone, stateProvince, category,
      tier, website, description, publicPhone, serviceArea,
      certifications, socialLink, contactName,
      paymentStatus: isPaid ? "awaiting_payment" : "not_required",
    });

    // Paid tiers → create Stripe Checkout session (or demo redirect)
    if (isPaid) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      // Demo mode: skip Stripe, redirect straight to success page
      if (isDemoMode) {
        await SignupApplication.findByIdAndUpdate(app._id, { paymentStatus: "paid" });
        return NextResponse.json({ checkoutUrl: `${appUrl}/signup/success?demo=true` });
      }

      const priceInfo = TIER_PRICES[tier];
      const stripe = getStripe();

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              recurring: { interval: "month" },
              product_data: { name: priceInfo.name },
              unit_amount: priceInfo.unit_amount,
            },
            quantity: 1,
          },
        ],
        customer_email: email,
        metadata: {
          applicationId: String(app._id),
          tier,
          companyName,
          fullName,
        },
        success_url: `${appUrl}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/signup?tier=${tier}`,
      });

      // Store the session ID
      await SignupApplication.findByIdAndUpdate(app._id, { stripeSessionId: session.id });

      return NextResponse.json({ checkoutUrl: session.url });
    }

    // Free tier — send confirmation emails
    const tierLabel = TIER_LABELS[tier] ?? tier;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;

    await sendEmail({
      to: email,
      subject: "You're on the list — NextCanna Connect",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
          <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
          </div>
          <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
            <h2 style="color:#1A4A35;margin:0 0 16px">Welcome, ${fullName}!</h2>
            <p style="line-height:1.6;color:#4A5E4A">
              We've received your application for the <strong>${tierLabel}</strong> plan
              for <strong>${companyName}</strong>. Our team will review your information
              and reach out within 1–2 business days.
            </p>
            <div style="background:white;border:1px solid #E8EDE8;border-radius:8px;padding:16px;margin:24px 0">
              <p style="margin:0 0 8px;font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;font-weight:600">Your Application</p>
              <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse">
                <tr><td style="padding:4px 0;color:#6B7280">Plan</td><td style="padding:4px 0"><strong>${tierLabel}</strong></td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Company</td><td style="padding:4px 0">${companyName}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Email</td><td style="padding:4px 0">${email}</td></tr>
                ${stateProvince ? `<tr><td style="padding:4px 0;color:#6B7280">Location</td><td style="padding:4px 0">${stateProvince}</td></tr>` : ""}
              </table>
            </div>
            <p style="line-height:1.6;color:#4A5E4A">
              If you have any questions, contact us at
              <a href="mailto:hello@nextcannaconnect.com" style="color:#1A4A35">hello@nextcannaconnect.com</a>.
            </p>
            <p style="color:#4A5E4A">— The NextCanna Connect Team</p>
          </div>
        </div>
      `,
    });

    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New signup: ${companyName} (${tierLabel})`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <h2 style="color:#1A4A35">New Signup Application</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Name</td><td style="padding:8px">${fullName}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Company</td><td style="padding:8px">${companyName}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Phone</td><td style="padding:8px">${phone || "—"}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Plan</td><td style="padding:8px">${tierLabel}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">State</td><td style="padding:8px">${stateProvince || "—"}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Category</td><td style="padding:8px">${category || "—"}</td></tr>
              ${website ? `<tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Website</td><td style="padding:8px">${website}</td></tr>` : ""}
              ${description ? `<tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Description</td><td style="padding:8px">${description}</td></tr>` : ""}
            </table>
            <p style="margin-top:16px;font-size:13px;color:#6B7280">Application ID: ${app._id}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[signup] Error:", err);
    return NextResponse.json({ error: "Failed to submit application", detail: String(err) }, { status: 500 });
  }
}
