"use client";

import { useEffect, useState } from "react";

interface SignupApp {
  _id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone?: string;
  stateProvince?: string;
  category?: string;
  tier: string;
  website?: string;
  description?: string;
  serviceArea?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  free:   { bg: "#F3F4F6", color: "#6B7280" },
  select: { bg: "#EFF6FF", color: "#2563EB" },
  elite:  { bg: "#E8F5EE", color: "#1A4A35" },
};

const TIER_LABELS: Record<string, string> = {
  free: "Claimed",
  select: "Select",
  elite: "Verified Pro",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "#FEF3E2", color: "#B45309" },
  approved: { bg: "#E8F5EE", color: "#1A4A35" },
  rejected: { bg: "#FEF2F2", color: "#DC2626" },
};

export default function SignupsPage() {
  const [apps, setApps] = useState<SignupApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    fetch("/api/admin/signups")
      .then((r) => r.json())
      .then((d) => { setApps(d.applications ?? []); setLoading(false); })
      .catch(() => { setError("Failed to load signups"); setLoading(false); });
  }, []);

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/signups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setApps((prev) => prev.map((a) => a._id === id ? { ...a, status } : a));
    } catch {
      alert("Failed to update status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);
  const counts = {
    all: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0D2818", margin: 0 }}>Signup Applications</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
            Review and approve business listing applications
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                border: "1px solid",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
                borderColor: filter === f ? "#1A4A35" : "#E5E7EB",
                background: filter === f ? "#1A4A35" : "white",
                color: filter === f ? "white" : "#6B7280",
              }}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {loading && <div style={{ color: "#6B7280", fontSize: "14px" }}>Loading…</div>}
      {error && <div style={{ color: "#DC2626", fontSize: "14px" }}>{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ background: "white", borderRadius: "12px", padding: "48px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
          No {filter === "all" ? "" : filter} applications yet.
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.map((app) => (
            <div
              key={app._id}
              style={{
                background: "white",
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                padding: "20px 24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: "20px",
                alignItems: "center",
              }}
            >
              {/* Company info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{app.companyName}</span>
                  <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, ...(TIER_COLORS[app.tier] ?? TIER_COLORS.free) }}>
                    {TIER_LABELS[app.tier] ?? app.tier}
                  </span>
                  <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, ...(STATUS_COLORS[app.status] ?? STATUS_COLORS.pending) }}>
                    {app.status}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#6B7280" }}>{app.fullName} · <a href={`mailto:${app.email}`} style={{ color: "#2563EB", textDecoration: "none" }}>{app.email}</a>{app.phone ? ` · ${app.phone}` : ""}</div>
                {app.stateProvince && <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>{app.stateProvince}{app.serviceArea ? ` · ${app.serviceArea}` : ""}</div>}
                {app.website && <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>{app.website}</div>}
                {app.description && (
                  <div style={{ fontSize: "12px", color: "#4B5563", marginTop: "6px", lineHeight: 1.5, maxWidth: "480px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                    {app.description}
                  </div>
                )}
              </div>

              {/* Date */}
              <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
                Applied {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                {app.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(app._id, "approved")}
                    disabled={actionLoading === app._id + "approved"}
                    style={{
                      padding: "7px 16px",
                      background: "#1A4A35",
                      color: "white",
                      border: "none",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      opacity: actionLoading === app._id + "approved" ? 0.6 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {actionLoading === app._id + "approved" ? "…" : "✓ Approve"}
                  </button>
                )}
                {app.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    disabled={actionLoading === app._id + "rejected"}
                    style={{
                      padding: "7px 16px",
                      background: "white",
                      color: "#DC2626",
                      border: "1px solid #FECACA",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      opacity: actionLoading === app._id + "rejected" ? 0.6 : 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {actionLoading === app._id + "rejected" ? "…" : "✕ Reject"}
                  </button>
                )}
                {app.status !== "pending" && (
                  <button
                    onClick={() => updateStatus(app._id, "approved")}
                    disabled={!!actionLoading}
                    style={{
                      padding: "7px 14px",
                      background: "white",
                      color: "#6B7280",
                      border: "1px solid #E5E7EB",
                      borderRadius: "7px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
