"use client";
import { useEffect, useState } from "react";
import { PLAN_LABEL } from "@/lib/tier";

interface AdminInquiry {
  _id: string;
  vendorSlug: string;
  vendor: { name: string; tier: string } | null;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceNeeded?: string;
  message?: string;
  source?: string;
  vendorNotified?: boolean;
  createdAt: string;
}

const card: React.CSSProperties = { background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" };

export default function LeadsPage() {
  const [items, setItems] = useState<AdminInquiry[]>([]);
  const [stats, setStats] = useState({ total: 0, undelivered: 0, last30: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"all" | "undelivered" | "delivered">("all");
  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (query) params.set("q", query);
    let cancelled = false;
    fetch(`/api/admin/leads?${params}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setItems(data.inquiries ?? []);
        setStats(data.stats ?? { total: 0, undelivered: 0, last30: 0 });
        setError("");
      })
      .catch(() => !cancelled && setError("Couldn't load leads. Please refresh."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [status, query]);

  const tab = (key: typeof status, label: string) => (
    <button
      key={key}
      onClick={() => { setLoading(true); setStatus(key); }}
      style={{
        padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
        border: "none", background: status === key ? "#1A4A35" : "#F3F4F6", color: status === key ? "white" : "#374151",
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0D2818", margin: 0 }}>Leads</h1>
        <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
          Every inquiry buyers send through vendor profiles. &ldquo;Not delivered&rdquo; means the vendor had no usable email — forward those by hand.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Total inquiries", value: stats.total, color: "#1A4A35" },
          { label: "Last 30 days", value: stats.last30, color: "#1A4A35" },
          { label: "Not delivered to vendor", value: stats.undelivered, color: stats.undelivered ? "#B45309" : "#1A4A35" },
        ].map((s) => (
          <div key={s.label} style={{ ...card, padding: "16px 20px" }}>
            <div style={{ fontSize: "26px", fontWeight: 800, color: s.color }}>{s.value.toLocaleString()}</div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", marginBottom: "14px" }}>
        {tab("all", "All")}
        {tab("undelivered", "Not delivered")}
        {tab("delivered", "Delivered")}
        <form
          onSubmit={(e) => { e.preventDefault(); setLoading(true); setQuery(q.trim()); }}
          style={{ marginLeft: "auto", display: "flex", gap: "6px" }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search buyer, email, vendor, message…"
            aria-label="Search leads"
            style={{ padding: "8px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", minWidth: "260px" }}
          />
          <button type="submit" style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #D1D5DB", background: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>Search</button>
        </form>
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#9CA3AF" }}>Loading leads…</div>
        ) : error ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#B91C1C" }}>{error}</div>
        ) : items.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>📋</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", margin: 0 }}>No leads {query || status !== "all" ? "match these filters" : "yet"}</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ background: "#F9FAFB", textAlign: "left" }}>
                  {["Date", "Buyer", "Vendor", "Request", "Delivered"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((l) => (
                  <tr key={l._id} style={{ borderTop: "1px solid #F3F4F6", verticalAlign: "top" }}>
                    <td style={{ padding: "12px 16px", color: "#6B7280", whiteSpace: "nowrap" }}>
                      {new Date(l.createdAt).toLocaleDateString()}
                      <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{new Date(l.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>{l.name}{l.company ? <span style={{ fontWeight: 400, color: "#6B7280" }}> · {l.company}</span> : null}</div>
                      <a href={`mailto:${l.email}`} style={{ color: "#1A4A35" }}>{l.email}</a>
                      {l.phone && <div style={{ color: "#6B7280" }}>{l.phone}</div>}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <a href={`/vendor/${l.vendorSlug}`} target="_blank" rel="noreferrer" style={{ color: "#1A4A35", fontWeight: 600 }}>
                        {l.vendor?.name ?? l.vendorSlug} ↗
                      </a>
                      {l.vendor && <div style={{ fontSize: "11px", color: "#9CA3AF", textTransform: "capitalize" }}>{PLAN_LABEL[l.vendor.tier] ?? l.vendor.tier}</div>}
                    </td>
                    <td style={{ padding: "12px 16px", maxWidth: "360px" }}>
                      {l.serviceNeeded && <div style={{ fontWeight: 600, color: "#1A4A35" }}>{l.serviceNeeded}</div>}
                      {l.message ? (
                        <div style={{ color: "#374151", whiteSpace: "pre-wrap" }}>
                          {open === l._id || l.message.length <= 140 ? l.message : `${l.message.slice(0, 140)}…`}
                          {l.message.length > 140 && (
                            <button onClick={() => setOpen(open === l._id ? null : l._id)} style={{ marginLeft: "6px", background: "none", border: "none", color: "#1A4A35", fontWeight: 600, cursor: "pointer", fontSize: "12px" }}>
                              {open === l._id ? "Less" : "More"}
                            </button>
                          )}
                        </div>
                      ) : !l.serviceNeeded ? <span style={{ color: "#9CA3AF" }}>—</span> : null}
                      {l.source && l.source !== "profile" && <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>{l.source}</div>}
                    </td>
                    <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                      {l.vendorNotified ? (
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#166534", background: "#DCFCE7", padding: "3px 10px", borderRadius: "20px" }}>Emailed</span>
                      ) : (
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "3px 10px", borderRadius: "20px" }}>Not delivered</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
