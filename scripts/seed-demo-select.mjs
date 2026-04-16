/**
 * Seed script: insert a demo "select" tier company into MongoDB
 * Run: node scripts/seed-demo-select.mjs
 */

import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Manually parse .env.local
try {
  const env = readFileSync(resolve(__dirname, "../.env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // .env.local not found — rely on existing env vars
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in .env.local");
  process.exit(1);
}

const CompanySchema = new mongoose.Schema(
  {
    slug:               { type: String, required: true, unique: true, index: true },
    name:               { type: String, required: true },
    tier:               { type: String, enum: ["free","claimed","select","elite","featured"], default: "free" },
    category:           { type: String, required: true, index: true },
    secondaryCategory:  String,
    location:           { city: { type: String, required: true }, state: { type: String, required: true } },
    shortDescription:   { type: String, required: true },
    fullDescription:    String,
    serviceTags:        [String],
    logoUrl:            String,
    logoPlaceholder:    { type: String, required: true },
    logoColor:          { type: String, default: "#1A4A35" },
    bannerImageUrl:     String,
    bannerCaption:      String,
    foundedYear:        Number,
    products:           [{ name: String, description: String, imageUrl: String }],
    website:            String,
    phone:              String,
    email:              String,
    productLines:       [String],
    minOrderQty:        String,
    leadTime:           String,
    serviceArea:        String,
    certifications:     [String],
    statesServed:       [String],
    teamSize:           String,
    yearsInCannabis:    Number,
    pricingModel:       String,
    caseStudies:        [{ title: String, summary: String }],
    specialtyAreas:     [String],
    credentials:        [String],
    yearsExperience:    Number,
    hourlyRate:         String,
    availability:       String,
    bio:                String,
    rating:             Number,
    reviewCount:        Number,
    isFeatured:         { type: Boolean, default: false },
    featuredExpiresAt:  Date,
  },
  { timestamps: true }
);

const Company =
  mongoose.models?.Company ?? mongoose.model("Company", CompanySchema);

const DEMO = {
  slug: "greenleaf-packaging-co",
  name: "GreenLeaf Packaging Co.",
  tier: "select",
  category: "manufacturers-suppliers",
  location: { city: "Denver", state: "Colorado" },
  shortDescription: "Sustainable cannabis packaging manufacturer offering child-resistant containers, custom-branded bags, and eco-friendly solutions for licensed dispensaries and brands.",
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
  bannerCaption: "Our Denver fulfillment center ships 2M+ units per month to 14 states.",
  foundedYear: 2017,
  teamSize: "48 employees",
  serviceArea: "14 States",
  certifications: ["ISO 9001:2015", "CPSC Compliant", "SGS Certified"],
  productLines: ["Child-Resistant Containers", "Custom Printed Pouches", "Compostable Line", "Exit Bags"],
  minOrderQty: "500 units",
  leadTime: "10–14 business days",
  website: "https://example.com/greenleaf-packaging",
  phone: "+1 (720) 555-0147",
  email: "sales@greenleaf-packaging.example.com",
  products: [
    {
      name: "Compostable Barrier Pouch",
      description: "Plant-based, smell-proof barrier pouch with child-resistant zipper. Available in 3.5g, 7g, and 14g sizes. Full-color custom printing included.",
    },
    {
      name: "CR Glass Jar — Matte Series",
      description: "Child-resistant glass jars with matte-finish lids. Available in 2oz, 3.5oz, and 1oz sizes. Meets all state compliance requirements.",
    },
    {
      name: "Pre-Roll Tube — Branded",
      description: "Pop-top or twist-top pre-roll tubes with full-wrap custom label. Available in 98mm, 109mm, and 116mm lengths.",
    },
  ],
  isFeatured: false,
};

async function run() {
  console.log("Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("Connected.");

  // Remove existing demo if re-running
  const removed = await Company.deleteOne({ slug: DEMO.slug });
  if (removed.deletedCount > 0) {
    console.log("Removed existing demo entry.");
  }

  const company = await Company.create(DEMO);
  console.log(`\n✅  Created: ${company.name}`);
  console.log(`   Slug   : ${company.slug}`);
  console.log(`   Tier   : ${company.tier}`);
  console.log(`   URL    : /vendor/${company.slug}\n`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
