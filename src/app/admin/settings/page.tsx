"use client";

import { useState, useRef, useCallback } from "react";

type ImportResult = { imported: number; skipped: number; total: number; tier: string };
type BulkResult = { imported: number; skipped: number; total: number; byCategory: Record<string, number> };
type CleanupResult = { companiesDeleted: number; usersDeleted: number; signupsDeleted: number };
type Scope = "all" | "companies" | "users";

interface DeleteResult {
  companiesDeleted: number;
  usersDeleted: number;
  signupsDeleted: number;
}

const TIERS = [
  { value: "free",   label: "Unclaimed",    color: "#6B7280", bg: "rgba(107,114,128,0.08)" },
  { value: "select", label: "Select",       color: "#2d6e52", bg: "rgba(45,110,82,0.1)"    },
  { value: "elite",  label: "Verified Pro", color: "#92400E", bg: "rgba(217,119,6,0.1)"    },
];

const CATEGORIES = [
  { value: "retail-dispensary",           label: "Retail & Dispensary" },
  { value: "cultivation-growing",         label: "Cultivation & Growing" },
  { value: "manufacturers-suppliers",     label: "Manufacturers & Suppliers" },
  { value: "extraction-processing",       label: "Extraction & Processing" },
  { value: "consultants-advisors",        label: "Consultants & Advisors" },
  { value: "marketing-branding-packaging",label: "Marketing, Branding & Packaging" },
  { value: "transportation-logistics",    label: "Transportation & Logistics" },
  { value: "testing-science",             label: "Testing & Science" },
  { value: "compliance-legal",            label: "Compliance & Legal" },
  { value: "technology-software",         label: "Technology & Software" },
  { value: "real-estate-construction",    label: "Real Estate & Construction" },
  { value: "finance-insurance",           label: "Finance & Insurance" },
];

function DangerCard({ title, description, scope }: { title: string; description: string; scope: Scope }) {
  const [phase, setPhase] = useState<"idle" | "confirm" | "done">("idle");
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [result, setResult] = useState<DeleteResult | null>(null);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (confirmText !== "DELETE ALL DATA") {
      setError('Type exactly "DELETE ALL DATA" to confirm.');
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, confirm: confirmText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setPhase("confirm");
      } else {
        setResult(data);
        setPhase("done");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (phase === "done" && result) {
    return (
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E5E7EB", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span style={{ fontSize: "24px" }}>✅</span>
          <div>
            <p style={{ fontWeight: 700, color: "#111827", margin: 0, fontSize: "15px" }}>{title} — Done</p>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "2px 0 0" }}>Data has been permanently deleted.</p>
          </div>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "12px 16px", fontSize: "13px", color: "#374151", display: "flex", gap: "24px" }}>
          {result.companiesDeleted > 0 && <span><strong>{result.companiesDeleted}</strong> companies</span>}
          {result.usersDeleted > 0 && <span><strong>{result.usersDeleted}</strong> users</span>}
          {result.signupsDeleted > 0 && <span><strong>{result.signupsDeleted}</strong> signups</span>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #FECACA", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <p style={{ fontWeight: 700, color: "#111827", margin: "0 0 4px", fontSize: "15px" }}>{title}</p>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{description}</p>
        </div>
        {phase === "idle" && (
          <button onClick={() => setPhase("confirm")} style={{ flexShrink: 0, padding: "8px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", color: "#DC2626", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Delete
          </button>
        )}
      </div>
      {phase === "confirm" && (
        <div style={{ marginTop: "20px", padding: "16px", background: "#FFF5F5", borderRadius: "8px", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "13px", color: "#7F1D1D", margin: "0 0 12px", lineHeight: 1.6 }}>
            ⚠️ This action is <strong>permanent and cannot be undone</strong>. Type <strong>DELETE ALL DATA</strong> to confirm.
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => { setConfirmText(e.target.value); setError(""); }}
            placeholder='Type "DELETE ALL DATA"'
            style={{ width: "100%", padding: "10px 12px", border: `1px solid ${error ? "#EF4444" : "#FECACA"}`, borderRadius: "8px", fontSize: "13px", marginBottom: "10px", boxSizing: "border-box", outline: "none", fontFamily: "monospace" }}
          />
          {error && <p style={{ fontSize: "12px", color: "#EF4444", margin: "0 0 10px" }}>{error}</p>}
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleDelete} disabled={loading} style={{ padding: "9px 18px", background: "#DC2626", border: "none", borderRadius: "8px", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
              {loading ? "Deleting…" : "Confirm Delete"}
            </button>
            <button onClick={() => { setPhase("idle"); setConfirmText(""); setError(""); }} style={{ padding: "9px 18px", background: "white", border: "1px solid #D1D5DB", borderRadius: "8px", color: "#374151", fontSize: "13px", cursor: "pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DemoListingsCard() {
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [action, setAction] = useState<"load" | "remove">("load");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function run(kind: "load" | "remove") {
    setAction(kind);
    setPhase("loading");
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/admin/seed-demo", { method: kind === "load" ? "POST" : "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setPhase("idle");
        return;
      }
      setMessage(
        kind === "load"
          ? `Done — ${data.created} created, ${data.updated} updated (${data.total} demo listings).`
          : `Removed ${data.deleted} demo listings.`
      );
      setPhase("done");
    } catch {
      setError("Network error. Please try again.");
      setPhase("idle");
    }
  }

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E5E7EB", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #F3F4F6", background: "#F7F9F7" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A4A35", margin: 0 }}>🧪 Demo Listings</h2>
        <p style={{ fontSize: "13px", color: "#4A5E4A", margin: "4px 0 0" }}>
          Loads 36 sample listings (3 per category, all 12 categories) so you can preview the front-end. Safe to run repeatedly — it updates the same records.
        </p>
      </div>
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button onClick={() => run("load")} disabled={phase === "loading"} style={{ padding: "10px 20px", background: "#1A4A35", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: phase === "loading" ? "wait" : "pointer", opacity: phase === "loading" && action === "load" ? 0.7 : 1 }}>
            {phase === "loading" && action === "load" ? "Loading…" : "Load Demo Listings"}
          </button>
          <button onClick={() => run("remove")} disabled={phase === "loading"} style={{ padding: "10px 20px", background: "white", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: phase === "loading" ? "wait" : "pointer", opacity: phase === "loading" && action === "remove" ? 0.7 : 1 }}>
            {phase === "loading" && action === "remove" ? "Removing…" : "Remove Demo Listings"}
          </button>
        </div>
        {message && <p style={{ fontSize: "13px", color: "#1A4A35", margin: 0 }}>✅ {message}</p>}
        {error && <p style={{ fontSize: "13px", color: "#DC2626", margin: 0 }}>{error}</p>}
        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
          Demo records are prefixed &quot;demo-&quot; and can be cleanly removed with the button above.
        </p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<"import" | "manage">("import");

  // ── Import state ─────────────────────────────────────────────────────────
  const [file, setFile]                 = useState<File | null>(null);
  const [tier, setTier]                 = useState("free");
  const [category, setCategory]         = useState("retail-dispensary");
  const [dragging, setDragging]         = useState(false);
  const [importing, setImporting]       = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError]   = useState("");
  const fileInputRef                    = useRef<HTMLInputElement>(null);

  // ── Bulk import state ──────────────────────────────────────────────────────
  const [bulkImporting, setBulkImporting]   = useState(false);
  const [bulkResult, setBulkResult]         = useState<BulkResult | null>(null);
  const [bulkError, setBulkError]           = useState("");

  // ── Unclaimed import state ──────────────────────────────────────────────────
  const [unclaimedImporting, setUnclaimedImporting] = useState(false);
  const [unclaimedResult, setUnclaimedResult]       = useState<{ imported: number; skipped: number; total: number } | null>(null);
  const [unclaimedError, setUnclaimedError]         = useState("");

  // ── Cleanup state ─────────────────────────────────────────────────────────
  const [cleaning, setCleaning]           = useState(false);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
  const [cleanupError, setCleanupError]   = useState("");
  const [confirmClean, setConfirmClean]   = useState(false);

  // ── Drag & drop ───────────────────────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".json")) {
      setFile(dropped);
      setImportResult(null);
      setImportError("");
    } else {
      setImportError("Please drop a .json file.");
    }
  }, []);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (picked) {
      setFile(picked);
      setImportResult(null);
      setImportError("");
    }
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    setImportError("");
    setImportResult(null);

    const form = new FormData();
    form.append("file", file);
    form.append("tier", tier);
    form.append("category", category);

    try {
      const res  = await fetch("/api/admin/import", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setImportResult(data);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setImporting(false);
    }
  }

  async function handleBulkImport() {
    setBulkImporting(true);
    setBulkError("");
    setBulkResult(null);
    try {
      const dataRes = await fetch("/data/listings-120.json");
      if (!dataRes.ok) throw new Error("Could not load listings data file.");
      const listings = await dataRes.json();
      const res = await fetch("/api/admin/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Bulk import failed");
      setBulkResult(data);
    } catch (err) {
      setBulkError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBulkImporting(false);
    }
  }

  async function handleUnclaimedImport() {
    setUnclaimedImporting(true);
    setUnclaimedError("");
    setUnclaimedResult(null);
    try {
      const res = await fetch("/api/admin/import-unclaimed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setUnclaimedResult(data);
    } catch (err) {
      setUnclaimedError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUnclaimedImporting(false);
    }
  }

  async function handleCleanup() {
    setCleaning(true);
    setCleanupError("");
    setCleanupResult(null);
    try {
      const res  = await fetch("/api/admin/cleanup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cleanup failed");
      setCleanupResult(data);
      setConfirmClean(false);
    } catch (err) {
      setCleanupError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCleaning(false);
    }
  }

  const card: React.CSSProperties = {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    marginBottom: "24px",
  };

  const selectedTier = TIERS.find((t) => t.value === tier)!;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    background: active ? "#1A4A35" : "transparent",
    color: active ? "white" : "#6B7280",
    fontSize: "14px",
    fontWeight: active ? 600 : 500,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0D2818", margin: 0 }}>Settings</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>Import data and manage platform configuration</p>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", borderRadius: "10px", padding: "4px" }}>
          <button style={tabStyle(tab === "import")} onClick={() => setTab("import")}>Import Data</button>
          <button style={tabStyle(tab === "manage")} onClick={() => setTab("manage")}>Manage Data</button>
        </div>
      </div>

      {/* ── Import Data Tab ──────────────────────────────────────── */}
      {tab === "import" && (
        <div style={{ maxWidth: "760px" }}>
          {/* Import Card */}
          <div style={card}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 20px" }}>
              📂 Import Listings
            </h2>

            {/* Tier selector */}
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Tier</p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {TIERS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTier(t.value)}
                    style={{
                      padding: "8px 16px", borderRadius: "8px",
                      border: `1.5px solid ${tier === t.value ? t.color : "#E5E7EB"}`,
                      background: tier === t.value ? t.bg : "white",
                      color: tier === t.value ? t.color : "#6B7280",
                      fontSize: "13px", fontWeight: tier === t.value ? 700 : 500,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selector */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Category</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: "14px", color: "#111827", background: "white", cursor: "pointer", outline: "none" }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragging ? "#1A4A35" : file ? "#5CB85C" : "#D1D5DB"}`,
                borderRadius: "12px", padding: "40px 24px", textAlign: "center", cursor: "pointer",
                background: dragging ? "rgba(26,74,53,0.04)" : file ? "rgba(92,184,92,0.04)" : "#FAFAFA",
                transition: "all 0.2s", marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>{file ? "✅" : "📁"}</div>
              {file ? (
                <>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>{file.name}</p>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>{(file.size / 1024).toFixed(1)} KB — click to change</p>
                </>
              ) : (
                <>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>Drag &amp; drop your JSON file here</p>
                  <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>or click to browse your computer</p>
                </>
              )}
            </div>

            <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={onFileChange} style={{ display: "none" }} />

            <button
              onClick={handleImport}
              disabled={!file || importing}
              style={{
                width: "100%", padding: "14px",
                background: !file || importing ? "#D1D5DB" : "#1A4A35",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "15px", fontWeight: 700,
                cursor: !file || importing ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              {importing
                ? "Importing… please wait"
                : `Import as ${selectedTier.label} · ${CATEGORIES.find((c) => c.value === category)?.label} →`}
            </button>

            {importing && (
              <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", marginTop: "10px" }}>
                This may take a few seconds for large files…
              </p>
            )}

            {importError && (
              <div style={{ marginTop: "16px", padding: "14px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", color: "#DC2626", fontSize: "14px" }}>
                ❌ {importError}
              </div>
            )}

            {importResult && (
              <div style={{ marginTop: "16px", padding: "20px 24px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#15803D", margin: "0 0 12px" }}>✅ Import complete!</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "Total in file", value: importResult.total },
                    { label: "Imported",      value: importResult.imported, color: "#15803D" },
                    { label: "Skipped",       value: importResult.skipped,  color: "#B45309" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", background: "white", borderRadius: "8px", padding: "12px" }}>
                      <p style={{ fontSize: "24px", fontWeight: 800, color: s.color ?? "#111827", margin: 0 }}>{s.value}</p>
                      <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: "13px", color: "#166534", marginTop: "14px", marginBottom: 0 }}>
                  Listings are now live at{" "}
                  <a href="/directory" target="_blank" style={{ color: "#15803D", fontWeight: 600 }}>/directory</a>.
                </p>
              </div>
            )}
          </div>

          {/* Bulk Import Card */}
          <div style={{ ...card, borderTop: "3px solid #2d6e52" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
              🚀 Bulk Import — 120 Verified Pro Listings
            </h2>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 6px" }}>
              One-click import of 120 pre-built Verified Pro listings — 10 real cannabis businesses per category across all 12 directories.
            </p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "0 0 20px" }}>
              Safe to run multiple times — existing listings are updated, not duplicated.
            </p>

            {bulkResult ? (
              <div style={{ padding: "20px 24px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#15803D", margin: "0 0 12px" }}>✅ Bulk import complete!</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  {[
                    { label: "Total", value: bulkResult.total },
                    { label: "Imported", value: bulkResult.imported, color: "#15803D" },
                    { label: "Skipped", value: bulkResult.skipped, color: "#B45309" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", background: "white", borderRadius: "8px", padding: "12px" }}>
                      <p style={{ fontSize: "24px", fontWeight: 800, color: s.color ?? "#111827", margin: 0 }}>{s.value}</p>
                      <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: "12px", color: "#374151" }}>
                  <strong>By category:</strong>{" "}
                  {Object.entries(bulkResult.byCategory).map(([cat, count]) => (
                    <span key={cat} style={{ marginRight: "12px" }}>{cat.replace(/-/g, " ")}: {count}</span>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleBulkImport}
                disabled={bulkImporting}
                style={{
                  width: "100%", padding: "14px",
                  background: bulkImporting ? "#D1D5DB" : "#2d6e52",
                  color: "white", border: "none", borderRadius: "10px",
                  fontSize: "15px", fontWeight: 700,
                  cursor: bulkImporting ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {bulkImporting ? "Importing 120 listings… please wait" : "Import 120 Verified Pro Listings →"}
              </button>
            )}

            {bulkError && (
              <div style={{ marginTop: "16px", padding: "14px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", color: "#DC2626", fontSize: "14px" }}>
                ❌ {bulkError}
              </div>
            )}
          </div>

          {/* Unclaimed Cultivation Import Card */}
          <div style={{ ...card, borderTop: "3px solid #92400E" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
              🌿 Import Unclaimed Cultivation Listings
            </h2>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 6px" }}>
              One-click import of 4,422 California DCC licensed cultivation businesses as unclaimed (free-tier) listings.
            </p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", margin: "0 0 20px" }}>
              Unclaimed listings appear in the directory but have no single listing page — visitors see a &quot;Claim This Listing&quot; prompt instead. Safe to run multiple times.
            </p>

            {unclaimedResult ? (
              <div style={{ padding: "20px 24px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "#15803D", margin: "0 0 12px" }}>✅ Import complete!</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                  {[
                    { label: "Total", value: unclaimedResult.total },
                    { label: "Imported", value: unclaimedResult.imported, color: "#15803D" },
                    { label: "Skipped", value: unclaimedResult.skipped, color: "#B45309" },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", background: "white", borderRadius: "8px", padding: "12px" }}>
                      <p style={{ fontSize: "24px", fontWeight: 800, color: s.color ?? "#111827", margin: 0 }}>{s.value}</p>
                      <p style={{ fontSize: "12px", color: "#6B7280", margin: "4px 0 0" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <button
                onClick={handleUnclaimedImport}
                disabled={unclaimedImporting}
                style={{
                  width: "100%", padding: "14px",
                  background: unclaimedImporting ? "#D1D5DB" : "#92400E",
                  color: "white", border: "none", borderRadius: "10px",
                  fontSize: "15px", fontWeight: 700,
                  cursor: unclaimedImporting ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
              >
                {unclaimedImporting ? "Importing 4,422 listings… this may take a minute" : "Import 4,422 Cultivation Listings →"}
              </button>
            )}

            {unclaimedError && (
              <div style={{ marginTop: "16px", padding: "14px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", color: "#DC2626", fontSize: "14px" }}>
                ❌ {unclaimedError}
              </div>
            )}
          </div>

          {/* Cleanup Card */}
          <div style={{ ...card, borderTop: "3px solid #EF4444" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>🧹 Clean Up Test Accounts</h2>
            <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 20px" }}>
              Removes all free-tier (unclaimed) vendor accounts, their linked companies, and any rejected signup applications.
            </p>

            {cleanupResult ? (
              <div style={{ padding: "20px 24px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px" }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#15803D", margin: "0 0 10px" }}>✅ Cleanup complete!</p>
                <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
                  Removed <strong>{cleanupResult.usersDeleted}</strong> user(s),{" "}
                  <strong>{cleanupResult.companiesDeleted}</strong> company/companies, and{" "}
                  <strong>{cleanupResult.signupsDeleted}</strong> signup application(s).
                </p>
              </div>
            ) : confirmClean ? (
              <div style={{ padding: "20px", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: "10px" }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#92400E", margin: "0 0 16px" }}>⚠️ Are you sure? This cannot be undone.</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={handleCleanup} disabled={cleaning} style={{ flex: 1, padding: "11px", background: "#EF4444", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: cleaning ? "not-allowed" : "pointer" }}>
                    {cleaning ? "Cleaning…" : "Yes, delete test data"}
                  </button>
                  <button onClick={() => setConfirmClean(false)} style={{ flex: 1, padding: "11px", background: "white", color: "#374151", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setConfirmClean(true)} style={{ padding: "11px 24px", background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
                Clean Up Test Data
              </button>
            )}

            {cleanupError && (
              <div style={{ marginTop: "12px", padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", color: "#DC2626", fontSize: "14px" }}>
                ❌ {cleanupError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Manage Data Tab ──────────────────────────────────────── */}
      {tab === "manage" && (
        <div style={{ maxWidth: "760px" }}>
          {/* Demo Listings */}
          <DemoListingsCard />

          {/* Danger Zone */}
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #FECACA", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #FEE2E2", background: "#FFF5F5" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#DC2626", margin: 0 }}>⚠️ Danger Zone</h2>
              <p style={{ fontSize: "13px", color: "#7F1D1D", margin: "4px 0 0" }}>
                These actions permanently delete data from the database and cannot be reversed.
              </p>
            </div>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <DangerCard scope="companies" title="Delete All Company Listings" description="Permanently removes every company/vendor listing from the database. Users and signups are kept." />
              <DangerCard scope="users" title="Delete All Users & Signups" description="Permanently removes all user accounts and signup applications. Company listings are kept." />
              <DangerCard scope="all" title="Delete Everything" description="Permanently removes all companies, users, and signup applications. Starts the platform completely fresh." />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
