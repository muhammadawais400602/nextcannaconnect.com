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
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

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

  const counts = {
    all:      apps.length,
    pending:  apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const statCards = [
    { label: "Total Received",    value: counts.all,      color: "#1A4A35", bg: "#E8F5EE",  icon: "📋", tab: "all" as const },
    { label: "Needs Attention",   value: counts.pending,  color: "#B45309", bg: "#FEF3E2",  icon: "⏳", tab: "pending" as const },
    { label: "Approved",          value: counts.approved, color: "#1A4A35", bg: "#D1FAE5",  icon: "✅", tab: "approved" as const },
    { label: "Rejected",          value: counts.rejected, color: "#DC2626", bg: "#FEE2E2",  icon: "❌", tab: "rejected" as const },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0D2818", margin: 0 }}>Signup Applications</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
          Review and approve business listing applications
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {statCards.map((s) => (
          <button
            key={s.tab}
            onClick={() => setFilter(s.tab)}
            style={{
              background: filter === s.tab ? s.color : "white",
              border: `2px solid ${filter === s.tab ? s.color : "#E5E7EB"}`,
              borderRadius: "12px",
              padding: "18px 20px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.15s",
              position: "relative",
            }}
          >
            {s.tab === "pending" && counts.pending > 0 && filter !== "pending" && (
              <span style={{ position: "absolute", top: "10px", right: "10px", width: "8px", height: "8px", background: "#F59E0B", borderRadius: "50%" }} />
            )}
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: filter === s.tab ? "white" : s.color, lineHeight: 1 }}>
              {loading ? "—" : s.value}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: filter === s.tab ? "rgba(255,255,255,0.8)" : "#6B7280", marginTop: "4px" }}>
              {s.label}
            </div>
          </button>
        ))}
      </div>

      {error && <div style={{ color: "#DC2626", fontSize: "14px", marginBottom: "12px" }}>{error}</div>}

      {/* Section label */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#374151", margin: 0, textTransform: "capitalize" }}>
          {filter === "pending" ? "⏳ Needs Your Attention" : filter === "approved" ? "✅ Approved" : filter === "rejected" ? "❌ Rejected" : "📋 All Applications"}
          <span style={{ marginLeft: "8px", background: "#F3F4F6", color: "#6B7280", padding: "2px 8px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
            {filtered.length}
          </span>
        </h2>
      </div>

      {!loading && filtered.length === 0 && (
        <div style={{ background: "white", borderRadius: "12px", padding: "48px", textAlign: "center", color: "#6B7280", fontSize: "14px", border: "1px solid #E5E7EB" }}>
          {filter === "pending" ? "🎉 No pending applications — you're all caught up!" : `No ${filter} applications yet.`}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((app) => (
            <div
              key={app._id}
              style={{
                background: "white",
                borderRadius: "12px",
                border: `1px solid ${app.status === "pending" ? "#FDE68A" : "#E5E7EB"}`,
                padding: "18px 20px",
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                gap: "20px",
                alignItems: "center",
              }}
            >
              {/* Info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{app.companyName}</span>
                  <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, ...(TIER_COLORS[app.tier] ?? TIER_COLORS.free) }}>
                    {TIER_LABELS[app.tier] ?? app.tier}
                  </span>
                  <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, ...(STATUS_COLORS[app.status]) }}>
                    {app.status}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  {app.fullName} · <a href={`mailto:${app.email}`} style={{ color: "#2563EB", textDecoration: "none" }}>{app.email}</a>
                  {app.phone ? ` · ${app.phone}` : ""}
                </div>
                {app.stateProvince && <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{app.stateProvince}</div>}
              </div>

              {/* Date */}
              <div style={{ fontSize: "11px", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px" }}>
                {app.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(app._id, "approved")}
                    disabled={actionLoading === app._id + "approved"}
                    style={{ padding: "7px 16px", background: "#1A4A35", color: "white", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 600, cursor: "pointer", opacity: actionLoading === app._id + "approved" ? 0.6 : 1, whiteSpace: "nowrap" }}
                  >
                    {actionLoading === app._id + "approved" ? "…" : "✓ Approve"}
                  </button>
                )}
                {app.status !== "rejected" && (
                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    disabled={actionLoading === app._id + "rejected"}
                    style={{ padding: "7px 16px", background: "white", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "7px", fontSize: "12px", fontWeight: 600, cursor: "pointer", opacity: actionLoading === app._id + "rejected" ? 0.6 : 1, whiteSpace: "nowrap" }}
                  >
                    {actionLoading === app._id + "rejected" ? "…" : "✕ Reject"}
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
