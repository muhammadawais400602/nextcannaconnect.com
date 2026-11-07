import Stripe from "stripe";
import { SITE_URL } from "@/lib/siteUrl";

export type PaidTier = "select" | "elite";

export const TIER_PRICES: Record<PaidTier, { unit_amount: number; name: string }> = {
  select: { unit_amount: 1999, name: "NextCanna Connect Select — $19.99/mo" },
  elite: { unit_amount: 3999, name: "NextCanna Connect Verified Pro — $39.99/mo" },
};

export function isPaidTier(tier: unknown): tier is PaidTier {
  return tier === "select" || tier === "elite";
}

export function stripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key);
}

/** Creates a monthly subscription Checkout session for a plan. */
export async function createSubscriptionCheckout(opts: {
  tier: PaidTier;
  email: string;
  customerId?: string;
  metadata: Record<string, string>;
  successPath: string;
  cancelPath: string;
}): Promise<Stripe.Checkout.Session> {
  const price = TIER_PRICES[opts.tier];
  return getStripe().checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price_data: {
          currency: "usd",
          recurring: { interval: "month" },
          product_data: { name: price.name },
          unit_amount: price.unit_amount,
        },
        quantity: 1,
      },
    ],
    ...(opts.customerId ? { customer: opts.customerId } : { customer_email: opts.email }),
    metadata: { ...opts.metadata, tier: opts.tier },
    // Copy metadata onto the subscription so later subscription events can be matched.
    subscription_data: { metadata: { ...opts.metadata, tier: opts.tier } },
    success_url: `${SITE_URL}${opts.successPath}`,
    cancel_url: `${SITE_URL}${opts.cancelPath}`,
  });
}
