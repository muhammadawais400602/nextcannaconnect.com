"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard, { authButtonStyle, authInputStyle, authLabelStyle } from "../forgot-password/AuthCard";

export default function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const router = useRouter();
  const [valid, setValid] = useState<boolean | null>(token ? null : false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => {
        setValid(!!d.valid);
        setEmail(d.email ?? "");
      })
      .catch(() => setValid(false));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
      setTimeout(() => router.push("/signin"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (valid === null) {
    return <AuthCard title="Reset your password"><p style={{ color: "#6B7280", fontSize: "14px" }}>Checking your link…</p></AuthCard>;
  }
  if (!valid) {
    return (
      <AuthCard title="This link has expired" subtitle="Password reset links work for one hour and can only be used once.">
        <Link href="/forgot-password" style={{ ...authButtonStyle(false), display: "block", textAlign: "center", textDecoration: "none" }}>
          Send a new link
        </Link>
      </AuthCard>
    );
  }
  if (done) {
    return (
      <AuthCard title="Password updated" subtitle="You've been signed out on other devices. Taking you to sign in…">
        <Link href="/signin" style={{ color: "#1A4A35", fontWeight: 600 }}>Sign in now</Link>
      </AuthCard>
    );
  }
  return (
    <AuthCard title="Choose a new password" subtitle={email ? `For ${email}` : undefined}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <label htmlFor="rp-new" style={authLabelStyle}>New password</label>
          <input id="rp-new" type="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={authInputStyle} />
        </div>
        <div>
          <label htmlFor="rp-confirm" style={authLabelStyle}>Confirm password</label>
          <input id="rp-confirm" type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={authInputStyle} />
        </div>
        {error && <p role="alert" style={{ color: "#DC2626", fontSize: "13px", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={saving} style={authButtonStyle(saving)}>
          {saving ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
