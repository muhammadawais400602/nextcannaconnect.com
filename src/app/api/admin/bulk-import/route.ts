import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

const VALID_TIERS = ["free", "select", "elite"];
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any>[] = Array.isArray(body) ? body : [];

    if (!data.length) {
      return NextResponse.json({ error: "No entries found." }, { status: 400 });
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
      const name = (entry.name || "").trim();
      const tier = entry.tier || "elite";
      const category = entry.category || "";

      if (!name) { skipped++; continue; }
      if (!VALID_TIERS.includes(tier)) { skipped++; continue; }
      if (!VALID_CATEGORIES.includes(category)) { skipped++; continue; }

      const base = entry.slug ? slugify(entry.slug) : slugify(name);
      let slug = base;
      let suffix = 2;
      while (usedSlugs.has(slug) && !existingSlugs.has(slug)) slug = `${base}-${suffix++}`;
      usedSlugs.add(slug);

      const doc: Record<string, unknown> = {
        slug,
        name,
        tier,
        category,
        location: entry.location || { address: "", city: "", state: "", zip: "" },
        shortDescription: entry.shortDescription || `${name} — cannabis industry partner.`,
        logoPlaceholder: initials(name),
        logoColor: LOGO_COLORS[i % LOGO_COLORS.length],
        serviceTags: entry.serviceTags || ["Cannabis Industry"],
        isFeatured: false,
        updatedAt: now,
      };

      if (entry.fullDescription) doc.fullDescription = entry.fullDescription;
      if (entry.website) doc.website = entry.website;
      if (entry.phone) doc.phone = entry.phone;
      if (entry.email) doc.email = entry.email;
      if (entry.facilitySize) doc.facilitySize = entry.facilitySize;
      if (entry.serviceArea) doc.serviceArea = entry.serviceArea;
      if (entry.teamSize) doc.teamSize = entry.teamSize;
      if (entry.pricingModel) doc.pricingModel = entry.pricingModel;
      if (entry.minOrderQty) doc.minOrderQty = entry.minOrderQty;
      if (entry.leadTime) doc.leadTime = entry.leadTime;
      if (entry.turnaroundTime) doc.turnaroundTime = entry.turnaroundTime;
      if (entry.licenseNumber) doc.licenseNumber = entry.licenseNumber;
      if (entry.licenseType) doc.licenseType = entry.licenseType;
      if (entry.delivery) doc.delivery = entry.delivery;
      if (entry.hours) doc.hours = entry.hours;
      if (entry.vehicleCount) doc.vehicleCount = entry.vehicleCount;
      if (entry.transportType) doc.transportType = entry.transportType;
      if (entry.dispatchHours) doc.dispatchHours = entry.dispatchHours;
      if (entry.accreditation) doc.accreditation = entry.accreditation;
      if (entry.panelCount) doc.panelCount = entry.panelCount;
      if (entry.projectsCompleted) doc.projectsCompleted = entry.projectsCompleted;
      if (entry.availability) doc.availability = entry.availability;
      if (Array.isArray(entry.specialtyAreas)) doc.specialtyAreas = entry.specialtyAreas;
      if (Array.isArray(entry.statesServed)) doc.statesServed = entry.statesServed;
      if (Array.isArray(entry.certifications)) doc.certifications = entry.certifications;

      ops.push({
        updateOne: {
          filter: { slug },
          update: { $set: doc, $setOnInsert: { createdAt: now } },
          upsert: true,
        },
      });
    }

    if (ops.length === 0) {
      return NextResponse.json({ error: "No valid entries found." }, { status: 400 });
    }

    const BATCH = 100;
    for (let i = 0; i < ops.length; i += BATCH) {
      await Company.bulkWrite(ops.slice(i, i + BATCH), { ordered: false });
    }

    const byCat: Record<string, number> = {};
    for (const entry of data) {
      const cat = entry.category || "unknown";
      byCat[cat] = (byCat[cat] || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      imported: ops.length,
      skipped,
      total: data.length,
      byCategory: byCat,
    });
  } catch (err) {
    console.error("[bulk-import]", err);
    return NextResponse.json({ error: "Bulk import failed." }, { status: 500 });
  }
}
