import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SignupApplication from "@/lib/models/SignupApplication";

export async function GET() {
  try {
    await connectDB();
    const applications = await SignupApplication.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ applications, total: applications.length });
  } catch (err) {
    console.error("[signups]", err);
    return NextResponse.json({ error: "Failed to fetch signups" }, { status: 500 });
  }
}
