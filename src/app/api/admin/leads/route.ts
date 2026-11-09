import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/lib/models/Inquiry";
import Company from "@/lib/models/Company";

// Admin-only: /api/admin/* is protected by the admin session in middleware.

/**
 * All buyer inquiries (profile contact forms + transport quote requests),
 * newest first. Query: ?status=undelivered|delivered&q=search&limit=200
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const sp = request.nextUrl.searchParams;
    const status = sp.get("status");
    const q = sp.get("q")?.trim().slice(0, 100);
    const limit = Math.min(Number(sp.get("limit")) || 200, 1000);

    const filter: Record<string, unknown> = {};
    if (status === "undelivered") filter.vendorNotified = { $ne: true };
    if (status === "delivered") filter.vendorNotified = true;
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: rx }, { email: rx }, { company: rx }, { vendorSlug: rx }, { message: rx }];
    }

    const [inquiries, total, undelivered, last30] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
      Inquiry.countDocuments({}),
      Inquiry.countDocuments({ vendorNotified: { $ne: true } }),
      Inquiry.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
    ]);

    const slugs = [...new Set(inquiries.map((i) => i.vendorSlug))];
    const companies = await Company.find({ slug: { $in: slugs } }).select("slug name tier").lean();
    const bySlug = new Map(companies.map((c) => [c.slug, { name: c.name, tier: c.tier }]));

    return NextResponse.json({
      inquiries: inquiries.map((i) => ({ ...i, _id: String(i._id), vendor: bySlug.get(i.vendorSlug) ?? null })),
      stats: { total, undelivered, last30 },
    });
  } catch (err) {
    console.error("[admin leads]", err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
