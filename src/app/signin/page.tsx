"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/vendor-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid email or password");
      window.location.href = "/vendor/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0eeea",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(80px, 12vw, 120px) 16px 60px",
      }}
    >
      {/* Card */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "4px",
          padding: "clamp(28px, 6vw, 56px) clamp(20px, 6vw, 48px)",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "28px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          Welcome Back
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            color: "#6B7280",
            lineHeight: 1.6,
            marginBottom: "40px",
          }}
        >
          Access your account to make updates.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Member&apos;s Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@firm.com"
              required
              style={{
                width: "100%",
                padding: "13px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                color: "#111827",
                backgroundColor: "#fafafa",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#003320"; e.currentTarget.style.backgroundColor = "white"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "#374151",
                }}
              >
                Password
              </label>
              <Link
                href="/signin"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#374151",
                  textDecoration: "none",
                }}
              >
                Forgot Password
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              style={{
                width: "100%",
                padding: "13px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                color: "#111827",
                backgroundColor: "#fafafa",
                outline: "none",
                boxSizing: "border-box",
                letterSpacing: "0.2em",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#003320"; e.currentTarget.style.backgroundColor = "white"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.backgroundColor = "#fafafa"; }}
            />
          </div>

          {error && (
            <p style={{ color: "#DC2626", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>{error}</p>
          )}
          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: "#003320",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#1a4a35"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#003320"; }}
          >
            {loading ? "Signing in…" : "Sign In to your Account"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#f3f4f6", margin: "36px 0" }} />

        {/* Register */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "#9CA3AF",
              marginBottom: "10px",
            }}
          >
            Interested in Joining?
          </p>
          <Link
            href="/signup"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: "#111827",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Request Membership →
          </Link>
        </div>
      </div>

    </div>
  );
}
