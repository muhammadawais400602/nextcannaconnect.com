import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/lib/models/Lead";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const charged = searchParams.get("charged");
    const tier = searchParams.get("tier");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (charged !== null) filter.charged = charged === "true";
    if (tier) filter.tier = tier;

    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const totalRevenue = leads
      .filter((l) => l.charged)
      .reduce((sum, l) => sum + l.leadFee, 0);

    return NextResponse.json({ leads, total: leads.length, totalRevenue });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
