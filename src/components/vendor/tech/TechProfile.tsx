import { Company } from "@/types";
import TechProfileTabs from "./TechProfileTabs";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const SECONDARY = "#3d6c55";

export default function TechProfile({ company }: { company: Company }) {
  const badge = company.accreditation || (company.tier === "elite" || company.tier === "select" ? "Verified" : null);

  const snapshot = [
    company.foundedYear ? { label: "Founded", value: String(company.foundedYear) } : null,
    (company.location.city || company.location.state) ? { label: "HQ", value: [company.location.city, company.location.state].filter(Boolean).join(", ") } : null,
    company.pricingModel ? { label: "Pricing Model", value: company.pricingModel } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const trialHref = company.website || "/signup";
  const demoHref = company.email ? `mailto:${company.email}` : "/contact";

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b", paddingTop: "70px" }}>
      <style>{`
        .tk-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .tk-container { padding-left: 64px; padding-right: 64px; } }
        .tk-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .tk-grid { grid-template-columns: 8fr 4fr; } }
        .tk-identity { display: flex; flex-direction: column; gap: 32px; }
        @media (min-width: 768px) { .tk-identity { flex-direction: row; align-items: center; } }
        .tk-sidebar { position: static; }
        @media (min-width: 1024px) { .tk-sidebar { position: sticky; top: 96px; align-self: start; } }
      `}</style>

      <main className="tk-container" style={{ paddingTop: "40px", paddingBottom: "80px" }}>
        <div className="tk-grid">
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
            {/* Vendor identity card */}
            <div className="tk-identity" style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "32px" }}>
              <div style={{ width: "96px", height: "96px", borderRadius: "50%", background: "#efedec", border: `1px solid ${PARCHMENT}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logoUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "28px", fontWeight: 800 }}>{company.logoPlaceholder}</div>
                )}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: "#001c10", margin: 0, letterSpacing: "-0.01em" }}>{company.name}</h1>
                  {badge && (
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: "0.75rem", fontSize: "12px", fontWeight: 500, background: "#b8ebce", color: SECONDARY, border: `1px solid ${SAGE}` }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px", marginRight: "4px", fontVariationSettings: "'FILL' 1" }}>verified</span>
                      {badge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "18px", color: VARIANT, margin: 0, maxWidth: "640px" }}>{company.shortDescription}</p>
              </div>
            </div>

            {/* Tabs + content */}
            <TechProfileTabs company={company} />
          </div>

          {/* Right rail */}
          <div className="tk-sidebar">
            <div id="engage-vendor" style={{ scrollMarginTop: "96px", background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px", boxShadow: "0 4px 24px rgba(0,51,32,0.04)" }}>
              <h3 style={{ fontSize: "24px", fontWeight: 600, color: "#001c10", margin: "0 0 16px" }}>Engage Vendor</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <a href={trialHref} target={company.website ? "_blank" : undefined} rel="noopener noreferrer" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", background: DF, color: "white", padding: "12px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>play_arrow</span>
                  Start Free Trial
                </a>
                <a href={demoHref} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", background: "transparent", border: `1px solid ${DF}`, color: DF, padding: "12px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>calendar_today</span>
                  Book a Demo
                </a>
              </div>

              {snapshot.length > 0 && (
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: `1px solid ${PARCHMENT}` }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 12px" }}>Vendor Snapshot</p>
                  <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "16px" }}>
                    {snapshot.map((s) => (
                      <li key={s.label} style={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                        <span style={{ color: VARIANT }}>{s.label}</span>
                        <span style={{ fontWeight: 500, textAlign: "right" }}>{s.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
