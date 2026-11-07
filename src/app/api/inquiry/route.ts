import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";
import User from "@/lib/models/User";
import Inquiry from "@/lib/models/Inquiry";
import { rateLimit, clientIp } from "@/lib/rateLimit";
import { EMAIL_RE, isHoneypotTripped, str } from "@/lib/formGuard";
import { sendEmail, emailLayout, emailButton, ADMIN_EMAIL } from "@/lib/email";
import { escapeHtml } from "@/lib/escapeHtml";
import { SITE_URL } from "@/lib/siteUrl";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    // Silently accept bot submissions so they don't retry.
    if (isHoneypotTripped(body)) return NextResponse.json({ ok: true });

    const ip = clientIp(req);
    if (!(await rateLimit(`inquiry:${ip}`, 5, 10 * 60_000))) {
      return NextResponse.json({ error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
    }

    const vendorSlug = str(body.vendorSlug, 200);
    const name = str(body.name, 100);
    const email = str(body.email, 200).toLowerCase();
    const phone = str(body.phone, 40);
    const buyerCompany = str(body.company, 150);
    const serviceNeeded = str(body.serviceNeeded, 200);
    const message = str(body.message, 3000);
    const source = str(body.source, 40) || "profile";

    if (!vendorSlug || !name || !email) {
      return NextResponse.json({ error: "Please fill in your name and email." }, { status: 400 });
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await connectDB();
    const company = await Company.findOne({ slug: vendorSlug }).select("_id name email slug").lean();
    if (!company) {
      return NextResponse.json({ error: "This vendor could not be found." }, { status: 404 });
    }

    const inquiry = await Inquiry.create({
      vendorSlug, companyId: company._id, name, email, phone, company: buyerCompany,
      serviceNeeded, message, source,
    });

    // Notify the vendor: the listing's public email plus the owner's account email.
    const owner = await User.findOne({ companyId: company._id }).select("email").lean();
    const recipients = [...new Set([company.email, owner?.email].filter(Boolean) as string[])];

    const rows = [
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
      ["Company", buyerCompany],
      ["Service needed", serviceNeeded],
    ]
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px;background:#F0F4F0;font-weight:600;width:140px">${k}</td><td style="padding:8px">${escapeHtml(v)}</td></tr>`,
      )
      .join("");
    const messageHtml = message
      ? `<p style="margin:16px 0 4px;font-weight:600">Message</p><p style="white-space:pre-wrap;margin:0;color:#374151">${escapeHtml(message)}</p>`
      : "";

    let vendorNotified = false;
    if (recipients.length) {
      vendorNotified = await sendEmail({
        to: recipients,
        replyTo: email,
        subject: `New inquiry for ${company.name} from ${name}`,
        html: emailLayout(
          `New inquiry for ${company.name}`,
          `<p style="line-height:1.6;color:#4A5E4A">A buyer contacted you through your NextCanna Connect listing. Reply to this email to respond directly.</p>
           <table style="width:100%;border-collapse:collapse;font-size:14px;background:white">${rows}</table>
           ${messageHtml}
           ${owner ? emailButton(`${SITE_URL}/vendor/dashboard`, "View in your dashboard") : emailButton(`${SITE_URL}/signup?claim=${encodeURIComponent(company.slug)}`, "Claim your free listing")}`,
        ),
      });
    }
    if (!vendorNotified) {
      // No vendor email on file (or delivery failed) — make sure the lead isn't lost.
      await sendEmail({
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: `Undelivered inquiry for ${company.name}`,
        html: emailLayout(
          `Inquiry for ${company.name} could not be delivered to the vendor`,
          `<p style="color:#4A5E4A">Please forward it manually.</p><table style="width:100%;border-collapse:collapse;font-size:14px;background:white">${rows}</table>${messageHtml}`,
        ),
      });
    }
    await Inquiry.updateOne({ _id: inquiry._id }, { vendorNotified });

    // Confirmation to the buyer. Contains no user-written text, so it can't be used to relay spam.
    await sendEmail({
      to: email,
      subject: `Your inquiry to ${company.name} was sent`,
      html: emailLayout(
        "Your inquiry was sent",
        `<p style="line-height:1.6;color:#4A5E4A">We passed your message to <strong>${escapeHtml(company.name)}</strong>. They'll reply to you directly at this email address.</p>
         ${emailButton(`${SITE_URL}/vendor/${encodeURIComponent(company.slug)}`, "View their profile")}`,
      ),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Inquiry submission error:", err);
    return NextResponse.json({ error: "Failed to send your inquiry. Please try again." }, { status: 500 });
  }
}
