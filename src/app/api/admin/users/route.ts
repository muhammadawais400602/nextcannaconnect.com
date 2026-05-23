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
      .select("-__v -passwordHash -setupToken -setupTokenExpires")
      .lean();

    return NextResponse.json({ users, total: users.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

const VALID_TIERS = ["free", "select", "elite"];

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const { id, tier } = await request.json();
    if (!VALID_TIERS.includes(tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }
    const user = await User.findByIdAndUpdate(id, { tier }, { new: true })
      .select("-__v -passwordHash -setupToken -setupTokenExpires")
      .lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
