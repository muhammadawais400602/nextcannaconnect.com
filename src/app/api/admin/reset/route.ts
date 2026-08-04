import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";
import SignupApplication from "@/lib/models/SignupApplication";

export async function POST(request: NextRequest) {
  try {
    const { scope, confirm } = await request.json();

    if (confirm !== "DELETE ALL DATA") {
      return NextResponse.json({ error: "Confirmation phrase did not match" }, { status: 400 });
    }

    await connectDB();

    let companiesDeleted = 0;
    let usersDeleted = 0;
    let signupsDeleted = 0;

    if (scope === "all" || scope === "companies") {
      const res = await Company.deleteMany({});
      companiesDeleted = res.deletedCount;
    }

    if (scope === "all" || scope === "users") {
      const res = await User.deleteMany({});
      usersDeleted = res.deletedCount;
      const res2 = await SignupApplication.deleteMany({});
      signupsDeleted = res2.deletedCount;
    }

    return NextResponse.json({ success: true, companiesDeleted, usersDeleted, signupsDeleted });
  } catch (err) {
    console.error("[reset]", err);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}
