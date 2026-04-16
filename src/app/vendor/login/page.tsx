"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      router.push("/vendor/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "1px solid #E8EDE8",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1A2E1A",
    backgroundColor: "white",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F9F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#1A4A35", fontFamily: "serif" }}>
              NextCanna Connect
            </div>
          </Link>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1A4A35", margin: "16px 0 6px" }}>
            Vendor Login
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280" }}>
            Sign in to manage your business listing
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            border: "1px solid #E8EDE8",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#4A5E4A",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                }}
              >
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                autoComplete="email"
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#4A5E4A",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <input
                required
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "#DC2626",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                background: "#1A4A35",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: "4px",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#6B7280" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={{ color: "#1A4A35", fontWeight: 600, textDecoration: "none" }}>
              Apply to list your business
            </Link>
          </div>
        </div>

        {/* Help text */}
        <p style={{ textAlign: "center", fontSize: "12px", color: "#9CA3AF", marginTop: "20px" }}>
          Having trouble?{" "}
          <a href="mailto:hello@nextcannaconnect.com" style={{ color: "#1A4A35", textDecoration: "none" }}>
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
