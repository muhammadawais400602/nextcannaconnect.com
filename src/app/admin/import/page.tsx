"use client";

import { useState, useRef } from "react";

const STATES = [
  { code: "CA", name: "California", method: "api", note: "Fetched directly from CA DCC public API" },
  { code: "CO", name: "Colorado", method: "csv", note: "Download CSV from colorado.gov/med" },
  { code: "OR", name: "Oregon", method: "csv", note: "Download CSV from oregon.gov/olcc" },
  { code: "WA", name: "Washington", method: "csv", note: "Download CSV from lcb.wa.gov" },
  { code: "MI", name: "Michigan", method: "csv", note: "Download CSV from michigan.gov/cra" },
  { code: "NV", name: "Nevada", method: "csv", note: "Download CSV from cannabis.nv.gov" },
  { code: "AZ", name: "Arizona", method: "csv", note: "Download CSV from azdhs.gov" },
  { code: "IL", name: "Illinois", method: "csv", note: "Download CSV from idfpr.illinois.gov" },
];

const CSV_SOURCES: Record<string, string> = {
  CO: "https://sbg.colorado.gov/med-licensed-facilities",
  OR: "https://www.oregon.gov/olcc/marijuana/pages/licensed-businesses.aspx",
  WA: "https://lcb.wa.gov/licensing/licensee-data",
  MI: "https://www.michigan.gov/cra/licensing/licensee-search",
  NV: "https://cannabis.nv.gov/industry/licensee-search",
  AZ: "https://azdhs.gov/licensing/medical-marijuana/index.php#dispensary-agents-checklists",
  IL: "https://idfpr.illinois.gov/profs/adultusecan.asp",
};

const CATEGORY_LABELS: Record<string, string> = {
  "cultivation-growing": "Cultivation & Growing",
  "manufacturers-suppliers": "Manufacturers & Suppliers",
  "extraction-processing": "Extraction & Processing",
  "retail-dispensary": "Retail & Dispensary",
  "transportation-logistics": "Transportation & Logistics",
  "testing-science": "Testing & Science",
  "consultants-advisors": "Consultants & Advisors",
  "marketing-branding-packaging": "Marketing & Branding",
  "technology-software": "Technology & Software",
  "real-estate-construction": "Real Estate & Construction",
  "finance-insurance": "Finance & Insurance",
  "compliance-legal": "Compliance & Legal",
};

type Status = "idle" | "fetching" | "previewing" | "importing" | "done" | "error";

interface PreviewData {
  total: number;
  byCategory: Record<string, number>;
  sample: Array<{ name: string; category: string; location: { city: string; state: string }; licenseType?: string }>;
}

interface ImportResult {
  inserted: number;
  skipped: number;
  total: number;
  byCategory: Record<string, number>;
}

export default function ImportListingsPage() {
  const [selectedState, setSelectedState] = useState("CA");
  const [limit, setLimit] = useState(200);
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const stateInfo = STATES.find(s => s.code === selectedState)!;
  const isCSV = stateInfo.method === "csv";

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setCsvContent(ev.target?.result as string ?? "");
    reader.readAsText(file);
  }

  async function handlePreview() {
    setStatus("fetching");
    setError("");
    setPreview(null);
    setResult(null);

    try {
      const body = isCSV
        ? { action: "import-csv", state: selectedState, csvContent, preview: true }
        : { action: "fetch-api", state: selectedState, limit, preview: true };

      const res = await fetch("/api/admin/import-licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setPreview(data);
      setStatus("previewing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  async function handleImport() {
    setStatus("importing");
    setError("");

    try {
      const body = isCSV
        ? { action: "import-csv", state: selectedState, csvContent, preview: false }
        : { action: "fetch-api", state: selectedState, limit, preview: false };

      const res = await fetch("/api/admin/import-licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  async function handleClear() {
    if (!confirm("Delete all Claimed listings from the database?")) return;
    const res = await fetch("/api/admin/import-licenses", { method: "DELETE" });
    const data = await res.json();
    alert(`Deleted ${data.deleted} claimed listings.`);
  }

  const busy = status === "fetching" || status === "importing";

  return (
    <div style={{ maxWidth: "860px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
          Import Government Listings
        </h1>
        <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>
          Pull real cannabis business licenses from state government databases and add them as Claimed listings.
        </p>
      </div>

      {/* State selector */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "16px", border: "1px solid #E5E7EB" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "12px" }}>
          Select State
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "20px" }}>
          {STATES.map(s => (
            <button
              key={s.code}
              onClick={() => { setSelectedState(s.code); setPreview(null); setResult(null); setError(""); setStatus("idle"); setCsvContent(""); setFileName(""); }}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: selectedState === s.code ? "2px solid #1A4A35" : "1px solid #E5E7EB",
                background: selectedState === s.code ? "#F0FDF4" : "white",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#111827" }}>{s.code}</div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>{s.name}</div>
              <div style={{ fontSize: "10px", marginTop: "4px", color: s.method === "api" ? "#059669" : "#D97706", fontWeight: 600 }}>
                {s.method === "api" ? "AUTO FETCH" : "CSV UPLOAD"}
              </div>
            </button>
          ))}
        </div>

        {/* State info */}
        <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "14px 16px", fontSize: "13px", color: "#6B7280", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>{stateInfo.method === "api" ? "🌐" : "📄"}</span>
          <div>
            <span style={{ color: "#374151", fontWeight: 600 }}>{stateInfo.method === "api" ? "API mode: " : "CSV mode: "}</span>
            {stateInfo.note}
            {isCSV && CSV_SOURCES[selectedState] && (
              <span> — <a href={CSV_SOURCES[selectedState]} target="_blank" rel="noreferrer" style={{ color: "#1A4A35", fontWeight: 600, textDecoration: "underline" }}>Download CSV here ↗</a></span>
            )}
          </div>
        </div>
      </div>

      {/* Config */}
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "16px", border: "1px solid #E5E7EB" }}>
        {!isCSV ? (
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>
              Number of licenses to import
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <input
                type="range"
                min={50}
                max={1000}
                step={50}
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: "20px", fontWeight: "700", color: "#1A4A35", minWidth: "60px", textAlign: "right" }}>{limit}</span>
            </div>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "6px" }}>
              Each license = 1 Claimed listing on the directory.
            </p>
          </div>
        ) : (
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "12px" }}>
              Upload CSV from {stateInfo.name}
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: "2px dashed #D1D5DB",
                borderRadius: "10px",
                padding: "32px",
                textAlign: "center",
                cursor: "pointer",
                background: csvContent ? "#F0FDF4" : "#FAFAFA",
                transition: "all 0.15s",
              }}
            >
              {csvContent ? (
                <>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#1A4A35" }}>{fileName}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>Click to replace</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>📂</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Click to upload CSV</div>
                  <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>Downloaded from the state website</div>
                </>
              )}
              <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleFileUpload} />
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {status === "error" && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", padding: "14px 16px", marginBottom: "16px", fontSize: "13px", color: "#DC2626" }}>
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <button
          onClick={handlePreview}
          disabled={busy || (isCSV && !csvContent)}
          style={{
            padding: "11px 24px",
            borderRadius: "8px",
            border: "1px solid #1A4A35",
            background: "white",
            color: "#1A4A35",
            fontSize: "14px",
            fontWeight: "600",
            cursor: busy || (isCSV && !csvContent) ? "not-allowed" : "pointer",
            opacity: busy || (isCSV && !csvContent) ? 0.5 : 1,
          }}
        >
          {status === "fetching" ? "Fetching…" : "Preview"}
        </button>

        {preview && status !== "done" && (
          <button
            onClick={handleImport}
            disabled={busy}
            style={{
              padding: "11px 28px",
              borderRadius: "8px",
              border: "none",
              background: "#1A4A35",
              color: "white",
              fontSize: "14px",
              fontWeight: "600",
              cursor: busy ? "not-allowed" : "pointer",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {status === "importing" ? "Importing…" : `Import ${preview.total} listings`}
          </button>
        )}

        <button
          onClick={handleClear}
          disabled={busy}
          style={{
            padding: "11px 20px",
            borderRadius: "8px",
            border: "1px solid #FCA5A5",
            background: "white",
            color: "#EF4444",
            fontSize: "14px",
            fontWeight: "600",
            cursor: busy ? "not-allowed" : "pointer",
            marginLeft: "auto",
          }}
        >
          Clear All Claimed
        </button>
      </div>

      {/* Preview results */}
      {preview && status !== "done" && (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#111827" }}>Preview — {preview.total} licenses ready</span>
              <span style={{ fontSize: "12px", color: "#6B7280", marginLeft: "10px" }}>First 10 shown below</span>
            </div>
          </div>

          {/* Category breakdown */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>By Category</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {Object.entries(preview.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
                <span key={cat} style={{ padding: "4px 10px", borderRadius: "20px", background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: "12px", color: "#166534" }}>
                  {CATEGORY_LABELS[cat] ?? cat}: <strong>{count}</strong>
                </span>
              ))}
            </div>
          </div>

          {/* Sample rows */}
          <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Business Name", "Category", "Location"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.sample.map((row, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 16px", fontWeight: "500", color: "#111827" }}>{row.name}</td>
                  <td style={{ padding: "10px 16px", color: "#6B7280" }}>{CATEGORY_LABELS[row.category] ?? row.category}</td>
                  <td style={{ padding: "10px 16px", color: "#6B7280" }}>{row.location?.city}, {row.location?.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Done result */}
      {status === "done" && result && (
        <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: "12px", padding: "24px" }}>
          <div style={{ fontSize: "20px", marginBottom: "8px" }}>✅</div>
          <div style={{ fontSize: "16px", fontWeight: "700", color: "#166534", marginBottom: "4px" }}>
            Import complete — {result.inserted} listings added
          </div>
          <div style={{ fontSize: "13px", color: "#4B7A60", marginBottom: "16px" }}>
            {result.skipped} duplicates skipped. They now appear in the directory as Claimed listings.
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {Object.entries(result.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <span key={cat} style={{ padding: "4px 10px", borderRadius: "20px", background: "white", border: "1px solid #86EFAC", fontSize: "12px", color: "#166534" }}>
                {CATEGORY_LABELS[cat] ?? cat}: <strong>{count}</strong>
              </span>
            ))}
          </div>
          <button
            onClick={() => { setStatus("idle"); setPreview(null); setResult(null); }}
            style={{ marginTop: "16px", padding: "8px 20px", borderRadius: "8px", border: "1px solid #1A4A35", background: "white", color: "#1A4A35", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
          >
            Import Another State
          </button>
        </div>
      )}
    </div>
  );
}
