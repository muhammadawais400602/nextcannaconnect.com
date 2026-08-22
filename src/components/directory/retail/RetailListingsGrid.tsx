"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Company } from "@/types";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const INK = "#1A1A1A";
const VARIANT = "#414943";

function isVerified(c: Company) {
  return c.tier === "elite" || c.tier === "select";
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const icon = i < full ? "star" : i === full && half ? "star_half" : "star";
        const filled = i < full || (i === full && half);
        return (
          <span
            key={i}
            className="material-symbols-outlined"
            style={{
              fontSize: "18px",
              color: filled ? SAGE : "#c0c9c1",
              fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {icon}
          </span>
        );
      })}
    </div>
  );
}

function RetailCard({ company }: { company: Company }) {
  const verified = isVerified(company);
  const detail = (label: string, value?: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
      <span style={{ color: VARIANT }}>{label}</span>
      <span style={{ fontWeight: 500, color: INK, letterSpacing: "0.01em" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div
      className="cat-card"
      style={{
        background: "white",
        borderRadius: "0.75rem",
        border: `1px solid ${PARCHMENT}`,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image band */}
      <div style={{ height: "192px", position: "relative", background: company.logoColor + "22" }}>
        {company.bannerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.bannerImageUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${company.logoColor}33, ${company.logoColor}11)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "44px", color: company.logoColor, opacity: 0.4 }}>storefront</span>
          </div>
        )}
        {verified && (
          <span style={{ position: "absolute", top: "16px", left: "16px", background: SAGE, color: DF, fontSize: "12px", fontWeight: 600, padding: "4px 8px", borderRadius: "0.25rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span> VERIFIED
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#efedec", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${PARCHMENT}`, overflow: "hidden" }}>
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span className="material-symbols-outlined" style={{ color: "#c0c9c1" }}>storefront</span>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: INK, margin: "0 0 4px", lineHeight: 1.2 }}>{company.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: VARIANT, fontSize: "13px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>location_on</span>
              <span>{[company.location.city, company.location.state].filter(Boolean).join(", ") || "—"}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: VARIANT, margin: "0 0 16px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
          {company.shortDescription}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", borderTop: `1px solid ${PARCHMENT}`, paddingTop: "16px" }}>
          {detail("License #", company.licenseNumber)}
          {detail("Type", company.licenseType)}
          {detail("Delivery", company.delivery)}
          {detail("Hours", company.hours)}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${PARCHMENT}`, paddingTop: "16px", marginTop: "auto" }}>
          {typeof company.rating === "number" ? <StarRow rating={company.rating} /> : <span />}
          <Link href={`/vendor/${company.slug}`} style={{ fontSize: "14px", fontWeight: 500, color: DF, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            View Profile <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  border: `1px solid ${PARCHMENT}`,
  color: VARIANT,
  borderRadius: "0.5rem",
  fontSize: "14px",
  fontWeight: 500,
  padding: "8px 12px",
  background: "white",
  outline: "none",
  cursor: "pointer",
};

const PAGE_SIZE = 9;

export default function RetailListingsGrid({ companies }: { companies: Company[] }) {
  const [location, setLocation] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("recommended");
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const states = useMemo(
    () => [...new Set(companies.map((c) => c.location.state).filter(Boolean))].sort(),
    [companies]
  );
  const licenseTypes = useMemo(
    () => [...new Set(companies.map((c) => c.licenseType).filter(Boolean) as string[])].sort(),
    [companies]
  );

  const filtered = useMemo(() => {
    let list = companies.filter((c) => {
      if (location && c.location.state !== location) return false;
      if (licenseType && c.licenseType !== licenseType) return false;
      if (verifiedOnly && !isVerified(c)) return false;
      if (serviceType === "delivery" && !(c.delivery === "Yes" || c.delivery === "Only")) return false;
      if (serviceType === "storefront" && c.delivery === "Only") return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    const TIER_ORDER: Record<string, number> = { elite: 0, select: 1, free: 2 };
    if (sort === "rating") {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sort === "newest") {
      list = [...list].reverse();
    } else {
      list = [...list].sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
    }
    return list;
  }, [companies, location, licenseType, serviceType, verifiedOnly, sort, search]);

  const shown = filtered.slice(0, visible);

  return (
    <>
      {/* Filter bar */}
      <div style={{ background: "white", borderTop: `1px solid ${PARCHMENT}`, borderBottom: `1px solid ${PARCHMENT}`, position: "sticky", top: "70px", zIndex: 40 }}>
        <div className="cat-container" style={{ padding: "16px 0", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", flex: 1, minWidth: 0 }}>
            <select value={location} onChange={(e) => { setLocation(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
              <option value="">Location</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={licenseType} onChange={(e) => { setLicenseType(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
              <option value="">License Type</option>
              {licenseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={serviceType} onChange={(e) => { setServiceType(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
              <option value="">Service Type</option>
              <option value="storefront">Storefront</option>
              <option value="delivery">Delivery</option>
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 500, color: VARIANT, border: `1px solid ${PARCHMENT}`, padding: "8px 12px", borderRadius: "0.5rem" }}>
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => { setVerifiedOnly(e.target.checked); setVisible(PAGE_SIZE); }} style={{ accentColor: SAGE }} />
              Verified Status
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ ...selectStyle, background: "#f5f3f2" }}>
              <option value="recommended">Sort by: Recommended</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
          <div style={{ position: "relative", flex: "0 1 256px", minWidth: "180px" }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#c0c9c1", fontSize: "20px" }}>search</span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisible(PAGE_SIZE); }}
              placeholder="Search specific names..."
              style={{ width: "100%", paddingLeft: "40px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", background: "#f5f3f2", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section style={{ background: "#f5f3f2", padding: "64px 0" }}>
        <div className="cat-container">
          {shown.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: VARIANT }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c0c9c1" }}>search_off</span>
              <p style={{ fontSize: "16px", marginTop: "12px" }}>No dispensaries match your filters yet.</p>
            </div>
          ) : (
            <div className="cat-grid">
              {shown.map((c) => <RetailCard key={c.slug} company={c} />)}

              {/* CTA tile — appended to the grid */}
              <div style={{ background: DF, borderRadius: "0.75rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "32px" }}>
                <span className="material-symbols-outlined" style={{ color: SAGE, fontSize: "48px", marginBottom: "16px" }}>storefront</span>
                <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#FBF9F8", margin: "0 0 8px" }}>Are you a dispensary operator?</h3>
                <p style={{ fontSize: "15px", color: "rgba(251,249,248,0.8)", margin: "0 0 24px" }}>Join the largest verified network of cannabis retailers. Expand your B2B reach today.</p>
                <Link href="/signup" style={{ fontSize: "14px", fontWeight: 500, background: SAGE, color: DF, padding: "12px 24px", borderRadius: "0.25rem", textDecoration: "none", width: "100%", boxSizing: "border-box" }}>Claim Your Listing</Link>
              </div>
            </div>
          )}

          {visible < filtered.length && (
            <div style={{ marginTop: "48px", display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                style={{ fontSize: "14px", fontWeight: 500, background: "transparent", color: DF, border: `1px solid ${DF}`, padding: "12px 32px", borderRadius: "0.25rem", cursor: "pointer" }}
              >
                Load More Dispensaries
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
