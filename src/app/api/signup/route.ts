import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";
import User from "@/lib/models/User";
import { escapeHtml } from "@/lib/escapeHtml";
import { rateLimit } from "@/lib/rateLimit";

const TIER_LABELS: Record<string, string> = {
  free: "Claimed (Free)",
  select: "Select — $49.99/mo",
  elite: "Verified Pro — $99/mo",
};

const TIER_PRICES: Record<string, { unit_amount: number; name: string }> = {
  select: { unit_amount: 4999, name: "NextCanna Connect Select — $49.99/mo" },
  elite:  { unit_amount: 9900, name: "NextCanna Connect Verified Pro — $99/mo" },
};

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
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
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!rateLimit(`signup:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    await connectDB();
    const body = await request.json();

    const { fullName, companyName, email, password, phone, stateProvince, category,
            tier, website, description, publicPhone, serviceArea,
            certifications, socialLink, contactName, categoryDetails } = body;

    if (!fullName || !companyName || !email || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists. Please sign in instead." }, { status: 409 });
    }

    const isPaid = tier === "select" || tier === "elite";

    // Create user account first (has unique index on email — fail fast on duplicates)
    const passwordHash = await bcrypt.hash(password, 12);
    try {
      await User.create({
        email: normalizedEmail,
        fullName,
        companyName,
        phone,
        stateProvince,
        category,
        tier,
        passwordHash,
        isActive: !isPaid,
      });
    } catch (userErr: unknown) {
      if (userErr && typeof userErr === "object" && "code" in userErr && (userErr as { code: number }).code === 11000) {
        return NextResponse.json({ error: "An account with this email already exists. Please sign in instead." }, { status: 409 });
      }
      throw userErr;
    }

    // Save application
    const app = await SignupApplication.create({
      fullName, companyName, email: normalizedEmail, phone, stateProvince, category,
      tier, website, description, publicPhone, serviceArea,
      certifications, socialLink, contactName,
      categoryDetails: categoryDetails && typeof categoryDetails === "object" ? categoryDetails : {},
      paymentStatus: isPaid ? "awaiting_payment" : "not_required",
    });

    // Paid tiers → create Stripe Checkout session (if Stripe is configured)
    if (isPaid && process.env.STRIPE_SECRET_KEY) {
      const priceInfo = TIER_PRICES[tier];
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
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

      await SignupApplication.findByIdAndUpdate(app._id, { stripeSessionId: session.id });

      return NextResponse.json({ checkoutUrl: session.url });
    }

    if (isPaid) {
      console.warn("[signup] STRIPE_SECRET_KEY not set — skipping checkout for paid tier");
      await SignupApplication.findByIdAndUpdate(app._id, { paymentStatus: "pending_manual" });
    }

    // Send confirmation emails
    const tierLabel = TIER_LABELS[tier] ?? tier;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;

    const eName = escapeHtml(fullName);
    const eCompany = escapeHtml(companyName);
    const eEmail = escapeHtml(email);
    const eState = stateProvince ? escapeHtml(stateProvince) : "";
    const ePhone = phone ? escapeHtml(phone) : "";
    const eCategory = category ? escapeHtml(category) : "";
    const eWebsite = website ? escapeHtml(website) : "";
    const eDescription = description ? escapeHtml(description) : "";

    await sendEmail({
      to: email,
      subject: "You're on the list — NextCanna Connect",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
          <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
          </div>
          <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
            <h2 style="color:#1A4A35;margin:0 0 16px">Welcome, ${eName}!</h2>
            <p style="line-height:1.6;color:#4A5E4A">
              We've received your application for the <strong>${escapeHtml(tierLabel)}</strong> plan
              for <strong>${eCompany}</strong>. Our team will review your information
              and reach out within 1–2 business days.
            </p>
            <div style="background:white;border:1px solid #E8EDE8;border-radius:8px;padding:16px;margin:24px 0">
              <p style="margin:0 0 8px;font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;font-weight:600">Your Application</p>
              <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse">
                <tr><td style="padding:4px 0;color:#6B7280">Plan</td><td style="padding:4px 0"><strong>${escapeHtml(tierLabel)}</strong></td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Company</td><td style="padding:4px 0">${eCompany}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Email</td><td style="padding:4px 0">${eEmail}</td></tr>
                ${eState ? `<tr><td style="padding:4px 0;color:#6B7280">Location</td><td style="padding:4px 0">${eState}</td></tr>` : ""}
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
        subject: `New signup: ${eCompany} (${escapeHtml(tierLabel)})`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <h2 style="color:#1A4A35">New Signup Application</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Name</td><td style="padding:8px">${eName}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Company</td><td style="padding:8px">${eCompany}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Email</td><td style="padding:8px"><a href="mailto:${eEmail}">${eEmail}</a></td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Phone</td><td style="padding:8px">${ePhone || "—"}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Plan</td><td style="padding:8px">${escapeHtml(tierLabel)}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">State</td><td style="padding:8px">${eState || "—"}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Category</td><td style="padding:8px">${eCategory || "—"}</td></tr>
              ${eWebsite ? `<tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Website</td><td style="padding:8px">${eWebsite}</td></tr>` : ""}
              ${eDescription ? `<tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Description</td><td style="padding:8px">${eDescription}</td></tr>` : ""}
              ${categoryDetails && typeof categoryDetails === "object"
                ? Object.entries(categoryDetails)
                    .filter(([, v]) => v)
                    .map(([k, v]) => `<tr><td style="padding:8px;background:#F7F9F7;font-weight:600">${escapeHtml(String(k))}</td><td style="padding:8px">${escapeHtml(String(v))}</td></tr>`)
                    .join("")
                : ""}
            </table>
            <p style="margin-top:16px;font-size:13px;color:#6B7280">Application ID: ${app._id}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[signup] Error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
