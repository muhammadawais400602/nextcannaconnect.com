"use client";

import { useState } from "react";
import HoneypotField from "@/components/ui/HoneypotField";
import { HONEYPOT_FIELD } from "@/lib/formGuard";

const DF = "#003320";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "white",
  border: `1px solid ${PARCHMENT}`,
  borderRadius: "0.25rem",
  padding: "10px 12px",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
  color: "#1b1c1b",
};

const labelStyle: React.CSSProperties = { display: "block", fontSize: "14px", fontWeight: 500, color: DF, marginBottom: "4px" };

export default function TransportQuoteForm({ companyName, vendorSlug }: { companyName: string; vendorSlug: string }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [trap, setTrap] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorSlug,
          name,
          email,
          phone: phone || undefined,
          serviceNeeded: "Transport quote",
          message: `Pickup: ${pickup}\nDropoff: ${dropoff}${details ? `\n\n${details}` : ""}`,
          source: "transport-quote",
          [HONEYPOT_FIELD]: trap,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send your request.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ background: "white", borderRadius: "0.5rem", border: `1px solid ${PARCHMENT}`, padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 16px" }}>Request a Quote</h3>
      {sent ? (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>Request Sent</div>
          <div style={{ fontSize: "13px", color: VARIANT }}>We sent your request to {companyName}. They&apos;ll reply to you by email.</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
          <div>
            <label htmlFor="tq-pickup" style={labelStyle}>Pickup Location</label>
            <input id="tq-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} required maxLength={120} placeholder="Zip or City" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="tq-dropoff" style={labelStyle}>Dropoff Location</label>
            <input id="tq-dropoff" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required maxLength={120} placeholder="Zip or City" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="tq-name" style={labelStyle}>Your Name</label>
            <input id="tq-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} autoComplete="name" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="tq-email" style={labelStyle}>Email</label>
            <input id="tq-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={200} autoComplete="email" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="tq-phone" style={labelStyle}>Phone (optional)</label>
            <input id="tq-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={40} autoComplete="tel" style={inputStyle} />
          </div>
          <div>
            <label htmlFor="tq-details" style={labelStyle}>Load details (optional)</label>
            <textarea id="tq-details" value={details} onChange={(e) => setDetails(e.target.value)} maxLength={2000} rows={3} placeholder="Product type, quantity, pickup date…" style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <HoneypotField value={trap} onChange={setTrap} />
          {error && <p role="alert" style={{ color: "#B91C1C", fontSize: "13px", margin: 0 }}>{error}</p>}
          <button type="submit" disabled={sending} style={{ width: "100%", background: DF, color: "white", border: "none", borderRadius: "0.25rem", padding: "12px 16px", fontSize: "14px", fontWeight: 500, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, marginTop: "4px" }}>
            {sending ? "Sending…" : "Start Request"}
          </button>
        </form>
      )}
    </div>
  );
}
