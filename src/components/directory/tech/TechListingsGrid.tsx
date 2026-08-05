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
    <div className="tech-card" style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
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
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  background: "white",
  border: "1px solid #c0c9c1",
  borderRadius: "0.5rem",
  fontSize: "14px",
  fontWeight: 500,
  outline: "none",
  cursor: "pointer",
  whiteSpace: "nowrap",
  color: "#1b1c1b",
};

const PAGE_SIZE = 9;

export default function TechListingsGrid({ companies }: { companies: Company[] }) {
  const [integration, setIntegration] = useState("");
  const [security, setSecurity] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
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
      {/* Sticky filter bar */}
      <div style={{ position: "sticky", top: "70px", zIndex: 40, background: "rgba(251,249,248,0.95)", backdropFilter: "blur(6px)", borderTop: `1px solid ${PARCHMENT}`, borderBottom: `1px solid ${PARCHMENT}` }}>
        <div className="tech-container" style={{ padding: "16px 0", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <select value={integration} onChange={(e) => { setIntegration(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
              <option value="">Integrations</option>
              {integrations.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={security} onChange={(e) => { setSecurity(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
              <option value="">Security / Certification</option>
              {securities.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {(integration || security) && (
              <button onClick={() => { setIntegration(""); setSecurity(""); setVisible(PAGE_SIZE); }} style={{ ...selectStyle, color: "#ba1a1a", borderColor: "#ffdad6" }}>
                Clear <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
              </button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: 500, color: VARIANT }}>Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setView("grid")} aria-label="Grid view" style={{ padding: "8px", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", background: view === "grid" ? "white" : "transparent", color: view === "grid" ? DF : VARIANT, cursor: "pointer", display: "flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>grid_view</span>
              </button>
              <button onClick={() => setView("list")} aria-label="List view" style={{ padding: "8px", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", background: view === "list" ? "white" : "transparent", color: view === "list" ? DF : VARIANT, cursor: "pointer", display: "flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>view_list</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="tech-container" style={{ paddingTop: "48px", paddingBottom: "48px" }}>
        {shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: VARIANT }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c0c9c1" }}>terminal</span>
            <p style={{ fontSize: "16px", marginTop: "12px" }}>No vendors match your filters yet.</p>
          </div>
        ) : (
          <div className={view === "grid" ? "tech-grid" : "tech-list"}>
            {shown.map((c) => <VendorCard key={c.slug} company={c} />)}

            {view === "grid" && (
              <div style={{ background: DF, borderRadius: "0.5rem", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: "16px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.1, background: "radial-gradient(circle at center, #a1d1b6 0%, transparent 70%)" }} />
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: SAGE, position: "relative", fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#FBF9F8", margin: 0, position: "relative" }}>Are you a software vendor?</h3>
                <p style={{ fontSize: "16px", color: "#a1d1b6", margin: 0, position: "relative" }}>Join the institutional marketplace and connect with enterprise MSOs.</p>
                <Link href="/signup" style={{ marginTop: "4px", padding: "12px 24px", background: SAGE, color: DF, borderRadius: "0.5rem", fontSize: "14px", fontWeight: 500, textDecoration: "none", width: "100%", boxSizing: "border-box", position: "relative" }}>Apply for Verification</Link>
              </div>
            )}
          </div>
        )}

        {visible < filtered.length && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "48px" }}>
            <button onClick={() => setVisible((v) => v + PAGE_SIZE)} style={{ padding: "12px 32px", background: "white", border: `1px solid ${PARCHMENT}`, color: DF, borderRadius: "0.5rem", fontSize: "14px", fontWeight: 500, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
              Load More Vendors
            </button>
          </div>
        )}
      </section>
    </>
  );
}
