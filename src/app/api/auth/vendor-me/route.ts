import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("vendor_session")?.value;
    if (!session || !session.startsWith("nc-vendor:")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parts = session.split(":");
    const userId = parts[1];

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
