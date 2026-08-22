"use client";

import { useState, useEffect } from "react";

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

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0D2818", margin: 0 }}>Profile Analytics</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>Track which vendor profiles are getting the most views</p>
        </div>
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

      {loading && (
        <div style={cardStyle}>
          <p style={{ color: "#6B7280", fontSize: "14px", margin: 0 }}>Loading analytics...</p>
        </div>
      )}

      {error && (
        <div style={{ ...cardStyle, borderColor: "#FECACA" }}>
          <p style={{ color: "#DC2626", fontSize: "14px", margin: 0 }}>{error}</p>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div style={cardStyle}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Total Profile Views</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#1A4A35", margin: 0 }}>{data.totalViews.toLocaleString()}</p>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "4px 0 0" }}>Last {data.days} days</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Unique Profiles Viewed</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#1A4A35", margin: 0 }}>{data.topViewed.length}</p>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "4px 0 0" }}>With at least 1 view</p>
            </div>
            <div style={cardStyle}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px" }}>Avg Views / Profile</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#1A4A35", margin: 0 }}>
                {data.topViewed.length > 0 ? (data.totalViews / data.topViewed.length).toFixed(1) : "0"}
              </p>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: "4px 0 0" }}>Per active profile</p>
            </div>
          </div>

          {/* Top viewed table */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0D2818", margin: "0 0 20px" }}>Top Viewed Profiles</h2>
            {data.topViewed.length === 0 ? (
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
                    {data.topViewed.map((v, i) => (
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
                          {data.totalViews > 0 ? ((v.views / data.totalViews) * 100).toFixed(1) : 0}%
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
    </div>
  );
}
