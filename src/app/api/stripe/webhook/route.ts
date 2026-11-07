import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";
import User, { type IUser } from "@/lib/models/User";
import Company from "@/lib/models/Company";
import { escapeHtml } from "@/lib/escapeHtml";
import { sendEmail, emailLayout, emailButton, ADMIN_EMAIL } from "@/lib/email";
import { getStripe, isPaidTier } from "@/lib/stripe";
import { SITE_URL } from "@/lib/siteUrl";

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  select: "Select — $19.99/mo",
  elite: "Verified Pro — $39.99/mo",
};

function idOf(value: string | { id: string } | null | undefined): string | undefined {
  if (!value) return undefined;
  return typeof value === "string" ? value : value.id;
}

/** Sets the plan on a user and on the listing they own. */
async function applyTier(user: IUser, tier: "free" | "select" | "elite") {
  user.tier = tier;
  await user.save();
  if (user.companyId) {
    await Company.updateOne({ _id: user.companyId }, { tier });
    revalidateTag("companies", "max");
  }
}

async function findUserForSubscription(sub: Stripe.Subscription) {
  return (
    (await User.findOne({ stripeSubscriptionId: sub.id })) ??
    (sub.metadata?.userId ? await User.findById(sub.metadata.userId) : null) ??
    (await User.findOne({ stripeCustomerId: idOf(sub.customer) }))
  );
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = idOf(session.customer);
  const subscriptionId = idOf(session.subscription);
  const tier = session.metadata?.tier;

  // 1) Existing vendor upgrading from the dashboard.
  if (session.metadata?.userId) {
    const user = await User.findById(session.metadata.userId);
    if (!user || !isPaidTier(tier)) return;
    user.stripeCustomerId = customerId ?? user.stripeCustomerId;
    user.stripeSubscriptionId = subscriptionId ?? user.stripeSubscriptionId;
    await applyTier(user, tier);
    await sendEmail({
      to: user.email,
      subject: "Your plan has been upgraded — NextCanna Connect",
      html: emailLayout(
        "Upgrade confirmed",
        `<p style="line-height:1.6;color:#4A5E4A">You're now on the <strong>${escapeHtml(TIER_LABELS[tier])}</strong> plan. The new features are already unlocked in your dashboard.</p>
         ${emailButton(`${SITE_URL}/vendor/dashboard`, "Open your dashboard")}`,
      ),
    });
    return;
  }

  // 2) New signup paying for a plan.
  const applicationId = session.metadata?.applicationId;
  if (!applicationId) {
    console.warn("[webhook] checkout without applicationId/userId:", session.id);
    return;
  }
  const app = await SignupApplication.findById(applicationId);
  if (!app) {
    console.warn("[webhook] Application not found:", applicationId);
    return;
  }
  // Only mark as paid — never move an already-approved application back to "pending".
  app.paymentStatus = "paid";
  app.stripeCustomerId = customerId;
  app.stripeSubscriptionId = subscriptionId;
  await app.save();
  await User.updateOne(
    { email: app.email },
    { stripeCustomerId: customerId, stripeSubscriptionId: subscriptionId },
  );

  const tierLabel = escapeHtml(TIER_LABELS[app.tier] ?? app.tier);
  await sendEmail({
    to: app.email,
    subject: "Payment confirmed — NextCanna Connect",
    html: emailLayout(
      "Payment confirmed",
      `<p style="line-height:1.6;color:#4A5E4A">Thank you, <strong>${escapeHtml(app.fullName)}</strong>! Your payment for the
       <strong>${tierLabel}</strong> plan is confirmed. Our team will review your application for
       <strong>${escapeHtml(app.companyName)}</strong> and activate your listing within 1–2 business days.</p>
       <p style="line-height:1.6;color:#4A5E4A">Questions? Email <a href="mailto:hello@nextcannaconnect.com" style="color:#1A4A35">hello@nextcannaconnect.com</a>.</p>`,
    ),
  });
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `Payment received: ${app.companyName} (${TIER_LABELS[app.tier] ?? app.tier})`,
    html: emailLayout(
      "New paid signup — ready to review",
      `<table style="width:100%;border-collapse:collapse;font-size:14px;background:white">
         <tr><td style="padding:8px;font-weight:600">Name</td><td style="padding:8px">${escapeHtml(app.fullName)}</td></tr>
         <tr><td style="padding:8px;font-weight:600">Company</td><td style="padding:8px">${escapeHtml(app.companyName)}</td></tr>
         <tr><td style="padding:8px;font-weight:600">Email</td><td style="padding:8px">${escapeHtml(app.email)}</td></tr>
         <tr><td style="padding:8px;font-weight:600">Plan</td><td style="padding:8px">${tierLabel}</td></tr>
         ${app.claimSlug ? `<tr><td style="padding:8px;font-weight:600">Claiming</td><td style="padding:8px">${escapeHtml(app.claimSlug)}</td></tr>` : ""}
       </table>
       ${emailButton(`${SITE_URL}/admin/users`, "Review application")}`,
    ),
  });
}

async function handleSubscriptionChange(sub: Stripe.Subscription, deleted: boolean) {
  const user = await findUserForSubscription(sub);
  if (!user) {
    console.warn("[webhook] No user for subscription", sub.id);
    return;
  }
  const ended = deleted || ["canceled", "unpaid", "incomplete_expired"].includes(sub.status);
  if (ended) {
    if (user.tier === "free") return;
    user.stripeSubscriptionId = undefined;
    await applyTier(user, "free");
    await sendEmail({
      to: user.email,
      subject: "Your NextCanna Connect subscription has ended",
      html: emailLayout(
        "Your subscription has ended",
        `<p style="line-height:1.6;color:#4A5E4A">Your paid plan has ended and your listing is now on the free plan. Your listing stays live, but paid features are hidden.</p>
         ${emailButton(`${SITE_URL}/vendor/dashboard`, "Re-subscribe from your dashboard")}`,
      ),
    });
    return;
  }
  // Plan changed in the billing portal (e.g. Select ⇄ Verified Pro).
  const tier = sub.metadata?.tier;
  if (sub.status === "active" && isPaidTier(tier) && tier !== user.tier) {
    user.stripeSubscriptionId = sub.id;
    await applyTier(user, tier);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const user = await User.findOne({ stripeCustomerId: idOf(invoice.customer) });
  const to = user?.email ?? invoice.customer_email;
  if (!to) return;
  await sendEmail({
    to,
    subject: "Action needed: your NextCanna Connect payment failed",
    html: emailLayout(
      "We couldn't process your payment",
      `<p style="line-height:1.6;color:#4A5E4A">Your latest subscription payment didn't go through. Please update your card to keep your paid listing features. Stripe will retry automatically.</p>
       ${emailButton(`${SITE_URL}/vendor/dashboard`, "Update payment method")}`,
    ),
  });
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
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    await connectDB();
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription, false);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription, true);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }
  } catch (err) {
    console.error(`[webhook] ${event.type} failed:`, err);
    // 500 makes Stripe retry the event.
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
