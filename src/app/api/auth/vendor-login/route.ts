import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import SignupApplication from "@/lib/models/SignupApplication";
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

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Only explain an inactive account to someone who knows the password.
    if (!user.isActive) {
      const latest = await SignupApplication.findOne({ email: user.email }).sort({ createdAt: -1 }).select("status").lean();
      const error =
        latest?.status === "rejected"
          ? "Your application wasn't approved. Reply to the email we sent you or contact hello@nextcannaconnect.com — you can also re-apply by signing up again with this email."
          : "Your account isn't active yet — we're reviewing your application and will email you when it's approved.";
      return NextResponse.json({ error }, { status: 403 });
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
