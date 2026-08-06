"use client";

import { useState } from "react";

type Scope = "all" | "companies" | "users";

interface DeleteResult {
  companiesDeleted: number;
  usersDeleted: number;
  signupsDeleted: number;
}

function DangerCard({
  title,
  description,
  scope,
}: {
  title: string;
  description: string;
  scope: Scope;
}) {
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
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        border: "1px solid #FECACA",
        padding: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <p style={{ fontWeight: 700, color: "#111827", margin: "0 0 4px", fontSize: "15px" }}>{title}</p>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, lineHeight: 1.6 }}>{description}</p>
        </div>
        {phase === "idle" && (
          <button
            onClick={() => setPhase("confirm")}
            style={{
              flexShrink: 0,
              padding: "8px 16px",
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              color: "#DC2626",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
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
            style={{
              width: "100%",
              padding: "10px 12px",
              border: `1px solid ${error ? "#EF4444" : "#FECACA"}`,
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "10px",
              boxSizing: "border-box",
              outline: "none",
              fontFamily: "monospace",
            }}
          />
          {error && <p style={{ fontSize: "12px", color: "#EF4444", margin: "0 0 10px" }}>{error}</p>}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleDelete}
              disabled={loading}
              style={{
                padding: "9px 18px",
                background: "#DC2626",
                border: "none",
                borderRadius: "8px",
                color: "white",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "Deleting…" : "Confirm Delete"}
            </button>
            <button
              onClick={() => { setPhase("idle"); setConfirmText(""); setError(""); }}
              style={{
                padding: "9px 18px",
                background: "white",
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                color: "#374151",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
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
          Loads 15 sample listings (3 per built template: Retail, Transportation, Testing, Technology, Real Estate) so you can preview the front-end. Safe to run repeatedly — it updates the same records.
        </p>
      </div>
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            onClick={() => run("load")}
            disabled={phase === "loading"}
            style={{ padding: "10px 20px", background: "#1A4A35", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: phase === "loading" ? "wait" : "pointer", opacity: phase === "loading" && action === "load" ? 0.7 : 1 }}
          >
            {phase === "loading" && action === "load" ? "Loading…" : "Load Demo Listings"}
          </button>
          <button
            onClick={() => run("remove")}
            disabled={phase === "loading"}
            style={{ padding: "10px 20px", background: "white", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: phase === "loading" ? "wait" : "pointer", opacity: phase === "loading" && action === "remove" ? 0.7 : 1 }}
          >
            {phase === "loading" && action === "remove" ? "Removing…" : "Remove Demo Listings"}
          </button>
        </div>
        {message && <p style={{ fontSize: "13px", color: "#1A4A35", margin: 0 }}>✅ {message}</p>}
        {error && <p style={{ fontSize: "13px", color: "#DC2626", margin: 0 }}>{error}</p>}
        <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>
          Demo records are prefixed “demo-” and can be cleanly removed with the button above.
        </p>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0D2818", margin: 0 }}>Settings</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>Manage platform data and configuration</p>
      </div>

      {/* Demo Listings */}
      <DemoListingsCard />

      {/* Danger Zone */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          border: "1px solid #FECACA",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #FEE2E2", background: "#FFF5F5" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#DC2626", margin: 0 }}>⚠️ Danger Zone</h2>
          <p style={{ fontSize: "13px", color: "#7F1D1D", margin: "4px 0 0" }}>
            These actions permanently delete data from the database and cannot be reversed.
          </p>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <DangerCard
            scope="companies"
            title="Delete All Company Listings"
            description="Permanently removes every company/vendor listing from the database. Users and signups are kept."
          />
          <DangerCard
            scope="users"
            title="Delete All Users & Signups"
            description="Permanently removes all user accounts and signup applications. Company listings are kept."
          />
          <DangerCard
            scope="all"
            title="Delete Everything"
            description="Permanently removes all companies, users, and signup applications. Starts the platform completely fresh."
          />
        </div>
      </div>
    </div>
  );
}
