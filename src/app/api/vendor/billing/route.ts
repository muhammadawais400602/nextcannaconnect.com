import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyVendorSession, VENDOR_SESSION_COOKIE } from "@/lib/verifyVendorSession";
import { createSubscriptionCheckout, getStripe, isPaidTier, stripeConfigured } from "@/lib/stripe";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * POST { action: "upgrade", tier } — start a Checkout session for a vendor without
 *   a subscription (existing vendors could not upgrade before: signup returned 409).
 * POST { action: "portal" } — open the Stripe billing portal to change plan,
 *   update the card, see invoices or cancel.
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyVendorSession(request.cookies.get(VENDOR_SESSION_COOKIE)?.value);
    if (!userId) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
    if (!stripeConfigured()) {
      return NextResponse.json(
        { error: "Online billing isn't available right now. Please email help@nextcannaconnect.com." },
        { status: 503 },
      );
    }

    const { action, tier } = await request.json().catch(() => ({}));
    await connectDB();
    const user = await User.findById(userId).select("email tier stripeCustomerId stripeSubscriptionId");
    if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    const wantsPortal = action === "portal" || (action === "upgrade" && user.stripeSubscriptionId);
    if (wantsPortal) {
      if (!user.stripeCustomerId) {
        return NextResponse.json(
          { error: "No billing account found. Please email help@nextcannaconnect.com." },
          { status: 400 },
        );
      }
      const portal = await getStripe().billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${SITE_URL}/vendor/dashboard`,
      });
      return NextResponse.json({ url: portal.url });
    }

    if (action !== "upgrade" || !isPaidTier(tier)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (user.tier === tier || (user.tier === "elite" && tier === "select")) {
      return NextResponse.json({ error: "You're already on this plan or higher." }, { status: 400 });
    }

    const session = await createSubscriptionCheckout({
      tier,
      email: user.email,
      customerId: user.stripeCustomerId,
      metadata: { userId: String(user._id) },
      successPath: "/vendor/dashboard?upgraded=1",
      cancelPath: "/vendor/dashboard",
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[vendor/billing]", err);
    return NextResponse.json({ error: "Couldn't open billing. Please try again." }, { status: 500 });
  }
}
