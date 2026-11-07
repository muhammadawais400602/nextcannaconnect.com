import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { verifyVendorSession, SIGNED_IN_MARKER, VENDOR_SESSION_MAX_AGE_SECONDS } from "@/lib/verifyVendorSession";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("vendor_session")?.value;
    const userId = await verifyVendorSession(session);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select("email fullName companyName tier isActive stripeCustomerId stripeSubscriptionId");

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({
      user: {
        email: user.email,
        fullName: user.fullName,
        companyName: user.companyName,
        tier: user.tier,
        hasBilling: !!user.stripeCustomerId,
        hasSubscription: !!user.stripeSubscriptionId,
      },
    });
    // Sessions created before the marker cookie existed get it here.
    if (!request.cookies.get(SIGNED_IN_MARKER)) {
      response.cookies.set(SIGNED_IN_MARKER, "1", {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: VENDOR_SESSION_MAX_AGE_SECONDS,
        path: "/",
      });
    }
    return response;
  } catch (err) {
    console.error("[vendor-me]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
