"use client";

import { useState, useRef, useCallback } from "react";

type ImportResult = { imported: number; skipped: number; total: number };
type CleanupResult = { companiesDeleted: number; usersDeleted: number; signupsDeleted: number };

export default function ImportPage() {
  // ── Import state ─────────────────────────────────────────────────────────
  const [file, setFile]               = useState<File | null>(null);
  const [dragging, setDragging]       = useState(false);
  const [importing, setImporting]     = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState("");
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  // ── Cleanup state ─────────────────────────────────────────────────────────
  const [cleaning, setCleaning]         = useState(false);
  const [cleanupResult, setCleanupResult] = useState<CleanupResult | null>(null);
  const [cleanupError, setCleanupError] = useState("");
  const [confirmClean, setConfirmClean] = useState(false);

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

  // ── Import ────────────────────────────────────────────────────────────────
  async function handleImport() {
    if (!file) return;
    setImporting(true);
    setImportError("");
    setImportResult(null);

    const form = new FormData();
    form.append("file", file);

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

  // ── Cleanup ───────────────────────────────────────────────────────────────
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

  // ── Styles ────────────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: "white",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    marginBottom: "24px",
  };

  return (
    <div style={{ maxWidth: "760px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0D2818", margin: 0 }}>
          Data Import
        </h1>
        <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
          Upload your dispensary JSON file to populate the directory with Unclaimed listings.
        </p>
      </div>

      {/* ── Import Card ─────────────────────────────────────────────────── */}
      <div style={card}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
          📂 Import Dispensaries
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 24px" }}>
          All entries will be added as <strong>Unclaimed</strong> listings under the{" "}
          <strong>Retail &amp; Dispensary</strong> category. Safe to re-upload — duplicates
          are updated, not doubled.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#1A4A35" : file ? "#5CB85C" : "#D1D5DB"}`,
            borderRadius: "12px",
            padding: "40px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "rgba(26,74,53,0.04)" : file ? "rgba(92,184,92,0.04)" : "#FAFAFA",
            transition: "all 0.2s",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>
            {file ? "✅" : "📁"}
          </div>
          {file ? (
            <>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>
                {file.name}
              </p>
              <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
                {(file.size / 1024).toFixed(1)} KB — click to change
              </p>
            </>
          ) : (
            <>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>
                Drag &amp; drop your JSON file here
              </p>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
                or click to browse your computer
              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={onFileChange}
          style={{ display: "none" }}
        />

        {/* Import button */}
        <button
          onClick={handleImport}
          disabled={!file || importing}
          style={{
            width: "100%",
            padding: "14px",
            background: !file || importing ? "#D1D5DB" : "#1A4A35",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: !file || importing ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {importing ? "Importing… please wait" : "Import Dispensaries →"}
        </button>

        {/* Progress hint */}
        {importing && (
          <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", marginTop: "10px" }}>
            This may take a few seconds for large files…
          </p>
        )}

        {/* Error */}
        {importError && (
          <div style={{ marginTop: "16px", padding: "14px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", color: "#DC2626", fontSize: "14px" }}>
            ❌ {importError}
          </div>
        )}

        {/* Success */}
        {importResult && (
          <div style={{ marginTop: "16px", padding: "20px 24px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px" }}>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#15803D", margin: "0 0 12px" }}>
              ✅ Import complete!
            </p>
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
              <a href="/directory" target="_blank" style={{ color: "#15803D", fontWeight: 600 }}>
                /directory
              </a>{" "}
              under the Unclaimed filter.
            </p>
          </div>
        )}
      </div>

      {/* ── Cleanup Card ─────────────────────────────────────────────────── */}
      <div style={{ ...card, borderTop: "3px solid #EF4444" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
          🧹 Clean Up Test Accounts
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 20px" }}>
          Removes all free-tier (unclaimed) vendor accounts, their linked companies, and
          any rejected signup applications. Use this to wipe test data before going live.
        </p>

        {cleanupResult ? (
          <div style={{ padding: "20px 24px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "10px" }}>
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#15803D", margin: "0 0 10px" }}>
              ✅ Cleanup complete!
            </p>
            <p style={{ fontSize: "13px", color: "#374151", margin: 0 }}>
              Removed <strong>{cleanupResult.usersDeleted}</strong> user(s),{" "}
              <strong>{cleanupResult.companiesDeleted}</strong> company/companies, and{" "}
              <strong>{cleanupResult.signupsDeleted}</strong> signup application(s).
            </p>
          </div>
        ) : confirmClean ? (
          <div style={{ padding: "20px", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: "10px" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#92400E", margin: "0 0 16px" }}>
              ⚠️ Are you sure? This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCleanup}
                disabled={cleaning}
                style={{ flex: 1, padding: "11px", background: "#EF4444", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: cleaning ? "not-allowed" : "pointer" }}
              >
                {cleaning ? "Cleaning…" : "Yes, delete test data"}
              </button>
              <button
                onClick={() => setConfirmClean(false)}
                style={{ flex: 1, padding: "11px", background: "white", color: "#374151", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmClean(true)}
            style={{ padding: "11px 24px", background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
          >
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
  );
}
