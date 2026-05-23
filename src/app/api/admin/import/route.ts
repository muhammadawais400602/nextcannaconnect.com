import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

const VALID_TIERS     = ["free", "select", "elite"];
const VALID_CATEGORIES = [
  "retail-dispensary", "cultivation-growing", "manufacturers-suppliers",
  "extraction-processing", "consultants-advisors", "marketing-branding-packaging",
  "transportation-logistics", "testing-science", "compliance-legal",
  "technology-software", "real-estate-construction", "finance-insurance",
];

const LOGO_COLORS = [
  "#1A4A35", "#2d6e52", "#4A5E4A", "#3d5a3e",
  "#2e5540", "#3a5c45", "#445e42", "#1e6b45",
];

const PLACEHOLDER_PHRASES = ["available on listing", "available via"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "listing";
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

function isPlaceholder(val: string | null | undefined): boolean {
  if (!val) return true;
  const lower = val.toLowerCase();
  return PLACEHOLDER_PHRASES.some((p) => lower.includes(p));
}

function cleanEmail(raw: string | null | undefined): string {
  if (!raw) return "";
  const m = raw.match(/\[([^\]]+)\]\(mailto:[^)]+\)/);
  return m ? m[1].trim() : raw.trim();
}

// Clean scraped page titles: "Foo | Bar" → shortest part, "Home - Foo" → "Foo"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanBusinessName(raw: string, entry: Record<string, any>): string {
  let name = (raw || "").trim();
  if (name.includes(" | ")) {
    name = name.split(" | ").sort((a, b) => a.length - b.length)[0].trim();
  }
  name = name.replace(/^home\s*[-–]\s*/i, "").trim();
  if (/^home$/i.test(name) || name.length < 3) {
    try {
      const host = new URL(entry.website || "").hostname.replace(/^www\./, "");
      name = host.split(".")[0].replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    } catch { name = ""; }
  }
  return name;
}

// ── Format detectors ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isScrapedEntry(e: Record<string, any>): boolean {
  return "business_name" in e || "brand_name" in e;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isStructuredEntry(e: Record<string, any>): boolean {
  return "company_name" in e && typeof e.about === "object" && e.about !== null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isLeaflyEntry(e: Record<string, any>): boolean {
  return "company_name" in e;
}

// ── Document builders ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildScrapedDoc(entry: Record<string, any>, index: number, slug: string, tier: string, category: string, now: Date): Record<string, unknown> {
  const rawName = entry.business_name || entry.brand_name || "";
  const name = cleanBusinessName(rawName, entry);

  const about1 = (entry.about_para_1 || entry.about || "").trim();
  const about2 = (entry.about_para_2 || "").trim();
  const fullDesc = [about1, about2].filter(Boolean).join("\n\n");
  const shortDesc = about1 ? about1.substring(0, 200) : `${name} — cannabis industry partner.`;

  // Parse city/state out of address string if city/state fields are empty
  let address = (entry.address || "").trim();
  let city    = (entry.city    || "").trim();
  let state   = (entry.state   || "").trim();
  let zip     = (entry.zip     || "").trim();

  // address field sometimes contains "street\ncity, STATE zip"
  if (!city && address.includes("\n")) {
    const parts = address.split("\n");
    address = parts[0].trim();
    const cityLine = parts[1]?.trim() || "";
    const m = cityLine.match(/^(.+),\s*([A-Z]{2})\s*(\d{5})?/);
    if (m) { city = m[1].trim(); state = m[2]; zip = m[3] || ""; }
  }

  const doc: Record<string, unknown> = {
    slug,
    name,
    tier,
    category,
    location: { address, city, state, zip },
    shortDescription: shortDesc,
    logoPlaceholder:  initials(name),
    logoColor:        LOGO_COLORS[index % LOGO_COLORS.length],
    serviceTags:      ["Cannabis Industry"],
    isFeatured:       false,
    updatedAt:        now,
  };

  if (fullDesc)                           doc.fullDescription = fullDesc;
  if ((entry.logo_url         || "").trim()) doc.logoUrl       = entry.logo_url.trim();
  if ((entry.featured_image_url || "").trim()) doc.bannerImageUrl = entry.featured_image_url.trim();
  if ((entry.website || "").trim())       doc.website         = entry.website.trim();
  if ((entry.phone   || "").trim())       doc.phone           = entry.phone.trim();
  if ((entry.email   || "").trim() && !isPlaceholder(entry.email)) doc.email = entry.email.trim();
  if ((entry.instagram   || "").trim())   doc.instagramUrl    = entry.instagram.trim();
  if ((entry.facebook    || "").trim())   doc.facebookUrl     = entry.facebook.trim();
  if ((entry.twitter_x   || "").trim())   doc.twitterUrl      = entry.twitter_x.trim();
  if ((entry.linkedin    || "").trim())   doc.linkedinUrl     = entry.linkedin.trim();

  return doc;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStructuredDoc(entry: Record<string, any>, index: number, slug: string, tier: string, category: string, now: Date): Record<string, unknown> {
  const branding = entry.branding     || {};
  const contact  = entry.contact      || {};
  const social   = entry.social_links || {};
  const stats    = entry.stats        || {};
  const about    = entry.about        || {};
  const name     = (entry.company_name || "").trim();

  const doc: Record<string, unknown> = {
    slug, name, tier, category,
    location: {
      address: (entry.address || "").trim(),
      city:    (entry.city    || "").trim(),
      state:   (entry.state   || "").trim(),
      zip:     "",
    },
    shortDescription: (entry.short_description || "").trim() || `${name} — cannabis industry partner.`,
    logoPlaceholder:  (branding.logo_initials || initials(name)).toUpperCase().substring(0, 2),
    logoColor:        branding.logo_color || LOGO_COLORS[index % LOGO_COLORS.length],
    serviceTags:      Array.isArray(entry.core_services_tags) ? entry.core_services_tags : ["Cannabis Industry"],
    isFeatured:       false,
    updatedAt:        now,
  };

  const fullDesc = (about.full_description || "").trim();
  if (fullDesc)                              doc.fullDescription = fullDesc;
  if (branding.logo_image_url?.trim())       doc.logoUrl         = branding.logo_image_url.trim();
  if (branding.banner_image_url?.trim())     doc.bannerImageUrl  = branding.banner_image_url.trim();
  if (!isPlaceholder(contact.website))       doc.website         = contact.website?.trim();
  if (contact.phone?.trim())                 doc.phone           = contact.phone.trim();
  const email = cleanEmail(contact.email);
  if (email && !isPlaceholder(email))        doc.email           = email;
  if (social.instagram?.trim())              doc.instagramUrl    = social.instagram.trim();
  if (social.facebook?.trim())               doc.facebookUrl     = social.facebook.trim();
  if (social.twitter?.trim())                doc.twitterUrl      = social.twitter.trim();
  if (social.linkedin?.trim())               doc.linkedinUrl     = social.linkedin.trim();
  if (social.youtube?.trim())                doc.youtubeUrl      = social.youtube.trim();
  if (social.yelp?.trim())                   doc.yelpUrl         = social.yelp.trim();
  if (social.leafly?.trim())                 doc.leaflyUrl       = social.leafly.trim();
  if (entry.leafly_url?.trim())              doc.leaflyUrl       = entry.leafly_url.trim();
  if (stats.founded_year)                    doc.foundedYear     = Number(stats.founded_year);
  if (stats.team_size)                       doc.teamSize        = String(stats.team_size);
  if (stats.regions_served?.trim())          doc.serviceArea     = stats.regions_served.trim();
  if (stats.years_in_cannabis)               doc.yearsInCannabis = Number(stats.years_in_cannabis);
  if (Array.isArray(entry.states_served) && entry.states_served.length)
                                             doc.statesServed    = entry.states_served;
  if (Array.isArray(entry.certifications) && entry.certifications.length)
                                             doc.certifications  = entry.certifications;
  if (entry.rating)                          doc.rating          = Number(entry.rating);
  if (entry.review_count)                    doc.reviewCount     = Number(entry.review_count);
  if (Array.isArray(entry.product_offerings) && entry.product_offerings.length) {
    doc.products = entry.product_offerings.map((p: { name: string; description: string; image_url?: string }) => ({
      name: p.name, description: p.description, imageUrl: p.image_url || undefined,
    }));
  }
  return doc;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildLeaflyDoc(entry: Record<string, any>, index: number, slug: string, tier: string, category: string, now: Date): Record<string, unknown> {
  const branding = entry.branding        || {};
  const contact  = entry.contact         || {};
  const social   = entry.social_links    || {};
  const stats    = entry.profile_stats   || {};
  const name     = (entry.company_name   || "").trim();

  const doc: Record<string, unknown> = {
    slug, name, tier, category,
    location: {
      address: (entry.address || "").trim(),
      city:    (entry.city    || "").trim(),
      state:   (entry.state   || "").trim(),
      zip:     "",
    },
    shortDescription: (entry.short_description || "").trim() || `${name} — cannabis industry partner.`,
    logoPlaceholder:  (branding.logo_initials || initials(name)).toUpperCase().substring(0, 2),
    logoColor:        branding.logo_color || LOGO_COLORS[index % LOGO_COLORS.length],
    serviceTags:      Array.isArray(entry.service_tags) ? entry.service_tags : ["Cannabis Industry"],
    isFeatured:       false,
    updatedAt:        now,
  };

  if (entry.full_description?.trim())    doc.fullDescription = entry.full_description.trim();
  if (branding.logo_image_url?.trim())   doc.logoUrl         = branding.logo_image_url.trim();
  if (branding.banner_image_url?.trim()) doc.bannerImageUrl  = branding.banner_image_url.trim();
  if (contact.website?.trim())           doc.website         = contact.website.trim();
  if (contact.phone?.trim())             doc.phone           = contact.phone.trim();
  const email = cleanEmail(contact.email);
  if (email)                             doc.email           = email;
  if (social.instagram?.trim())          doc.instagramUrl    = social.instagram.trim();
  if (social.facebook?.trim())           doc.facebookUrl     = social.facebook.trim();
  if (social.twitter?.trim())            doc.twitterUrl      = social.twitter.trim();
  if (social.yelp?.trim())               doc.yelpUrl         = social.yelp.trim();
  if (social.leafly?.trim())             doc.leaflyUrl       = social.leafly.trim();
  if (stats.founded_year)                doc.foundedYear     = Number(stats.founded_year);
  if (Array.isArray(entry.states_served) && entry.states_served.length)
                                         doc.statesServed    = entry.states_served;
  if (Array.isArray(entry.certifications) && entry.certifications.length)
                                         doc.certifications  = entry.certifications;
  if (entry.leafly_rating)               doc.rating          = Number(entry.leafly_rating);
  if (entry.leafly_reviews)              doc.reviewCount     = Number(entry.leafly_reviews);
  return doc;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildStandardDoc(entry: Record<string, any>, index: number, slug: string, tier: string, category: string, now: Date): Record<string, unknown> {
  const name      = (entry.name || "").trim();
  const logoUrl   = (entry.logo_url      || "").trim();
  const bannerUrl = (entry.featured_image || logoUrl).trim();

  const doc: Record<string, unknown> = {
    slug, name, tier, category,
    location: {
      address: (entry.address_street || "").trim(),
      city:    (entry.address_city   || "").trim(),
      state:   (entry.address_state  || "").trim(),
      zip:     (entry.address_zip    || "").trim(),
    },
    shortDescription: (() => {
      const desc = (entry.description || "").trim();
      if (desc) return desc.substring(0, 200);
      const city  = (entry.address_city  || "").trim();
      const state = (entry.address_state || "").trim();
      if (city && state) return `${name} is located in ${city}, ${state}.`;
      return `${name} — cannabis industry partner.`;
    })(),
    logoPlaceholder: initials(name),
    logoColor:       LOGO_COLORS[index % LOGO_COLORS.length],
    serviceTags:     ["Cannabis Industry"],
    isFeatured:      false,
    updatedAt:       now,
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

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file     = formData.get("file") as File | null;
    const tier     = (formData.get("tier")     as string | null) || "free";
    const category = (formData.get("category") as string | null) || "retail-dispensary";

    if (!file) return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    if (!VALID_TIERS.includes(tier)) return NextResponse.json({ error: "Invalid tier." }, { status: 400 });
    if (!VALID_CATEGORIES.includes(category)) return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: "File too large. Maximum size is 10 MB." }, { status: 413 });

    // Replace bare NaN (from Python/pandas exports) with null before parsing
    const text    = (await file.text()).replace(/:\s*NaN\b/g, ": null");
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

    const ops  = [];
    let skipped = 0;
    const now  = new Date();

    for (let i = 0; i < data.length; i++) {
      const entry     = data[i];
      const scraped   = isScrapedEntry(entry);
      const structured = !scraped && isStructuredEntry(entry);
      const leafly    = !scraped && !structured && isLeaflyEntry(entry);

      const rawName = scraped
        ? cleanBusinessName(entry.business_name || entry.brand_name, entry)
        : (structured || leafly) ? entry.company_name : entry.name;
      const name = (rawName || "").trim();
      if (!name) { skipped++; continue; }

      const rawSlug = (entry.slug || "").trim();
      const base    = rawSlug ? slugify(rawSlug) : slugify(name);
      let slug      = base;
      let suffix    = 2;
      while (usedSlugs.has(slug) && !existingSlugs.has(slug)) slug = `${base}-${suffix++}`;
      usedSlugs.add(slug);

      const doc = scraped
        ? buildScrapedDoc(entry, i, slug, tier, category, now)
        : structured
        ? buildStructuredDoc(entry, i, slug, tier, category, now)
        : leafly
        ? buildLeaflyDoc(entry, i, slug, tier, category, now)
        : buildStandardDoc(entry, i, slug, tier, category, now);

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

    return NextResponse.json({ success: true, imported: ops.length, skipped, total: data.length, tier, category });
  } catch (err) {
    console.error("[import]", err);
    return NextResponse.json({ error: "Import failed. Please try again." }, { status: 500 });
  }
}
