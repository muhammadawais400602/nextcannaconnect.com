"use client";

import { useState } from "react";
import { Company } from "@/types";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const OUTLINE = "#717973";

const SEC_ICONS: Record<string, string> = {
  encrypt: "lock",
  aes: "lock",
  sso: "key",
  saml: "key",
  rbac: "shield",
  access: "shield",
  audit: "history",
  log: "history",
};

function secIcon(label: string): string {
  const key = Object.keys(SEC_ICONS).find((k) => label.toLowerCase().includes(k));
  return key ? SEC_ICONS[key] : "verified_user";
}

function statusStyle(status: string): React.CSSProperties {
  const s = status.toLowerCase();
  if (s.includes("maintain") || s.includes("active") || s.includes("certified")) {
    return { background: "rgba(136,185,158,0.2)", color: DF, border: "1px solid rgba(136,185,158,0.3)" };
  }
  return { background: "#e4e2e1", color: VARIANT, border: "1px solid #c0c9c1" };
}

export default function TechProfileTabs({ company }: { company: Company }) {
  const screenshots = company.screenshots ?? [];
  const certTable = company.certTable ?? [];
  const securityFeatures = company.securityFeatures ?? [];
  const features = company.features ?? [];

  const hasCerts = certTable.length > 0 || securityFeatures.length > 0;
  const hasFeatures = features.length > 0;
  const hasPricing = !!company.pricingModel;

  const tabs = [
    { id: "overview", label: "Overview" },
    hasCerts ? { id: "certs", label: "Certifications & Security" } : null,
    hasFeatures ? { id: "features", label: "Features" } : null,
    hasPricing ? { id: "pricing", label: "Pricing" } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  const [active, setActive] = useState("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {/* Sticky tabs */}
      <div style={{ position: "sticky", top: "70px", zIndex: 30, background: "rgba(251,249,248,0.95)", backdropFilter: "blur(6px)", borderBottom: `1px solid ${PARCHMENT}`, paddingTop: "16px" }}>
        <ul style={{ display: "flex", gap: "32px", overflowX: "auto", listStyle: "none", margin: 0, padding: 0 }}>
          {tabs.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setActive(t.id)}
                style={{
                  fontSize: "14px",
                  fontWeight: active === t.id ? 700 : 500,
                  color: active === t.id ? DF : VARIANT,
                  borderBottom: active === t.id ? `2px solid ${DF}` : "2px solid transparent",
                  paddingBottom: "16px",
                  background: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Overview */}
      {active === "overview" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#001c10", margin: 0 }}>Platform Overview</h2>
          <div style={{ fontSize: "16px", color: VARIANT, lineHeight: 1.7, maxWidth: "768px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {(company.fullDescription || company.shortDescription).split("\n\n").map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
          </div>
          {screenshots.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: screenshots.length > 1 ? "repeat(auto-fit, minmax(280px, 1fr))" : "1fr", gap: "24px", marginTop: "8px" }}>
              {screenshots.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={src} alt={`${company.name} screenshot ${i + 1}`} style={{ borderRadius: "0.5rem", border: `1px solid ${PARCHMENT}`, boxShadow: "0 1px 2px rgba(0,0,0,0.04)", objectFit: "cover", aspectRatio: "16 / 9", width: "100%" }} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Certifications & Security */}
      {active === "certs" && hasCerts && (
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#001c10", margin: 0 }}>Certifications &amp; Security Posture</h2>
          {certTable.length > 0 && (
            <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px", overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${PARCHMENT}` }}>
                    {["Certification Standard", "Status", "Last Audit"].map((h) => (
                      <th key={h} style={{ padding: "16px 16px 16px 0", fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {certTable.map((c, i) => (
                    <tr key={i} style={{ borderBottom: i < certTable.length - 1 ? "1px solid #efedec" : "none" }}>
                      <td style={{ padding: "16px 16px 16px 0", fontWeight: 500, color: "#001c10" }}>{c.standard}</td>
                      <td style={{ padding: "16px 16px 16px 0" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: "0.25rem", fontSize: "12px", fontWeight: 500, ...statusStyle(c.status) }}>{c.status}</span>
                      </td>
                      <td style={{ padding: "16px 16px 16px 0", color: VARIANT }}>{c.lastAudit || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {securityFeatures.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
              {securityFeatures.map((f) => (
                <div key={f} style={{ border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "#fbf9f8" }}>
                  <span className="material-symbols-outlined" style={{ color: DF, marginBottom: "8px", fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>{secIcon(f)}</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#1b1c1b" }}>{f}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Features */}
      {active === "features" && hasFeatures && (
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#001c10", margin: 0 }}>Features</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            {features.map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "16px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: SAGE, flexShrink: 0 }}>check_circle</span>
                <span style={{ fontSize: "14px", color: "#1b1c1b", lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pricing */}
      {active === "pricing" && hasPricing && (
        <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#001c10", margin: 0 }}>Pricing</h2>
          <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: OUTLINE, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Pricing Model</div>
              <div style={{ fontSize: "20px", fontWeight: 600, color: DF }}>{company.pricingModel}</div>
            </div>
            <a href="#engage-vendor" style={{ background: DF, color: "white", padding: "12px 24px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Request Pricing</a>
          </div>
        </section>
      )}
    </div>
  );
}
