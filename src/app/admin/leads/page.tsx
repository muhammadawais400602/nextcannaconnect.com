"use client";
import { useEffect, useState } from "react";

const TIER_COLORS: Record<string, string> = {
  elite: "#1A4A35", select: "#2563EB", claimed: "#7C3AED",
};
const TIER_BG: Record<string, string> = {
  elite: "#E8F5EE", select: "#EFF6FF", claimed: "#F5F3FF",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Lead = Record<string, any>;

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [empty, setEmpty] = useState(false);
  const [filter, setFilter] = useState<"all" | "charged" | "uncharged">("all");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter === "charged") params.set("charged", "true");
    if (filter === "uncharged") params.set("charged", "false");

    fetch(`/api/admin/leads?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setLeads(data.leads || []);
        setTotalRevenue(data.totalRevenue || 0);
        setEmpty(!data.leads || data.leads.length === 0);
        setLoading(false);
      })
      .catch(() => {
        setEmpty(true);
        setLoading(false);
      });
  }, [filter]);

  const charged = leads.filter((l) => l.charged).length;

  return (
    <div>
      <div style={{ marginBottom: "28px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0D2818", margin: 0, fontFamily: "sans-serif" }}>
            Leads
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px", fontFamily: "sans-serif" }}>
            Contact requests sent to vendors
          </p>
        </div>
        {!empty && (
          <div
            style={{
              background: "white", borderRadius: "12px", padding: "16px 20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", textAlign: "right",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#1A4A35", fontFamily: "sans-serif" }}>
              ${(totalRevenue / 100).toFixed(2)}
            </div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "sans-serif" }}>
              Total Revenue ({charged} charged)
            </div>
          </div>
        )}
      </div>

      {/* Filter */}
      {!empty && (
        <div
          style={{
            display: "flex", gap: "8px", marginBottom: "16px",
          }}
        >
          {(["all", "charged", "uncharged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setLoading(true); setFilter(f); }}
              style={{
                padding: "7px 16px",
                background: filter === f ? "#1A4A35" : "white",
                color: filter === f ? "white" : "#374151",
                border: "1px solid",
                borderColor: filter === f ? "#1A4A35" : "#D1D5DB",
                borderRadius: "8px", fontSize: "13px", fontWeight: "500",
                cursor: "pointer", fontFamily: "sans-serif", textTransform: "capitalize",
              }}
            >
              {f === "all" ? "All Leads" : f === "charged" ? "Charged" : "Pending Charge"}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          background: "white", borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "sans-serif" }}>
            Loading leads...
          </div>
        ) : empty ? (
          <div style={{ padding: "60px", textAlign: "center", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
              No leads yet
            </p>
            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>
              Leads will appear here when visitors contact vendors through the directory.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Sender", "Company Contacted", "Services", "Tier", "Fee", "Status", "Date"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px", textAlign: "left", fontSize: "11px",
                      fontWeight: "700", color: "#6B7280", textTransform: "uppercase",
                      letterSpacing: "0.05em", fontFamily: "sans-serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead._id} style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827", fontFamily: "sans-serif" }}>
                      {lead.senderName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "sans-serif" }}>
                      {lead.senderEmail}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "#374151", fontFamily: "sans-serif" }}>
                      {lead.senderCompany}
                    </div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "sans-serif" }}>
                      → {lead.companySlug}
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#6B7280", fontFamily: "sans-serif", maxWidth: "180px" }}>
                    {lead.servicesInterested?.join(", ") || "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px", fontWeight: "700", textTransform: "capitalize",
                        color: TIER_COLORS[lead.tier] || "#6B7280",
                        background: TIER_BG[lead.tier] || "#F9FAFB",
                        padding: "3px 10px", borderRadius: "20px", fontFamily: "sans-serif",
                      }}
                    >
                      {lead.tier}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", fontWeight: "600", color: "#111827", fontFamily: "sans-serif" }}>
                    ${(lead.leadFee / 100).toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px", fontWeight: "600",
                        color: lead.charged ? "#059669" : "#D97706",
                        background: lead.charged ? "#D1FAE5" : "#FEF3C7",
                        padding: "3px 10px", borderRadius: "20px", fontFamily: "sans-serif",
                      }}
                    >
                      {lead.charged ? "Charged" : "Pending"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "12px", color: "#9CA3AF", fontFamily: "sans-serif" }}>
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
