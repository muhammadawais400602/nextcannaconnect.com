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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.slug || !body.category || !body.shortDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const company = await Company.create({
      ...body,
      logoPlaceholder: body.logoPlaceholder || body.name.substring(0, 2).toUpperCase(),
      logoColor: body.logoColor || "#1A4A35",
      isFeatured: body.tier === "elite",
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
