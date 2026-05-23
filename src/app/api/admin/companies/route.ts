import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";
import { COMPANIES } from "@/data/companies";

async function seedIfEmpty() {
  const count = await Company.countDocuments();
  if (count === 0) {
    const docs = COMPANIES.map(({ id, bannerColor, ...rest }) => ({
      ...rest,
      isFeatured: rest.tier === "elite",
    }));
    await Company.insertMany(docs);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await seedIfEmpty();

    const { searchParams } = new URL(request.url);
    const tier = searchParams.get("tier");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (tier) filter.tier = tier;
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    const companies = await Company.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json({ companies, total: companies.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

const VALID_TIERS_CO = ["free", "select", "elite"];
const VALID_CATS_CO = [
  "retail-dispensary", "cultivation-growing", "manufacturers-suppliers",
  "extraction-processing", "consultants-advisors", "marketing-branding-packaging",
  "transportation-logistics", "testing-science", "compliance-legal",
  "technology-software", "real-estate-construction", "finance-insurance",
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.name || !body.slug || !body.category || !body.shortDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (body.tier && !VALID_TIERS_CO.includes(body.tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }
    if (!VALID_CATS_CO.includes(body.category)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }

    const tier = body.tier || "free";
    const company = await Company.create({
      name:             String(body.name).slice(0, 200),
      slug:             String(body.slug).slice(0, 200),
      category:         body.category,
      tier,
      shortDescription: String(body.shortDescription || "").slice(0, 500),
      fullDescription:  body.fullDescription ? String(body.fullDescription).slice(0, 5000) : undefined,
      website:          body.website  ? String(body.website).slice(0, 500)  : undefined,
      phone:            body.phone    ? String(body.phone).slice(0, 50)     : undefined,
      email:            body.email    ? String(body.email).slice(0, 200)    : undefined,
      logoUrl:          body.logoUrl  ? String(body.logoUrl).slice(0, 500)  : undefined,
      bannerImageUrl:   body.bannerImageUrl ? String(body.bannerImageUrl).slice(0, 500) : undefined,
      logoPlaceholder:  body.logoPlaceholder ? String(body.logoPlaceholder).slice(0, 5) : String(body.name).substring(0, 2).toUpperCase(),
      logoColor:        body.logoColor || "#1A4A35",
      location:         body.location ? {
        address: String(body.location.address || "").slice(0, 300),
        city:    String(body.location.city    || "").slice(0, 100),
        state:   String(body.location.state   || "").slice(0, 100),
        zip:     String(body.location.zip     || "").slice(0, 20),
      } : undefined,
      serviceTags:      Array.isArray(body.serviceTags)
        ? body.serviceTags.slice(0, 20).map((t: unknown) => String(t).slice(0, 100))
        : undefined,
      isFeatured: tier === "elite",
    });

    return NextResponse.json({ company }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("duplicate key")) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}
