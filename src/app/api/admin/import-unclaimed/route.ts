import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";
import { readFile } from "fs/promises";
import path from "path";

const LOGO_COLORS = [
  "#1A4A35", "#2d6e52", "#4A5E4A", "#3d5a3e",
  "#2e5540", "#3a5c45", "#445e42", "#1e6b45",
];

export async function POST() {
  try {
    await connectDB();

    const filePath = path.join(process.cwd(), "public", "data", "cultivation-unclaimed.json");
    const raw = await readFile(filePath, "utf-8");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any>[] = JSON.parse(raw);

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
      const name = (entry.businessName || entry.legalName || "").trim();
      if (!name) { skipped++; continue; }

      const category = entry.categorySlug || "cultivation-growing";

      let slug = entry.slug || "";
      if (!slug) { skipped++; continue; }

      let finalSlug = slug;
      let suffix = 2;
      while (usedSlugs.has(finalSlug) && !existingSlugs.has(finalSlug)) {
        finalSlug = `${slug}-${suffix++}`;
      }
      usedSlugs.add(finalSlug);

      const loc = entry.location || {};
      const contact = entry.contact || {};
      const catData = entry.categoryData || {};

      const tagline = entry.tagline || `${name} — cannabis industry partner.`;

      const doc: Record<string, unknown> = {
        slug: finalSlug,
        name,
        tier: "free",
        category,
        location: {
          address: "",
          city: loc.city || "",
          state: loc.state || "CA",
          zip: loc.zip || "",
        },
        shortDescription: tagline,
        logoPlaceholder: entry.initials || name.substring(0, 2).toUpperCase(),
        logoColor: LOGO_COLORS[i % LOGO_COLORS.length],
        serviceTags: entry.trustBadges || ["Cannabis Industry"],
        isFeatured: false,
        updatedAt: now,
      };

      if (contact.email) doc.email = contact.email.toLowerCase();
      if (contact.phone) doc.phone = contact.phone;
      if (catData.licenseNumber) doc.licenseNumber = catData.licenseNumber;
      if (catData.licenseType) doc.licenseType = catData.licenseType;
      if (catData.licenseStatus) doc.licenseStatus = catData.licenseStatus;
      if (catData.statesServed) doc.statesServed = catData.statesServed;
      if (catData.growType) doc.serviceArea = catData.growType;
      if (catData.canopySize) doc.facilitySize = catData.canopySize;
      if (catData.ownerName) doc.bio = catData.ownerName;
      if (catData.licenseDesignation) {
        doc.certifications = [catData.licenseDesignation];
      }
      if (loc.county) {
        doc.fullDescription = `Licensed cannabis cultivation operation in ${loc.county} County, ${loc.state || "CA"}. License: ${catData.licenseNumber || "N/A"} (${catData.licenseType || "N/A"}).`;
      }

      ops.push({
        updateOne: {
          filter: { slug: finalSlug },
          update: { $set: doc, $setOnInsert: { createdAt: now } },
          upsert: true,
        },
      });
    }

    if (ops.length === 0) {
      return NextResponse.json({ error: "No valid entries found." }, { status: 400 });
    }

    const BATCH = 200;
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
    console.error("[import-unclaimed]", err);
    return NextResponse.json({ error: "Import failed." }, { status: 500 });
  }
}
