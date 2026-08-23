"use client";

import TierGate from "./TierGate";
import { cardStyle } from "./shared";

export default function AnalyticsTab({ tier }: { tier: string }) {
  if (tier !== "elite") {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>🔒</span>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1A4A35", marginBottom: "8px" }}>
            Verified Pro Feature
          </h2>
          <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "20px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
            Upgrade to Verified Pro to access the full analytics dashboard — profile views, inquiries, search appearances, and click-through rate.
          </p>
          <a
            href="/pricing"
            style={{
              display: "inline-block",
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
              background: "#1A4A35",
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: "8px",
            }}
          >
            View Plans →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Profile Views", value: "—", sub: "Total" },
          { label: "Inquiries", value: "—", sub: "Total" },
          { label: "Search Appearances", value: "—", sub: "Last 30 days" },
          { label: "Click-through Rate", value: "—", sub: "Views / Appearances" },
        ].map((s) => (
          <div key={s.label} style={{ ...cardStyle, padding: "16px 18px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 8px" }}>
              {s.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 800, color: "#0D2818", margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A4A35", marginBottom: "14px" }}>
          Profile Views Over Time
        </h3>
        <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "13px", border: "1px dashed #E5E7EB", borderRadius: "8px" }}>
          Chart data will populate as visitors view your listing.
        </div>
      </div>

      {/* Inquiries table */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A4A35", marginBottom: "14px" }}>
          Recent Inquiries
        </h3>
        <div style={{ textAlign: "center", padding: "24px", color: "#9CA3AF", fontSize: "13px" }}>
          No inquiries yet.
        </div>
      </div>
    </div>
  );
}
