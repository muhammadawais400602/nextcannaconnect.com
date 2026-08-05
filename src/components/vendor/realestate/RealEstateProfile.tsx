import { Company } from "@/types";
import RealEstateProfileTabs from "./RealEstateProfileTabs";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const SECONDARY = "#396751";
const SEC_CONTAINER = "#b8ebce";
const ON_SEC_CONTAINER = "#3d6c55";

export default function RealEstateProfile({ company }: { company: Company }) {
  const verified = company.tier === "elite" || company.tier === "select";

  const stats = [
    company.foundedYear ? { label: "Established", value: String(company.foundedYear) } : null,
    (company.location.city || company.location.state) ? { label: "Headquarters", value: [company.location.city, company.location.state].filter(Boolean).join(", ") } : null,
    company.teamSize ? { label: "Team Size", value: company.teamSize } : null,
    company.projectsCompleted ? { label: "Projects Completed", value: company.projectsCompleted } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const credentials = company.accreditations ?? [];
  const showCredentialCard = !!company.credentialHeadline || credentials.length > 0;
  const insurance = company.insurance ?? [];

  const addressLines = [company.location.address, [company.location.city, company.location.state, company.location.zip].filter(Boolean).join(", ")].filter(Boolean);

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b", paddingTop: "70px" }}>
      <style>{`
        .rec-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .rec-container { padding-left: 64px; padding-right: 64px; } }
        .rec-hero { display: flex; flex-direction: column; gap: 24px; }
        @media (min-width: 768px) { .rec-hero { flex-direction: row; } }
        .rec-cred-card { width: 100%; flex-shrink: 0; }
        @media (min-width: 768px) { .rec-cred-card { width: 320px; } }
        .rec-content { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .rec-content { grid-template-columns: 2fr 1fr; } }
        .rec-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
        @media (min-width: 768px) { .rec-stats { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      <main className="rec-container" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
        {/* Identity + credential hero */}
        <section className="rec-hero" style={{ marginBottom: "40px" }}>
          {/* Main info card */}
          <div style={{ flex: 1, background: "white", borderRadius: "0.5rem", border: `1px solid ${PARCHMENT}`, padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                  {verified && (
                    <span style={{ background: SEC_CONTAINER, color: ON_SEC_CONTAINER, fontSize: "12px", fontWeight: 600, padding: "4px 8px", borderRadius: "0.25rem", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span> Verified Standards
                    </span>
                  )}
                  <span style={{ color: VARIANT, fontSize: "12px", fontWeight: 600, border: `1px solid ${PARCHMENT}`, padding: "4px 8px", borderRadius: "0.25rem" }}>Real Estate &amp; Construction</span>
                </div>
                <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: DF, margin: "0 0 8px", letterSpacing: "-0.02em" }}>{company.name}</h1>
                <p style={{ fontSize: "18px", color: VARIANT, margin: 0, maxWidth: "640px" }}>{company.shortDescription}</p>
              </div>
              <div style={{ width: "96px", height: "96px", borderRadius: "0.25rem", background: "#efedec", border: `1px solid ${PARCHMENT}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logoUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "28px", fontWeight: 800 }}>{company.logoPlaceholder}</div>
                )}
              </div>
            </div>
            {stats.length > 0 && (
              <div className="rec-stats" style={{ paddingTop: "24px", borderTop: `1px solid ${PARCHMENT}` }}>
                {stats.map((s) => (
                  <div key={s.label}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, margin: "0 0 4px" }}>{s.label}</p>
                    <p style={{ fontSize: "16px", fontWeight: 500, margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Credential card */}
          <div className="rec-cred-card" style={{ background: DF, color: "#FBF9F8", borderRadius: "0.5rem", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 10px 30px -15px rgba(0,51,32,0.3)" }}>
            <div>
              {showCredentialCard && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <span className="material-symbols-outlined" style={{ color: SAGE, fontSize: "30px", fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: SAGE, margin: 0 }}>{company.credentialHeadline || "Verified Credentials"}</h3>
                </div>
              )}
              {credentials.length > 0 && (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                  {credentials.map((c) => (
                    <li key={c} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", opacity: 0.9 }}>
                      <span className="material-symbols-outlined" style={{ color: SAGE, fontSize: "18px" }}>check_circle</span>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <a href="#contact-info" style={{ width: "100%", background: "#FBF9F8", color: DF, fontSize: "14px", fontWeight: 500, padding: "12px 16px", borderRadius: "0.25rem", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxSizing: "border-box" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>assignment</span>
              Request Project Quote
            </a>
          </div>
        </section>

        {/* Content: tabs (main) + sidebar */}
        <div className="rec-content">
          {/* Main */}
          <div>
            <RealEstateProfileTabs company={company} />
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {insurance.length > 0 && (
              <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: DF, margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ color: "#6e9d83" }}>admin_panel_settings</span>
                  Insurance Snapshot
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {insurance.map((it) => (
                    <div key={it.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "12px", borderBottom: `1px solid ${PARCHMENT}` }}>
                      <span style={{ fontSize: "16px", color: VARIANT }}>{it.label}</span>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: DF }}>{it.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div id="contact-info" style={{ scrollMarginTop: "96px", background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: 600, color: DF, margin: "0 0 24px" }}>Contact Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {addressLines.length > 0 && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <span className="material-symbols-outlined" style={{ color: VARIANT, marginTop: "2px" }}>location_on</span>
                    <div>
                      {addressLines.map((l, i) => <p key={i} style={{ fontSize: "16px", color: VARIANT, margin: 0 }}>{l}</p>)}
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className="material-symbols-outlined" style={{ color: VARIANT }}>call</span>
                    <a href={`tel:${company.phone}`} style={{ fontSize: "16px", color: VARIANT, textDecoration: "none" }}>{company.phone}</a>
                  </div>
                )}
                {company.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className="material-symbols-outlined" style={{ color: VARIANT }}>mail</span>
                    <a href={`mailto:${company.email}`} style={{ fontSize: "16px", color: SECONDARY, textDecoration: "none", wordBreak: "break-all" }}>{company.email}</a>
                  </div>
                )}
                {company.website && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className="material-symbols-outlined" style={{ color: VARIANT }}>language</span>
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "16px", color: SECONDARY, textDecoration: "none" }}>{company.website.replace(/^https?:\/\//, "")}</a>
                  </div>
                )}
                {addressLines.length === 0 && !company.phone && !company.email && !company.website && (
                  <p style={{ fontSize: "14px", color: VARIANT, margin: 0 }}>Contact details available on request.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
