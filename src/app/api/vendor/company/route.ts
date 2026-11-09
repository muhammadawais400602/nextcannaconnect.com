import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Company from "@/lib/models/Company";
import SignupApplication from "@/lib/models/SignupApplication";
import { verifyVendorSession } from "@/lib/verifyVendorSession";

/**
 * Links an account to its company for accounts approved before companyId was
 * stored on the user. Only exact email matches are allowed, only after an admin
 * approved an application for that email, and never for a listing that another
 * account already owns. (Previously any signup could take over a listing by
 * matching its email or company name.)
 */
async function linkApprovedCompany(userId: string, email: string) {
  const approved = await SignupApplication.exists({ email, status: "approved" });
  if (!approved) return null;
  const company = await Company.findOne({ email });
  if (!company) return null;
  const otherOwner = await User.exists({ companyId: company._id, _id: { $ne: userId } });
  if (otherOwner) return null;
  await User.findByIdAndUpdate(userId, { companyId: company._id });
  return company;
}

const SELECT_FIELDS = [
  "shortDescription", "fullDescription", "website", "bannerImageUrl", "bannerCaption", "products",
];
const ELITE_FIELDS = ["linkedinUrl", "instagramUrl", "youtubeUrl"];
const URL_FIELDS = ["website", "linkedinUrl", "instagramUrl", "youtubeUrl", "logoUrl", "bannerImageUrl"];
const MAX_LEN: Record<string, number> = { name: 120, shortDescription: 300, fullDescription: 5000, bio: 3000 };

function cleanString(key: string, value: unknown): string | undefined {
  if (value === null) return "";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value !== "string") return undefined;
  const v = value.trim().slice(0, MAX_LEN[key] ?? 500);
  if (URL_FIELDS.includes(key) && v && !/^https?:\/\//i.test(v)) return undefined;
  return v;
}

function cleanList(value: unknown[]): string[] {
  return value
    .filter((v) => typeof v === "string" || typeof v === "number")
    .map((v) => String(v).trim().slice(0, 120))
    .filter(Boolean)
    .slice(0, 50);
}

async function getVendorUserId(request: NextRequest): Promise<string | null> {
  const session = request.cookies.get("vendor_session")?.value;
  if (!session) return null;
  const userId = await verifyVendorSession(session);
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return userId;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getVendorUserId(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId).select("companyId isActive email companyName tier");
    if (!user?.isActive) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let company = user.companyId ? await Company.findById(user.companyId) : null;

    if (!company) {
      company = await linkApprovedCompany(userId, user.email);
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
    const user = await User.findById(userId).select("companyId isActive email companyName tier");
    if (!user?.isActive) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!user.companyId) {
      const linked = await linkApprovedCompany(userId, user.email);
      if (linked) user.companyId = linked._id as mongoose.Types.ObjectId;
    }
    if (!user.companyId) {
      return NextResponse.json(
        { error: "Your listing is not live yet. It will be editable once our team approves your application." },
        { status: 404 },
      );
    }

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
      "name", "shortDescription", "fullDescription", "website", "phone",
      "bannerImageUrl", "bannerCaption",
      "foundedYear", "teamSize", "serviceArea", "yearsInCannabis",
      "pricingModel", "availability", "hourlyRate", "bio",
      "linkedinUrl", "instagramUrl", "youtubeUrl",
      "logoUrl",
      // Category-specific fields
      "minOrderQty", "leadTime",
      "licenseNumber", "licenseType", "delivery", "hours", "locationsCount",
      "metrcIntegrated",
      "vehicleCount", "transportType", "loadsPerMonth", "cargoInsurance",
      "dispatchHours", "gpsTracked",
      "accreditation", "turnaroundTime", "sampleTypes", "panelCount",
      "facilitySize", "samplesTested", "rushService", "sampleIntakeHours",
      "licenseStatus",
      "projectsCompleted", "credentialHeadline",
      "yearsExperience",
    ];
    if (body.category && VALID_CATEGORIES.includes(body.category)) {
      update.category = body.category;
    }
    // Enforce plan limits on the server, not just in the dashboard UI.
    const planTier = user.tier ?? "free";
    const blocked = new Set<string>([
      ...(planTier === "free" ? SELECT_FIELDS : []),
      ...(planTier !== "elite" ? ELITE_FIELDS : []),
    ]);
    const numberFields = new Set(["foundedYear", "locationsCount", "vehicleCount", "panelCount", "projectsCompleted"]);
    const booleanFields = new Set(["metrcIntegrated", "gpsTracked", "cargoInsurance", "rushService", "delivery"]);
    for (const key of allowed) {
      if (body[key] === undefined || blocked.has(key)) continue;
      const raw = body[key];
      if (numberFields.has(key) && typeof raw === "number") {
        if (Number.isFinite(raw)) update[key] = raw;
        continue;
      }
      if (booleanFields.has(key) && typeof raw === "boolean") {
        update[key] = raw;
        continue;
      }
      const cleaned = cleanString(key, raw);
      if (cleaned !== undefined) update[key] = cleaned;
    }
    if ("name" in update && !update.name) {
      return NextResponse.json({ error: "Company name can't be empty." }, { status: 400 });
    }
    if (body.city !== undefined || body.state !== undefined || body.address !== undefined || body.zip !== undefined) {
      const existing = await Company.findById(user.companyId).select("location");
      if (body.address !== undefined) update["location.address"] = cleanString("address", body.address) ?? "";
      update["location.city"] = cleanString("city", body.city) ?? existing?.location?.city ?? "";
      update["location.state"] = cleanString("state", body.state) ?? existing?.location?.state ?? "";
      if (body.zip !== undefined) update["location.zip"] = cleanString("zip", body.zip) ?? "";
    }
    if (Array.isArray(body.serviceTags)) update.serviceTags = cleanList(body.serviceTags);
    if (Array.isArray(body.certifications)) update.certifications = cleanList(body.certifications);
    if (Array.isArray(body.productLines)) update.productLines = cleanList(body.productLines);
    if (Array.isArray(body.specialtyAreas)) update.specialtyAreas = cleanList(body.specialtyAreas);
    if (Array.isArray(body.credentials)) update.credentials = cleanList(body.credentials);
    if (Array.isArray(body.statesServed)) update.statesServed = cleanList(body.statesServed);
    if (Array.isArray(body.features)) update.features = cleanList(body.features);
    if (Array.isArray(body.securityFeatures)) update.securityFeatures = cleanList(body.securityFeatures);
    if (Array.isArray(body.accreditations)) update.accreditations = cleanList(body.accreditations);
    if (Array.isArray(body.products) && !blocked.has("products")) {
      update.products = body.products.slice(0, 6).map((p: { name?: string; description?: string; imageUrl?: string }) => ({
        name: String(p.name ?? "").slice(0, 100),
        description: String(p.description ?? "").slice(0, 300),
        imageUrl: /^https?:\/\//i.test(String(p.imageUrl ?? "")) ? String(p.imageUrl).slice(0, 500) : "",
      }));
    }

    const company = await Company.findByIdAndUpdate(
      user.companyId,
      { $set: update },
      { returnDocument: "after" }
    );

    revalidateTag("companies", "max");
    if (company?.slug) revalidatePath(`/vendor/${company.slug}`);
    if (company?.category) revalidatePath(`/directory/${company.category}`);
    return NextResponse.json({ success: true, company });
  } catch (err) {
    console.error("[vendor/company PUT]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
