import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";
import SignupApplication from "@/lib/models/SignupApplication";
import mongoose from "mongoose";

export async function POST() {
  try {
    await connectDB();

    // Find all free-tier users and collect their companyIds
    const users = await User.find({ tier: "free" }, { _id: 1, email: 1, companyId: 1 }).lean();
    const companyIds = users
      .map((u) => (u as { companyId?: mongoose.Types.ObjectId }).companyId)
      .filter(Boolean) as mongoose.Types.ObjectId[];

    const userEmails = users.map((u) => (u as { email: string }).email);

    // Delete linked companies (only free-tier ones to be safe)
    let companiesDeleted = 0;
    if (companyIds.length > 0) {
      const res = await Company.deleteMany({ _id: { $in: companyIds }, tier: "free" });
      companiesDeleted = res.deletedCount;
    }

    // Delete users
    const usersRes = await User.deleteMany({ tier: "free" });

    // Delete their signup applications
    const signupsRes = await SignupApplication.deleteMany({
      $or: [
        { email: { $in: userEmails } },
        { status: "rejected" },
      ],
    });

    return NextResponse.json({
      success: true,
      companiesDeleted,
      usersDeleted:   usersRes.deletedCount,
      signupsDeleted: signupsRes.deletedCount,
    });
  } catch (err) {
    console.error("[cleanup]", err);
    return NextResponse.json({ error: "Cleanup failed. Please try again." }, { status: 500 });
  }
}
