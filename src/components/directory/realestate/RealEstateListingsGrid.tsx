"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Company } from "@/types";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";

function isVerified(c: Company) {
  return c.tier === "elite" || c.tier === "select";
}

function FirmCard({ company }: { company: Company }) {
  const verified = isVerified(company);
  const detail = (label: string, value?: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
      <span style={{ color: VARIANT }}>{label}</span>
      <span style={{ fontWeight: 500, color: DF, letterSpacing: "0.01em" }}>{value || "—"}</span>
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
            <span className="material-symbols-outlined" style={{ fontSize: "44px", color: company.logoColor, opacity: 0.4 }}>architecture</span>
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
              <div style={{ width: "100%", height: "100%", background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "16px" }}>{company.logoPlaceholder}</div>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: DF, margin: "0 0 4px", lineHeight: 1.2 }}>{company.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: VARIANT, fontSize: "13px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>location_on</span>
              <span>{[company.location.city, company.location.state].filter(Boolean).join(", ") || "Multi-State"}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: "13px", color: VARIANT, margin: "0 0 16px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
          {company.shortDescription}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", borderTop: `1px solid ${PARCHMENT}`, paddingTop: "16px" }}>
          {detail("Projects", company.projectsCompleted)}
          {detail("Team Size", company.teamSize)}
          {detail("Services", (company.serviceTags ?? []).slice(0, 3).join(", ") || undefined)}
          {detail("Founded", company.foundedYear ? String(company.foundedYear) : undefined)}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${PARCHMENT}`, paddingTop: "16px", marginTop: "auto" }}>
          {company.credentialHeadline ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: "#396751" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>verified</span>
              {company.credentialHeadline}
            </span>
          ) : <span />}
          <Link href={`/vendor/${company.slug}`} style={{ fontSize: "14px", fontWeight: 500, color: DF, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            View Profile <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const chipStyle = (active: boolean): React.CSSProperties => ({
  border: `1px solid ${active ? DF : PARCHMENT}`,
  background: active ? DF : "white",
  color: active ? "white" : VARIANT,
  borderRadius: "999px",
  padding: "6px 14px",
  fontSize: "13px",
  fontWeight: 500,
  cursor: "pointer",
  whiteSpace: "nowrap",
});

const PAGE_SIZE = 9;

const selectStyle: React.CSSProperties = {
  border: `1px solid ${PARCHMENT}`,
  borderRadius: "0.5rem",
  padding: "8px 12px",
  fontSize: "14px",
  fontWeight: 500,
  background: "white",
  outline: "none",
  cursor: "pointer",
  color: VARIANT,
};

export default function RealEstateListingsGrid({ companies }: { companies: Company[] }) {
  const [active, setActive] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const serviceTypes = useMemo(() => [...new Set(companies.flatMap((c) => c.serviceTags ?? []))].sort(), [companies]);
  const states = useMemo(() => [...new Set(companies.map((c) => c.location.state).filter(Boolean))].sort(), [companies]);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (location && c.location.state !== location) return false;
      if (active.length > 0 && !active.every((a) => (c.serviceTags ?? []).includes(a))) return false;
      return true;
    });
  }, [companies, location, active]);

  function toggle(tag: string) {
    setActive((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    setVisible(PAGE_SIZE);
  }

  const shown = filtered.slice(0, visible);

  return (
    <>
      {/* Filter bar */}
      <div style={{ background: "white", borderTop: `1px solid ${PARCHMENT}`, borderBottom: `1px solid ${PARCHMENT}`, position: "sticky", top: "70px", zIndex: 40 }}>
        <div className="cat-container" style={{ padding: "16px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", display: "flex", alignItems: "center", gap: "4px", marginRight: "4px" }}>
            <span className="material-symbols-outlined">filter_list</span> Filters:
          </span>
          <select value={location} onChange={(e) => { setLocation(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
            <option value="">All Locations</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {serviceTypes.length === 0 && <span style={{ fontSize: "13px", color: VARIANT }}>No filters available yet.</span>}
          {serviceTypes.map((t) => (
            <button key={t} onClick={() => toggle(t)} style={chipStyle(active.includes(t))}>{t}</button>
          ))}
          {active.length > 0 && (
            <button onClick={() => { setActive([]); setVisible(PAGE_SIZE); }} style={{ ...chipStyle(false), color: "#ba1a1a", borderColor: "#ffdad6" }}>Clear</button>
          )}
        </div>
      </div>

      {/* Grid */}
      <section style={{ background: "#f5f3f2", padding: "64px 0" }}>
        <div className="cat-container">
          {shown.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: VARIANT }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c0c9c1" }}>domain</span>
              <p style={{ fontSize: "16px", marginTop: "12px" }}>No firms match your filters yet.</p>
            </div>
          ) : (
            <div className="cat-grid">
              {shown.map((c) => <FirmCard key={c.slug} company={c} />)}

              {/* CTA tile */}
              <div style={{ background: DF, borderRadius: "0.75rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "32px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: SAGE, marginBottom: "16px" }}>architecture</span>
                <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#FBF9F8", margin: "0 0 8px" }}>Are you a verified contractor?</h3>
                <p style={{ fontSize: "15px", color: "rgba(251,249,248,0.8)", margin: "0 0 24px" }}>Join the institutional marketplace and connect with highly capitalized operators.</p>
                <Link href="/signup" style={{ background: SAGE, color: DF, fontSize: "14px", fontWeight: 500, padding: "12px 24px", borderRadius: "0.25rem", textDecoration: "none", width: "100%", boxSizing: "border-box" }}>Apply for Verification</Link>
              </div>
            </div>
          )}

          {visible < filtered.length && (
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} style={{ border: `1px solid ${DF}`, color: DF, padding: "12px 32px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, background: "transparent", cursor: "pointer" }}>
                Load More Firms
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
