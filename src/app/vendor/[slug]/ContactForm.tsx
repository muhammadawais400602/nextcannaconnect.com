"use client";

import { useState } from "react";

interface Props {
  companyName: string;
  serviceTags: string[];
}

export default function ContactForm({ companyName, serviceTags }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  }

  if (sent) {
    return (
      <div style={{ background: "white", borderRadius: "12px", padding: "28px", border: "1px solid #E5E7EB", marginBottom: "16px", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
        <div style={{ fontSize: "15px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>Inquiry Sent</div>
        <div style={{ fontSize: "13px", color: "#6B7280" }}>{companyName} will respond shortly.</div>
      </div>
    );
  }

  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "28px", border: "1px solid #E5E7EB", marginBottom: "16px" }}>
      <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>
        Contact {companyName}
      </h3>
      <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px", lineHeight: 1.5 }}>
        Request a bespoke quote or technical consultation.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
            Full Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jonathan Sterling"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#111827" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
            Corporate Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="j.sterling@enterprise.com"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#111827" }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
            Phone Number
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+1 (415) 555-0123"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", outline: "none", boxSizing: "border-box", color: "#111827" }}
          />
        </div>
        {serviceTags.length > 0 && (
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>
              Service Needed
            </label>
            <select
              value={form.service}
              onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", outline: "none", background: "white", color: "#111827", boxSizing: "border-box" }}
            >
              <option value="">Select a service...</option>
              {serviceTags.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}
        <button
          type="submit"
          disabled={sending}
          style={{ width: "100%", padding: "13px", background: "#003320", color: "white", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, marginTop: "4px" }}
        >
          {sending ? "Sending..." : "Send Inquiry"}
        </button>
        <p style={{ fontSize: "12px", color: "#9CA3AF", textAlign: "center", marginTop: "2px" }}>
          Priority response for ISO-certified partners.
        </p>
      </form>
    </div>
  );
}
