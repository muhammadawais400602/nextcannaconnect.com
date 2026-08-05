"use client";

import { useState } from "react";

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

export default function TransportQuoteForm({ companyName }: { companyName: string }) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  }

  return (
    <div style={{ background: "white", borderRadius: "0.5rem", border: `1px solid ${PARCHMENT}`, padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 16px" }}>Request a Quote</h3>
      {sent ? (
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>✅</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>Request Sent</div>
          <div style={{ fontSize: "13px", color: VARIANT }}>{companyName} will respond with a transport quote shortly.</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: DF, marginBottom: "4px" }}>Pickup Location</label>
            <input value={pickup} onChange={(e) => setPickup(e.target.value)} required placeholder="Zip or City" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: DF, marginBottom: "4px" }}>Dropoff Location</label>
            <input value={dropoff} onChange={(e) => setDropoff(e.target.value)} required placeholder="Zip or City" style={inputStyle} />
          </div>
          <button type="submit" disabled={sending} style={{ width: "100%", background: DF, color: "white", border: "none", borderRadius: "0.25rem", padding: "12px 16px", fontSize: "14px", fontWeight: 500, cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.7 : 1, marginTop: "4px" }}>
            {sending ? "Sending…" : "Start Request"}
          </button>
          <p style={{ textAlign: "center", fontSize: "12px", color: VARIANT, margin: 0 }}>Response time: Usually within 2 hours</p>
        </form>
      )}
    </div>
  );
}
