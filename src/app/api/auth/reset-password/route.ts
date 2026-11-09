import { passwordProblem } from "@/lib/password";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { hashResetToken } from "@/lib/resetToken";

async function findByToken(token: string | null | undefined) {
  if (!token || typeof token !== "string" || token.length > 200) return null;
  await connectDB();
  return User.findOne({ resetToken: hashResetToken(token), resetTokenExpires: { $gt: new Date() } });
}

export async function GET(request: NextRequest) {
  const user = await findByToken(request.nextUrl.searchParams.get("token")).catch(() => null);
  return NextResponse.json({ valid: !!user, email: user?.email });
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json().catch(() => ({}));
    const pwProblem = passwordProblem(password);
    if (pwProblem) {
      return NextResponse.json({ error: pwProblem }, { status: 400 });
    }
    const user = await findByToken(token);
    if (!user) {
      return NextResponse.json({ error: "This reset link is invalid or has expired. Please request a new one." }, { status: 400 });
    }
    user.passwordHash = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    // Sign out everywhere — whoever had the old password loses access.
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;
    await user.save();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
