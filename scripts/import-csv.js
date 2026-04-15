/**
 * import-csv.js
 *
 * Imports cannabis license data from a state CSV file and converts
 * to NextCanna Company objects.
 *
 * Usage:
 *   node scripts/import-csv.js --state CO --file scripts/input/colorado-licenses.csv
 *   node scripts/import-csv.js --state OR --file scripts/input/oregon-licenses.csv
 *   node scripts/import-csv.js --state WA --file scripts/input/washington-licenses.csv
 *
 * CSV column mappings per state are defined in STATE_COLUMN_MAPS below.
 * Add a new entry for any state you want to support.
 *
 * Output:
 *   scripts/output/companies-{STATE}.json
 */

const fs = require("fs");
const path = require("path");

// ─── Column maps per state ─────────────────────────────────────────────────
// Keys are your internal field names, values are the CSV header strings
// (case-insensitive match)

const STATE_COLUMN_MAPS = {
  CO: {
    name: "Licensee Name",
    licenseNumber: "License Number",
    licenseType: "License Type",
    city: "City",
    state: () => "CO",
    zip: "Zip",
    status: "License Status",
    phone: "Phone",
    email: "Email",
    website: "Website",
  },
  OR: {
    name: "Business Name",
    licenseNumber: "License Number",
    licenseType: "License Category",
    city: "City",
    state: () => "OR",
    zip: "Zip Code",
    status: "Status",
    phone: "",
    email: "",
    website: "",
  },
  WA: {
    name: "Tradename",
    licenseNumber: "License Number",
    licenseType: "Privilege",
    city: "City",
    state: () => "WA",
    zip: "Zip",
    status: "License Status",
    phone: "",
    email: "",
    website: "",
  },
  MI: {
    name: "Licensee Name",
    licenseNumber: "License Number",
    licenseType: "License Type",
    city: "City",
    state: () => "MI",
    zip: "Zip",
    status: "License Status",
    phone: "",
    email: "",
    website: "",
  },
};

// ─── License type → category mapping (same as fetch-gov-licenses.js) ───────
const LICENSE_TYPE_MAP = {
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
  "Retail Marijuana Cultivation Facility": "cultivation-growing",
  "Medical Marijuana Cultivation Facility": "cultivation-growing",
  "Retail Marijuana Products Manufacturer": "manufacturers-suppliers",
  "Medical Marijuana Store": "retail-dispensary",
  "Retail Marijuana Store": "retail-dispensary",
  "Medical Marijuana Center": "retail-dispensary",
  "Retail Marijuana Testing Facility": "testing-science",
  "Retail Marijuana Transporter": "transportation-logistics",
  "Producer": "cultivation-growing",
  "Processor Tier I": "extraction-processing",
  "Processor Tier II": "extraction-processing",
  "Wholesaler": "manufacturers-suppliers",
  "Producer License": "cultivation-growing",
};

function mapLicenseType(rawType) {
  if (!rawType) return "cultivation-growing";
  if (LICENSE_TYPE_MAP[rawType]) return LICENSE_TYPE_MAP[rawType];
  const lower = rawType.toLowerCase();
  if (lower.includes("cultivat") || lower.includes("grow") || lower.includes("nursery")) return "cultivation-growing";
  if (lower.includes("manufactur") || lower.includes("supplier")) return "manufacturers-suppliers";
  if (lower.includes("extract") || lower.includes("process")) return "extraction-processing";
  if (lower.includes("retail") || lower.includes("dispensary") || lower.includes("store")) return "retail-dispensary";
  if (lower.includes("transport") || lower.includes("distribut") || lower.includes("deliver")) return "transportation-logistics";
  if (lower.includes("test") || lower.includes("lab")) return "testing-science";
  if (lower.includes("consult")) return "consultants-advisors";
  if (lower.includes("market") || lower.includes("brand")) return "marketing-branding-packaging";
  return "cultivation-growing";
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const slugsUsed = new Set();
function toSlug(name) {
  let base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let slug = base;
  let n = 2;
  while (slugsUsed.has(slug)) slug = `${base}-${n++}`;
  slugsUsed.add(slug);
  return slug;
}

function toInitials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

const LOGO_COLORS = ["#1A4A35", "#2D6A4F", "#40916C", "#52B788", "#74C69D", "#095D40"];

// ─── CSV parser (no external deps) ────────────────────────────────────────
function parseCSV(content) {
  const lines = content.split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = [];
    let cur = "";
    let inQuote = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQuote = !inQuote; }
      else if (ch === "," && !inQuote) { values.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    values.push(cur.trim());
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
    rows.push(row);
  }
  return rows;
}

function getField(row, colMap, field) {
  const col = colMap[field];
  if (!col) return "";
  if (typeof col === "function") return col();
  // Case-insensitive header lookup
  const key = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
  return key ? row[key] : "";
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  const stateArg = (args.find(a => a.startsWith("--state"))?.split("=")[1] ||
                    args[args.indexOf("--state") + 1] || "").toUpperCase();
  const fileArg = args.find(a => a.startsWith("--file"))?.split("=")[1] ||
                  args[args.indexOf("--file") + 1];

  if (!stateArg || !fileArg) {
    console.error("Usage: node scripts/import-csv.js --state CO --file scripts/input/colorado-licenses.csv");
    process.exit(1);
  }

  const colMap = STATE_COLUMN_MAPS[stateArg];
  if (!colMap) {
    console.error(`State "${stateArg}" not configured. Add it to STATE_COLUMN_MAPS.`);
    process.exit(1);
  }

  if (!fs.existsSync(fileArg)) {
    console.error(`File not found: ${fileArg}`);
    process.exit(1);
  }

  const content = fs.readFileSync(fileArg, "utf8");
  const rows = parseCSV(content);
  console.log(`Parsed ${rows.length} rows from ${fileArg}`);

  let idCounter = 20000;
  const companies = rows
    .filter(row => {
      const status = getField(row, colMap, "status").toLowerCase();
      return !status || status.includes("active") || status.includes("current");
    })
    .map(row => {
      const id = String(++idCounter);
      const name = getField(row, colMap, "name");
      if (!name) return null;
      const licenseType = getField(row, colMap, "licenseType");
      const city = getField(row, colMap, "city");
      const state = getField(row, colMap, "state");
      const licenseNumber = getField(row, colMap, "licenseNumber");
      const phone = getField(row, colMap, "phone");
      const email = getField(row, colMap, "email");
      const website = getField(row, colMap, "website");
      const category = mapLicenseType(licenseType);

      return {
        id,
        slug: toSlug(name),
        name,
        tier: "claimed",
        category,
        location: { city: city || "Unknown", state: state || stateArg },
        shortDescription: `Licensed ${licenseType || "cannabis business"} in ${city || stateArg}. License #${licenseNumber}.`,
        serviceTags: [licenseType].filter(Boolean),
        logoPlaceholder: toInitials(name),
        logoColor: LOGO_COLORS[idCounter % LOGO_COLORS.length],
        ...(website ? { website } : {}),
        ...(phone ? { phone } : {}),
        ...(email ? { email } : {}),
        statesServed: [state || stateArg],
      };
    })
    .filter(Boolean);

  const outDir = path.join(__dirname, "output");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `companies-${stateArg}.json`);
  fs.writeFileSync(outFile, JSON.stringify(companies, null, 2));

  const byCat = {};
  companies.forEach(c => { byCat[c.category] = (byCat[c.category] || 0) + 1; });
  console.log("\nBy category:");
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).forEach(([cat, n]) => {
    console.log(`  ${cat.padEnd(35)} ${n}`);
  });
  console.log(`\nWritten ${companies.length} companies to ${outFile}`);
  console.log("Next: node scripts/import-to-app.js");
}

main();
