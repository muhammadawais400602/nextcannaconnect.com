import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProfileView from "@/lib/models/ProfileView";
import Company from "@/lib/models/Company";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json().catch(() => ({}));
    if (!slug || typeof slug !== "string" || slug.length > 200) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }
    const ua = req.headers.get("user-agent") ?? "";
    if (/bot|crawl|spider|slurp|lighthouse|headless/i.test(ua)) return NextResponse.json({ ok: true });

    // Count each visitor at most once per profile per 30 minutes.
    if (!(await rateLimit(`view:${clientIp(req)}:${slug}`, 1, 30 * 60_000))) {
      return NextResponse.json({ ok: true });
    }

    await connectDB();
    if (!(await Company.exists({ slug }))) return NextResponse.json({ ok: true });

    await ProfileView.create({
      companySlug: slug,
      referrer: req.headers.get("referer") ?? "",
      userAgent: ua.slice(0, 300),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[track/profile-view]", err);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
