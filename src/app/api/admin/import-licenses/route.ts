import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

// ─── License type → category mapping ──────────────────────────────────────
const LICENSE_TYPE_MAP: Record<string, string> = {
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
  "Retail Marijuana Cultivation Facility": "cultivation-growing",
  "Medical Marijuana Cultivation Facility": "cultivation-growing",
  "Retail Marijuana Products Manufacturer": "manufacturers-suppliers",
  "Medical Marijuana Products Manufacturer": "manufacturers-suppliers",
  "Retail Marijuana Store": "retail-dispensary",
  "Medical Marijuana Center": "retail-dispensary",
  "Retail Marijuana Testing Facility": "testing-science",
  "Retail Marijuana Transporter": "transportation-logistics",
  "Producer": "cultivation-growing",
  "Processor Tier I": "extraction-processing",
  "Processor Tier II": "extraction-processing",
  "Wholesaler": "manufacturers-suppliers",
};

function mapLicenseType(rawType: string): string {
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
  if (lower.includes("tech") || lower.includes("software")) return "technology-software";
  if (lower.includes("real estate") || lower.includes("construct")) return "real-estate-construction";
  if (lower.includes("financ") || lower.includes("insur")) return "finance-insurance";
  if (lower.includes("legal") || lower.includes("compli")) return "compliance-legal";
  return "cultivation-growing";
}

function toSlug(name: string, suffix = ""): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return suffix ? `${base}-${suffix}` : base;
}

function toInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

const LOGO_COLORS = ["#1A4A35", "#2D6A4F", "#40916C", "#52B788", "#74C69D", "#095D40"];

interface RawLicense {
  name: string;
  licenseNumber: string;
  licenseType: string;
  city: string;
  state: string;
  website?: string;
  phone?: string;
  email?: string;
}

function licenseToDoc(license: RawLicense, idx: number) {
  const category = mapLicenseType(license.licenseType);
  const slug = toSlug(license.name, license.licenseNumber ? license.licenseNumber.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(-6) : String(idx));

  return {
    slug,
    name: license.name,
    tier: "claimed" as const,
    category,
    location: { city: license.city || "Unknown", state: license.state },
    shortDescription: `Licensed ${license.licenseType || "cannabis business"} in ${license.city || license.state}. License #${license.licenseNumber}.`,
    serviceTags: [license.licenseType].filter(Boolean),
    logoPlaceholder: toInitials(license.name),
    logoColor: LOGO_COLORS[idx % LOGO_COLORS.length],
    isFeatured: false,
    ...(license.website ? { website: license.website } : {}),
    ...(license.phone ? { phone: license.phone } : {}),
    ...(license.email ? { email: license.email } : {}),
    statesServed: [license.state],
  };
}

// ─── Fetch from California DCC public API ──────────────────────────────────
async function fetchCA(limit: number): Promise<RawLicense[]> {
  const results: RawLicense[] = [];
  const pageSize = 100;
  const pages = Math.ceil(limit / pageSize);

  for (let page = 0; page < pages; page++) {
    const from = page * pageSize;
    const res = await fetch(
      `https://search.cannabis.ca.gov/api/search?size=${pageSize}&from=${from}&status=Active`,
      { headers: { "User-Agent": "NextCanna-Admin/1.0" }, cache: "no-store" }
    );
    if (!res.ok) throw new Error(`CA DCC API error: ${res.status}`);
    const data = await res.json();
    const hits = data?.hits?.hits ?? [];
    if (hits.length === 0) break;

    for (const hit of hits) {
      const src = hit._source ?? {};
      results.push({
        name: src.business_legal_name || src.business_dba_name || "",
        licenseNumber: src.license_number || "",
        licenseType: src.license_type || "",
        city: src.city || "",
        state: "CA",
        website: src.website || "",
        phone: src.business_phone || "",
        email: src.business_email || "",
      });
    }
    if (results.length >= limit) break;
  }
  return results.filter(r => r.name).slice(0, limit);
}

// ─── Parse uploaded CSV ────────────────────────────────────────────────────
function parseCSV(content: string, stateCode: string): RawLicense[] {
  const lines = content.split(/\r?\n/);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, "").trim().toLowerCase());

  const col = (row: string[], ...names: string[]) => {
    for (const name of names) {
      const idx = headers.findIndex(h => h.includes(name.toLowerCase()));
      if (idx !== -1) return (row[idx] || "").replace(/^"|"$/g, "").trim();
    }
    return "";
  };

  const results: RawLicense[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values: string[] = [];
    let cur = "";
    let inQ = false;
    for (const ch of lines[i]) {
      if (ch === '"') inQ = !inQ;
      else if (ch === "," && !inQ) { values.push(cur); cur = ""; }
      else cur += ch;
    }
    values.push(cur);

    const status = col(values, "status").toLowerCase();
    if (status && !status.includes("active") && !status.includes("current")) continue;

    const name = col(values, "business name", "licensee name", "tradename", "dba", "legal name");
    if (!name) continue;

    results.push({
      name,
      licenseNumber: col(values, "license number", "license #", "lic num"),
      licenseType: col(values, "license type", "license category", "privilege", "activity"),
      city: col(values, "city"),
      state: stateCode,
      phone: col(values, "phone"),
      email: col(values, "email"),
      website: col(values, "website", "url"),
    });
  }
  return results;
}

// ─── POST /api/admin/import-licenses ──────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, state, limit = 200, csvContent, preview = false } = body;

    let rawLicenses: RawLicense[] = [];

    // Fetch or parse
    if (action === "fetch-api") {
      if (state === "CA") {
        rawLicenses = await fetchCA(limit);
      } else {
        return NextResponse.json({ error: `API fetch not available for ${state}. Use CSV upload.` }, { status: 400 });
      }
    } else if (action === "import-csv") {
      if (!csvContent || !state) {
        return NextResponse.json({ error: "csvContent and state are required" }, { status: 400 });
      }
      rawLicenses = parseCSV(csvContent, state);
    } else {
      return NextResponse.json({ error: "action must be fetch-api or import-csv" }, { status: 400 });
    }

    const docs = rawLicenses.map((l, i) => licenseToDoc(l, i));

    // Preview mode — just return data, don't save
    if (preview) {
      const byCat: Record<string, number> = {};
      docs.forEach(d => { byCat[d.category] = (byCat[d.category] || 0) + 1; });
      return NextResponse.json({ preview: true, total: docs.length, byCategory: byCat, sample: docs.slice(0, 10) });
    }

    // Save to MongoDB
    await connectDB();
    let inserted = 0;
    let skipped = 0;

    for (const doc of docs) {
      try {
        await Company.findOneAndUpdate(
          { slug: doc.slug },
          { $setOnInsert: doc },
          { upsert: true, new: false }
        );
        inserted++;
      } catch {
        skipped++;
      }
    }

    const byCat: Record<string, number> = {};
    docs.forEach(d => { byCat[d.category] = (byCat[d.category] || 0) + 1; });

    return NextResponse.json({ success: true, inserted, skipped, total: docs.length, byCategory: byCat });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Import failed" }, { status: 500 });
  }
}

// ─── DELETE /api/admin/import-licenses — clear all claimed listings ────────
export async function DELETE() {
  try {
    await connectDB();
    const result = await Company.deleteMany({ tier: "claimed" });
    return NextResponse.json({ deleted: result.deletedCount });
  } catch (err) {
    return NextResponse.json({ error: "Failed to clear listings" }, { status: 500 });
  }
}
