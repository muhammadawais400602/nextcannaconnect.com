"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

export default function PostRFPPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [budget, setBudget] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/vendor-me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setAuthed(!!data.user))
      .catch(() => setAuthed(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/rfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, categorySlug, budget, city, state, deadline: deadline || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to post RFP");
      router.push("/rfp-board");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setSubmitting(false);
    }
  }

  if (authed === null) {
    return (
      <div style={{ backgroundColor: "#F7F9F7", minHeight: "100vh", padding: "120px 20px", textAlign: "center" }}>
        <p style={{ color: "#9CA3AF" }}>Loading...</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div style={{ backgroundColor: "#F7F9F7", minHeight: "100vh", padding: "120px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0D2818", marginBottom: "12px" }}>Sign In Required</h1>
        <p style={{ color: "#6B7280", fontSize: "14px", marginBottom: "20px" }}>You need to sign in to post an RFP.</p>
        <Link href="/vendor/login" style={{ padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 700, background: "#1A4A35", color: "white", textDecoration: "none" }}>
          Sign In
        </Link>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111827",
    background: "white",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: "11px",
    fontWeight: 700 as const,
    color: "#4A5E4A",
    textTransform: "uppercase" as const,
    letterSpacing: "0.8px",
    marginBottom: "5px",
  };

  return (
    <div style={{ backgroundColor: "#F7F9F7", minHeight: "100vh" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "100px 20px 80px" }}>
        <Link href="/rfp-board" style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 600, display: "inline-block", marginBottom: "20px" }}>
          &larr; Back to RFP Board
        </Link>

        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "32px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0D2818", marginBottom: "6px" }}>
            Post a Request for Proposal
          </h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "28px", lineHeight: 1.6 }}>
            Describe what you need and vendors in that category will see and respond to your RFP.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>RFP Title *</label>
              <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Need transport service for weekly flower deliveries" required maxLength={200} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Category *</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} required>
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Description *</label>
              <textarea
                style={{ ...inputStyle, resize: "vertical" }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you need, timeline, requirements..."
                rows={6}
                required
                maxLength={2000}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Budget (optional)</label>
                <input style={inputStyle} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $5,000-10,000" maxLength={100} />
              </div>
              <div>
                <label style={labelStyle}>Deadline (optional)</label>
                <input style={inputStyle} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
              <div>
                <label style={labelStyle}>City (optional)</label>
                <input style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Denver" />
              </div>
              <div>
                <label style={labelStyle}>State (optional)</label>
                <input style={inputStyle} value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. CO" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%", padding: "14px", background: "#1A4A35", color: "white", border: "none",
                borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Posting..." : "Post RFP"}
            </button>
            {error && <p style={{ color: "#DC2626", fontSize: "13px", marginTop: "8px" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
