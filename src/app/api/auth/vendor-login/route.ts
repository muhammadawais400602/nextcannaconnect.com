import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { rateLimit, clientIp, tooManyRequests } from "@/lib/rateLimit";
import { setVendorSessionCookie } from "@/lib/verifyVendorSession";

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    // Per network: 5 attempts a minute.
    if (!(await rateLimit(`vendor-login:${ip}`, 5, 60_000))) {
      return tooManyRequests("Too many sign-in attempts. Please wait a minute and try again.", 60);
    }

    await connectDB();
    const { email, password } = await request.json().catch(() => ({}));

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    // Per account: 10 attempts per 15 minutes, so one account can't be
    // brute-forced from many addresses.
    if (!(await rateLimit(`vendor-login-acct:${email.toLowerCase().trim()}`, 10, 15 * 60_000))) {
      return tooManyRequests(
        "Too many sign-in attempts for this account. Please wait 15 minutes or reset your password.",
        15 * 60,
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim(), accountType: "vendor" });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Your account is not active yet. It may be pending admin approval." }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: { email: user.email, fullName: user.fullName, companyName: user.companyName, tier: user.tier },
    });
    setVendorSessionCookie(response, String(user._id), user.sessionVersion ?? 0);

    return response;
  } catch (err) {
    console.error("[vendor-login]", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
