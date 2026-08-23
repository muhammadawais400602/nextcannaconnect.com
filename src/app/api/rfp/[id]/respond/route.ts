import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";
import RFP from "@/lib/models/RFP";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = request.cookies.get("vendor_session")?.value;
    if (!session || !session.startsWith("nc-vendor:")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.split(":")[1];
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid RFP ID" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId).select("isActive tier companyId");
    if (!user?.isActive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.tier === "free") {
      return NextResponse.json({ error: "Upgrade to Select or Verified Pro to respond to RFPs" }, { status: 403 });
    }

    const company = user.companyId ? await Company.findById(user.companyId).select("name") : null;
    if (!company) {
      return NextResponse.json({ error: "No company linked to your account" }, { status: 400 });
    }

    const { message } = await request.json();
    if (!message || !String(message).trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const rfp = await RFP.findById(id);
    if (!rfp) return NextResponse.json({ error: "RFP not found" }, { status: 404 });
    if (rfp.status === "closed") {
      return NextResponse.json({ error: "This RFP is closed" }, { status: 400 });
    }

    const alreadyResponded = rfp.responses.some(
      (r) => r.companyId.toString() === company._id.toString()
    );
    if (alreadyResponded) {
      return NextResponse.json({ error: "You have already responded to this RFP" }, { status: 400 });
    }

    rfp.responses.push({
      companyId: company._id as mongoose.Types.ObjectId,
      companyName: company.name,
      message: String(message).slice(0, 2000),
      submittedAt: new Date(),
      tier: user.tier,
    });
    await rfp.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[rfp respond]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
