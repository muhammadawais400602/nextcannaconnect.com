import Link from "next/link";
import { Company } from "@/types";
import TestingProfileTabs from "./TestingProfileTabs";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const OUTLINE = "#717973";

export default function TestingProfile({ company }: { company: Company }) {
  const meta = [
    (company.location.city || company.location.state)
      ? { icon: "location_on", label: [company.location.city, company.location.state].filter(Boolean).join(", "), fill: false }
      : null,
    company.accreditation ? { icon: "verified", label: company.accreditation, fill: false } : null,
    typeof company.rating === "number"
      ? { icon: "star", label: `${company.rating}${company.reviewCount ? ` (${company.reviewCount} Reviews)` : ""}`, fill: true }
      : null,
    company.turnaroundTime ? { icon: "timer", label: `${company.turnaroundTime} TAT Avg`, fill: false } : null,
  ].filter(Boolean) as { icon: string; label: string; fill: boolean }[];

  // Trust badges: accreditations array, plus license status
  const badges = company.accreditations ?? [];

  const quickFacts = [
    company.metrcIntegrated !== undefined ? { label: "Metrc Integrated", check: !!company.metrcIntegrated } : null,
    company.rushService ? { label: "Rush Service Available", value: company.rushService } : null,
    company.sampleTypes ? { label: "Sample Types", value: company.sampleTypes } : null,
  ].filter(Boolean) as { label: string; check?: boolean; value?: string }[];

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b", paddingTop: "70px" }}>
      <style>{`
        .ts-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .ts-container { padding-left: 64px; padding-right: 64px; } }
        .ts-identity { display: flex; flex-direction: column; gap: 32px; }
        @media (min-width: 768px) { .ts-identity { flex-direction: row; align-items: flex-start; } }
        .ts-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .ts-grid { grid-template-columns: 8fr 4fr; } }
        .ts-sidebar { position: static; }
        @media (min-width: 1024px) { .ts-sidebar { position: sticky; top: 112px; align-self: start; } }
      `}</style>

      {/* Hero cover band */}
      <section style={{ position: "relative", width: "100%", height: "320px" }}>
        {company.bannerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.bannerImageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${company.logoColor} 0%, #001c10 100%)` }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: DF, opacity: 0.4 }} />
        <div className="ts-container" style={{ position: "relative", height: "100%" }}>
          <div style={{ paddingTop: "24px" }}>
            <Link href="/directory/testing-science" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#FBF9F8", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_back</span>
              Back to Testing &amp; Science Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Identity card */}
      <section className="ts-container" style={{ position: "relative", marginTop: "-96px", zIndex: 20, marginBottom: "80px" }}>
        <div className="ts-identity" style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "32px", boxShadow: "0 8px 30px rgba(0,51,32,0.05)" }}>
          <div style={{ width: "128px", height: "128px", flexShrink: 0, border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", overflow: "hidden", background: "#fbf9f8", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {company.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logoUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "36px", fontWeight: 800 }}>{company.logoPlaceholder}</div>
            )}
          </div>

          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: DF, margin: "0 0 4px", letterSpacing: "-0.01em" }}>{company.name}</h1>
              <p style={{ fontSize: "16px", color: VARIANT, margin: 0 }}>{company.shortDescription}</p>
            </div>
            {meta.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", fontSize: "12px", fontWeight: 600, color: VARIANT }}>
                {meta.map((m) => (
                  <div key={m.label} style={{ display: "flex", alignItems: "center", gap: "4px", background: "#efedec", padding: "4px 12px", borderRadius: "0.75rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px", color: m.icon === "star" ? "#F59E0B" : undefined, fontVariationSettings: m.fill ? "'FILL' 1" : undefined }}>{m.icon}</span>
                    {m.label}
                  </div>
                ))}
              </div>
            )}
            {badges.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {badges.map((b) => (
                  <span key={b} style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: SAGE, border: `1px solid ${SAGE}`, padding: "2px 8px", borderRadius: "0.25rem" }}>{b}</span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "260px", flexShrink: 0 }}>
            <a href="#contact-lab" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: SAGE, color: "#001c10", padding: "12px 24px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 700, textDecoration: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
              Request a Testing Quote
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
            </a>
            <a href="#contact-lab" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", border: `1px solid ${DF}`, color: DF, padding: "12px 24px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
              Schedule Sample Pickup
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>local_shipping</span>
            </a>
          </div>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="ts-container" style={{ paddingBottom: "128px" }}>
        <div className="ts-grid">
          {/* Left */}
          <div>
            <TestingProfileTabs company={company} />
          </div>

          {/* Right sidebar */}
          <div className="ts-sidebar">
            <div id="contact-lab" style={{ scrollMarginTop: "112px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Contact Lab */}
              <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "24px" }}>
                <h3 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 16px", borderBottom: `1px solid ${PARCHMENT}`, paddingBottom: "8px" }}>Contact Lab</h3>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                  {company.phone && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <span className="material-symbols-outlined" style={{ color: OUTLINE, marginTop: "2px" }}>call</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "16px" }}>Phone</div>
                        <a href={`tel:${company.phone}`} style={{ color: VARIANT, fontSize: "16px", textDecoration: "none" }}>{company.phone}</a>
                      </div>
                    </li>
                  )}
                  {company.email && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <span className="material-symbols-outlined" style={{ color: OUTLINE, marginTop: "2px" }}>mail</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "16px" }}>Email</div>
                        <a href={`mailto:${company.email}`} style={{ color: VARIANT, fontSize: "16px", textDecoration: "none", wordBreak: "break-all" }}>{company.email}</a>
                      </div>
                    </li>
                  )}
                  {company.sampleIntakeHours && (
                    <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <span className="material-symbols-outlined" style={{ color: OUTLINE, marginTop: "2px" }}>schedule</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "16px" }}>Sample Intake Hours</div>
                        <div style={{ color: VARIANT, fontSize: "16px", whiteSpace: "pre-line" }}>{company.sampleIntakeHours}</div>
                      </div>
                    </li>
                  )}
                  {!company.phone && !company.email && !company.sampleIntakeHours && (
                    <li style={{ color: VARIANT, fontSize: "14px" }}>Contact details available on request.</li>
                  )}
                </ul>
              </div>

              {/* Quick Facts */}
              {quickFacts.length > 0 && (
                <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "24px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: DF, margin: "0 0 16px" }}>Quick Facts</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px", color: VARIANT }}>
                    {quickFacts.map((f, i) => (
                      <div key={f.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: i < quickFacts.length - 1 ? `1px solid ${PARCHMENT}` : "none", paddingBottom: i < quickFacts.length - 1 ? "8px" : 0 }}>
                        <span>{f.label}</span>
                        {f.value !== undefined ? (
                          <span>{f.value}</span>
                        ) : f.check ? (
                          <span className="material-symbols-outlined" style={{ color: SAGE, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined" style={{ color: OUTLINE }}>remove</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section style={{ background: DF, padding: "64px 0", textAlign: "center" }}>
        <div className="ts-container" style={{ maxWidth: "768px" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "white", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Need a compliant cannabis testing lab?</h2>
          <p style={{ fontSize: "18px", color: "#a0d2b6", margin: "0 0 32px" }}>Connect with verified, ISO-accredited facilities to ensure your products meet regulatory standards.</p>
          <Link href="/directory/testing-science" style={{ display: "inline-block", background: SAGE, color: "#001c10", padding: "16px 32px", borderRadius: "0.25rem", fontSize: "18px", fontWeight: 600, textDecoration: "none" }}>Browse More Labs</Link>
        </div>
      </section>
    </div>
  );
}
