"use client";
import { useEffect, useState } from "react";
import CustomSelect from "@/components/ui/CustomSelect";

const TIER_COLORS: Record<string, string> = {
  elite: "#1A4A35", select: "#2563EB", free: "#6B7280",
};
const TIER_BG: Record<string, string> = {
  elite: "#E8F5EE", select: "#EFF6FF", free: "#F9FAFB",
};

const TIER_LABELS: Record<string, string> = {
  free: "Claimed", select: "Select", elite: "Verified Pro",
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "#FEF3E2", color: "#B45309" },
  approved: { bg: "#E8F5EE", color: "#1A4A35" },
  rejected: { bg: "#FEF2F2", color: "#DC2626" },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type User = Record<string, any>;

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
  categoryDetails?: Record<string, string>;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function UsersPage() {
  const [tab, setTab] = useState<"users" | "signups">("users");

  // ── Users state ───────────────────────────────────────────────
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersEmpty, setUsersEmpty] = useState(false);

  // ── Signups state ─────────────────────────────────────────────
  const [apps, setApps] = useState<SignupApp[]>([]);
  const [signupsLoading, setSignupsLoading] = useState(true);
  const [signupsError, setSignupsError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || []);
        setUsersEmpty(!data.users || data.users.length === 0);
        setUsersLoading(false);
      })
      .catch(() => { setUsersEmpty(true); setUsersLoading(false); });

    fetch("/api/admin/signups")
      .then((r) => r.json())
      .then((d) => { setApps(d.applications ?? []); setSignupsLoading(false); })
      .catch(() => { setSignupsError("Failed to load signups"); setSignupsLoading(false); });
  }, []);

  async function handleTierChange(id: string, tier: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tier }),
    });
    if (res.ok) {
      const { user } = await res.json();
      setUsers((prev) => prev.map((u) => (u._id === id ? user : u)));
    }
  }

  async function deleteApp(id: string) {
    setActionLoading(id + "delete");
    try {
      const res = await fetch(`/api/admin/signups/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setApps((prev) => prev.filter((a) => a._id !== id));
      setDeleteConfirm(null);
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

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

  const signupCounts = {
    all:      apps.length,
    pending:  apps.filter((a) => a.status === "pending").length,
    approved: apps.filter((a) => a.status === "approved").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  const filteredApps = statusFilter === "all" ? apps : apps.filter((a) => a.status === statusFilter);

  const pendingBadge = signupCounts.pending > 0 ? signupCounts.pending : null;

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
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0D2818", margin: 0, fontFamily: "sans-serif" }}>
            Users
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px", fontFamily: "sans-serif" }}>
            Manage registered users and signup applications
          </p>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", borderRadius: "10px", padding: "4px" }}>
          <button style={tabStyle(tab === "users")} onClick={() => setTab("users")}>
            Active Users
          </button>
          <button style={tabStyle(tab === "signups")} onClick={() => setTab("signups")}>
            Signups
            {pendingBadge && tab !== "signups" && (
              <span style={{ background: "#F59E0B", color: "white", fontSize: "11px", fontWeight: 700, borderRadius: "10px", padding: "1px 7px", minWidth: "18px", textAlign: "center" }}>
                {pendingBadge}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Active Users Tab ────────────────────────────────────── */}
      {tab === "users" && (
        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {usersLoading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "sans-serif" }}>
              Loading users...
            </div>
          ) : usersEmpty ? (
            <div style={{ padding: "60px", textAlign: "center", fontFamily: "sans-serif" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>👥</div>
              <p style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>No users yet</p>
              <p style={{ fontSize: "14px", color: "#9CA3AF" }}>Users will appear here once they sign up on the platform.</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {["Name", "Email", "Company", "Type", "Tier", "Joined", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "sans-serif" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id} style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1A4A35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "white", fontFamily: "sans-serif", flexShrink: 0 }}>
                          {u.fullName?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827", fontFamily: "sans-serif" }}>
                          {u.fullName}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>{u.email}</td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>{u.companyName || "—"}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "600", textTransform: "capitalize", color: u.accountType === "vendor" ? "#1A4A35" : "#2563EB", background: u.accountType === "vendor" ? "#E8F5EE" : "#EFF6FF", padding: "3px 10px", borderRadius: "20px", fontFamily: "sans-serif" }}>
                        {u.accountType}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "capitalize", color: TIER_COLORS[u.tier] || "#6B7280", background: TIER_BG[u.tier] || "#F9FAFB", padding: "3px 10px", borderRadius: "20px", fontFamily: "sans-serif" }}>
                        {u.tier}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "#9CA3AF", fontFamily: "sans-serif" }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <CustomSelect value={u.tier} onChange={(e) => handleTierChange(u._id, e.target.value)} style={{ fontSize: "12px", padding: "6px 28px 6px 10px" }}>
                        {[{ v: "free", l: "Unclaimed" }, { v: "select", l: "Select" }, { v: "elite", l: "Verified Pro" }].map(({ v, l }) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </CustomSelect>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Signups Tab ─────────────────────────────────────────── */}
      {tab === "signups" && (
        <>
          {/* Stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
            {([
              { label: "Total Received",  value: signupCounts.all,      color: "#1A4A35", icon: "📋", key: "all" as const },
              { label: "Needs Attention",  value: signupCounts.pending,  color: "#B45309", icon: "⏳", key: "pending" as const },
              { label: "Approved",         value: signupCounts.approved, color: "#1A4A35", icon: "✅", key: "approved" as const },
              { label: "Rejected",         value: signupCounts.rejected, color: "#DC2626", icon: "❌", key: "rejected" as const },
            ]).map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                style={{
                  background: statusFilter === s.key ? s.color : "white",
                  border: `2px solid ${statusFilter === s.key ? s.color : "#E5E7EB"}`,
                  borderRadius: "12px",
                  padding: "18px 20px",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  position: "relative",
                }}
              >
                {s.key === "pending" && signupCounts.pending > 0 && statusFilter !== "pending" && (
                  <span style={{ position: "absolute", top: "10px", right: "10px", width: "8px", height: "8px", background: "#F59E0B", borderRadius: "50%" }} />
                )}
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>{s.icon}</div>
                <div style={{ fontSize: "28px", fontWeight: 800, color: statusFilter === s.key ? "white" : s.color, lineHeight: 1 }}>
                  {signupsLoading ? "—" : s.value}
                </div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: statusFilter === s.key ? "rgba(255,255,255,0.8)" : "#6B7280", marginTop: "4px" }}>
                  {s.label}
                </div>
              </button>
            ))}
          </div>

          {signupsError && <div style={{ color: "#DC2626", fontSize: "14px", marginBottom: "12px" }}>{signupsError}</div>}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#374151", margin: 0, textTransform: "capitalize" }}>
              {statusFilter === "pending" ? "⏳ Needs Your Attention" : statusFilter === "approved" ? "✅ Approved" : statusFilter === "rejected" ? "❌ Rejected" : "📋 All Applications"}
              <span style={{ marginLeft: "8px", background: "#F3F4F6", color: "#6B7280", padding: "2px 8px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                {filteredApps.length}
              </span>
            </h2>
          </div>

          {!signupsLoading && filteredApps.length === 0 && (
            <div style={{ background: "white", borderRadius: "12px", padding: "48px", textAlign: "center", color: "#6B7280", fontSize: "14px", border: "1px solid #E5E7EB" }}>
              {statusFilter === "pending" ? "🎉 No pending applications — you're all caught up!" : `No ${statusFilter} applications yet.`}
            </div>
          )}

          {!signupsLoading && filteredApps.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredApps.map((app) => (
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
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{app.companyName}</span>
                      <span style={{ padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, background: TIER_BG[app.tier] || "#F9FAFB", color: TIER_COLORS[app.tier] || "#6B7280" }}>
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
                    {app.categoryDetails && Object.entries(app.categoryDetails).filter(([, v]) => v).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                        {Object.entries(app.categoryDetails).filter(([, v]) => v).map(([k, v]) => (
                          <span key={k} style={{ fontSize: "10px", color: "#374151", background: "#F3F4F6", borderRadius: "6px", padding: "3px 8px" }}>
                            <span style={{ color: "#9CA3AF" }}>{k}:</span> {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: "11px", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                    {new Date(app.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
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
                    {deleteConfirm === app._id ? (
                      <>
                        <button onClick={() => deleteApp(app._id)} disabled={actionLoading === app._id + "delete"} style={{ padding: "7px 12px", background: "#DC2626", color: "white", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                          {actionLoading === app._id + "delete" ? "…" : "Confirm"}
                        </button>
                        <button onClick={() => setDeleteConfirm(null)} style={{ padding: "7px 10px", background: "none", color: "#6B7280", border: "1px solid #E5E7EB", borderRadius: "7px", fontSize: "12px", cursor: "pointer" }}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setDeleteConfirm(app._id)} style={{ padding: "7px 10px", background: "none", color: "#9CA3AF", border: "1px solid #E5E7EB", borderRadius: "7px", fontSize: "12px", cursor: "pointer", whiteSpace: "nowrap" }} title="Delete application">
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
