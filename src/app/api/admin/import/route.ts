import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "dispensary";
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

const LOGO_COLORS = [
  "#1A4A35", "#2d6e52", "#4A5E4A", "#3d5a3e",
  "#2e5540", "#3a5c45", "#445e42", "#1e6b45",
];

function makeShortDesc(entry: Record<string, string>): string {
  const desc = (entry.description || "").trim();
  if (desc) return desc.substring(0, 200);
  const name  = (entry.name  || "Cannabis Dispensary").trim();
  const city  = (entry.address_city  || "").trim();
  const state = (entry.address_state || "").trim();
  if (city && state) return `${name} is a cannabis dispensary located in ${city}, ${state}.`;
  return `${name} — licensed cannabis dispensary.`;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const text = await file.text();
    let data: Record<string, string>[];

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        data = parsed;
      } else {
        // Handle { dispensaries: [...] } or similar wrapper
        const val = Object.values(parsed).find((v) => Array.isArray(v));
        if (!val) throw new Error("No array found in JSON");
        data = val as Record<string, string>[];
      }
    } catch {
      return NextResponse.json({ error: "Invalid JSON file." }, { status: 400 });
    }

    // Pre-load existing slugs so we can deduplicate within the file too
    const existingSlugs = new Set(
      (await Company.find({}, { slug: 1, _id: 0 }).lean()).map((d) => (d as { slug: string }).slug)
    );
    const usedSlugs = new Set(existingSlugs);

    const ops = [];
    let skipped = 0;
    const now = new Date();

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      const name = (entry.name || "").trim();
      if (!name) { skipped++; continue; }

      // Generate unique slug
      const base = slugify(name);
      let slug = base;
      let suffix = 2;
      while (usedSlugs.has(slug) && !existingSlugs.has(slug)) {
        slug = `${base}-${suffix++}`;
      }
      usedSlugs.add(slug);

      const logoUrl   = (entry.logo_url      || "").trim();
      const bannerUrl = (entry.featured_image || logoUrl).trim();

      const doc: Record<string, unknown> = {
        slug,
        name,
        tier:             "free",
        category:         "retail-dispensary",
        location: {
          address: (entry.address_street || "").trim(),
          city:    (entry.address_city   || "").trim(),
          state:   (entry.address_state  || "").trim(),
          zip:     (entry.address_zip    || "").trim(),
        },
        shortDescription: makeShortDesc(entry),
        logoPlaceholder:  initials(name),
        logoColor:        LOGO_COLORS[i % LOGO_COLORS.length],
        serviceTags:      ["Dispensary", "Cannabis Retail"],
        isFeatured:       false,
        updatedAt:        now,
      };

      if (entry.description?.trim())  doc.fullDescription = entry.description.trim();
      if (logoUrl)                     doc.logoUrl         = logoUrl;
      if (bannerUrl)                   doc.bannerImageUrl  = bannerUrl;
      if (entry.phone?.trim())         doc.phone           = entry.phone.trim();
      if (entry.email?.trim())         doc.email           = entry.email.trim();
      if (entry.website?.trim())       doc.website         = entry.website.trim();
      if (entry.social_instagram?.trim()) doc.instagramUrl = entry.social_instagram.trim();
      if (entry.social_facebook?.trim())  doc.facebookUrl  = entry.social_facebook.trim();
      if (entry.social_twitter?.trim())   doc.twitterUrl   = entry.social_twitter.trim();
      if (entry.social_yelp?.trim())      doc.yelpUrl      = entry.social_yelp.trim();
      if (entry.leafly_url?.trim())       doc.leaflyUrl    = entry.leafly_url.trim();

      ops.push({
        updateOne: {
          filter: { slug },
          update: { $set: doc, $setOnInsert: { createdAt: now } },
          upsert: true,
        },
      });
    }

    if (ops.length === 0) {
      return NextResponse.json({ error: "No valid entries found in the file." }, { status: 400 });
    }

    // Process in batches of 100
    const BATCH = 100;
    for (let i = 0; i < ops.length; i += BATCH) {
      await Company.bulkWrite(ops.slice(i, i + BATCH), { ordered: false });
    }

    return NextResponse.json({
      success: true,
      imported: ops.length,
      skipped,
      total: data.length,
    });
  } catch (err) {
    console.error("[import]", err);
    return NextResponse.json({ error: "Import failed. Please try again." }, { status: 500 });
  }
}
