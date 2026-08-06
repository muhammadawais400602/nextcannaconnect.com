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

const SERVICE_ICONS: Record<string, string> = {
  architect: "architecture",
  contracting: "construction",
  contractor: "construction",
  hvac: "hvac",
  engineering: "engineering",
  zoning: "map",
  build: "construction",
};

function firmIcon(company: Company): string {
  const tags = (company.serviceTags ?? []).join(" ").toLowerCase();
  const key = Object.keys(SERVICE_ICONS).find((k) => tags.includes(k));
  return key ? SERVICE_ICONS[key] : "domain";
}

function FirmCard({ company }: { company: Company }) {
  const verified = isVerified(company);
  const tags = (company.serviceTags ?? []).slice(0, 3);

  return (
    <article className="cat-card" style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.75rem", padding: "24px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
          <div style={{ width: "48px", height: "48px", background: "#efedec", borderRadius: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${PARCHMENT}`, flexShrink: 0, overflow: "hidden" }}>
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span className="material-symbols-outlined" style={{ color: DF }}>{firmIcon(company)}</span>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#001c10", margin: 0 }}>{company.name}</h3>
            <div style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>location_on</span>
              {[company.location.city, company.location.state].filter(Boolean).join(", ") || "Multi-State Operator"}
            </div>
          </div>
        </div>
        {verified && (
          <span style={{ background: "rgba(136,185,158,0.2)", color: DF, fontSize: "11px", fontWeight: 600, padding: "4px 8px", borderRadius: "0.25rem", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span> VERIFIED
          </span>
        )}
      </div>

      <p style={{ fontSize: "16px", color: VARIANT, margin: "0 0 16px", lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{company.shortDescription}</p>

      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
          {tags.map((t) => (
            <span key={t} style={{ background: "#fbf9f8", border: `1px solid ${PARCHMENT}`, color: VARIANT, fontSize: "12px", fontWeight: 600, padding: "4px 8px", borderRadius: "0.25rem" }}>{t}</span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${PARCHMENT}`, paddingTop: "16px", marginTop: "auto", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ color: DF }}>
          {company.projectsCompleted ? (
            <>
              <span style={{ fontSize: "24px", fontWeight: 600 }}>{company.projectsCompleted}</span>
              <span style={{ fontSize: "11px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", marginLeft: "4px" }}>Projects</span>
            </>
          ) : <span />}
        </div>
        <Link href={`/vendor/${company.slug}`} style={{ border: `1px solid ${DF}`, color: DF, fontSize: "14px", fontWeight: 500, padding: "8px 16px", borderRadius: "0.25rem", textDecoration: "none" }}>View Profile</Link>
      </div>
    </article>
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

export default function RealEstateListingsGrid({ companies }: { companies: Company[] }) {
  const [active, setActive] = useState<string[]>([]);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const serviceTypes = useMemo(() => [...new Set(companies.flatMap((c) => c.serviceTags ?? []))].sort(), [companies]);

  const filtered = useMemo(() => {
    if (active.length === 0) return companies;
    return companies.filter((c) => active.every((a) => (c.serviceTags ?? []).includes(a)));
  }, [companies, active]);

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
            <span className="material-symbols-outlined">filter_list</span> Service:
          </span>
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
              <div style={{ background: DF, borderRadius: "0.75rem", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
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
