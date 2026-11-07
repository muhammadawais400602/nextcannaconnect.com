"use client";

import { cardStyle } from "./shared";
import { useVendorLeads } from "./useVendorLeads";
import InquiryList from "./InquiryList";

export default function AnalyticsTab({ tier }: { tier: string }) {
  if (tier !== "elite") return <AnalyticsLocked />;
  return <AnalyticsDashboard />;
}

function AnalyticsLocked() {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <span style={{ fontSize: "32px", display: "block", marginBottom: "12px" }}>🔒</span>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1A4A35", marginBottom: "8px" }}>
            Verified Pro Feature
          </h2>
          <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "20px", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
            Upgrade to Verified Pro to access the full analytics dashboard — profile views over time and your complete inquiry history.
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

function AnalyticsDashboard() {
  const { inquiries, stats, loading, error } = useVendorLeads();
  const fmt = (n: number | undefined) => (loading ? "…" : (n ?? 0).toLocaleString());
  const days = stats?.viewsByDay ?? [];
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Profile Views", value: fmt(stats?.views30), sub: "Last 30 days" },
          { label: "Profile Views", value: fmt(stats?.viewsTotal), sub: "All time" },
          { label: "Inquiries", value: fmt(stats?.inquiries30), sub: "Last 30 days" },
          { label: "Inquiries", value: fmt(stats?.inquiriesTotal), sub: "All time" },
        ].map((s) => (
          <div key={s.label + s.sub} style={{ ...cardStyle, padding: "16px 18px" }}>
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 8px" }}>
              {s.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 800, color: "#0D2818", margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A4A35", marginBottom: "14px" }}>
          Profile Views — Last 30 Days
        </h3>
        {days.length === 0 || days.every((d) => d.count === 0) ? (
          <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: "13px", border: "1px dashed #E5E7EB", borderRadius: "8px" }}>
            {loading ? "Loading…" : "No views yet. This chart fills in as buyers view your listing."}
          </div>
        ) : (
          <div role="img" aria-label={`Profile views per day for the last 30 days, ${stats?.views30 ?? 0} in total`} style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "160px" }}>
            {days.map((d) => (
              <div
                key={d.date}
                title={`${d.date}: ${d.count} view${d.count === 1 ? "" : "s"}`}
                style={{ flex: 1, height: `${Math.max(2, (d.count / max) * 100)}%`, background: d.count ? "#1A4A35" : "#E5E7EB", borderRadius: "3px 3px 0 0" }}
              />
            ))}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1A4A35", marginBottom: "14px" }}>
          All Inquiries
        </h3>
        <InquiryList inquiries={inquiries} loading={loading} error={error} />
      </div>
    </div>
  );
}
