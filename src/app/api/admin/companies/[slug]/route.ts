import User from "@/lib/models/User";
import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const company = await Company.findOne({ slug }).lean();
    if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ company });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await request.json();

    const company = await Company.findOneAndUpdate(
      { slug },
      {
        ...body,
        isFeatured: body.tier === "elite",
      },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ company });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const result = await Company.findOneAndDelete({ slug });
    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Detach the owner's account (it would otherwise point at a missing listing)
    // and clear cached pages so the listing disappears from the site right away.
    await User.updateMany({ companyId: result._id }, { $unset: { companyId: "" } });
    revalidateTag("companies", "max");
    revalidatePath(`/vendor/${slug}`);
    revalidatePath(`/directory/${result.category}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
