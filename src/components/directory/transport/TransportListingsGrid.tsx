"use client";

import { useState } from "react";
import Link from "next/link";
import { Company } from "@/types";

const DF = "#003320";
const SAGE = "#88B99E";
const VARIANT = "#414943";
const OUTLINE = "#717973";
const SURFACE_VARIANT = "#e4e2e1";

function isVerified(c: Company) {
  return c.tier === "elite" || c.tier === "select";
}

function CardStat({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", fontSize: "12px", color: "#1b1c1b" }}>
      <span className="material-symbols-outlined" style={{ fontSize: "16px", marginRight: "8px", color: OUTLINE }}>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
    </div>
  );
}

function CarrierCard({ company, list }: { company: Company; list: boolean }) {
  const verified = isVerified(company);
  const stats: { icon: string; label: string }[] = [];
  if (company.licenseNumber) stats.push({ icon: "badge", label: `Lic: ${company.licenseNumber}` });
  if (company.vehicleCount) stats.push({ icon: "local_shipping", label: `${company.vehicleCount} Vehicles` });
  if (company.transportType) stats.push({ icon: "thermostat", label: company.transportType });
  if (company.dispatchHours) stats.push({ icon: "support_agent", label: company.dispatchHours });

  return (
    <div
      className="transport-card"
      style={{
        background: "white",
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        border: `1px solid ${SURFACE_VARIANT}`,
        display: "flex",
        flexDirection: list ? "row" : "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: list ? "auto" : "192px", width: list ? "260px" : "100%", flexShrink: 0, background: company.logoColor + "22", overflow: "hidden" }}>
        {company.bannerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.bannerImageUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: list ? "100%" : undefined }} />
        ) : (
          <div style={{ width: "100%", height: "100%", minHeight: list ? "180px" : undefined, background: `linear-gradient(135deg, ${company.logoColor}33, ${company.logoColor}11)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "44px", color: company.logoColor, opacity: 0.4 }}>local_shipping</span>
          </div>
        )}
        {verified && (
          <div style={{ position: "absolute", top: "16px", left: "16px", background: SAGE, color: DF, padding: "4px 12px", borderRadius: "0.75rem", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "14px", marginRight: "4px" }}>verified</span> Verified
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px", gap: "12px" }}>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: DF, margin: "0 0 4px" }}>{company.name}</h3>
            <div style={{ display: "flex", alignItems: "center", color: VARIANT, fontSize: "12px", fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", marginRight: "4px" }}>location_on</span>
              HQ: {[company.location.city, company.location.state].filter(Boolean).join(", ") || "—"}
            </div>
          </div>
          <div style={{ width: "48px", height: "48px", background: "#EEEAE3", borderRadius: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", color: DF, fontWeight: 700, fontSize: "18px", border: `1px solid ${SURFACE_VARIANT}`, flexShrink: 0, overflow: "hidden" }}>
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : company.logoPlaceholder}
          </div>
        </div>

        <p style={{ color: VARIANT, fontSize: "14px", margin: "0 0 24px", flex: 1, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
          {company.shortDescription}
        </p>

        {stats.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: "12px", columnGap: "8px", marginBottom: "24px" }}>
            {stats.map((s) => <CardStat key={s.label} icon={s.icon} label={s.label} />)}
          </div>
        )}

        {(company.serviceTags?.length ?? 0) > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {company.serviceTags!.slice(0, 3).map((tag) => (
              <span key={tag} style={{ background: "#f5f3f2", color: VARIANT, padding: "4px 8px", borderRadius: "0.25rem", fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{tag}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "16px", borderTop: `1px solid ${SURFACE_VARIANT}` }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {typeof company.rating === "number" ? (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: SAGE, fontVariationSettings: "'FILL' 1" }}>star</span>
                <span style={{ fontSize: "14px", fontWeight: 700, marginLeft: "4px" }}>{company.rating}</span>
                {company.reviewCount ? <span style={{ color: OUTLINE, fontSize: "12px", marginLeft: "4px" }}>({company.reviewCount} reviews)</span> : null}
              </>
            ) : <span />}
          </div>
          <Link href={`/vendor/${company.slug}`} style={{ color: DF, fontSize: "14px", fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center" }}>
            View Profile <span className="material-symbols-outlined" style={{ fontSize: "18px", marginLeft: "4px" }}>arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 9;

export default function TransportListingsGrid({ companies }: { companies: Company[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const shown = companies.slice(0, visible);

  return (
    <>
      {/* Header + view toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: 0 }}>{companies.length} Verified Carrier{companies.length === 1 ? "" : "s"}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#e4e2e1", borderRadius: "0.5rem", padding: "4px" }}>
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
        <div className={view === "grid" ? "transport-grid" : "transport-list"} style={{ marginBottom: "48px" }}>
          {shown.map((c) => <CarrierCard key={c.slug} company={c} list={view === "list"} />)}

          {view === "grid" && (
            <div style={{ background: DF, borderRadius: "0.5rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "32px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "36px", color: SAGE, marginBottom: "16px" }}>directions_bus</span>
              <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#FBF9F8", margin: "0 0 16px" }}>Run a cannabis fleet?</h3>
              <p style={{ fontSize: "16px", color: "#EEEAE3", margin: "0 0 32px" }}>Connect with licensed producers and retailers looking for reliable transportation partners in your region.</p>
              <Link href="/signup" style={{ background: SAGE, color: DF, padding: "12px 24px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Claim Your Listing</Link>
            </div>
          )}
        </div>
      )}

      {visible < companies.length && (
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <button onClick={() => setVisible((v) => v + PAGE_SIZE)} style={{ border: `1px solid ${DF}`, color: DF, padding: "12px 32px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, background: "transparent", cursor: "pointer" }}>
            Load More Carriers
          </button>
        </div>
      )}
    </>
  );
}
