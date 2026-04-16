import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";

function toSlug(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const TIER_LABELS: Record<string, string> = {
  free: "Claimed (Free)",
  select: "Select — $49.99/mo",
  elite: "Verified Pro — $99/mo",
};

const TIER_MAP: Record<string, "free" | "claimed" | "select" | "elite"> = {
  free: "free",
  select: "select",
  elite: "elite",
};

async function sendEmail(payload: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "NextCanna Connect <hello@nextcannaconnect.com>";
  if (!apiKey) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...payload }),
  });
  if (!res.ok) console.error("[sendEmail]", await res.text());
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await request.json();

    if (!["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const app = await SignupApplication.findByIdAndUpdate(id, { status }, { new: true });
    if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const tierLabel = TIER_LABELS[app.tier] ?? app.tier;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextcanna-connect.vercel.app";

    if (status === "approved") {
      // Generate secure setup token (expires in 72 hours)
      const token = randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 72 * 60 * 60 * 1000);

      // Create Company record if one doesn't exist yet (best-effort — never blocks approval)
      let companyId: unknown = null;
      try {
        let company = await Company.findOne({ email: app.email });
        if (!company) {
          const baseSlug = toSlug(app.companyName) || `company-${Date.now().toString(36)}`;
          const slugTaken = await Company.findOne({ slug: baseSlug });
          const slug = slugTaken ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;
          company = await Company.create({
            slug,
            name: app.companyName,
            category: app.category || "consultants-advisors",
            tier: TIER_MAP[app.tier] ?? "free",
            location: { city: "", state: app.stateProvince || "" },
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
      } catch (companyErr) {
        console.error("[signups PATCH] Company creation failed (non-fatal):", companyErr);
      }

      // Create or update User record (linked to company)
      await User.findOneAndUpdate(
        { email: app.email },
        {
          email: app.email,
          fullName: app.fullName,
          companyName: app.companyName,
          phone: app.phone,
          stateProvince: app.stateProvince,
          category: app.category,
          accountType: "vendor",
          tier: TIER_MAP[app.tier] ?? "free",
          ...(companyId ? { companyId } : {}),
          setupToken: token,
          setupTokenExpires: expires,
          isActive: false,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const setupLink = `${siteUrl}/set-password?token=${token}`;

      await sendEmail({
        to: app.email,
        subject: "Your NextCanna Connect application is approved — set your password",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2E1A">
            <div style="background:#1A4A35;padding:32px;text-align:center;border-radius:12px 12px 0 0">
              <h1 style="color:white;margin:0;font-size:22px">NextCanna Connect</h1>
            </div>
            <div style="padding:32px;background:#F7F9F7;border-radius:0 0 12px 12px;border:1px solid #E8EDE8">
              <h2 style="color:#1A4A35;margin:0 0 12px">Welcome aboard, ${app.fullName}!</h2>
              <p style="line-height:1.6;color:#4A5E4A">
                Your application for <strong>${app.companyName}</strong> on the <strong>${tierLabel}</strong>
                plan has been <strong style="color:#1A4A35">approved</strong>.
              </p>
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
              <h2 style="color:#1A4A35;margin:0 0 16px">Hi ${app.fullName},</h2>
              <p style="line-height:1.6;color:#4A5E4A">
                Thank you for applying to list <strong>${app.companyName}</strong> on NextCanna Connect.
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
    return NextResponse.json({ error: "Failed to update", detail: String(err) }, { status: 500 });
  }
}
