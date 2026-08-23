"use client";

import { useState } from "react";
import Link from "next/link";
import { Company } from "@/types";

const DF = "#003320";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const SEC_CONTAINER = "#b8ebce";
const ON_SEC_CONTAINER = "#3d6c55";

export default function RealEstateProfileTabs({ company }: { company: Company }) {
  const licenses = company.licensesTable ?? [];
  const projects = company.products ?? [];
  const steps = company.processSteps ?? [];

  const hasCredentials = licenses.length > 0;
  const hasPortfolio = projects.length > 0;
  const hasProcess = steps.length > 0;
  const isElite = company.tier === "elite";

  const tabs = [
    { id: "overview", label: "Overview", icon: "description" },
    hasCredentials ? { id: "credentials", label: "Credentials & Insurance", icon: "verified_user" } : null,
    hasPortfolio ? { id: "portfolio", label: "Portfolio", locked: !isElite, icon: "photo_library" } : null,
    hasProcess ? { id: "process", label: "Process", locked: !isElite, icon: "account_tree" } : null,
  ].filter(Boolean) as { id: string; label: string; icon: string; locked?: boolean }[];

  const [active, setActive] = useState("overview");

  return (
    <div>
      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${PARCHMENT}`, marginBottom: "40px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "32px", minWidth: "max-content" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                paddingBottom: "16px",
                fontSize: "14px",
                fontWeight: active === t.id ? 700 : 500,
                color: t.locked ? "#9CA3AF" : (active === t.id ? DF : VARIANT),
                borderBottom: active === t.id ? `2px solid ${DF}` : "2px solid transparent",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{t.icon}</span>
              {t.label}{t.locked && <span className="material-symbols-outlined" style={{ fontSize: "14px", marginLeft: "4px" }}>lock</span>}</button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {active === "overview" && (
        <section>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: DF, margin: "0 0 24px" }}>About the Firm</h2>
          <div style={{ fontSize: "16px", color: VARIANT, lineHeight: 1.7, display: "flex", flexDirection: "column", gap: "16px" }}>
            {(company.fullDescription || company.shortDescription).split("\n\n").map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
          </div>
        </section>
      )}

      {/* Credentials & Insurance (licenses table) */}
      {active === "credentials" && hasCredentials && (
        <section>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: DF, margin: "0 0 24px" }}>Licenses &amp; Credentials</h2>
          <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#efedec", borderBottom: `1px solid ${PARCHMENT}` }}>
                    {["Jurisdiction", "License Type", "License Number", "Status"].map((h) => (
                      <th key={h} style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 500, color: VARIANT, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((l, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${PARCHMENT}` }}>
                      <td style={{ padding: "16px 24px", color: "#1b1c1b" }}>{l.authority || "—"}</td>
                      <td style={{ padding: "16px 24px", color: VARIANT }}>{l.type}</td>
                      <td style={{ padding: "16px 24px", color: VARIANT, fontFamily: "monospace", fontSize: "14px" }}>{l.number || "—"}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: SEC_CONTAINER, color: ON_SEC_CONTAINER, padding: "2px 8px", borderRadius: "0.25rem", fontSize: "12px", fontWeight: 500 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>check</span>
                          {l.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Portfolio (featured projects) */}
      {active === "portfolio" && hasPortfolio && (
        <section>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: DF, margin: "0 0 8px" }}>Featured Projects</h2>
          <p style={{ fontSize: "16px", color: VARIANT, margin: "0 0 32px" }}>A selection of recent institutional-grade buildouts.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "24px" }}>
            {projects.map((p) => (
              <div key={p.name}>
                <div style={{ aspectRatio: "4 / 3", borderRadius: "0.5rem", overflow: "hidden", marginBottom: "12px", border: `1px solid ${PARCHMENT}`, background: company.logoColor + "22" }}>
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "40px", color: company.logoColor, opacity: 0.4 }}>apartment</span>
                    </div>
                  )}
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: DF, margin: "0 0 2px" }}>{p.name}</h4>
                <p style={{ fontSize: "14px", color: VARIANT, margin: 0 }}>{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Process */}
      {active === "process" && hasProcess && (
        <section>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: DF, margin: "0 0 24px" }}>Our Design-Build Process</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {steps.map((s, i) => (
              <div key={s.title} style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px" }}>
                <div style={{ width: "40px", height: "40px", background: DF, color: "#FBF9F8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px", marginBottom: "16px" }}>{i + 1}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: DF, margin: "0 0 8px" }}>{s.title}</h3>
                <p style={{ fontSize: "16px", color: VARIANT, margin: 0, lineHeight: 1.5 }}>{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {tabs.find(t => t.id === active)?.locked && (
        <section style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "40px 32px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#9CA3AF", marginBottom: "12px", display: "block" }}>lock</span>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", margin: "0 0 8px" }}>Verified Pro Feature</h3>
          <p style={{ fontSize: "14px", color: "#414943", margin: "0 0 16px" }}>Upgrade to Verified Pro to unlock this section.</p>
          <Link href="/pricing" style={{ fontSize: "13px", fontWeight: 700, color: "#003320", textDecoration: "none" }}>View Plans &rarr;</Link>
        </section>
      )}
    </div>
  );
}
