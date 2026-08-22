import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProfileView from "@/lib/models/ProfileView";

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get("slug");
    const days = Math.min(Number(req.nextUrl.searchParams.get("days") || 30), 90);
    const since = new Date();
    since.setDate(since.getDate() - days);

    await connectDB();

    if (slug) {
      const views = await ProfileView.countDocuments({
        companySlug: slug,
        createdAt: { $gte: since },
      });

      const dailyViews = await ProfileView.aggregate([
        { $match: { companySlug: slug, createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return NextResponse.json({ slug, days, totalViews: views, daily: dailyViews });
    }

    const topViewed = await ProfileView.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$companySlug", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 50 },
    ]);

    const totalViews = await ProfileView.countDocuments({
      createdAt: { $gte: since },
    });

    return NextResponse.json({ days, totalViews, topViewed });
  } catch (err) {
    console.error("[admin/analytics]", err);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
