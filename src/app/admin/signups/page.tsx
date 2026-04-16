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

  useEffect(() => {
    fetch("/api/admin/signups")
      .then((r) => r.json())
      .then((d) => { setApps(d.applications ?? []); setLoading(false); })
      .catch(() => { setError("Failed to load signups"); setLoading(false); });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0D2818", margin: 0 }}>Signup Applications</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
          All business listing applications submitted via /signup
        </p>
      </div>

      {loading && <div style={{ color: "#6B7280", fontSize: "14px" }}>Loading…</div>}
      {error && <div style={{ color: "#DC2626", fontSize: "14px" }}>{error}</div>}

      {!loading && !error && apps.length === 0 && (
        <div style={{ background: "white", borderRadius: "12px", padding: "48px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
          No signup applications yet.
        </div>
      )}

      {!loading && apps.length > 0 && (
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                {["Company", "Contact", "Plan", "State", "Status", "Date"].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {apps.map((app, i) => (
                <tr key={app._id} style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{app.companyName}</div>
                    {app.website && <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{app.website}</div>}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "#374151" }}>{app.fullName}</div>
                    <a href={`mailto:${app.email}`} style={{ fontSize: "11px", color: "#2563EB", textDecoration: "none" }}>{app.email}</a>
                    {app.phone && <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{app.phone}</div>}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, ...(TIER_COLORS[app.tier] ?? TIER_COLORS.free) }}>
                      {TIER_LABELS[app.tier] ?? app.tier}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#6B7280" }}>{app.stateProvince || "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, ...(STATUS_COLORS[app.status] ?? STATUS_COLORS.pending) }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#9CA3AF", whiteSpace: "nowrap" }}>
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
