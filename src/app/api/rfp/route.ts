import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import RFP from "@/lib/models/RFP";
import { verifyVendorSession } from "@/lib/verifyVendorSession";
import { rateLimit } from "@/lib/rateLimit";
import { CATEGORIES } from "@/data/categories";
import { str } from "@/lib/formGuard";

async function getVendorUser(request: NextRequest) {
  const session = request.cookies.get("vendor_session")?.value;
  if (!session) return null;
  const userId = await verifyVendorSession(session);
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return null;
  await connectDB();
  const user = await User.findById(userId).select("isActive fullName tier");
  if (!user?.isActive) return null;
  return { id: userId, name: user.fullName, tier: user.tier };
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query: Record<string, unknown> = { status: "open" };
    if (category) query.categorySlug = category;

    const rfps = await RFP.find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .select("title categorySlug budget location deadline responses status createdAt postedByName")
      .lean();

    const items = rfps.map((r) => ({
      _id: r._id,
      title: r.title,
      categorySlug: r.categorySlug,
      budget: r.budget,
      location: r.location,
      deadline: r.deadline,
      responseCount: r.responses?.length ?? 0,
      status: r.status,
      createdAt: r.createdAt,
      postedByName: r.postedByName,
    }));

    return NextResponse.json({ rfps: items });
  } catch (err) {
    console.error("[rfp GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getVendorUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, description, categorySlug, budget, city, state, deadline } = body;

    if (!str(title) || !str(description, 2000) || !categorySlug) {
      return NextResponse.json({ error: "Title, description, and category are required" }, { status: 400 });
    }
    if (!CATEGORIES.some((c) => c.slug === categorySlug)) {
      return NextResponse.json({ error: "Please choose a valid category" }, { status: 400 });
    }
    const deadlineDate = deadline ? new Date(deadline) : undefined;
    if (deadlineDate && Number.isNaN(deadlineDate.getTime())) {
      return NextResponse.json({ error: "Invalid deadline" }, { status: 400 });
    }
    if (!(await rateLimit(`rfp-post:${user.id}`, 5, 24 * 60 * 60_000))) {
      return NextResponse.json({ error: "You can post up to 5 RFPs per day." }, { status: 429 });
    }

    const rfp = await RFP.create({
      title: str(title, 200),
      description: str(description, 2000),
      categorySlug,
      budget: budget ? String(budget).slice(0, 100) : undefined,
      location: { city: str(city, 100), state: str(state, 60) },
      deadline: deadlineDate,
      postedBy: new mongoose.Types.ObjectId(user.id),
      postedByName: user.name,
    });

    return NextResponse.json({ success: true, rfp: { _id: rfp._id } }, { status: 201 });
  } catch (err) {
    console.error("[rfp POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
