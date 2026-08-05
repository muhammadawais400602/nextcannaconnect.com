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
    <article className="re-card" style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px" }}>
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
          <span style={{ background: "rgba(136,185,158,0.2)", color: DF, fontSize: "12px", fontWeight: 600, padding: "4px 8px", borderRadius: "0.25rem", display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span> CREDENTIALS VERIFIED
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${PARCHMENT}`, paddingTop: "16px" }}>
        <div style={{ color: DF }}>
          {company.projectsCompleted ? (
            <>
              <span style={{ fontSize: "24px", fontWeight: 600 }}>{company.projectsCompleted}</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", marginLeft: "4px" }}>Projects Delivered</span>
            </>
          ) : <span />}
        </div>
        <Link href={`/vendor/${company.slug}`} style={{ border: `1px solid ${DF}`, color: DF, fontSize: "14px", fontWeight: 500, padding: "8px 16px", borderRadius: "0.25rem", textDecoration: "none" }}>View Profile</Link>
      </div>
    </article>
  );
}

export default function RealEstateListingsGrid({ companies }: { companies: Company[] }) {
  const [active, setActive] = useState<string[]>([]);

  const serviceTypes = useMemo(() => [...new Set(companies.flatMap((c) => c.serviceTags ?? []))].sort(), [companies]);

  const filtered = useMemo(() => {
    if (active.length === 0) return companies;
    return companies.filter((c) => active.every((a) => (c.serviceTags ?? []).includes(a)));
  }, [companies, active]);

  function toggle(tag: string) {
    setActive((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  return (
    <div className="re-layout">
      {/* Filters sidebar */}
      <aside className="re-sidebar">
        <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#001c10", margin: "0 0 16px", borderBottom: `1px solid ${PARCHMENT}`, paddingBottom: "8px" }}>Filters</h3>
          {serviceTypes.length > 0 ? (
            <>
              <h4 style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", margin: "0 0 12px" }}>Service Type</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                {serviceTypes.map((t) => (
                  <label key={t} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: active.includes(t) ? DF : VARIANT }}>
                    <input type="checkbox" checked={active.includes(t)} onChange={() => toggle(t)} style={{ accentColor: DF }} />
                    {t}
                  </label>
                ))}
              </div>
            </>
          ) : (
            <p style={{ fontSize: "13px", color: VARIANT, marginBottom: "16px" }}>No filters available yet.</p>
          )}
          <button
            onClick={() => setActive([])}
            style={{ width: "100%", background: "transparent", border: `1px solid ${DF}`, color: DF, fontSize: "14px", fontWeight: 500, padding: "8px", borderRadius: "0.25rem", cursor: "pointer" }}
          >
            Clear Filters
          </button>
        </div>
      </aside>

      {/* Grid */}
      <div className="re-grid-wrap">
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: VARIANT }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c0c9c1" }}>domain</span>
            <p style={{ fontSize: "16px", marginTop: "12px" }}>No firms match your filters yet.</p>
          </div>
        ) : (
          <div className="re-grid">
            {filtered.map((c) => <FirmCard key={c.slug} company={c} />)}

            {/* CTA tile (full width) */}
            <article style={{ gridColumn: "1 / -1", background: DF, color: "#FBF9F8", borderRadius: "0.5rem", padding: "32px", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "flex-start" }} className="re-cta-row">
                <div style={{ maxWidth: "560px" }}>
                  <h3 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, margin: "0 0 8px" }}>Are you a verified contractor?</h3>
                  <p style={{ fontSize: "16px", color: SAGE, margin: 0 }}>Join the institutional marketplace and connect with highly capitalized operators looking for specialized construction partners.</p>
                </div>
                <Link href="/signup" style={{ background: "#FBF9F8", color: DF, fontSize: "14px", fontWeight: 500, padding: "12px 24px", borderRadius: "0.25rem", textDecoration: "none", whiteSpace: "nowrap" }}>Apply for Verification</Link>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
}
