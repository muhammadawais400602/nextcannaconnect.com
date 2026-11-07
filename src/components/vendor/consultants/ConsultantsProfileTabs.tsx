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

export default function ConsultantsProfileTabs({ company, similar }: { company: Company; similar: Company[] }) {
  const stats = [
    company.foundedYear ? { label: "Founded", value: String(company.foundedYear) } : null,
    company.yearsInCannabis ? { label: "Years in Cannabis", value: String(company.yearsInCannabis) } : null,
    company.serviceArea ? { label: "States Served", value: company.serviceArea } : null,
    company.teamSize ? { label: "Team", value: company.teamSize } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const hasCredentials = (company.credentials?.length ?? 0) > 0 || (company.certifications?.length ?? 0) > 0;
  const hasServices = (company.serviceTags?.length ?? 0) > 0;
  const hasCaseStudies = (company.caseStudies?.length ?? 0) > 0;
  const hasFaqs = (company.faqs?.length ?? 0) > 0;
  const isElite = company.tier === "elite";
  const isFree = company.tier === "free";

  const tabs = [
    { id: "overview", label: "Overview" },
    hasCredentials ? { id: "credentials", label: "Credentials", locked: isFree } : null,
    hasServices ? { id: "services", label: "Services", locked: !isElite || isFree } : null,
    hasCaseStudies ? { id: "case-studies", label: "Case Studies", locked: !isElite || isFree } : null,
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

      {active === "credentials" && hasCredentials && (
        <section style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "32px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Credentials</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {[...(company.credentials ?? []), ...(company.certifications ?? [])].map((cred) => (
              <span key={cred} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(187,238,209,0.15)", border: `1px solid ${SAGE}44`, borderRadius: "0.5rem", padding: "10px 16px", fontSize: "14px", fontWeight: 500, color: INK }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: SAGE }}>workspace_premium</span>
                {cred}
              </span>
            ))}
          </div>
        </section>
      )}

      {active === "services" && hasServices && (
        <section style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "32px" }}>
          <h2 style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Services</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {(company.serviceTags ?? []).map((tag) => (
              <div key={tag} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${PARCHMENT}` }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: SAGE }}>check_circle</span>
                <span style={{ fontSize: "16px", color: INK }}>{tag}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {active === "case-studies" && hasCaseStudies && (
        <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(company.caseStudies ?? []).map((cs) => (
            <div key={cs.title} style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: INK, margin: "0 0 8px" }}>{cs.title}</h3>
              <p style={{ fontSize: "14px", color: VARIANT, lineHeight: 1.6, margin: 0 }}>{cs.summary}</p>
            </div>
          ))}
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
                      <span className="material-symbols-outlined" style={{ fontSize: "32px", color: c.logoColor, opacity: 0.4 }}>support_agent</span>
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
