import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { verifyVendorSession } from "@/lib/verifyVendorSession";

async function getVendorUserId(request: NextRequest): Promise<string | null> {
  const session = request.cookies.get("vendor_session")?.value;
  if (!session) return null;
  const userId = verifyVendorSession(session);
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return userId;
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getVendorUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId).select("isActive");
    if (!user?.isActive) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fullName } = await request.json();
    const trimmed = String(fullName ?? "").trim();
    if (!trimmed) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    await User.findByIdAndUpdate(userId, { fullName: trimmed });
    return NextResponse.json({ success: true, fullName: trimmed });
  } catch (err) {
    console.error("[vendor/profile PUT]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
