import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";
import User from "@/lib/models/User";

/** Public info used by the signup page when someone claims a listing (?claim=slug). */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug || slug.length > 200) return NextResponse.json({ found: false });
  try {
    await connectDB();
    const company = await Company.findOne({ slug }).select("_id name category location").lean();
    if (!company) return NextResponse.json({ found: false });
    const claimed = !!(await User.exists({ companyId: company._id }));
    return NextResponse.json({
      found: true,
      name: company.name,
      category: company.category,
      state: company.location?.state ?? "",
      claimed,
    });
  } catch (err) {
    console.error("[claim-info]", err);
    return NextResponse.json({ found: false });
  }
}
