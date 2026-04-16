"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function SetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [info, setInfo] = useState<{ email: string; fullName: string; companyName: string } | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { setTokenValid(false); return; }
    fetch(`/api/auth/set-password?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        setTokenValid(d.valid);
        if (d.valid) setInfo({ email: d.email, fullName: d.fullName, companyName: d.companyName });
      })
      .catch(() => setTokenValid(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
      setTimeout(() => router.push("/vendor/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "11px 14px", border: "1px solid #E8EDE8",
    borderRadius: "8px", fontSize: "14px", color: "#1A2E1A",
    backgroundColor: "white", outline: "none", boxSizing: "border-box",
  };

  if (tokenValid === null) {
    return <div style={{ textAlign: "center", color: "#6B7280", fontSize: "14px" }}>Verifying your link…</div>;
  }

  if (!tokenValid) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1A4A35", marginBottom: "8px" }}>Link Expired or Invalid</h2>
        <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.6, marginBottom: "20px" }}>
          This password setup link has expired or already been used.<br />
          Please contact <a href="mailto:hello@nextcannaconnect.com" style={{ color: "#1A4A35" }}>hello@nextcannaconnect.com</a> for a new link.
        </p>
        <Link href="/" style={{ color: "#1A4A35", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", background: "#1A4A35", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px", color: "white" }}>✓</div>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1A4A35", marginBottom: "8px" }}>Password Set!</h2>
        <p style={{ color: "#6B7280", fontSize: "14px" }}>Redirecting you to login…</p>
      </div>
    );
  }

  return (
    <div>
      {info && (
        <div style={{ background: "#E8F5EE", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px", fontSize: "13px", color: "#1A4A35" }}>
          Setting up account for <strong>{info.companyName || info.fullName}</strong> · {info.email}
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A5E4A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
            New Password
          </label>
          <input
            required type="password" minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#4A5E4A", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
            Confirm Password
          </label>
          <input
            required type="password"
            placeholder="Repeat your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={inputStyle}
          />
        </div>
        {error && <p style={{ color: "#DC2626", fontSize: "13px", margin: 0 }}>{error}</p>}
        <button
          type="submit" disabled={submitting}
          style={{ width: "100%", padding: "13px", background: "#1A4A35", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, marginTop: "4px" }}
        >
          {submitting ? "Saving…" : "Set Password & Activate Account"}
        </button>
      </form>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F9F7", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#1A4A35", fontFamily: "serif" }}>NextCanna Connect</div>
          </Link>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1A4A35", margin: "16px 0 6px" }}>Set Your Password</h1>
          <p style={{ fontSize: "14px", color: "#6B7280" }}>Choose a secure password to activate your vendor account.</p>
        </div>
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: "1px solid #E8EDE8" }}>
          <Suspense fallback={<div style={{ color: "#6B7280", fontSize: "14px" }}>Loading…</div>}>
            <SetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
