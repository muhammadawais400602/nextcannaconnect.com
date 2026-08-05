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

function LabCard({ company }: { company: Company }) {
  const verified = isVerified(company);
  const tags = (company.serviceTags ?? []).slice(0, 3);

  return (
    <div style={{ background: "white", borderRadius: "0.75rem", border: `1px solid ${PARCHMENT}`, overflow: "hidden", display: "flex", flexDirection: "column" }} className="testing-card">
      <div style={{ height: "192px", position: "relative", background: company.logoColor + "22" }}>
        {company.bannerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.bannerImageUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${company.logoColor}33, ${company.logoColor}11)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "44px", color: company.logoColor, opacity: 0.4 }}>science</span>
          </div>
        )}
        {(verified || company.accreditation) && (
          <div style={{ position: "absolute", top: "16px", left: "16px", background: SAGE, color: DF, fontSize: "12px", fontWeight: 600, padding: "4px 8px", borderRadius: "0.25rem", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span> {company.accreditation || "Verified"}
          </div>
        )}
      </div>

      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", gap: "12px" }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: 0, lineHeight: 1.2 }}>{company.name}</h3>
            <p style={{ display: "flex", alignItems: "center", gap: "4px", color: VARIANT, fontSize: "16px", marginTop: "4px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>location_on</span>
              {[company.location.city, company.location.state].filter(Boolean).join(", ") || "—"}
            </p>
          </div>
          <div style={{ width: "48px", height: "48px", background: "#efedec", borderRadius: "50%", border: `1px solid ${PARCHMENT}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span className="material-symbols-outlined" style={{ color: "#c0c9c1" }}>science</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
          {company.turnaroundTime && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", borderBottom: `1px solid ${PARCHMENT}`, paddingBottom: "8px" }}>
              <span style={{ color: VARIANT }}>TAT</span>
              <span style={{ fontWeight: 500 }}>{company.turnaroundTime}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", borderBottom: company.panelCount ? `1px solid ${PARCHMENT}` : "none", paddingBottom: "8px" }}>
            <span style={{ color: VARIANT }}>State License</span>
            <span style={{ fontWeight: 500, color: SAGE }}>{company.licenseStatus || (isVerified(company) ? "Active" : "—")}</span>
          </div>
          {company.panelCount && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
              <span style={{ color: VARIANT }}>Panels</span>
              <span style={{ fontWeight: 500 }}>{company.panelCount}</span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px", marginTop: "auto" }}>
            {tags.map((t) => (
              <span key={t} style={{ background: "#fbf9f8", color: "#1b1c1b", fontSize: "12px", fontWeight: 600, padding: "4px 8px", borderRadius: "0.25rem", border: `1px solid ${PARCHMENT}` }}>{t}</span>
            ))}
          </div>
        )}

        <Link href={`/vendor/${company.slug}`} style={{ display: "block", textAlign: "center", border: `1px solid ${DF}`, color: DF, padding: "8px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none", marginTop: tags.length ? 0 : "auto" }}>
          View Profile
        </Link>
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  border: `1px solid ${PARCHMENT}`,
  borderRadius: "0.25rem",
  padding: "8px 12px",
  fontSize: "16px",
  background: "white",
  outline: "none",
  cursor: "pointer",
  color: "#1b1c1b",
};

const PAGE_SIZE = 9;

export default function TestingListingsGrid({ companies }: { companies: Company[] }) {
  const [location, setLocation] = useState("");
  const [accreditation, setAccreditation] = useState("");
  const [testCategory, setTestCategory] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const states = useMemo(() => [...new Set(companies.map((c) => c.location.state).filter(Boolean))].sort(), [companies]);
  const accreditations = useMemo(() => [...new Set(companies.map((c) => c.accreditation).filter(Boolean) as string[])].sort(), [companies]);
  const categories = useMemo(() => [...new Set(companies.flatMap((c) => c.serviceTags ?? []))].sort(), [companies]);

  const filtered = useMemo(() => companies.filter((c) => {
    if (location && c.location.state !== location) return false;
    if (accreditation && c.accreditation !== accreditation) return false;
    if (testCategory && !(c.serviceTags ?? []).includes(testCategory)) return false;
    return true;
  }), [companies, location, accreditation, testCategory]);

  const shown = filtered.slice(0, visible);

  return (
    <>
      {/* Sticky filter bar */}
      <div style={{ position: "sticky", top: "70px", zIndex: 40, background: "white", borderBottom: `1px solid ${PARCHMENT}`, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
        <div className="testing-container" style={{ padding: "16px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", display: "flex", alignItems: "center", gap: "4px", marginRight: "8px" }}>
            <span className="material-symbols-outlined">filter_list</span> Filters:
          </span>
          <select value={location} onChange={(e) => { setLocation(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
            <option value="">All Locations</option>
            {states.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={accreditation} onChange={(e) => { setAccreditation(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
            <option value="">All Accreditations</option>
            {accreditations.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={testCategory} onChange={(e) => { setTestCategory(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
            <option value="">Test Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="testing-container" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
        {shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: VARIANT }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c0c9c1" }}>science</span>
            <p style={{ fontSize: "16px", marginTop: "12px" }}>No labs match your filters yet.</p>
          </div>
        ) : (
          <div className="testing-grid">
            {shown.map((c) => <LabCard key={c.slug} company={c} />)}
          </div>
        )}

        {visible < filtered.length && (
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button onClick={() => setVisible((v) => v + PAGE_SIZE)} style={{ border: `1px solid ${DF}`, color: DF, padding: "12px 32px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, background: "transparent", cursor: "pointer" }}>
              Load More Labs
            </button>
          </div>
        )}
      </div>
    </>
  );
}
