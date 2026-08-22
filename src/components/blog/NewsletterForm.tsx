"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "blog" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      } else {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "12px 0" }}>
        <p style={{ fontSize: "15px", fontWeight: 600, color: "rgba(136,185,158,0.9)", fontFamily: "'Inter', sans-serif" }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "12px", maxWidth: "440px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
        placeholder="professional@company.com"
        required
        style={{
          flex: 1,
          minWidth: "220px",
          padding: "12px 16px",
          borderRadius: "8px",
          border: status === "error" ? "1px solid #EF4444" : "1px solid rgba(136,185,158,0.3)",
          backgroundColor: "rgba(255,255,255,0.07)",
          color: "white",
          fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          padding: "12px 24px",
          backgroundColor: "white",
          color: "#003320",
          border: "none",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.05em",
          fontFamily: "'Inter', sans-serif",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          opacity: status === "loading" ? 0.7 : 1,
        }}
      >
        {status === "loading" ? "Subscribing..." : "Subscribe"}
      </button>
      {status === "error" && (
        <p style={{ width: "100%", fontSize: "12px", color: "#EF4444", fontFamily: "'Inter', sans-serif", margin: "4px 0 0", textAlign: "center" }}>
          {message}
        </p>
      )}
    </form>
  );
}
