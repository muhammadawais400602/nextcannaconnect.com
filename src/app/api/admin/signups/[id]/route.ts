import { sendEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/siteUrl";
import { escapeHtml } from "@/lib/escapeHtml";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";

function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  select: "Select — $19.99/mo",
  elite: "Verified Pro — $39.99/mo",
};

const TIER_MAP: Record<string, "free" | "select" | "elite"> = {
  free: "free",
  select: "select",
  elite: "elite",
};


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status, confirmUnpaid } = await request.json();

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const existingApp = await SignupApplication.findById(id);
    if (!existingApp) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    // Don't silently approve a paid plan that hasn't been paid for.
    if (status === "approved" && existingApp.paymentStatus === "awaiting_payment" && !confirmUnpaid) {
      return NextResponse.json(
        { error: "This applicant chose a paid plan but hasn't completed payment.", code: "UNPAID" },
        { status: 409 },
      );
    }

    // Never hand a listing that another account already owns to a new applicant.
    let claimTarget: InstanceType<typeof Company> | null = null;
    if (status === "approved") {
      claimTarget = existingApp.claimSlug
        ? await Company.findOne({ slug: existingApp.claimSlug })
        : await Company.findOne({ email: existingApp.email });
      if (claimTarget) {
        const owner = await User.findOne({ companyId: claimTarget._id }).select("email").lean();
        if (owner && owner.email !== existingApp.email) {
          return NextResponse.json(
            { error: `"${claimTarget.name}" is already owned by ${owner.email}. Resolve the ownership before approving.` },
            { status: 409 },
          );
        }
      }
    }

    existingApp.status = status;
    await existingApp.save();
    const app = existingApp;

    const tierLabel = TIER_LABELS[app.tier] ?? app.tier;
    const siteUrl = SITE_URL;
    const eFullName = escapeHtml(app.fullName);
    const eCompanyName = escapeHtml(app.companyName);
    const eTierLabel = escapeHtml(tierLabel);
    const isPaidPlan = app.tier === "select" || app.tier === "elite";
    // Before Stripe: paid plans are invoiced by hand — say so in the email.
    const paymentBlock =
      isPaidPlan && app.paymentStatus !== "paid"
        ? `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:14px 16px;margin:20px 0;color:#92400E;line-height:1.6">
             <strong>Payment setup</strong> — your ${eTierLabel} subscription (${app.tier === "elite" ? "$39.99" : "$19.99"}/mo) hasn't been invoiced yet.
             Our team will reach out within 1 business day to arrange payment. If you'd like to pay sooner, just reply to this email.
           </div>`
        : "";
    const rfpBlock = isPaidPlan
      ? `<p style="line-height:1.6;color:#4A5E4A">Your plan includes the <a href="${siteUrl}/rfp-board" style="color:#1A4A35;font-weight:600">RFP Board</a>, where buyers post requests for proposals you can respond to.</p>`
      : "";

    if (status === "approved") {
      // Create Company record if one doesn't exist yet (best-effort — never blocks approval)
      let companyId: unknown = null;
      try {
        let company = claimTarget;
        if (company) {
          // Existing / claimed listing: apply the plan the owner signed up (and paid) for.
          company.tier = (TIER_MAP[app.tier] ?? "free") as typeof company.tier;
          if (!company.email) company.email = app.email;
          await company.save();
        } else {
          const baseSlug = toSlug(app.companyName) || "company";
          let slug = baseSlug;
          let suffix = 2;
          while (await Company.findOne({ slug }).select("_id").lean()) {
            slug = `${baseSlug}-${suffix++}`;
          }
          company = await Company.create({
            slug,
            name: app.companyName,
            category: app.category || "consultants-advisors",
            tier: TIER_MAP[app.tier] ?? "free",
            // "All States (USA)" / "All Provinces (Canada)" are service areas, not a location.
            location: { city: "", state: app.stateProvince && !app.stateProvince.startsWith("all-") ? app.stateProvince : "" },
            statesServed: app.stateProvince === "all-us" ? ["Nationwide"] : app.stateProvince === "all-ca" ? ["All Canada"] : [],
            shortDescription: app.description || `${app.companyName} — cannabis industry professional`,
            email: app.email,
            phone: app.phone || "",
            website: app.website || "",
            serviceArea: app.serviceArea || "",
            certifications: app.certifications
              ? String(app.certifications).split(",").map((c) => c.trim()).filter(Boolean)
              : [],
            logoPlaceholder: app.companyName.slice(0, 2).toUpperCase(),
            logoColor: "#1A4A35",
            isFeatured: false,
          });
        }
        companyId = company._id;
        revalidateTag("companies", "max");
      } catch (companyErr) {
        console.error("[signups PATCH] Company creation failed (non-fatal):", companyErr);
      }

      // Activate user account and link to company
      const existingUser = await User.findOne({ email: app.email });
      const hasPassword = existingUser?.passwordHash;

      const userUpdate: Record<string, unknown> = {
        email: app.email,
        fullName: app.fullName,
        companyName: app.companyName,
        phone: app.phone,
        stateProvince: app.stateProvince,
        category: app.category,
        accountType: "vendor",
        tier: TIER_MAP[app.tier] ?? "free",
        ...(companyId ? { companyId } : {}),
        ...(app.stripeCustomerId ? { stripeCustomerId: app.stripeCustomerId } : {}),
        ...(app.stripeSubscriptionId ? { stripeSubscriptionId: app.stripeSubscriptionId } : {}),
        isActive: !!hasPassword,
      };

      if (!hasPassword) {
        const setupTokenVal = randomBytes(32).toString("hex");
        const setupExpires = new Date(Date.now() + 72 * 60 * 60 * 1000);
        userUpdate.setupToken = setupTokenVal;
        userUpdate.setupTokenExpires = setupExpires;
      }

      await User.findOneAndUpdate(
        { email: app.email },
        userUpdate,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (hasPassword) {
        await sendEmail({
          to: app.email,
          subject: "Your NextCanna Connect application is approved!",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
              <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
                <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
              </div>
              <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
                <h2 style="color:#1A4A35;margin:0 0 12px">Welcome aboard, ${eFullName}!</h2>
                <p style="line-height:1.6;color:#4A5E4A">
                  Your application for <strong>${eCompanyName}</strong> on the <strong>${eTierLabel}</strong>
                  plan has been <strong style="color:#1A4A35">approved</strong>. Your account is now active!
                </p>
                ${paymentBlock}
                ${rfpBlock}
                <div style="text-align:center;margin:28px 0">
                  <a href="${siteUrl}/signin"
                     style="background:#1A4A35;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
                    Sign In to Your Account →
                  </a>
                </div>
                <p style="color:#4A5E4A;margin-top:24px">— The NextCanna Connect Team</p>
              </div>
            </div>
          `,
        });
      } else {
        const setupLink = `${siteUrl}/set-password?token=${(userUpdate.setupToken as string)}`;
        await sendEmail({
          to: app.email,
          subject: "Your NextCanna Connect application is approved — set your password",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
              <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
                <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
              </div>
              <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
                <h2 style="color:#1A4A35;margin:0 0 12px">Welcome aboard, ${eFullName}!</h2>
                <p style="line-height:1.6;color:#4A5E4A">
                  Your application for <strong>${eCompanyName}</strong> on the <strong>${eTierLabel}</strong>
                  plan has been <strong style="color:#1A4A35">approved</strong>.
                </p>
                ${paymentBlock}
                ${rfpBlock}
                <p style="line-height:1.6;color:#4A5E4A">
                  Click the button below to set your password and activate your account.
                  This link expires in <strong>72 hours</strong>.
                </p>
                <div style="text-align:center;margin:28px 0">
                  <a href="${setupLink}"
                     style="background:#1A4A35;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
                    Set Your Password →
                  </a>
                </div>
                <p style="font-size:12px;color:#9CA3AF;text-align:center">
                  Or copy this link: <a href="${setupLink}" style="color:#1A4A35;word-break:break-all">${setupLink}</a>
                </p>
                <p style="color:#4A5E4A;margin-top:24px">— The NextCanna Connect Team</p>
              </div>
            </div>
          `,
        });
      }

    } else if (status === "rejected") {
      await sendEmail({
        to: app.email,
        subject: "Update on your NextCanna Connect application",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
            <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
              <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
            </div>
            <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
              <h2 style="color:#1A4A35;margin:0 0 16px">Hi ${eFullName},</h2>
              <p style="line-height:1.6;color:#4A5E4A">
                Thank you for applying to list <strong>${eCompanyName}</strong> on NextCanna Connect.
                After review, we're unable to approve your application at this time.
              </p>
              <p style="line-height:1.6;color:#4A5E4A">
                If you have questions, reply to this email or contact us at
                <a href="mailto:hello@nextcannaconnect.com" style="color:#1A4A35">hello@nextcannaconnect.com</a>.
              </p>
              <p style="color:#4A5E4A">— The NextCanna Connect Team</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, status: app.status });
  } catch (err) {
    console.error("[signups PATCH]", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await SignupApplication.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[signups DELETE]", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
