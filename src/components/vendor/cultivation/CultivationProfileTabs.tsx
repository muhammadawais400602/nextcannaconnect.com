"use client";

import { useState } from "react";
import Link from "next/link";
import { Company } from "@/types";
import FaqAccordion from "@/components/ui/FaqAccordion";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const INK = "#1A1A1A";
const VARIANT = "#414943";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: "24px", fontWeight: 600, color: INK, margin: 0 }}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${PARCHMENT}` }}>
      <span style={{ fontSize: "14px", color: VARIANT }}>{label}</span>
      <span style={{ fontSize: "14px", fontWeight: 500, color: INK }}>{value}</span>
    </div>
  );
}

export default function CultivationProfileTabs({ company, similar }: { company: Company; similar: Company[] }) {
  const stats = [
    company.foundedYear ? { label: "Founded", value: String(company.foundedYear) } : null,
    company.teamSize ? { label: "Team", value: company.teamSize } : null,
    company.statesServed?.length
      ? { label: "States", value: company.statesServed.join(", ") }
      : company.location.state
      ? { label: "States", value: company.location.state }
      : null,
    company.serviceArea ? { label: "Canopy", value: company.serviceArea } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const hasGrowOps = (company.serviceTags?.length ?? 0) > 0 || (company.products?.length ?? 0) > 0;
  const hasCerts = (company.certifications?.length ?? 0) > 0 || (company.credentials?.length ?? 0) > 0;
  const hasFaqs = (company.faqs?.length ?? 0) > 0;
  const isElite = company.tier === "elite";
  const isFree = company.tier === "free";

  const tabs = [
    { id: "overview", label: "Overview" },
    hasGrowOps ? { id: "grow-ops", label: "Grow Operations", locked: !isElite || isFree } : null,
    hasCerts ? { id: "certifications", label: "Certifications", locked: isFree } : null,
    hasFaqs ? { id: "faqs", label: "FAQs", locked: isFree } : null,
  ].filter(Boolean) as { id: string; label: string; locked?: boolean }[];

  const [active, setActive] = useState("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div style={{ position: "sticky", top: "70px", zIndex: 30, background: "rgba(251,249,248,0.9)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${PARCHMENT}`, paddingTop: "8px" }}>
        <nav style={{ display: "flex", gap: "32px", overflowX: "auto" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                paddingBottom: "12px",
                fontSize: "14px",
                fontWeight: active === t.id ? 600 : 500,
                color: t.locked ? "#9CA3AF" : (active === t.id ? DF : VARIANT),
                borderBottom: active === t.id ? `2px solid ${DF}` : "2px solid transparent",
                background: "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}{t.locked && <span className="material-symbols-outlined" style={{ fontSize: "14px", marginLeft: "4px", verticalAlign: "middle" }}>lock</span>}
            </button>
          ))}
        </nav>
      </div>

      {active === "overview" && (
        <section style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "32px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>About</h2>
          <div style={{ fontSize: "16px", color: "#1b1c1b", lineHeight: 1.7, marginBottom: stats.length ? "32px" : 0 }}>
            {(company.fullDescription || company.shortDescription).split("\n\n").map((p, i) => (
              <p key={i} style={{ margin: "0 0 16px" }}>{p}</p>
            ))}
          </div>
          {stats.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: "24px", paddingTop: "24px", borderTop: `1px solid ${PARCHMENT}` }}>
              {stats.map((s) => <Stat key={s.label} label={s.label} value={s.value} />)}
            </div>
          )}
        </section>
      )}

      {active === "grow-ops" && hasGrowOps && (
        <section style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "32px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Capabilities</h2>
          {(company.serviceTags?.length ?? 0) > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: (company.products?.length ?? 0) > 0 ? "32px" : 0 }}>
              {(company.serviceTags ?? []).map((tag) => (
                <span key={tag} style={{ background: "#fbf9f8", color: "#1b1c1b", fontSize: "12px", fontWeight: 600, padding: "6px 12px", borderRadius: "0.25rem", border: `1px solid ${PARCHMENT}` }}>{tag}</span>
              ))}
            </div>
          )}
          {(company.products?.length ?? 0) > 0 && (
            <>
              <h2 style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Products</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(company.products ?? []).map((p) => (
                  <div key={p.name} style={{ padding: "12px 0", borderBottom: `1px solid ${PARCHMENT}` }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 600, color: INK, margin: "0 0 4px" }}>{p.name}</h4>
                    <p style={{ fontSize: "14px", color: VARIANT, margin: 0 }}>{p.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {active === "certifications" && hasCerts && (
        <section style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "32px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Certifications &amp; Credentials</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {[...(company.certifications ?? []), ...(company.credentials ?? [])].map((cert) => (
              <div key={cert} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fbf9f8", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "10px 16px", fontSize: "14px", fontWeight: 500, color: INK }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: SAGE }}>verified</span> {cert}
              </div>
            ))}
          </div>
        </section>
      )}

      {active === "faqs" && hasFaqs && (
        <FaqAccordion
          items={(company.faqs ?? []).map((f) => ({ q: f.question, a: f.answer }))}
          itemStyle={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem" }}
          questionStyle={{ color: INK }}
          answerStyle={{ color: VARIANT }}
        />
      )}
      {tabs.find(t => t.id === active)?.locked && (
        <section style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "40px 32px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#9CA3AF", marginBottom: "12px", display: "block" }}>lock</span>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", margin: "0 0 8px" }}>{isFree ? "Select Feature" : "Verified Pro Feature"}</h3>
          <p style={{ fontSize: "14px", color: "#414943", margin: "0 0 16px" }}>{isFree ? "Upgrade to add listing details." : "Upgrade to Verified Pro to unlock this section."}</p>
          <Link href="/pricing" style={{ fontSize: "13px", fontWeight: 700, color: "#003320", textDecoration: "none" }}>View Plans &rarr;</Link>
        </section>
      )}


      {company.tier === "elite" && similar.length > 0 && (
        <section>
          <h3 style={{ fontSize: "24px", fontWeight: 600, color: INK, margin: "16px 0 24px" }}>Similar Verified Partners</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "24px" }}>
            {similar.map((c) => (
              <Link key={c.slug} href={`/vendor/${c.slug}`} style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "16px", textDecoration: "none", display: "block" }}>
                <div style={{ height: "128px", borderRadius: "0.25rem", marginBottom: "16px", overflow: "hidden", background: c.logoColor + "22" }}>
                  {c.bannerImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.bannerImageUrl} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${c.logoColor}33, ${c.logoColor}11)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "32px", color: c.logoColor, opacity: 0.4 }}>nature</span>
                    </div>
                  )}
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 700, color: INK, margin: "0 0 4px" }}>{c.name}</h4>
                <p style={{ fontSize: "12px", color: VARIANT, margin: "0 0 8px" }}>{[c.location.city, c.location.state].filter(Boolean).join(", ")}</p>
                {(c.tier === "elite" || c.tier === "select") && (
                  <span style={{ fontSize: "12px", color: SAGE, background: "rgba(187,238,209,0.2)", padding: "2px 8px", borderRadius: "0.25rem", display: "inline-block", fontWeight: 600 }}>Verified</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
