import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";
import SignupApplication from "@/lib/models/SignupApplication";
import { getStripe, stripeConfigured } from "@/lib/stripe";

// Admin-only: /api/admin/* is protected by the admin session in middleware.

// Never send credentials or tokens to the browser, even to admins.
const SAFE_FIELDS = "-__v -passwordHash -setupToken -setupTokenExpires -resetToken -resetTokenExpires -sessionVersion";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get("tier");
    const accountType = searchParams.get("accountType");

    const filter: Record<string, string> = {};
    if (tier) filter.tier = tier;
    if (accountType) filter.accountType = accountType;

    const users = await User.find(filter).sort({ createdAt: -1 }).select(SAFE_FIELDS).lean();
    const companyIds = users.map((u) => u.companyId).filter((c): c is mongoose.Types.ObjectId => !!c);
    const companies = await Company.find({ _id: { $in: companyIds } }).select("slug name").lean();
    const byId = new Map(companies.map((c) => [String(c._id), { slug: c.slug, name: c.name }]));

    return NextResponse.json({
      users: users.map((u) => ({ ...u, listing: u.companyId ? byId.get(String(u.companyId)) ?? null : null })),
      total: users.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

/** Change a user's plan — applied to their listing too, so badges/features match. */
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const { id, tier } = await request.json();
    if (!["free", "select", "elite"].includes(tier)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    const user = await User.findByIdAndUpdate(id, { tier }, { returnDocument: "after" }).select(SAFE_FIELDS).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.companyId) {
      await Company.updateOne({ _id: user.companyId }, { tier });
      revalidateTag("companies", "max");
    }
    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

/**
 * DELETE { id, deleteListing } — removes a user account and their signup
 * applications; optionally their listing too. Cancels any Stripe subscription
 * first so a deleted user isn't charged again.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { id, deleteListing } = await request.json().catch(() => ({}));
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    }
    await connectDB();
    const user = await User.findById(id).select("email companyId stripeSubscriptionId").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.stripeSubscriptionId) {
      if (!stripeConfigured()) {
        return NextResponse.json(
          { error: "This user has a paid subscription. Cancel it in Stripe first, then delete the user." },
          { status: 409 },
        );
      }
      try {
        await getStripe().subscriptions.cancel(user.stripeSubscriptionId);
      } catch (err) {
        const code = (err as { code?: string })?.code;
        if (code !== "resource_missing") {
          console.error("[admin delete user] Stripe cancel failed:", err);
          return NextResponse.json(
            { error: "Couldn't cancel this user's subscription in Stripe, so nothing was deleted. Try again or cancel it in Stripe first." },
            { status: 502 },
          );
        }
      }
    }

    let listingDeleted = false;
    if (deleteListing && user.companyId) {
      const res = await Company.deleteOne({ _id: user.companyId });
      listingDeleted = res.deletedCount > 0;
    }
    const apps = await SignupApplication.deleteMany({ email: user.email });
    await User.deleteOne({ _id: user._id });
    revalidateTag("companies", "max");

    return NextResponse.json({ ok: true, listingDeleted, applicationsDeleted: apps.deletedCount });
  } catch (err) {
    console.error("[admin delete user]", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
