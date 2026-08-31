"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Company } from "@/types";

const DF = "#003320";
const SAGE = "#88B99E";
const VARIANT = "#414943";
const PARCHMENT = "#EEEAE3";

function isVerified(c: Company) {
  return c.tier === "elite" || c.tier === "select";
}

function CarrierCard({ company }: { company: Company }) {
  const verified = isVerified(company);
  const detail = (label: string, value?: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
      <span style={{ color: VARIANT }}>{label}</span>
      <span style={{ fontWeight: 500, color: DF }}>{value || "—"}</span>
    </div>
  );

  return (
    <div
      className="cat-card"
      style={{
        background: "white",
        borderRadius: "0.75rem",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        border: `1px solid ${PARCHMENT}`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "192px", width: "100%", flexShrink: 0, background: company.logoColor + "22", overflow: "hidden" }}>
        {company.bannerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.bannerImageUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${company.logoColor}33, ${company.logoColor}11)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "44px", color: company.logoColor, opacity: 0.4 }}>local_shipping</span>
          </div>
        )}
        {verified && (
          <span style={{ position: "absolute", top: "16px", left: "16px", background: SAGE, color: DF, padding: "4px 8px", borderRadius: "0.25rem", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span> VERIFIED
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#efedec", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${PARCHMENT}`, overflow: "hidden" }}>
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span className="material-symbols-outlined" style={{ color: "#c0c9c1" }}>local_shipping</span>
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: DF, margin: "0 0 4px", lineHeight: 1.2 }}>{company.name}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: VARIANT, fontSize: "13px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>location_on</span>
              <span>{[company.location.city, company.location.state].filter(Boolean).join(", ") || "—"}</span>
            </div>
          </div>
        </div>

        <p style={{ color: VARIANT, fontSize: "13px", margin: "0 0 16px", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
          {company.shortDescription}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", borderTop: `1px solid ${PARCHMENT}`, paddingTop: "16px" }}>
          {detail("License", company.licenseNumber)}
          {detail("Vehicles", company.vehicleCount ? String(company.vehicleCount) : undefined)}
          {detail("Type", company.transportType)}
          {detail("Dispatch", company.dispatchHours)}
        </div>

        {(company.serviceTags?.length ?? 0) > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {(company.serviceTags ?? []).slice(0, 3).map((tag) => (
              <span key={tag} style={{ background: "#fbf9f8", color: "#1b1c1b", padding: "4px 8px", borderRadius: "0.25rem", fontSize: "12px", fontWeight: 600, border: `1px solid ${PARCHMENT}` }}>{tag}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${PARCHMENT}` }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {typeof company.rating === "number" ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: SAGE, fontVariationSettings: "'FILL' 1" }}>star</span>
                <span style={{ fontSize: "14px", fontWeight: 700, marginLeft: "4px" }}>{company.rating}</span>
                {company.reviewCount ? <span style={{ color: VARIANT, fontSize: "12px", marginLeft: "4px" }}>({company.reviewCount} reviews)</span> : null}
              </>
            ) : <span />}
          </div>
          <Link href={`/vendor/${company.slug}`} style={{ color: DF, fontSize: "14px", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
            View Profile <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
          </Link>
        </div>
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

export default function TransportListingsGrid({ companies }: { companies: Company[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [location, setLocation] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const states = useMemo(() => [...new Set(companies.map((c) => c.location.state).filter(Boolean))].sort(), [companies]);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (location && c.location.state !== location) return false;
      return true;
    });
  }, [companies, location]);

  const shown = filtered.slice(0, visible);

  return (
    <>
    {/* Filter bar */}
    <div style={{ background: "white", borderTop: `1px solid ${PARCHMENT}`, borderBottom: `1px solid ${PARCHMENT}`, position: "sticky", top: "70px", zIndex: 40 }}>
      <div className="cat-container" style={{ padding: "16px 0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", display: "flex", alignItems: "center", gap: "4px", marginRight: "4px" }}>
          <span className="material-symbols-outlined">filter_list</span> Filters:
        </span>
        <select value={location} onChange={(e) => { setLocation(e.target.value); setVisible(PAGE_SIZE); }} style={selectStyle}>
          <option value="">All Locations</option>
          {states.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>

    <section style={{ background: "#f5f3f2", padding: "64px 0" }}>
      <div className="cat-container">
      {/* Header + view toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: 0 }}>{filtered.length} Verified Carrier{filtered.length === 1 ? "" : "s"}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: PARCHMENT, borderRadius: "0.5rem", padding: "4px" }}>
          <button onClick={() => setView("grid")} aria-label="Grid view" style={{ padding: "8px", borderRadius: "0.25rem", border: "none", cursor: "pointer", background: view === "grid" ? "white" : "transparent", color: view === "grid" ? DF : VARIANT, display: "flex", boxShadow: view === "grid" ? "0 1px 2px rgba(0,0,0,0.1)" : "none" }}>
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button onClick={() => setView("list")} aria-label="List view" style={{ padding: "8px", borderRadius: "0.25rem", border: "none", cursor: "pointer", background: view === "list" ? "white" : "transparent", color: view === "list" ? DF : VARIANT, display: "flex", boxShadow: view === "list" ? "0 1px 2px rgba(0,0,0,0.1)" : "none" }}>
            <span className="material-symbols-outlined">list</span>
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: VARIANT }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c0c9c1" }}>local_shipping</span>
          <p style={{ fontSize: "16px", marginTop: "12px" }}>No carriers listed yet. Check back soon.</p>
        </div>
      ) : (
        <div className={view === "grid" ? "cat-grid" : undefined} style={view === "grid" ? { marginBottom: "48px" } : { display: "grid", gridTemplateColumns: "1fr", gap: "16px", marginBottom: "48px" }}>
          {shown.map((c) => <CarrierCard key={c.slug} company={c} />)}

          {view === "grid" && (
            <div style={{ background: DF, borderRadius: "0.75rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "32px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "36px", color: SAGE, marginBottom: "16px" }}>directions_bus</span>
              <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#FBF9F8", margin: "0 0 16px" }}>Run a cannabis fleet?</h3>
              <p style={{ fontSize: "16px", color: "#EEEAE3", margin: "0 0 32px" }}>Connect with licensed producers and retailers looking for reliable transportation partners in your region.</p>
              <Link href="/signup" style={{ background: SAGE, color: DF, padding: "12px 24px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Claim Your Listing</Link>
            </div>
          )}
        </div>
      )}

      {visible < filtered.length && (
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <button onClick={() => setVisible((v) => v + PAGE_SIZE)} style={{ border: `1px solid ${DF}`, color: DF, padding: "12px 32px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, background: "transparent", cursor: "pointer" }}>
            Load More Carriers
          </button>
        </div>
      )}
      </div>
    </section>
    </>
  );
}
