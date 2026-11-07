import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";
import Inquiry from "@/lib/models/Inquiry";
import ProfileView from "@/lib/models/ProfileView";
import { verifyVendorSession, VENDOR_SESSION_COOKIE } from "@/lib/verifyVendorSession";

const DAY = 24 * 60 * 60 * 1000;

/** Inquiries and profile-view stats for the signed-in vendor's listing. */
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyVendorSession(request.cookies.get(VENDOR_SESSION_COOKIE)?.value);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId).select("companyId").lean();
    const company = user?.companyId ? await Company.findById(user.companyId).select("slug").lean() : null;
    if (!company) {
      return NextResponse.json({
        inquiries: [],
        stats: { views30: 0, viewsTotal: 0, inquiries30: 0, inquiriesTotal: 0, viewsByDay: [] },
      });
    }

    const since = new Date(Date.now() - 30 * DAY);
    const [inquiries, inquiriesTotal, inquiries30, viewsTotal, views30, daily] = await Promise.all([
      Inquiry.find({ vendorSlug: company.slug })
        .sort({ createdAt: -1 })
        .limit(50)
        .select("name email phone company serviceNeeded message source createdAt")
        .lean(),
      Inquiry.countDocuments({ vendorSlug: company.slug }),
      Inquiry.countDocuments({ vendorSlug: company.slug, createdAt: { $gte: since } }),
      ProfileView.countDocuments({ companySlug: company.slug }),
      ProfileView.countDocuments({ companySlug: company.slug, createdAt: { $gte: since } }),
      ProfileView.aggregate<{ _id: string; count: number }>([
        { $match: { companySlug: company.slug, createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      ]),
    ]);

    const byDay = new Map(daily.map((d) => [d._id, d.count]));
    const viewsByDay = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(Date.now() - (29 - i) * DAY).toISOString().slice(0, 10);
      return { date, count: byDay.get(date) ?? 0 };
    });

    return NextResponse.json({
      inquiries: inquiries.map((q) => ({ ...q, _id: String(q._id) })),
      stats: { views30, viewsTotal, inquiries30, inquiriesTotal, viewsByDay },
    });
  } catch (err) {
    console.error("[vendor/leads]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
