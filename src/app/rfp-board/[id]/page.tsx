"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

interface RFPDetail {
  _id: string;
  title: string;
  description: string;
  categorySlug: string;
  budget?: string;
  location: { city?: string; state?: string };
  deadline?: string;
  postedByName?: string;
  createdAt: string;
  status: string;
  responses: {
    companyName: string;
    message: string;
    submittedAt: string;
    tier: string;
  }[];
}

const CATEGORY_LABELS: Record<string, string> = {};
for (const cat of CATEGORIES) CATEGORY_LABELS[cat.slug] = cat.label;

const TIER_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  elite: { label: "VERIFIED PRO", bg: "#1A4A35", color: "white" },
  select: { label: "SELECT", bg: "#185FA5", color: "white" },
};

export default function RFPDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [rfp, setRfp] = useState<RFPDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [submitErr, setSubmitErr] = useState("");

  useEffect(() => {
    fetch("/api/auth/vendor-me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUserTier(data.user.tier ?? "free");
      })
      .catch(() => {});

    fetch(`/api/rfp/${id}`)
      .then((r) => r.json())
      .then((data) => setRfp(data.rfp ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleRespond(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setSubmitMsg("");
    setSubmitErr("");
    try {
      const res = await fetch(`/api/rfp/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setSubmitMsg("Response submitted successfully!");
      setMessage("");
      // Refresh
      const updated = await fetch(`/api/rfp/${id}`).then((r) => r.json());
      if (updated.rfp) setRfp(updated.rfp);
    } catch (err) {
      setSubmitErr(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#F7F9F7", minHeight: "100vh", padding: "120px 20px", textAlign: "center" }}>
        <p style={{ color: "#9CA3AF", fontSize: "14px" }}>Loading...</p>
      </div>
    );
  }

  if (!rfp) {
    return (
      <div style={{ backgroundColor: "#F7F9F7", minHeight: "100vh", padding: "120px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "20px", color: "#374151", marginBottom: "12px" }}>RFP Not Found</h1>
        <Link href="/rfp-board" style={{ color: "#1A4A35", fontWeight: 600, textDecoration: "none" }}>
          &larr; Back to RFP Board
        </Link>
      </div>
    );
  }

  const canRespond = userTier === "select" || userTier === "elite";
  const loc = [rfp.location?.city, rfp.location?.state].filter(Boolean).join(", ");
  const deadline = rfp.deadline ? new Date(rfp.deadline).toLocaleDateString() : null;
  const catLabel = CATEGORY_LABELS[rfp.categorySlug] || rfp.categorySlug;

  return (
    <div style={{ backgroundColor: "#F7F9F7", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 20px 80px" }}>
        <Link href="/rfp-board" style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 600, display: "inline-block", marginBottom: "20px" }}>
          &larr; Back to RFP Board
        </Link>

        {/* RFP detail */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "28px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", padding: "3px 8px", borderRadius: "5px", background: "rgba(26,74,53,0.08)", color: "#1A4A35" }}>
              {catLabel}
            </span>
            <span style={{
              fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "5px",
              background: rfp.status === "open" ? "#DEF7EC" : "#FEE2E2",
              color: rfp.status === "open" ? "#065F46" : "#991B1B",
            }}>
              {rfp.status.toUpperCase()}
            </span>
          </div>

          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0D2818", marginBottom: "12px" }}>
            {rfp.title}
          </h1>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>
            {rfp.postedByName && <span>Posted by {rfp.postedByName}</span>}
            {loc && <span>{loc}</span>}
            {rfp.budget && <span>Budget: {rfp.budget}</span>}
            {deadline && <span>Deadline: {deadline}</span>}
            <span>Posted {new Date(rfp.createdAt).toLocaleDateString()}</span>
          </div>

          <div style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {rfp.description}
          </div>
        </div>

        {/* Response form */}
        {canRespond && rfp.status === "open" && (
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "28px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0D2818", marginBottom: "14px" }}>
              Submit Your Response
            </h2>
            <form onSubmit={handleRespond}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe how your company can fulfill this RFP..."
                rows={5}
                required
                style={{
                  width: "100%", padding: "12px 14px", border: "1px solid #E5E7EB", borderRadius: "8px",
                  fontSize: "14px", color: "#111827", resize: "vertical", marginBottom: "12px",
                  boxSizing: "border-box", outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "12px 24px", background: "#1A4A35", color: "white", border: "none",
                  borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Submitting..." : "Submit Response"}
              </button>
              {submitMsg && <p style={{ color: "#16A34A", fontSize: "13px", marginTop: "8px" }}>{submitMsg}</p>}
              {submitErr && <p style={{ color: "#DC2626", fontSize: "13px", marginTop: "8px" }}>{submitErr}</p>}
            </form>
          </div>
        )}

        {!canRespond && userTier !== null && (
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "28px", textAlign: "center", marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "14px" }}>
              Upgrade to Select or Verified Pro to respond to RFPs.
            </p>
            <Link href="/pricing" style={{ fontSize: "13px", fontWeight: 700, color: "#1A4A35", textDecoration: "none" }}>
              View Plans &rarr;
            </Link>
          </div>
        )}

        {/* Responses */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0D2818", marginBottom: "14px" }}>
            Responses ({rfp.responses.length})
          </h2>
          {rfp.responses.length === 0 ? (
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E5E7EB", padding: "24px", textAlign: "center", color: "#9CA3AF", fontSize: "14px" }}>
              No responses yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {rfp.responses.map((resp, i) => {
                const badge = TIER_BADGE[resp.tier];
                return (
                  <div key={i} style={{ background: "white", borderRadius: "12px", border: "1px solid #E5E7EB", padding: "20px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                        {resp.companyName}
                      </span>
                      {badge && (
                        <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", padding: "2px 7px", borderRadius: "4px", background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      )}
                      <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                        {new Date(resp.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {resp.message}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
