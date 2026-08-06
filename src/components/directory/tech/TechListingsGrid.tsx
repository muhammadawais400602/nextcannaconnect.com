"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Company } from "@/types";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const SECONDARY = "#396751";

function isVerified(c: Company) {
  return c.tier === "elite" || c.tier === "select";
}

function VendorCard({ company }: { company: Company }) {
  const badge = company.accreditation || (isVerified(company) ? "Verified" : null);
  const tags = (company.serviceTags ?? []).slice(0, 4);

  return (
    <div className="cat-card" style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.75rem", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "0.25rem", background: "#efedec", border: `1px solid ${PARCHMENT}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logoUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: "20px" }}>{company.logoPlaceholder}</div>
          )}
        </div>
        {badge && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 8px", background: "rgba(160,210,182,0.2)", color: SECONDARY, border: "1px solid #a0d2b6", borderRadius: "0.25rem", fontSize: "12px", fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>shield</span>
            {badge}
          </span>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 4px" }}>{company.name}</h3>
        <p style={{ fontSize: "16px", color: VARIANT, margin: 0, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{company.shortDescription}</p>
      </div>

      <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${PARCHMENT}` }}>
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {tags.map((t) => (
              <span key={t} style={{ padding: "4px 8px", background: "#efedec", color: VARIANT, fontSize: "12px", fontWeight: 600, borderRadius: "0.25rem", border: "1px solid #dbdad9" }}>{t}</span>
            ))}
          </div>
        )}
        <Link href={`/vendor/${company.slug}`} style={{ display: "block", textAlign: "center", padding: "8px", border: `1px solid ${DF}`, color: DF, borderRadius: "0.5rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>View Profile</Link>
      </div>
    </div>
  );
}

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

const PAGE_SIZE = 9;

export default function TechListingsGrid({ companies }: { companies: Company[] }) {
  const [integration, setIntegration] = useState("");
  const [security, setSecurity] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const integrations = useMemo(() => [...new Set(companies.flatMap((c) => c.serviceTags ?? []))].sort(), [companies]);
  const securities = useMemo(() => [...new Set(companies.map((c) => c.accreditation).filter(Boolean) as string[])].sort(), [companies]);

  const filtered = useMemo(() => companies.filter((c) => {
    if (integration && !(c.serviceTags ?? []).includes(integration)) return false;
    if (security && c.accreditation !== security) return false;
    return true;
  }), [companies, integration, security]);

  const shown = filtered.slice(0, visible);

  return (
    <>
      {/* Filter bar */}
      <div style={{ background: "white", borderTop: `1px solid ${PARCHMENT}`, borderBottom: `1px solid ${PARCHMENT}`, position: "sticky", top: "70px", zIndex: 40 }}>
        <div className="cat-container" style={{ padding: "16px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", display: "flex", alignItems: "center", gap: "4px", marginRight: "4px" }}>
            <span className="material-symbols-outlined">filter_list</span> Filters:
          </span>
          <select value={integration} onChange={(e) => { setIntegration(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
            <option value="">All Integrations</option>
            {integrations.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
          <select value={security} onChange={(e) => { setSecurity(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
            <option value="">All Certifications</option>
            {securities.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <section style={{ background: "#f5f3f2", padding: "64px 0" }}>
        <div className="cat-container">
          {shown.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: VARIANT }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c0c9c1" }}>terminal</span>
              <p style={{ fontSize: "16px", marginTop: "12px" }}>No vendors match your filters yet.</p>
            </div>
          ) : (
            <div className="cat-grid">
              {shown.map((c) => <VendorCard key={c.slug} company={c} />)}

              {/* CTA tile */}
              <div style={{ background: DF, borderRadius: "0.75rem", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: "16px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.1, background: "radial-gradient(circle at center, #a1d1b6 0%, transparent 70%)" }} />
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: SAGE, position: "relative", fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#FBF9F8", margin: 0, position: "relative" }}>Are you a software vendor?</h3>
                <p style={{ fontSize: "15px", color: "#a1d1b6", margin: 0, position: "relative" }}>Join the institutional marketplace and connect with enterprise MSOs.</p>
                <Link href="/signup" style={{ marginTop: "4px", padding: "12px 24px", background: SAGE, color: DF, borderRadius: "0.5rem", fontSize: "14px", fontWeight: 500, textDecoration: "none", width: "100%", boxSizing: "border-box", position: "relative" }}>Apply for Verification</Link>
              </div>
            </div>
          )}

          {visible < filtered.length && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "48px" }}>
              <button onClick={() => setVisible((v) => v + PAGE_SIZE)} style={{ padding: "12px 32px", background: "transparent", border: `1px solid ${DF}`, color: DF, borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                Load More Vendors
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
