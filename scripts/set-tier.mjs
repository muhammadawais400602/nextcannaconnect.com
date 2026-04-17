/**
 * One-time script: update a company's tier in MongoDB
 * Run: MONGODB_URI="mongodb+srv://..." node scripts/set-tier.mjs
 */

import mongoose from "mongoose";

const SLUG = "cofcode";
const NEW_TIER = "elite"; // "elite" = Verified Pro

const uri = process.env.MONGODB_URI;
if (!uri) { console.error("Set MONGODB_URI env var"); process.exit(1); }

await mongoose.connect(uri);

const result = await mongoose.connection.collection("companies").findOneAndUpdate(
  { slug: SLUG },
  { $set: { tier: NEW_TIER, isFeatured: true } },
  { returnDocument: "after" }
);

if (!result) {
  console.error(`No company found with slug "${SLUG}"`);
} else {
  console.log(`Updated: ${result.name} → tier: ${result.tier}`);
}

await mongoose.disconnect();
