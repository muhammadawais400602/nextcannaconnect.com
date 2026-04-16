"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface VendorInfo {
  email: string;
  fullName: string;
  companyName?: string;
  tier: string;
}

const TIER_LABELS: Record<string, string> = {
  free: "Claimed (Free)",
  select: "Select",
  elite: "Verified Pro",
};

const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  free:   { bg: "#F3F4F6", color: "#6B7280" },
  select: { bg: "#EFF6FF", color: "#2563EB" },
  elite:  { bg: "#E8F5EE", color: "#1A4A35" },
};

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/vendor-me")
      .then((r) => {
        if (!r.ok) {
          window.location.href = "/vendor/login";
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setVendor(d.user);
        setLoading(false);
      })
      .catch(() => {
        window.location.href = "/vendor/login";
      });
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/vendor-logout", { method: "POST" });
    window.location.href = "/vendor/login";
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F9F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#6B7280", fontSize: "14px" }}>Loading…</div>
      </div>
    );
  }

  const tierStyle = TIER_COLORS[vendor?.tier ?? "free"];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9F7" }}>
      {/* Nav */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "0 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontSize: "18px", fontWeight: 800, color: "#1A4A35", fontFamily: "serif" }}>
            NextCanna Connect
          </Link>
          <button
            onClick={handleLogout}
            style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: "7px", padding: "6px 14px", fontSize: "13px", color: "#6B7280", cursor: "pointer" }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0D2818", margin: 0 }}>
              Welcome back, {vendor?.fullName?.split(" ")[0]}
            </h1>
            <span style={{ padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, ...tierStyle }}>
              {TIER_LABELS[vendor?.tier ?? "free"]}
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px" }}>
            {vendor?.companyName} · {vendor?.email}
          </p>
        </div>

        {/* Coming soon card */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "48px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚀</div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1A4A35", marginBottom: "8px" }}>
            Your Dashboard is Coming Soon
          </h2>
          <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, maxWidth: "420px", margin: "0 auto 24px" }}>
            We&apos;re building tools so you can manage your listing, update your profile, view analytics, and respond to leads — all in one place.
          </p>
          <Link
            href="/"
            style={{ display: "inline-block", background: "#1A4A35", color: "white", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
          >
            View Your Listing →
          </Link>
        </div>
      </div>
    </div>
  );
}
