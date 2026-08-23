"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TabNavigation, { type TabKey } from "./components/TabNavigation";
import DashboardTab from "./components/DashboardTab";
import ProfileTab from "./components/ProfileTab";
import ListingDetailsTab from "./components/ListingDetailsTab";
import MediaTab from "./components/MediaTab";
import AnalyticsTab from "./components/AnalyticsTab";
import AccountTab from "./components/AccountTab";
import { TIER_LABELS, TIER_COLORS } from "./components/shared";
import type { VendorUser, CompanyData } from "./components/shared";

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<VendorUser | null>(null);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [editingCompanyName, setEditingCompanyName] = useState(false);
  const [companyNameValue, setCompanyNameValue] = useState("");
  const [companyNameSaving, setCompanyNameSaving] = useState(false);

  function fetchData() {
    Promise.all([
      fetch("/api/auth/vendor-me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/vendor/company").then((r) => (r.ok ? r.json() : null)),
    ]).then(([meData, companyData]) => {
      if (!meData) {
        window.location.href = "/vendor/login";
        return;
      }
      setVendor(meData.user);
      setNameValue(meData.user?.fullName ?? "");
      if (companyData?.company) {
        setCompany(companyData.company as CompanyData);
        setCompanyNameValue(companyData.company.name ?? "");
      }
      setLoading(false);
    }).catch(() => {
      window.location.href = "/vendor/login";
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function saveName() {
    if (!nameValue.trim()) return;
    setNameSaving(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: nameValue.trim() }),
      });
      if (res.ok) {
        setVendor((v) => (v ? { ...v, fullName: nameValue.trim() } : v));
        setEditingName(false);
      }
    } finally {
      setNameSaving(false);
    }
  }

  async function saveCompanyName() {
    if (!companyNameValue.trim()) return;
    setCompanyNameSaving(true);
    try {
      const res = await fetch("/api/vendor/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: companyNameValue.trim() }),
      });
      if (res.ok) {
        setCompany((c) => (c ? { ...c, name: companyNameValue.trim() } : c));
        setEditingCompanyName(false);
      }
    } finally {
      setCompanyNameSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/vendor-logout", { method: "POST" });
    window.location.href = "/vendor/login";
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#F7F9F7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "3px solid #E5E7EB",
              borderTopColor: "#1A4A35",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Loading dashboard...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  if (!vendor) return null;

  const tierStyle = TIER_COLORS[vendor.tier] ?? TIER_COLORS.free;
  const tier = company?.tier ?? vendor.tier ?? "free";

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9F7" }}>
      {/* Nav bar */}
      <div
        style={{
          background: "white",
          borderBottom: "1px solid #E5E7EB",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            height: "58px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              fontSize: "17px",
              fontWeight: 800,
              color: "#1A4A35",
              fontFamily: "serif",
            }}
          >
            NextCanna Connect
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {company && (
              <Link
                href={`/vendor/${company.slug}`}
                target="_blank"
                style={{
                  fontSize: "13px",
                  color: "#1A4A35",
                  fontWeight: 600,
                  textDecoration: "none",
                  border: "1px solid #C6E0D0",
                  borderRadius: "7px",
                  padding: "5px 12px",
                }}
              >
                View Listing →
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "1px solid #E5E7EB",
                borderRadius: "7px",
                padding: "5px 12px",
                fontSize: "13px",
                color: "#6B7280",
                cursor: "pointer",
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              {editingName ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    autoFocus
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveName();
                      if (e.key === "Escape") setEditingName(false);
                    }}
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#0D2818",
                      border: "1px solid #C6E0D0",
                      borderRadius: "6px",
                      padding: "3px 8px",
                      outline: "none",
                      background: "white",
                    }}
                  />
                  <button
                    onClick={saveName}
                    disabled={nameSaving}
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "white",
                      background: "#1A4A35",
                      border: "none",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {nameSaving ? "..." : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    style={{
                      fontSize: "12px",
                      color: "#9CA3AF",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0D2818", margin: 0 }}>
                    Welcome back, {vendor.fullName?.split(" ")[0]}
                  </h1>
                  <button
                    onClick={() => {
                      setNameValue(vendor.fullName ?? "");
                      setEditingName(true);
                    }}
                    style={{
                      fontSize: "11px",
                      color: "#9CA3AF",
                      background: "none",
                      border: "1px solid #E5E7EB",
                      borderRadius: "5px",
                      padding: "2px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit name
                  </button>
                </div>
              )}
              <span
                style={{
                  padding: "3px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 600,
                  ...tierStyle,
                }}
              >
                {TIER_LABELS[vendor.tier ?? "free"]}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "4px",
                flexWrap: "wrap",
              }}
            >
              {company &&
                (editingCompanyName ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                      autoFocus
                      value={companyNameValue}
                      onChange={(e) => setCompanyNameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveCompanyName();
                        if (e.key === "Escape") setEditingCompanyName(false);
                      }}
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#0D2818",
                        border: "1px solid #C6E0D0",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        outline: "none",
                        background: "white",
                      }}
                    />
                    <button
                      onClick={saveCompanyName}
                      disabled={companyNameSaving}
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "white",
                        background: "#1A4A35",
                        border: "none",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        cursor: "pointer",
                      }}
                    >
                      {companyNameSaving ? "..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingCompanyName(false)}
                      style={{
                        fontSize: "11px",
                        color: "#9CA3AF",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "13px", color: "#6B7280", fontWeight: 600 }}>
                      {company.name}
                    </span>
                    <button
                      onClick={() => {
                        setCompanyNameValue(company.name);
                        setEditingCompanyName(true);
                      }}
                      style={{
                        fontSize: "11px",
                        color: "#9CA3AF",
                        background: "none",
                        border: "1px solid #E5E7EB",
                        borderRadius: "5px",
                        padding: "1px 7px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              <span style={{ fontSize: "13px", color: "#9CA3AF" }}>·</span>
              <span style={{ fontSize: "13px", color: "#6B7280" }}>{vendor.email}</span>
            </div>
          </div>
        </div>

        {/* No company state */}
        {!company && (
          <div
            style={{
              background: "white",
              borderRadius: "14px",
              border: "1px solid #E5E7EB",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⏳</div>
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#1A4A35",
                marginBottom: "8px",
              }}
            >
              Your listing is being set up
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>
              Your company listing will appear here shortly. If it&apos;s been more than
              a few minutes,{" "}
              <a href="mailto:hello@nextcannaconnect.com" style={{ color: "#1A4A35" }}>
                contact support
              </a>
              .
            </p>
          </div>
        )}

        {/* Tabbed dashboard */}
        {company && (
          <>
            <TabNavigation active={activeTab} onChange={setActiveTab} />

            {activeTab === "dashboard" && (
              <DashboardTab
                vendor={vendor}
                company={company}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                company={company}
                tier={tier}
                onSaved={fetchData}
              />
            )}
            {activeTab === "listing" && (
              <ListingDetailsTab
                company={company}
                tier={tier}
                onSaved={fetchData}
              />
            )}
            {activeTab === "media" && (
              <MediaTab
                company={company}
                tier={tier}
                onSaved={fetchData}
              />
            )}
            {activeTab === "analytics" && <AnalyticsTab tier={tier} />}
            {activeTab === "account" && (
              <AccountTab vendor={vendor} onLogout={handleLogout} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
