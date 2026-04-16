import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { token, password } = await request.json();

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await User.findOne({
      setupToken: token,
      setupTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "This link is invalid or has expired. Please contact support." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    user.passwordHash = passwordHash;
    user.setupToken = undefined;
    user.setupTokenExpires = undefined;
    user.isActive = true;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[set-password]", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// Validate token (GET) — used to check if link is still valid before rendering the page
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = request.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ valid: false });

    const user = await User.findOne({
      setupToken: token,
      setupTokenExpires: { $gt: new Date() },
    }).select("email fullName companyName");

    if (!user) return NextResponse.json({ valid: false });

    return NextResponse.json({
      valid: true,
      email: user.email,
      fullName: user.fullName,
      companyName: user.companyName,
    });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
