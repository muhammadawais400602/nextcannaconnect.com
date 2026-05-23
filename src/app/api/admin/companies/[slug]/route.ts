import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

const VALID_TIERS = ["free", "select", "elite"];
const VALID_CATS = [
  "retail-dispensary", "cultivation-growing", "manufacturers-suppliers",
  "extraction-processing", "consultants-advisors", "marketing-branding-packaging",
  "transportation-logistics", "testing-science", "compliance-legal",
  "technology-software", "real-estate-construction", "finance-insurance",
];

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

    if (body.tier && !VALID_TIERS.includes(body.tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }
    if (body.category && !VALID_CATS.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    const strField = (key: string, max: number) => {
      if (body[key] !== undefined) update[key] = String(body[key] ?? "").slice(0, max);
    };
    strField("name",             200);
    strField("shortDescription", 500);
    strField("fullDescription",  5000);
    strField("website",          500);
    strField("phone",            50);
    strField("email",            200);
    strField("logoUrl",          500);
    strField("bannerImageUrl",   500);
    strField("logoColor",        20);
    strField("logoPlaceholder",  5);
    strField("bio",              2000);
    strField("pricingModel",     200);
    strField("availability",     200);
    strField("serviceArea",      300);
    strField("linkedinUrl",      500);
    strField("instagramUrl",     500);
    strField("youtubeUrl",       500);
    strField("facebookUrl",      500);
    strField("twitterUrl",       500);
    if (body.tier)     update.tier     = body.tier;
    if (body.category) update.category = body.category;
    if (body.tier !== undefined) update.isFeatured = body.tier === "elite";
    if (body.foundedYear !== undefined) update.foundedYear = Number(body.foundedYear) || undefined;
    if (body.teamSize   !== undefined) update.teamSize     = String(body.teamSize).slice(0, 50);
    if (Array.isArray(body.serviceTags)) {
      update.serviceTags = body.serviceTags.slice(0, 20).map((t: unknown) => String(t).slice(0, 100));
    }
    if (body.location !== undefined) {
      update["location.address"] = String(body.location?.address || "").slice(0, 300);
      update["location.city"]    = String(body.location?.city    || "").slice(0, 100);
      update["location.state"]   = String(body.location?.state   || "").slice(0, 100);
      update["location.zip"]     = String(body.location?.zip     || "").slice(0, 20);
    }

    const company = await Company.findOneAndUpdate(
      { slug },
      { $set: update },
      { new: true, runValidators: true }
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete company" }, { status: 500 });
  }
}
