import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProfileView from "@/lib/models/ProfileView";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    await connectDB();

    await ProfileView.create({
      companySlug: slug,
      referrer: req.headers.get("referer") ?? "",
      userAgent: req.headers.get("user-agent") ?? "",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[track/profile-view]", err);
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 });
  }
}
