/**
 * import-to-app.js
 *
 * Takes the processed companies from scripts/output/ and writes them
 * into src/data/companies.ts so they appear on the website immediately.
 *
 * Usage:
 *   node scripts/import-to-app.js                        # imports output/companies.json
 *   node scripts/import-to-app.js --file output/companies-CO.json
 *   node scripts/import-to-app.js --append               # appends to existing data
 *
 * By default it REPLACES the COMPANIES array. Use --append to add to existing.
 */

const fs = require("fs");
const path = require("path");

function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find(a => a.startsWith("--file"))?.split("=")[1] ||
                  args[args.indexOf("--file") + 1] ||
                  path.join(__dirname, "output", "companies.json");
  const append = args.includes("--append");

  if (!fs.existsSync(fileArg)) {
    console.error(`File not found: ${fileArg}`);
    console.error("Run fetch-gov-licenses.js or import-csv.js first.");
    process.exit(1);
  }

  const newCompanies = JSON.parse(fs.readFileSync(fileArg, "utf8"));
  console.log(`Loaded ${newCompanies.length} companies from ${fileArg}`);

  const targetFile = path.join(__dirname, "../src/data/companies.ts");

  let existingCompanies = [];
  if (append) {
    // Pull existing companies out of the TS file
    const existing = fs.readFileSync(targetFile, "utf8");
    const match = existing.match(/export const COMPANIES: Company\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      try {
        existingCompanies = JSON.parse(match[1]);
        console.log(`Appending to ${existingCompanies.length} existing companies`);
      } catch {
        console.warn("Could not parse existing companies — replacing instead.");
      }
    }
  }

  const combined = [...existingCompanies, ...newCompanies];

  // Deduplicate by slug
  const seen = new Set();
  const deduped = combined.filter(c => {
    if (seen.has(c.slug)) return false;
    seen.add(c.slug);
    return true;
  });
  console.log(`After deduplication: ${deduped.length} unique companies`);

  // Generate the TS file
  const output = `import { Company } from "@/types";

export const COMPANIES: Company[] = ${JSON.stringify(deduped, null, 2)};

export function getCompaniesByCategory(categorySlug: string): Company[] {
  return COMPANIES.filter(
    (c) => c.category === categorySlug || c.secondaryCategory === categorySlug
  ).sort((a, b) => {
    const order: Record<string, number> = {
      featured: 0,
      elite: 1,
      select: 2,
      claimed: 3,
      free: 4,
    };
    return order[a.tier] - order[b.tier];
  });
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}

export function getFeaturedCompanies(): Company[] {
  return COMPANIES.filter((c) =>
    c.tier === "elite" || c.tier === "featured" || c.tier === "select"
  ).slice(0, 8);
}
`;

  fs.writeFileSync(targetFile, output);

  // Summary
  const byCat = {};
  const byTier = {};
  deduped.forEach(c => {
    byCat[c.category] = (byCat[c.category] || 0) + 1;
    byTier[c.tier] = (byTier[c.tier] || 0) + 1;
  });

  console.log("\nBy tier:");
  Object.entries(byTier).forEach(([t, n]) => console.log(`  ${t.padEnd(15)} ${n}`));
  console.log("\nBy category:");
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([cat, n]) => {
    console.log(`  ${cat.padEnd(35)} ${n}`);
  });
  console.log(`\nWritten to src/data/companies.ts — ${deduped.length} total listings`);
}

main();
