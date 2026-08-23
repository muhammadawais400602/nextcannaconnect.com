import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import RFP from "@/lib/models/RFP";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    await connectDB();
    const rfp = await RFP.findById(id).lean();
    if (!rfp) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Sort responses: elite first, then select
    const sorted = [...(rfp.responses ?? [])].sort((a, b) => {
      const order: Record<string, number> = { elite: 0, select: 1, free: 2 };
      return (order[a.tier] ?? 2) - (order[b.tier] ?? 2);
    });

    return NextResponse.json({ rfp: { ...rfp, responses: sorted } });
  } catch (err) {
    console.error("[rfp/[id] GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
