"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { COMPANIES } from "@/data/companies";
import { CATEGORIES } from "@/data/categories";

const TIER_COLORS: Record<string, string> = {
  elite: "#1A4A35",
  select: "#2d6e52",
  free: "#6B7280",
};

const TIER_BG: Record<string, string> = {
  elite: "rgba(26,74,53,0.1)",
  select: "rgba(45,110,82,0.1)",
  free: "#F3F4F6",
};

const TIER_LABEL: Record<string, string> = {
  free: "Unclaimed", select: "Select", elite: "Verified Pro",
};

function tierCounts() {
  const counts: Record<string, number> = { elite: 0, select: 0, free: 0 };
  COMPANIES.forEach((c) => { counts[c.tier] = (counts[c.tier] || 0) + 1; });
  return counts;
}

function categoryCounts() {
  const counts: Record<string, number> = {};
  COMPANIES.forEach((c) => { counts[c.category] = (counts[c.category] || 0) + 1; });
  return counts;
}

interface TopViewed {
  _id: string;
  views: number;
}

interface AnalyticsData {
  days: number;
  totalViews: number;
  topViewed: TopViewed[];
}

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "12px",
  border: "1px solid #E5E7EB",
  padding: "24px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

export default function DashboardPage() {
  const tiers = tierCounts();
  const catCounts = categoryCounts();
  const recent = [...COMPANIES].slice(0, 6);

  const [tab, setTab] = useState<"overview" | "analytics">("overview");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    if (tab !== "analytics") return;
    setAnalyticsLoading(true);
    setAnalyticsError("");
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setAnalyticsData(d);
      })
      .catch((e) => setAnalyticsError(e.message))
      .finally(() => setAnalyticsLoading(false));
  }, [tab, days]);

  const stats = [
    { label: "Total Listings", value: COMPANIES.length, sub: "All tiers", color: "#1A4A35", bg: "#E8F5EE" },
    { label: "Paid Listings", value: (tiers.elite || 0) + (tiers.select || 0), sub: "Verified Pro + Select", color: "#E8821E", bg: "#FEF3E2" },
    { label: "Categories", value: CATEGORIES.length, sub: "Industry verticals", color: "#2563EB", bg: "#EFF6FF" },
    { label: "Unclaimed", value: tiers.free || 0, sub: "Free tier listings", color: "#6B7280", bg: "#F3F4F6" },
  ];

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
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0D2818", margin: 0, fontFamily: "sans-serif" }}>
            Dashboard
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px", fontFamily: "sans-serif" }}>
            Overview of your NextCanna Connect directory
          </p>
        </div>
        <div style={{ display: "flex", gap: "4px", background: "#F3F4F6", borderRadius: "10px", padding: "4px" }}>
          <button style={tabStyle(tab === "overview")} onClick={() => setTab("overview")}>Overview</button>
          <button style={tabStyle(tab === "analytics")} onClick={() => setTab("analytics")}>Analytics</button>
        </div>
      </div>

      {tab === "overview" && (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
            {stats.map((s) => (
              <div
                key={s.label}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  borderTop: `3px solid ${s.color}`,
                }}
              >
                <div style={{ fontSize: "30px", fontWeight: "800", color: s.color, fontFamily: "sans-serif", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827", marginTop: "8px", fontFamily: "sans-serif" }}>
                  {s.label}
                </div>
                <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px", fontFamily: "sans-serif" }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px" }}>
            {/* Recent Companies */}
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: 0, fontFamily: "sans-serif" }}>
                  Recent Companies
                </h2>
                <Link href="/admin/companies" style={{ fontSize: "13px", color: "#1A4A35", textDecoration: "none", fontFamily: "sans-serif", fontWeight: "500" }}>
                  View all &rarr;
                </Link>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    {["Company", "Category", "Location", "Tier"].map((h) => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: "12px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", fontFamily: "sans-serif" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((c, i) => (
                    <tr key={c.id} style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: c.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "white", flexShrink: 0, fontFamily: "sans-serif" }}>
                            {c.logoPlaceholder}
                          </div>
                          <div>
                            <Link href={`/admin/companies/${c.slug}/edit`} style={{ fontSize: "13px", fontWeight: "600", color: "#111827", textDecoration: "none", fontFamily: "sans-serif" }}>
                              {c.name}
                            </Link>
                            <div style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "sans-serif" }}>
                              {c.website || c.email || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>
                        {CATEGORIES.find((cat) => cat.slug === c.category)?.shortLabel ?? c.category}
                      </td>
                      <td style={{ padding: "12px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>
                        {c.location.city}, {c.location.state}
                      </td>
                      <td style={{ padding: "12px 20px" }}>
                        <span style={{ fontSize: "11px", fontWeight: "600", textTransform: "capitalize", color: TIER_COLORS[c.tier] || "#6B7280", background: TIER_BG[c.tier] || "#F9FAFB", padding: "2px 8px", borderRadius: "20px", fontFamily: "sans-serif" }}>
                          {TIER_LABEL[c.tier] ?? c.tier}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tier breakdown */}
            <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", padding: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0 0 16px", fontFamily: "sans-serif" }}>
                Listings by Tier
              </h2>
              {Object.entries(tiers).map(([tier, count]) => (
                <div key={tier} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "13px", textTransform: "capitalize", fontWeight: "500", color: "#374151", fontFamily: "sans-serif" }}>
                      {TIER_LABEL[tier] ?? tier}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#111827", fontFamily: "sans-serif" }}>
                      {count}
                    </span>
                  </div>
                  <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(count / COMPANIES.length) * 100}%`, background: TIER_COLORS[tier] || "#6B7280", borderRadius: "3px" }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #F3F4F6" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#374151", margin: "0 0 12px", fontFamily: "sans-serif" }}>
                  Top Categories
                </h3>
                {Object.entries(catCounts)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([cat, count]) => (
                    <div key={cat} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F9FAFB" }}>
                      <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "sans-serif" }}>
                        {CATEGORIES.find((c) => c.slug === cat)?.shortLabel ?? cat}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#1A4A35", fontFamily: "sans-serif" }}>
                        {count}
                      </span>
                    </div>
                  ))}
              </div>

              <Link
                href="/admin/companies/new"
                style={{ display: "block", marginTop: "20px", padding: "10px", background: "#E8821E", color: "white", textAlign: "center", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: "600", fontFamily: "sans-serif" }}
              >
                + Add New Company
              </Link>
            </div>
          </div>
        </>
      )}

      {tab === "analytics" && (
        <>
          {/* Period selector */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px", background: "white", cursor: "pointer" }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>

          {analyticsLoading && (
            <div style={cardStyle}>
              <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>Loading analytics...</p>
            </div>
          )}

          {analyticsError && (
            <div style={{ ...cardStyle, borderColor: "#FECACA" }}>
              <p style={{ color: "#DC2626", fontSize: "14px", margin: 0 }}>{analyticsError}</p>
            </div>
          )}

          {analyticsData && !analyticsLoading && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                <div style={cardStyle}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Total Profile Views</p>
                  <p style={{ fontSize: "36px", fontWeight: 700, color: "#1A4A35", margin: 0 }}>{analyticsData.totalViews.toLocaleString()}</p>
                  <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "4px 0 0" }}>Last {analyticsData.days} days</p>
                </div>
                <div style={cardStyle}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Unique Profiles Viewed</p>
                  <p style={{ fontSize: "36px", fontWeight: 700, color: "#1A4A35", margin: 0 }}>{analyticsData.topViewed.length}</p>
                  <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "4px 0 0" }}>With at least 1 view</p>
                </div>
                <div style={cardStyle}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Avg Views / Profile</p>
                  <p style={{ fontSize: "36px", fontWeight: 700, color: "#1A4A35", margin: 0 }}>
                    {analyticsData.topViewed.length > 0 ? (analyticsData.totalViews / analyticsData.topViewed.length).toFixed(1) : "0"}
                  </p>
                  <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "4px 0 0" }}>Per active profile</p>
                </div>
              </div>

              <div style={cardStyle}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0D2818", margin: "0 0 20px" }}>Top Viewed Profiles</h2>
                {analyticsData.topViewed.length === 0 ? (
                  <p style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>No profile views recorded yet. Views will appear here once visitors start viewing vendor profiles.</p>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #E5E7EB" }}>
                          <th style={{ textAlign: "left", padding: "12px 16px", color: "#6B7280", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Rank</th>
                          <th style={{ textAlign: "left", padding: "12px 16px", color: "#6B7280", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vendor Slug</th>
                          <th style={{ textAlign: "right", padding: "12px 16px", color: "#6B7280", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Views</th>
                          <th style={{ textAlign: "right", padding: "12px 16px", color: "#6B7280", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>% of Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.topViewed.map((v, i) => (
                          <tr key={v._id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                            <td style={{ padding: "12px 16px", color: "#374151" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px", borderRadius: "50%", background: i < 3 ? "#E8F5EE" : "#F9FAFB", color: i < 3 ? "#1A4A35" : "#6B7280", fontWeight: 700, fontSize: "12px" }}>
                                {i + 1}
                              </span>
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <a href={`/vendor/${v._id}`} target="_blank" rel="noopener noreferrer" style={{ color: "#1A4A35", fontWeight: 500, textDecoration: "none" }}>
                                {v._id}
                              </a>
                            </td>
                            <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#111827" }}>{v.views.toLocaleString()}</td>
                            <td style={{ padding: "12px 16px", textAlign: "right", color: "#6B7280" }}>
                              {analyticsData.totalViews > 0 ? ((v.views / analyticsData.totalViews) * 100).toFixed(1) : 0}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
