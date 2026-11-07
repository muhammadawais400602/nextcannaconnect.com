import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import RFP from "@/lib/models/RFP";
import { verifyVendorSession, VENDOR_SESSION_COOKIE } from "@/lib/verifyVendorSession";

export async function GET(
  request: NextRequest,
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

    // Bids are private: only the poster sees the responses. Everyone else just
    // sees how many there are (previously competitors could read each other's bids).
    const viewerId = await verifyVendorSession(request.cookies.get(VENDOR_SESSION_COOKIE)?.value);
    const isOwner = !!viewerId && String(rfp.postedBy) === viewerId;
    const { postedBy: _postedBy, ...publicRfp } = rfp;
    void _postedBy;

    return NextResponse.json({
      rfp: {
        ...publicRfp,
        responses: isOwner ? sorted : [],
        responseCount: sorted.length,
        isOwner,
      },
    });
  } catch (err) {
    console.error("[rfp/[id] GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
