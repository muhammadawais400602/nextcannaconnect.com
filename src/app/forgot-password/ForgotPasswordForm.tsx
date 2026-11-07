"use client";

import { useState } from "react";
import AuthCard, { authButtonStyle, authInputStyle, authLabelStyle } from "./AuthCard";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthCard title="Forgot your password?" subtitle="Enter the email you signed up with and we'll send you a link to choose a new one.">
      {message ? (
        <p role="status" style={{ background: "#E8F5EE", color: "#1A4A35", borderRadius: "10px", padding: "14px 16px", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
          {message} Check your spam folder if it doesn&apos;t arrive within a few minutes.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="fp-email" style={authLabelStyle}>Email</label>
            <input id="fp-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} style={authInputStyle} />
          </div>
          {error && <p role="alert" style={{ color: "#DC2626", fontSize: "13px", margin: 0 }}>{error}</p>}
          <button type="submit" disabled={sending} style={authButtonStyle(sending)}>
            {sending ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
