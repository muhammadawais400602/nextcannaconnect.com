import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { EMAIL_RE, str } from "@/lib/formGuard";
import { sendEmail, emailLayout, emailButton } from "@/lib/email";
import { SITE_URL } from "@/lib/siteUrl";
import { hashResetToken, RESET_TOKEN_TTL_MS } from "@/lib/resetToken";

/**
 * Emails a one-hour password reset link. Always responds the same way so the
 * form can't be used to discover which emails have accounts.
 */
export async function POST(request: NextRequest) {
  const ok = NextResponse.json({
    ok: true,
    message: "If an account exists for that email, we've sent a link to reset your password.",
  });
  try {
    const body = await request.json().catch(() => ({}));
    const email = str(body.email, 200).toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    const ip = clientIp(request);
    if (!(await rateLimit(`forgot:${ip}`, 5, 15 * 60_000)) || !(await rateLimit(`forgot:${email}`, 3, 60 * 60_000))) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    await connectDB();
    const user = await User.findOne({ email }).select("email fullName passwordHash setupToken setupTokenExpires");
    if (!user) return ok;

    // Approved but never set a password: resend the original setup link instead.
    if (!user.passwordHash && user.setupToken) {
      user.setupTokenExpires = new Date(Date.now() + 72 * 60 * 60 * 1000);
      await user.save();
      await sendEmail({
        to: user.email,
        subject: "Set your NextCanna Connect password",
        html: emailLayout(
          "Set your password",
          `<p style="line-height:1.6;color:#4A5E4A">Use the button below to set your password and activate your account. The link works for 72 hours.</p>
           ${emailButton(`${SITE_URL}/set-password?token=${user.setupToken}`, "Set my password")}`,
        ),
      });
      return ok;
    }
    if (!user.passwordHash) return ok;

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = hashResetToken(token);
    user.resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Reset your NextCanna Connect password",
      html: emailLayout(
        "Reset your password",
        `<p style="line-height:1.6;color:#4A5E4A">We received a request to reset the password for this account. The link below works for one hour.</p>
         ${emailButton(`${SITE_URL}/reset-password?token=${token}`, "Choose a new password")}
         <p style="font-size:13px;color:#6B7280">If you didn't ask for this, you can ignore this email — your password won't change.</p>`,
      ),
    });
    return ok;
  } catch (err) {
    console.error("[forgot-password]", err);
    return ok;
  }
}
