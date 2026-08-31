import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import RFP from "@/lib/models/RFP";
import { verifyVendorSession } from "@/lib/verifyVendorSession";

async function getVendorUser(request: NextRequest) {
  const session = request.cookies.get("vendor_session")?.value;
  if (!session) return null;
  const userId = verifyVendorSession(session);
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

    if (!title || !description || !categorySlug) {
      return NextResponse.json({ error: "Title, description, and category are required" }, { status: 400 });
    }

    const rfp = await RFP.create({
      title: String(title).slice(0, 200),
      description: String(description).slice(0, 2000),
      categorySlug,
      budget: budget ? String(budget).slice(0, 100) : undefined,
      location: { city: city || "", state: state || "" },
      deadline: deadline ? new Date(deadline) : undefined,
      postedBy: new mongoose.Types.ObjectId(user.id),
      postedByName: user.name,
    });

    return NextResponse.json({ success: true, rfp: { _id: rfp._id } }, { status: 201 });
  } catch (err) {
    console.error("[rfp POST]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
