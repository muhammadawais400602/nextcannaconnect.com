import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";

async function getVendorUserId(request: NextRequest): Promise<string | null> {
  const session = request.cookies.get("vendor_session")?.value;
  if (!session || !session.startsWith("nc-vendor:")) return null;
  const userId = session.split(":")[1];
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return userId;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getVendorUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId).select("companyId isActive email companyName");
    if (!user?.isActive) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let company = user.companyId ? await Company.findById(user.companyId) : null;

    // Fallback: link company by email or company name for pre-existing accounts
    if (!company) {
      company = await Company.findOne({ email: user.email })
        ?? (user.companyName
          ? await Company.findOne({ name: { $regex: `^${user.companyName}$`, $options: "i" } })
          : null);
      if (company) {
        await User.findByIdAndUpdate(userId, { companyId: company._id });
      }
    }

    return NextResponse.json({ company });
  } catch (err) {
    console.error("[vendor/company GET]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getVendorUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId).select("companyId isActive email companyName");
    if (!user?.isActive) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Resolve companyId — link by email/name for accounts approved before auto-linking was added
    if (!user.companyId) {
      const found = await Company.findOne({ email: user.email })
        ?? (user.companyName
          ? await Company.findOne({ name: { $regex: `^${user.companyName}$`, $options: "i" } })
          : null);
      if (found) {
        user.companyId = found._id as mongoose.Types.ObjectId;
        await User.findByIdAndUpdate(userId, { companyId: found._id });
      }
    }
    if (!user.companyId) return NextResponse.json({ error: "No company linked to this account" }, { status: 404 });

    const body = await request.json();

    // Vendors can edit content fields only — not slug, tier, category, or isFeatured
    const update: Record<string, unknown> = {};
    const VALID_CATEGORIES = [
      "cultivation-growing", "manufacturers-suppliers", "extraction-processing",
      "consultants-advisors", "marketing-branding-packaging", "retail-dispensary",
      "transportation-logistics", "testing-science", "compliance-legal",
      "technology-software", "real-estate-construction", "finance-insurance",
    ];
    const allowed = [
      "shortDescription", "fullDescription", "website", "phone",
      "bannerImageUrl", "bannerCaption",
      "foundedYear", "teamSize", "serviceArea", "yearsInCannabis",
      "pricingModel", "availability", "hourlyRate", "bio",
    ];
    if (body.category && VALID_CATEGORIES.includes(body.category)) {
      update.category = body.category;
    }
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = body[key];
    }
    if (body.city !== undefined || body.state !== undefined || body.address !== undefined || body.zip !== undefined) {
      const existing = await Company.findById(user.companyId).select("location");
      if (body.address !== undefined) update["location.address"] = body.address;
      update["location.city"] = body.city ?? existing?.location?.city ?? "";
      update["location.state"] = body.state ?? existing?.location?.state ?? "";
      if (body.zip !== undefined) update["location.zip"] = body.zip;
    }
    if (Array.isArray(body.serviceTags)) update.serviceTags = body.serviceTags;
    if (Array.isArray(body.certifications)) update.certifications = body.certifications;
    if (Array.isArray(body.products)) {
      update.products = body.products.slice(0, 6).map((p: { name?: string; description?: string; imageUrl?: string }) => ({
        name: String(p.name ?? "").slice(0, 100),
        description: String(p.description ?? "").slice(0, 300),
        imageUrl: String(p.imageUrl ?? "").slice(0, 500),
      }));
    }

    const company = await Company.findByIdAndUpdate(
      user.companyId,
      { $set: update },
      { new: true }
    );

    revalidateTag("companies", "max");
    if (company?.slug) revalidatePath(`/vendor/${company.slug}`);
    if (company?.category) revalidatePath(`/directory/${company.category}`);
    return NextResponse.json({ success: true, company });
  } catch (err) {
    console.error("[vendor/company PUT]", err);
    return NextResponse.json({ error: "Server error", detail: String(err) }, { status: 500 });
  }
}
