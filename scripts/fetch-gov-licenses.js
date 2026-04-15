/**
 * fetch-gov-licenses.js
 *
 * Fetches real cannabis business license data from state government databases
 * and outputs Company objects in the NextCanna Connect schema.
 *
 * Sources:
 *   - California DCC public search API (https://search.cannabis.ca.gov)
 *   - Colorado MED licensee list (CSV download)
 *   - Oregon OLCC (CSV download)
 *
 * Usage:
 *   node scripts/fetch-gov-licenses.js                  # fetch all states
 *   node scripts/fetch-gov-licenses.js --state CA       # fetch California only
 *   node scripts/fetch-gov-licenses.js --limit 100      # limit results per state
 *
 * Output:
 *   scripts/output/gov-licenses.json   → raw fetched data
 *   scripts/output/companies.json      → ready-to-import Company objects
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// ─── Category mapping ──────────────────────────────────────────────────────
// Maps government license type strings → your 12 category slugs

const LICENSE_TYPE_MAP = {
  // California DCC license types
  "Cultivator": "cultivation-growing",
  "Cultivation": "cultivation-growing",
  "Nursery": "cultivation-growing",
  "Processor": "extraction-processing",
  "Manufacturer": "manufacturers-suppliers",
  "Manufacturing": "manufacturers-suppliers",
  "Distributor": "transportation-logistics",
  "Distribution": "transportation-logistics",
  "Retailer": "retail-dispensary",
  "Retail": "retail-dispensary",
  "Microbusiness": "retail-dispensary",
  "Dispensary": "retail-dispensary",
  "Testing Laboratory": "testing-science",
  "Testing": "testing-science",
  "Laboratory": "testing-science",
  "Event Organizer": "consultants-advisors",
  "Cannabis Event Organizer": "consultants-advisors",
  // Colorado MED license types
  "Retail Marijuana Cultivation Facility": "cultivation-growing",
  "Medical Marijuana Cultivation Facility": "cultivation-growing",
  "Retail Marijuana Products Manufacturer": "manufacturers-suppliers",
  "Medical Marijuana Products Manufacturer": "manufacturers-suppliers",
  "Retail Marijuana Store": "retail-dispensary",
  "Medical Marijuana Center": "retail-dispensary",
  "Retail Marijuana Testing Facility": "testing-science",
  "Retail Marijuana Transporter": "transportation-logistics",
  // Oregon OLCC
  "Producer": "cultivation-growing",
  "Processor Tier I": "extraction-processing",
  "Processor Tier II": "extraction-processing",
  "Wholesaler": "manufacturers-suppliers",
  "Laboratory": "testing-science",
};

function mapLicenseType(rawType) {
  if (!rawType) return "cultivation-growing";
  // Exact match first
  if (LICENSE_TYPE_MAP[rawType]) return LICENSE_TYPE_MAP[rawType];
  // Partial match
  const lower = rawType.toLowerCase();
  if (lower.includes("cultivat") || lower.includes("grow") || lower.includes("nursery")) return "cultivation-growing";
  if (lower.includes("manufactur") || lower.includes("supplier")) return "manufacturers-suppliers";
  if (lower.includes("extract") || lower.includes("process")) return "extraction-processing";
  if (lower.includes("retail") || lower.includes("dispensary") || lower.includes("store")) return "retail-dispensary";
  if (lower.includes("transport") || lower.includes("distribut") || lower.includes("deliver")) return "transportation-logistics";
  if (lower.includes("test") || lower.includes("lab")) return "testing-science";
  if (lower.includes("consult")) return "consultants-advisors";
  if (lower.includes("market") || lower.includes("brand")) return "marketing-branding-packaging";
  if (lower.includes("tech") || lower.includes("software")) return "technology-software";
  if (lower.includes("real estate") || lower.includes("construct")) return "real-estate-construction";
  if (lower.includes("financ") || lower.includes("insur")) return "finance-insurance";
  if (lower.includes("legal") || lower.includes("compli")) return "compliance-legal";
  return "cultivation-growing"; // default fallback
}

// ─── Slug generator ────────────────────────────────────────────────────────
const slugsUsed = new Set();
function toSlug(name) {
  let base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let slug = base;
  let n = 2;
  while (slugsUsed.has(slug)) {
    slug = `${base}-${n++}`;
  }
  slugsUsed.add(slug);
  return slug;
}

// ─── Logo initials ─────────────────────────────────────────────────────────
function toInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

const LOGO_COLORS = ["#1A4A35", "#2D6A4F", "#40916C", "#52B788", "#74C69D", "#095D40"];
function pickColor(id) {
  return LOGO_COLORS[parseInt(id) % LOGO_COLORS.length];
}

// ─── Fetch helpers ─────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "NextCanna-DataFetch/1.0" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse failed for ${url}: ${e.message}`)); }
      });
    }).on("error", reject);
  });
}

// ─── California DCC ────────────────────────────────────────────────────────
// Public search API: https://search.cannabis.ca.gov
// Returns paginated license records with name, license type, city, status

async function fetchCaliforniaLicenses(limit = 500) {
  console.log("Fetching California DCC licenses...");
  const results = [];
  const pageSize = 100;
  const pages = Math.ceil(limit / pageSize);

  for (let page = 0; page < pages; page++) {
    const from = page * pageSize;
    const url = `https://search.cannabis.ca.gov/api/search?size=${pageSize}&from=${from}&status=Active`;
    try {
      const data = await fetchJSON(url);
      const hits = data?.hits?.hits || [];
      if (hits.length === 0) break;
      hits.forEach(hit => {
        const src = hit._source || {};
        results.push({
          name: src.business_legal_name || src.business_dba_name || "Unknown",
          licenseNumber: src.license_number || "",
          licenseType: src.license_type || "",
          city: src.city || "",
          state: "CA",
          county: src.county || "",
          zip: src.zip_code || "",
          status: src.license_status || "Active",
          website: src.website || "",
          phone: src.business_phone || "",
          email: src.business_email || "",
        });
      });
      console.log(`  CA: fetched ${results.length} records...`);
    } catch (err) {
      console.warn(`  CA page ${page} failed: ${err.message}`);
      break;
    }
  }
  return results;
}

// ─── Colorado MED ──────────────────────────────────────────────────────────
// CSV available at colorado.gov — parsed inline here
// Note: Replace CSV_URL with the actual download link from colorado.gov/med

async function fetchColoradoLicenses() {
  console.log("Colorado MED: Download CSV from https://sbg.colorado.gov/med-licensed-facilities");
  console.log("  → Save as scripts/input/colorado-licenses.csv and run: node scripts/import-csv.js --state CO");
  return []; // Manual step — Colorado requires CSV download
}

// ─── Oregon OLCC ───────────────────────────────────────────────────────────
async function fetchOregonLicenses() {
  console.log("Oregon OLCC: Download from https://www.oregon.gov/olcc/marijuana/pages/licensed-businesses.aspx");
  console.log("  → Save as scripts/input/oregon-licenses.csv and run: node scripts/import-csv.js --state OR");
  return [];
}

// ─── Convert raw license → Company object ─────────────────────────────────
let idCounter = 10000; // start high to avoid conflicts with any existing IDs

function licenseToCompany(license) {
  const id = String(++idCounter);
  const category = mapLicenseType(license.licenseType);
  const slug = toSlug(license.name);

  // Build service tags from license type
  const serviceTags = [license.licenseType].filter(Boolean).slice(0, 4);
  if (license.county) serviceTags.push(`${license.county} County`);

  return {
    id,
    slug,
    name: license.name,
    tier: "claimed",
    category,
    location: {
      city: license.city || "Unknown",
      state: license.state || "CA",
    },
    shortDescription: `Licensed ${license.licenseType || "cannabis business"} operating in ${license.city || "California"}. License #${license.licenseNumber}.`,
    serviceTags: serviceTags.length ? serviceTags : [category],
    logoPlaceholder: toInitials(license.name),
    logoColor: pickColor(id),
    ...(license.website ? { website: license.website } : {}),
    ...(license.phone ? { phone: license.phone } : {}),
    ...(license.email ? { email: license.email } : {}),
    statesServed: [license.state],
  };
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const stateArg = args.find(a => a.startsWith("--state"))?.split("=")[1] ||
                   args[args.indexOf("--state") + 1];
  const limitArg = parseInt(args.find(a => a.startsWith("--limit"))?.split("=")[1] ||
                   args[args.indexOf("--limit") + 1]) || 500;

  // Ensure output directory exists
  const outDir = path.join(__dirname, "output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  let rawLicenses = [];

  if (!stateArg || stateArg === "CA") {
    const ca = await fetchCaliforniaLicenses(limitArg);
    rawLicenses = rawLicenses.concat(ca);
  }
  if (!stateArg || stateArg === "CO") {
    const co = await fetchColoradoLicenses();
    rawLicenses = rawLicenses.concat(co);
  }
  if (!stateArg || stateArg === "OR") {
    const or = await fetchOregonLicenses();
    rawLicenses = rawLicenses.concat(or);
  }

  console.log(`\nTotal raw licenses fetched: ${rawLicenses.length}`);

  // Save raw data
  fs.writeFileSync(
    path.join(outDir, "gov-licenses.json"),
    JSON.stringify(rawLicenses, null, 2)
  );

  // Convert to Company objects
  const companies = rawLicenses
    .filter(l => l.name && l.name !== "Unknown")
    .map(licenseToCompany);

  fs.writeFileSync(
    path.join(outDir, "companies.json"),
    JSON.stringify(companies, null, 2)
  );

  // Print summary by category
  const byCat = {};
  companies.forEach(c => {
    byCat[c.category] = (byCat[c.category] || 0) + 1;
  });
  console.log("\nCompanies by category:");
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat.padEnd(35)} ${count}`);
  });

  console.log(`\nOutput written to:`);
  console.log(`  scripts/output/gov-licenses.json  (raw data)`);
  console.log(`  scripts/output/companies.json     (ready to import)`);
  console.log(`\nNext step: node scripts/import-to-app.js`);
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
