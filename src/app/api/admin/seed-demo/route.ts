import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";
import { DEMO_LISTINGS } from "@/data/demoListings";

// POST — upsert all demo listings (idempotent, keyed by slug)
export async function POST() {
  try {
    await connectDB();
    let created = 0;
    let updated = 0;

    for (const listing of DEMO_LISTINGS) {
      const res = await Company.updateOne(
        { slug: listing.slug },
        { $set: { ...listing, isFeatured: listing.tier === "elite" } },
        { upsert: true }
      );
      if (res.upsertedCount) created += 1;
      else if (res.matchedCount) updated += 1;
    }

    return NextResponse.json({ success: true, created, updated, total: DEMO_LISTINGS.length });
  } catch (err) {
    console.error("[seed-demo]", err);
    return NextResponse.json({ error: "Failed to seed demo listings" }, { status: 500 });
  }
}

// DELETE — remove all demo listings (slugs prefixed "demo-")
export async function DELETE() {
  try {
    await connectDB();
    const res = await Company.deleteMany({ slug: { $regex: "^demo-" } });
    return NextResponse.json({ success: true, deleted: res.deletedCount });
  } catch (err) {
    console.error("[seed-demo]", err);
    return NextResponse.json({ error: "Failed to remove demo listings" }, { status: 500 });
  }
}
