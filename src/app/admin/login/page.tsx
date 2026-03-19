"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0D1F14 0%, #1A4A35 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "48px",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              background: "#1A4A35",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "24px",
              fontWeight: "700",
              color: "white",
              fontFamily: "sans-serif",
            }}
          >
            N
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#0D2818",
              fontFamily: "sans-serif",
              marginBottom: "4px",
            }}
          >
            NextCanna Connect
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", fontFamily: "sans-serif" }}>
            Super Admin Portal
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "6px",
                fontFamily: "sans-serif",
              }}
            >
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your admin password"
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                border: error ? "1px solid #EF4444" : "1px solid #D1D5DB",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "sans-serif",
                outline: "none",
                boxSizing: "border-box",
                color: "#111827",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#EF4444",
                fontSize: "13px",
                fontFamily: "sans-serif",
                marginBottom: "16px",
                background: "#FEF2F2",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #FECACA",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#9CA3AF" : "#1A4A35",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "sans-serif",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
