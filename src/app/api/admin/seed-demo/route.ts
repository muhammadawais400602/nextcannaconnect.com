import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

const DEMO = {
  slug: "greenleaf-packaging-co",
  name: "GreenLeaf Packaging Co.",
  tier: "select" as const,
  category: "manufacturers-suppliers",
  location: { city: "Denver", state: "Colorado" },
  shortDescription:
    "Sustainable cannabis packaging manufacturer offering child-resistant containers, custom-branded bags, and eco-friendly solutions for licensed dispensaries and brands.",
  fullDescription: `GreenLeaf Packaging Co. was founded in 2017 by a team of packaging engineers and cannabis entrepreneurs who saw a critical gap in the market: sustainable, compliant packaging that didn't compromise on brand aesthetics.

Operating out of our 45,000 sq ft Denver facility, we serve over 300 licensed cannabis brands and dispensaries across 14 states. Our in-house design team works closely with clients to create packaging that stands out on the shelf while meeting every state compliance requirement.

We specialize in child-resistant closures, tamper-evident seals, and smell-proof barrier pouches — all available with full-color custom printing. Our compostable line uses plant-based materials certified to break down within 90 days, helping cannabis brands meet their sustainability goals without sacrificing shelf appeal.

Every product in our catalog meets or exceeds CPSC child-resistance standards and carries full ISO 9001 quality certification. We offer small-batch minimums starting at 500 units, making us accessible to craft brands as well as large-scale operators.`,
  serviceTags: [
    "Custom Packaging Design",
    "Child-Resistant Containers",
    "Eco-Friendly / Compostable",
    "Bulk Order Fulfillment",
    "Compliance Consulting",
  ],
  logoPlaceholder: "GL",
  logoColor: "#1A4A35",
  bannerCaption:
    "Our Denver fulfillment center ships 2M+ units per month to 14 states.",
  foundedYear: 2017,
  teamSize: "48 employees",
  serviceArea: "14 States",
  certifications: ["ISO 9001:2015", "CPSC Compliant", "SGS Certified"],
  productLines: [
    "Child-Resistant Containers",
    "Custom Printed Pouches",
    "Compostable Line",
    "Exit Bags",
  ],
  minOrderQty: "500 units",
  leadTime: "10–14 business days",
  website: "https://example.com/greenleaf-packaging",
  phone: "+1 (720) 555-0147",
  email: "sales@greenleaf-packaging.example.com",
  products: [
    {
      name: "Compostable Barrier Pouch",
      description:
        "Plant-based, smell-proof barrier pouch with child-resistant zipper. Available in 3.5g, 7g, and 14g sizes. Full-color custom printing included.",
    },
    {
      name: "CR Glass Jar — Matte Series",
      description:
        "Child-resistant glass jars with matte-finish lids. Available in 2oz, 3.5oz, and 1oz sizes. Meets all state compliance requirements.",
    },
    {
      name: "Pre-Roll Tube — Branded",
      description:
        "Pop-top or twist-top pre-roll tubes with full-wrap custom label. Available in 98mm, 109mm, and 116mm lengths.",
    },
  ],
  isFeatured: false,
};

export async function POST() {
  try {
    await connectDB();

    const company = await Company.findOneAndUpdate(
      { slug: DEMO.slug },
      { $set: DEMO },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Demo Select company created",
      vendorUrl: `/vendor/${company.slug}`,
      adminUrl: `/admin/companies/${company.slug}/edit`,
    });
  } catch (err) {
    console.error("[seed-demo]", err);
    return NextResponse.json(
      { error: "Seed failed", detail: String(err) },
      { status: 500 }
    );
  }
}
