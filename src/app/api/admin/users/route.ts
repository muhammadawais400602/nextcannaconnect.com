import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get("tier");
    const accountType = searchParams.get("accountType");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (tier) filter.tier = tier;
    if (accountType) filter.accountType = accountType;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json({ users, total: users.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const { id, tier } = await request.json();
    const user = await User.findByIdAndUpdate(id, { tier }, { new: true }).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
