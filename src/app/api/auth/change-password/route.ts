import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { verifyVendorSession, setVendorSessionCookie } from "@/lib/verifyVendorSession";

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get("vendor_session")?.value;
    const userId = await verifyVendorSession(session);
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both fields are required" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId).select("passwordHash isActive sessionVersion");

    if (!user || !user.isActive || !user.passwordHash) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash as string);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    // Sign out every other device, then re-issue this browser's session.
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    await user.save();

    const response = NextResponse.json({ success: true });
    setVendorSessionCookie(response, String(user._id), user.sessionVersion);
    return response;
  } catch (err) {
    console.error("[change-password]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
