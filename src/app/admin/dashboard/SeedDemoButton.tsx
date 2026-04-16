"use client";

import { useState } from "react";

export default function SeedDemoButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [urls, setUrls] = useState<{ vendorUrl: string; adminUrl: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSeed() {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/seed-demo", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || data.error || `HTTP ${res.status}`);
        setStatus("error");
        return;
      }
      setUrls({ vendorUrl: data.vendorUrl, adminUrl: data.adminUrl });
      setStatus("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  if (status === "done" && urls) {
    return (
      <div style={{ background: "#E8F5EE", borderRadius: "10px", padding: "16px 20px", border: "1px solid #A7D7B8", fontFamily: "sans-serif" }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#1A4A35", marginBottom: "10px" }}>
          ✅ Demo Select company created!
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a
            href={urls.vendorUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ padding: "7px 14px", background: "#1A4A35", color: "white", borderRadius: "7px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}
          >
            View Front-end →
          </a>
          <a
            href={urls.adminUrl}
            style={{ padding: "7px 14px", background: "white", color: "#1A4A35", border: "1px solid #1A4A35", borderRadius: "7px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}
          >
            Edit in Admin →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "16px 20px", border: "1px solid #BFDBFE", fontFamily: "sans-serif" }}>
      <div style={{ fontSize: "13px", fontWeight: "700", color: "#1D4ED8", marginBottom: "4px" }}>
        Demo: Select Package
      </div>
      <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "12px" }}>
        Add a sample Select-tier company (GreenLeaf Packaging Co.) to preview the front-end listing page and admin edit form.
      </div>
      <button
        onClick={handleSeed}
        disabled={status === "loading"}
        style={{
          padding: "8px 16px",
          background: status === "error" ? "#DC2626" : "#2563EB",
          color: "white",
          border: "none",
          borderRadius: "7px",
          fontSize: "12px",
          fontWeight: "600",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        {status === "loading" ? "Creating…" : status === "error" ? "Retry" : "Insert Demo Company"}
      </button>
      {status === "error" && errorMsg && (
        <div style={{ marginTop: "8px", fontSize: "11px", color: "#DC2626", fontFamily: "monospace", wordBreak: "break-all" }}>
          {errorMsg}
        </div>
      )}
    </div>
  );
}
