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

// Strip markdown link format: [email@x.com](mailto:email@x.com) → email@x.com
function cleanEmail(raw: string | null | undefined): string {
  if (!raw) return "";
  const match = raw.match(/\[([^\]]+)\]\(mailto:[^)]+\)/);
  return match ? match[1].trim() : raw.trim();
}

// Detect if entry is the Leafly-style nested format
function isLeaflyEntry(entry: Record<string, unknown>): boolean {
  return "company_name" in entry;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildLeaflyDoc(entry: Record<string, any>, index: number, slug: string, tier: string, now: Date): Record<string, unknown> {
  const branding   = entry.branding        || {};
  const contact    = entry.contact         || {};
  const social     = entry.social_links    || {};
  const stats      = entry.profile_stats   || {};

  const name = (entry.company_name || "").trim();

  const doc: Record<string, unknown> = {
    slug,
    name,
    tier,
    category:         "retail-dispensary",
    location: {
      address: (entry.address || "").trim(),
      city:    (entry.city    || "").trim(),
      state:   (entry.state   || "").trim(),
      zip:     "",
    },
    shortDescription:  (entry.short_description || "").trim() || `${name} — licensed cannabis dispensary.`,
    logoPlaceholder:   (branding.logo_initials || initials(name)).toUpperCase().substring(0, 2),
    logoColor:         branding.logo_color || LOGO_COLORS[index % LOGO_COLORS.length],
    serviceTags:       Array.isArray(entry.service_tags) ? entry.service_tags : ["Dispensary", "Cannabis Retail"],
    isFeatured:        false,
    updatedAt:         now,
  };

  if (entry.full_description?.trim())      doc.fullDescription = entry.full_description.trim();
  if (contact.website?.trim())             doc.website         = contact.website.trim();
  if (contact.phone?.trim())               doc.phone           = contact.phone.trim();
  const email = cleanEmail(contact.email);
  if (email)                               doc.email           = email;
  if (social.instagram?.trim())            doc.instagramUrl    = social.instagram.trim();
  if (social.facebook?.trim())             doc.facebookUrl     = social.facebook.trim();
  if (social.twitter?.trim())              doc.twitterUrl      = social.twitter.trim();
  if (social.yelp?.trim())                 doc.yelpUrl         = social.yelp.trim();
  if (social.leafly?.trim())               doc.leaflyUrl       = social.leafly.trim();
  if (stats.founded_year)                  doc.foundedYear     = Number(stats.founded_year);
  if (Array.isArray(entry.states_served) && entry.states_served.length)
                                           doc.statesServed    = entry.states_served;
  if (Array.isArray(entry.certifications) && entry.certifications.length)
                                           doc.certifications  = entry.certifications;
  if (entry.leafly_rating)                 doc.rating          = Number(entry.leafly_rating);
  if (entry.leafly_reviews)                doc.reviewCount     = Number(entry.leafly_reviews);

  return doc;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStandardDoc(entry: Record<string, any>, index: number, slug: string, tier: string, now: Date): Record<string, unknown> {
  const name      = (entry.name || "").trim();
  const logoUrl   = (entry.logo_url      || "").trim();
  const bannerUrl = (entry.featured_image || logoUrl).trim();

  const doc: Record<string, unknown> = {
    slug,
    name,
    tier,
    category:         "retail-dispensary",
    location: {
      address: (entry.address_street || "").trim(),
      city:    (entry.address_city   || "").trim(),
      state:   (entry.address_state  || "").trim(),
      zip:     (entry.address_zip    || "").trim(),
    },
    shortDescription: makeShortDesc(entry),
    logoPlaceholder:  initials(name),
    logoColor:        LOGO_COLORS[index % LOGO_COLORS.length],
    serviceTags:      ["Dispensary", "Cannabis Retail"],
    isFeatured:       false,
    updatedAt:        now,
  };

  if (entry.description?.trim())           doc.fullDescription = entry.description.trim();
  if (logoUrl)                             doc.logoUrl         = logoUrl;
  if (bannerUrl)                           doc.bannerImageUrl  = bannerUrl;
  if (entry.phone?.trim())                 doc.phone           = entry.phone.trim();
  if (entry.email?.trim())                 doc.email           = entry.email.trim();
  if (entry.website?.trim())               doc.website         = entry.website.trim();
  if (entry.social_instagram?.trim())      doc.instagramUrl    = entry.social_instagram.trim();
  if (entry.social_facebook?.trim())       doc.facebookUrl     = entry.social_facebook.trim();
  if (entry.social_twitter?.trim())        doc.twitterUrl      = entry.social_twitter.trim();
  if (entry.social_yelp?.trim())           doc.yelpUrl         = entry.social_yelp.trim();
  if (entry.leafly_url?.trim())            doc.leaflyUrl       = entry.leafly_url.trim();

  return doc;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const tier = (formData.get("tier") as string | null) || "free";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (!["free", "select", "elite"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    }

    const text = await file.text();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: Record<string, any>[];

    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        data = parsed;
      } else {
        const val = Object.values(parsed).find((v) => Array.isArray(v));
        if (!val) throw new Error("No array found in JSON");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = val as Record<string, any>[];
      }
    } catch {
      return NextResponse.json({ error: "Invalid JSON file." }, { status: 400 });
    }

    const existingSlugs = new Set(
      (await Company.find({}, { slug: 1, _id: 0 }).lean()).map((d) => (d as { slug: string }).slug)
    );
    const usedSlugs = new Set(existingSlugs);

    const ops = [];
    let skipped = 0;
    const now = new Date();

    for (let i = 0; i < data.length; i++) {
      const entry = data[i];
      const leafly = isLeaflyEntry(entry);
      const rawName = leafly ? entry.company_name : entry.name;
      const name = (rawName || "").trim();
      if (!name) { skipped++; continue; }

      // Use provided slug if available, otherwise generate from name
      const rawSlug = (entry.slug || "").trim();
      const base = rawSlug ? slugify(rawSlug) : slugify(name);
      let slug = base;
      let suffix = 2;
      while (usedSlugs.has(slug) && !existingSlugs.has(slug)) {
        slug = `${base}-${suffix++}`;
      }
      usedSlugs.add(slug);

      const doc = leafly
        ? buildLeaflyDoc(entry, i, slug, tier, now)
        : buildStandardDoc(entry, i, slug, tier, now);

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

    const BATCH = 100;
    for (let i = 0; i < ops.length; i += BATCH) {
      await Company.bulkWrite(ops.slice(i, i + BATCH), { ordered: false });
    }

    return NextResponse.json({
      success: true,
      imported: ops.length,
      skipped,
      total: data.length,
      tier,
    });
  } catch (err) {
    console.error("[import]", err);
    return NextResponse.json({ error: "Import failed. Please try again." }, { status: 500 });
  }
}
