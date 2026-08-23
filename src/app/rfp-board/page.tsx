"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

interface RFPItem {
  _id: string;
  title: string;
  categorySlug: string;
  budget?: string;
  location: { city?: string; state?: string };
  deadline?: string;
  responseCount: number;
  status: string;
  createdAt: string;
  postedByName?: string;
}

const CATEGORY_LABELS: Record<string, string> = {};
for (const cat of CATEGORIES) {
  CATEGORY_LABELS[cat.slug] = cat.label;
}

export default function RFPBoardPage() {
  const [rfps, setRfps] = useState<RFPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [userTier, setUserTier] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/vendor-me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUserTier(data.user.tier ?? "free");
      })
      .catch(() => {});

    const url = filter ? `/api/rfp?category=${filter}` : "/api/rfp";
    fetch(url)
      .then((r) => r.json())
      .then((data) => setRfps(data.rfps ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const gated = !userTier || userTier === "free";

  return (
    <div style={{ backgroundColor: "#F7F9F7", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ background: "#1C3B2D", padding: "100px 20px 60px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: "#88B99E", marginBottom: "10px" }}>
          RFP BOARD
        </p>
        <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 700, color: "white", marginBottom: "10px" }}>
          Cannabis Industry RFPs
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
          Browse open Requests for Proposals from buyers across the cannabis industry.
        </p>
      </section>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px 80px" }}>
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setLoading(true); }}
            style={{
              padding: "10px 14px", border: "1px solid #E5E7EB", borderRadius: "8px",
              fontSize: "13px", color: "#374151", background: "white", cursor: "pointer",
            }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.label}</option>
            ))}
          </select>

          {userTier && (
            <Link
              href="/rfp-board/post"
              style={{
                padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700,
                background: "#1A4A35", color: "white", textDecoration: "none",
              }}
            >
              Post an RFP
            </Link>
          )}
        </div>

        {/* Tier gate */}
        {gated && (
          <div style={{
            background: "white", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "40px 28px",
            textAlign: "center", marginBottom: "24px",
          }}>
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</div>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0D2818", marginBottom: "8px" }}>
              RFP Board Access Required
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, marginBottom: "20px", maxWidth: "420px", margin: "0 auto 20px" }}>
              Upgrade to Select ($49.99/mo) or Verified Pro ($99/mo) to view and respond to RFPs from buyers in your category.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/vendor/login" style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, border: "1px solid #1A4A35", color: "#1A4A35", textDecoration: "none" }}>
                Sign In
              </Link>
              <Link href="/pricing" style={{ padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, background: "#1A4A35", color: "white", textDecoration: "none" }}>
                View Plans
              </Link>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && !gated && (
          <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "14px" }}>
            Loading RFPs...
          </div>
        )}

        {/* RFP list */}
        {!loading && !gated && rfps.length === 0 && (
          <div style={{
            background: "white", borderRadius: "14px", border: "1px solid #E5E7EB",
            padding: "48px 28px", textAlign: "center",
          }}>
            <p style={{ fontSize: "15px", color: "#6B7280" }}>No open RFPs right now. Check back soon or post your own.</p>
          </div>
        )}

        {!loading && !gated && rfps.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {rfps.map((rfp) => {
              const catLabel = CATEGORY_LABELS[rfp.categorySlug] || rfp.categorySlug;
              const loc = [rfp.location?.city, rfp.location?.state].filter(Boolean).join(", ");
              const deadline = rfp.deadline ? new Date(rfp.deadline).toLocaleDateString() : null;
              return (
                <Link
                  key={rfp._id}
                  href={`/rfp-board/${rfp._id}`}
                  style={{
                    display: "block", textDecoration: "none",
                    background: "white", borderRadius: "12px", border: "1px solid #E5E7EB",
                    padding: "20px 24px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
                          padding: "3px 8px", borderRadius: "5px",
                          background: "rgba(26,74,53,0.08)", color: "#1A4A35",
                        }}>
                          {catLabel}
                        </span>
                        {deadline && (
                          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>
                            Due {deadline}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                        {rfp.title}
                      </h3>
                      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", fontSize: "12px", color: "#6B7280" }}>
                        {loc && <span>{loc}</span>}
                        {rfp.budget && <span>Budget: {rfp.budget}</span>}
                        <span>{rfp.responseCount} response{rfp.responseCount !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    <span style={{
                      fontSize: "12px", fontWeight: 600, color: "#1A4A35",
                      whiteSpace: "nowrap", paddingTop: "4px",
                    }}>
                      View &amp; Respond &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
