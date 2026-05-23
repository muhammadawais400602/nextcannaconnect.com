import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import { verifyVendorToken } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const userId = verifyVendorToken(request.cookies.get("vendor_session")?.value);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(userId).select("email fullName companyName tier isActive");

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      user: { email: user.email, fullName: user.fullName, companyName: user.companyName, tier: user.tier },
    });
  } catch (err) {
    console.error("[vendor-me]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
