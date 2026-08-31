import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    if (body?.confirm !== "REMOVE ALL") {
      return NextResponse.json(
        { error: 'Confirmation phrase did not match. Send { "confirm": "REMOVE ALL" }.' },
        { status: 400 },
      );
    }

    await connectDB();

    const count = await Company.countDocuments({});
    const res = await Company.deleteMany({});

    revalidateTag("companies", "max");
    revalidatePath("/directory", "layout");

    return NextResponse.json({
      success: true,
      removed: res.deletedCount,
      total: count,
    });
  } catch (err) {
    console.error("[remove-all-companies]", err);
    return NextResponse.json({ error: "Removal failed." }, { status: 500 });
  }
}
