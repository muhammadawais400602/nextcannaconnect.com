import Link from "next/link";
import { Company } from "@/types";
import TransportProfileTabs from "./TransportProfileTabs";
import TransportQuoteForm from "./TransportQuoteForm";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";

export default function TransportProfile({ company }: { company: Company }) {
  const verified = company.tier === "elite" || company.tier === "select";

  const pills = [
    verified ? { icon: "verified_user", label: "License Verified" } : null,
    company.cargoInsurance ? { icon: "shield", label: company.cargoInsurance } : null,
    company.gpsTracked ? { icon: "satellite_alt", label: "GPS Tracked" } : null,
  ].filter(Boolean) as { icon: string; label: string }[];

  const metaItems = [
    (company.location.city || company.location.state)
      ? { icon: "location_on", label: `${[company.location.city, company.location.state].filter(Boolean).join(", ")} HQ` }
      : null,
    verified ? { icon: "verified", label: company.verifiedDate ? `Verified ${company.verifiedDate}` : "Verified" } : null,
    typeof company.rating === "number"
      ? { icon: "star", label: `${company.rating}${company.reviewCount ? ` (${company.reviewCount} Reviews)` : ""}` }
      : null,
    company.dispatchHours ? { icon: "schedule", label: company.dispatchHours } : null,
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b", paddingTop: "70px" }}>
      <style>{`
        .tp-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .tp-container { padding-left: 64px; padding-right: 64px; } }
        .tp-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .tp-grid { grid-template-columns: 8fr 4fr; } }
        .tp-identity-row { display: flex; flex-direction: column; gap: 24px; }
        @media (min-width: 768px) { .tp-identity-row { flex-direction: row; align-items: flex-start; justify-content: space-between; } }
        .tp-sidebar { position: static; }
        @media (min-width: 1024px) { .tp-sidebar { position: sticky; top: 112px; align-self: start; } }
      `}</style>

      {/* Breadcrumb */}
      <div className="tp-container" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600, color: VARIANT, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: VARIANT, textDecoration: "none" }}>Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          <Link href="/directory" style={{ color: VARIANT, textDecoration: "none" }}>Directory</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          <Link href="/directory/transportation-logistics" style={{ color: VARIANT, textDecoration: "none" }}>Transportation &amp; Logistics</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          <span style={{ color: DF, fontWeight: 500 }}>{company.name}</span>
        </nav>
      </div>

      {/* Hero cover band */}
      <div style={{ position: "relative", width: "100%", height: "288px" }}>
        {company.bannerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.bannerImageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${company.logoColor} 0%, #001c10 100%)` }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: DF, opacity: 0.4 }} />
        <div className="tp-container" style={{ position: "relative", height: "100%" }}>
          <div style={{ position: "absolute", top: "16px", left: "20px" }}>
            <Link href="/directory/transportation-logistics" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#FBF9F8", fontSize: "14px", fontWeight: 500, background: "rgba(26,26,26,0.5)", padding: "6px 12px", borderRadius: "0.25rem", backdropFilter: "blur(4px)", textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
              <span>Back to Transportation &amp; Logistics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Identity card */}
      <div className="tp-container" style={{ position: "relative", zIndex: 30, marginTop: "-96px" }}>
        <div style={{ background: "white", borderRadius: "0.5rem", border: `1px solid ${PARCHMENT}`, padding: "24px", boxShadow: "0 4px 24px 0 rgba(0,51,32,0.1)" }}>
          <div className="tp-identity-row">
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ width: "96px", height: "96px", background: "#e9e8e7", borderRadius: "0.5rem", border: `1px solid ${PARCHMENT}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {company.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={company.logoUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover", padding: "8px" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "28px", fontWeight: 800 }}>{company.logoPlaceholder}</div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: "#001c10", margin: 0, letterSpacing: "-0.01em" }}>{company.name}</h1>
                  <p style={{ fontSize: "18px", color: VARIANT, margin: 0 }}>{company.shortDescription}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", fontSize: "14px", fontWeight: 500, color: VARIANT, paddingTop: "8px" }}>
                    {metaItems.map((m) => (
                      <span key={m.label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: SAGE, fontVariationSettings: m.icon === "star" ? "'FILL' 1" : undefined }}>{m.icon}</span>
                        <span>{m.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flexShrink: 0, width: "100%", maxWidth: "100%" }}>
              <a href="#quote" style={{ display: "block", textAlign: "center", background: DF, color: "white", fontSize: "14px", fontWeight: 500, padding: "12px 24px", borderRadius: "0.25rem", textDecoration: "none" }}>Request Transport Quote</a>
            </div>
          </div>

          {/* Trust pills */}
          {pills.length > 0 && (
            <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: `1px solid ${PARCHMENT}`, display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {pills.map((p) => (
                <span key={p.label} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "#f5f3f2", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", fontSize: "12px", fontWeight: 600, color: "#001c10" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: SAGE }}>{p.icon}</span>
                  {p.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="tp-container" style={{ marginTop: "48px", paddingBottom: "128px" }}>
        <div className="tp-grid">
          {/* Left */}
          <div>
            <TransportProfileTabs company={company} />
          </div>
          {/* Right sidebar */}
          <div className="tp-sidebar">
            <div id="quote" style={{ scrollMarginTop: "112px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <TransportQuoteForm companyName={company.name} />
              {(company.phone || company.email || company.website) && (
                <div style={{ background: "white", borderRadius: "0.5rem", border: `1px solid ${PARCHMENT}`, padding: "24px" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Get In Touch</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {company.phone && (
                      <a href={`tel:${company.phone}`} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#1b1c1b", textDecoration: "none" }}>
                        <span className="material-symbols-outlined" style={{ color: VARIANT }}>phone</span> {company.phone}
                      </a>
                    )}
                    {company.email && (
                      <a href={`mailto:${company.email}`} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#1b1c1b", textDecoration: "none" }}>
                        <span className="material-symbols-outlined" style={{ color: VARIANT }}>mail</span> {company.email}
                      </a>
                    )}
                    {company.website && (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: "#1b1c1b", textDecoration: "none" }}>
                        <span className="material-symbols-outlined" style={{ color: VARIANT }}>language</span> {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
