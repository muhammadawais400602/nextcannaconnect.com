"use client";

import type { VendorInquiry } from "./useVendorLeads";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function InquiryList({
  inquiries,
  loading,
  error,
  limit,
}: {
  inquiries: VendorInquiry[];
  loading: boolean;
  error: boolean;
  limit?: number;
}) {
  const empty = { textAlign: "center" as const, padding: "24px", color: "#9CA3AF", fontSize: "13px" };
  if (loading) return <div style={empty}>Loading inquiries…</div>;
  if (error) return <div style={empty}>Couldn&apos;t load inquiries. Please refresh the page.</div>;
  if (!inquiries.length) {
    return (
      <div style={empty}>
        No inquiries yet. When buyers contact you through your listing, they&apos;ll appear here and
        you&apos;ll get an email.
      </div>
    );
  }
  const shown = limit ? inquiries.slice(0, limit) : inquiries;
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
      {shown.map((q) => (
        <li key={q._id} style={{ border: "1px solid #E5E7EB", borderRadius: "8px", padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
            <strong style={{ fontSize: "14px", color: "#0D2818" }}>
              {q.name}
              {q.company ? <span style={{ fontWeight: 400, color: "#6B7280" }}> · {q.company}</span> : null}
            </strong>
            <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{formatDate(q.createdAt)}</span>
          </div>
          {q.serviceNeeded && (
            <p style={{ fontSize: "12px", color: "#1A4A35", margin: "4px 0 0", fontWeight: 600 }}>{q.serviceNeeded}</p>
          )}
          {q.message && (
            <p style={{ fontSize: "13px", color: "#374151", margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{q.message}</p>
          )}
          <p style={{ fontSize: "13px", margin: "8px 0 0", display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <a href={`mailto:${q.email}`} style={{ color: "#1A4A35", fontWeight: 600 }}>{q.email}</a>
            {q.phone && <a href={`tel:${q.phone}`} style={{ color: "#1A4A35" }}>{q.phone}</a>}
          </p>
        </li>
      ))}
    </ul>
  );
}
