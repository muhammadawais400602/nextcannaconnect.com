import { passwordProblem } from "@/lib/password";
import { sendEmail, ADMIN_EMAIL, emailFooterHtml } from "@/lib/email";
import { createSubscriptionCheckout, isPaidTier, stripeConfigured } from "@/lib/stripe";
import Company from "@/lib/models/Company";
import { CATEGORIES } from "@/data/categories";
import { setVendorSessionCookie } from "@/lib/verifyVendorSession";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";
import User from "@/lib/models/User";
import { escapeHtml } from "@/lib/escapeHtml";
import { rateLimit } from "@/lib/rateLimit";

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  select: "Select — $19.99/mo",
  elite: "Verified Pro — $39.99/mo",
};


// Hashing + database writes + two emails: allow more than the default time budget.
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (!await rateLimit(`signup:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    await connectDB();
    const body = await request.json();

    const { fullName, companyName, email, password, phone, stateProvince, category,
            tier, website, description, publicPhone, serviceArea,
            certifications, socialLink, contactName, categoryDetails, claimSlug } = body;

    if (!["free", "select", "elite"].includes(tier)) {
      return NextResponse.json({ error: "Please choose a plan" }, { status: 400 });
    }
    if (!category || !CATEGORIES.some((c) => c.slug === category)) {
      return NextResponse.json({ error: "Please choose your business category" }, { status: 400 });
    }
    if (!stateProvince) {
      return NextResponse.json({ error: "Please choose your state or province" }, { status: 400 });
    }

    if (!fullName || !companyName || !email || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pwProblem = passwordProblem(password);
    if (pwProblem) {
      return NextResponse.json({ error: pwProblem }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const isPaid = isPaidTier(tier);

    // Claiming an existing (unclaimed) listing?
    let claimCompanySlug: string | undefined;
    if (claimSlug) {
      const target = await Company.findOne({ slug: String(claimSlug) }).select("_id slug").lean();
      if (!target) {
        return NextResponse.json({ error: "The listing you're trying to claim no longer exists." }, { status: 400 });
      }
      if (await User.exists({ companyId: target._id })) {
        return NextResponse.json(
          { error: "This listing has already been claimed. If it's your business, please contact help@nextcannaconnect.com." },
          { status: 409 },
        );
      }
      claimCompanySlug = target.slug;
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    // A rejected applicant can re-apply with the same email and password: their
    // account is reused and a fresh application goes into the review queue.
    let reapplying = false;
    if (existingUser && !existingUser.isActive && existingUser.passwordHash) {
      const latest = await SignupApplication.findOne({ email: normalizedEmail }).sort({ createdAt: -1 }).select("status").lean();
      if (latest?.status === "rejected") {
        if (!(await bcrypt.compare(String(password), existingUser.passwordHash))) {
          return NextResponse.json(
            { error: "To re-apply, use the same password as your previous application — or reset it with “Forgot password”." },
            { status: 409 },
          );
        }
        reapplying = true;
      }
    }
    if (existingUser && !reapplying) {
      // Someone who started a paid signup but abandoned Stripe checkout can resume it
      // (previously they were locked out with "account already exists").
      const pendingApp = !existingUser.isActive
        ? await SignupApplication.findOne({ email: normalizedEmail, paymentStatus: "awaiting_payment" }).sort({ createdAt: -1 })
        : null;
      const samePassword = existingUser.passwordHash
        ? await bcrypt.compare(String(password), existingUser.passwordHash)
        : false;
      if (pendingApp && samePassword && stripeConfigured() && isPaid) {
        pendingApp.set({ tier, ...(claimCompanySlug ? { claimSlug: claimCompanySlug } : {}) });
        const session = await createSubscriptionCheckout({
          tier,
          email: normalizedEmail,
          metadata: { applicationId: String(pendingApp._id), companyName: String(companyName), fullName: String(fullName) },
          successPath: "/signup/success?session_id={CHECKOUT_SESSION_ID}",
          cancelPath: `/signup?tier=${tier}`,
        });
        pendingApp.stripeSessionId = session.id;
        await pendingApp.save();
        await User.updateOne({ _id: existingUser._id }, { tier });
        return NextResponse.json({ checkoutUrl: session.url });
      }
      return NextResponse.json(
        {
          error: pendingApp
            ? "You already started signing up with this email. Enter the same password to continue to payment, or reset your password."
            : "An account with this email already exists. Please sign in instead.",
        },
        { status: 409 },
      );
    }

    // Create user account first (has unique index on email — fail fast on duplicates)
    const passwordHash = await bcrypt.hash(password, 12);
    if (reapplying) {
      await User.updateOne(
        { email: normalizedEmail },
        { fullName, companyName, phone, stateProvince, category, tier, isActive: !isPaid },
      );
    } else try {
      await User.create({
        email: normalizedEmail,
        fullName,
        companyName,
        phone,
        stateProvince,
        category,
        tier,
        passwordHash,
        isActive: !isPaid,
      });
    } catch (userErr: unknown) {
      if (userErr && typeof userErr === "object" && "code" in userErr && (userErr as { code: number }).code === 11000) {
        return NextResponse.json({ error: "An account with this email already exists. Please sign in instead." }, { status: 409 });
      }
      throw userErr;
    }

    // Save application
    const app = await SignupApplication.create({
      fullName, companyName, email: normalizedEmail, phone, stateProvince, category,
      tier, website, description, publicPhone, serviceArea,
      certifications, socialLink, contactName,
      categoryDetails: categoryDetails && typeof categoryDetails === "object" ? categoryDetails : {},
      paymentStatus: isPaid ? "awaiting_payment" : "not_required",
      ...(claimCompanySlug ? { claimSlug: claimCompanySlug } : {}),
    });

    // Paid tiers → create Stripe Checkout session (if Stripe is configured)
    if (isPaid && stripeConfigured()) {
      const session = await createSubscriptionCheckout({
        tier,
        email: normalizedEmail,
        metadata: { applicationId: String(app._id), companyName: String(companyName), fullName: String(fullName) },
        successPath: "/signup/success?session_id={CHECKOUT_SESSION_ID}",
        cancelPath: `/signup?tier=${tier}`,
      });

      await SignupApplication.findByIdAndUpdate(app._id, { stripeSessionId: session.id });

      return NextResponse.json({ checkoutUrl: session.url });
    }

    if (isPaid) {
      console.warn("[signup] STRIPE_SECRET_KEY not set — skipping checkout for paid tier");
      await SignupApplication.findByIdAndUpdate(app._id, { paymentStatus: "pending_manual" });
    }

    // Send confirmation emails
    const tierLabel = TIER_LABELS[tier] ?? tier;
    const adminEmail = ADMIN_EMAIL;

    const eName = escapeHtml(fullName);
    const eCompany = escapeHtml(companyName);
    const eEmail = escapeHtml(email);
    const eState = stateProvince ? escapeHtml(stateProvince) : "";
    const ePhone = phone ? escapeHtml(phone) : "";
    const eCategory = category ? escapeHtml(category) : "";
    const eWebsite = website ? escapeHtml(website) : "";
    const eDescription = description ? escapeHtml(description) : "";

    await sendEmail({
      to: email,
      subject: "You're on the list — NextCanna Connect",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
          <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
          </div>
          <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
            <h2 style="color:#1A4A35;margin:0 0 16px">Welcome, ${eName}!</h2>
            <p style="line-height:1.6;color:#4A5E4A">
              We've received your application for the <strong>${escapeHtml(tierLabel)}</strong> plan
              for <strong>${eCompany}</strong>. Our team will review your information
              and reach out within 1–2 business days.
            </p>
            <div style="background:white;border:1px solid #E8EDE8;border-radius:8px;padding:16px;margin:24px 0">
              <p style="margin:0 0 8px;font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;font-weight:600">Your Application</p>
              <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse">
                <tr><td style="padding:4px 0;color:#6B7280">Plan</td><td style="padding:4px 0"><strong>${escapeHtml(tierLabel)}</strong></td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Company</td><td style="padding:4px 0">${eCompany}</td></tr>
                <tr><td style="padding:4px 0;color:#6B7280">Email</td><td style="padding:4px 0">${eEmail}</td></tr>
                ${eState ? `<tr><td style="padding:4px 0;color:#6B7280">Location</td><td style="padding:4px 0">${eState}</td></tr>` : ""}
              </table>
            </div>
            <p style="line-height:1.6;color:#4A5E4A">
              If you have any questions, contact us at
              <a href="mailto:hello@nextcannaconnect.com" style="color:#1A4A35">hello@nextcannaconnect.com</a>.
            </p>
            <p style="color:#4A5E4A">— The NextCanna Connect Team</p>
              ${emailFooterHtml()}
          </div>
        </div>
      `,
    });

    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New signup: ${eCompany} (${escapeHtml(tierLabel)})`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <h2 style="color:#1A4A35">New Signup Application</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Name</td><td style="padding:8px">${eName}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Company</td><td style="padding:8px">${eCompany}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Email</td><td style="padding:8px"><a href="mailto:${eEmail}">${eEmail}</a></td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Phone</td><td style="padding:8px">${ePhone || "—"}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Plan</td><td style="padding:8px">${escapeHtml(tierLabel)}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">State</td><td style="padding:8px">${eState || "—"}</td></tr>
              <tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Category</td><td style="padding:8px">${eCategory || "—"}</td></tr>
              ${eWebsite ? `<tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Website</td><td style="padding:8px">${eWebsite}</td></tr>` : ""}
              ${eDescription ? `<tr><td style="padding:8px;background:#F7F9F7;font-weight:600">Description</td><td style="padding:8px">${eDescription}</td></tr>` : ""}
              ${categoryDetails && typeof categoryDetails === "object"
                ? Object.entries(categoryDetails)
                    .filter(([, v]) => v)
                    .map(([k, v]) => `<tr><td style="padding:8px;background:#F7F9F7;font-weight:600">${escapeHtml(String(k))}</td><td style="padding:8px">${escapeHtml(String(v))}</td></tr>`)
                    .join("")
                : ""}
            </table>
            <p style="margin-top:16px;font-size:13px;color:#6B7280">Application ID: ${app._id}</p>
          </div>
        `,
      });
    }

    // Free accounts are active straight away: sign them in so they land in
    // their dashboard (which explains the listing is being reviewed).
    const response = NextResponse.json({ success: true, signedIn: !isPaid });
    if (!isPaid) {
      const created = await User.findOne({ email: normalizedEmail }).select("_id sessionVersion");
      if (created) setVendorSessionCookie(response, String(created._id), created.sessionVersion ?? 0);
    }
    return response;
  } catch (err) {
    console.error("[signup] Error:", err);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
