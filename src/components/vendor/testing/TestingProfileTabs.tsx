"use client";

import { useState } from "react";
import Link from "next/link";
import { Company } from "@/types";

const DF = "#003320";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const OUTLINE = "#717973";

const CAP_ICONS: Record<string, string> = {
  potency: "science",
  pesticide: "bug_report",
  microbial: "coronavirus",
  solvent: "water_drop",
  "heavy metal": "biotech",
  terpene: "grain",
};

function capIcon(name: string): string {
  const key = Object.keys(CAP_ICONS).find((k) => name.toLowerCase().includes(k));
  return key ? CAP_ICONS[key] : "science";
}

export default function TestingProfileTabs({ company }: { company: Company }) {
  const stats = [
    company.foundedYear ? { label: "Founded", value: String(company.foundedYear) } : null,
    company.teamSize ? { label: "Team Size", value: company.teamSize } : null,
    company.facilitySize ? { label: "Facility", value: company.facilitySize } : null,
    company.samplesTested ? { label: "Samples Tested", value: company.samplesTested } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const capabilities = company.capabilities ?? [];
  const accreditations = company.accreditations ?? [];

  const hasCapabilities = capabilities.length > 0;
  const hasAccreditation = accreditations.length > 0 || !!company.accreditation;
  const isElite = company.tier === "elite";
  const isFree = company.tier === "free";

  const tabs = [
    { id: "overview", label: "Overview" },
    hasAccreditation ? { id: "accreditation", label: "Accreditation", locked: isFree } : null,
    hasCapabilities ? { id: "capabilities", label: "Capabilities", locked: !isElite || isFree } : null,
  ].filter(Boolean) as { id: string; label: string; locked?: boolean }[];

  const [active, setActive] = useState("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${PARCHMENT}`, display: "flex", gap: "32px", overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              paddingBottom: "12px",
              borderBottom: active === t.id ? `2px solid ${DF}` : "2px solid transparent",
              color: t.locked ? "#9CA3AF" : (active === t.id ? DF : VARIANT),
              fontWeight: active === t.id ? 700 : 500,
              fontSize: "14px",
              whiteSpace: "nowrap",
              background: "none",
              cursor: "pointer",
            }}
          >
              {t.label}{t.locked && <span className="material-symbols-outlined" style={{ fontSize: "14px", marginLeft: "4px", verticalAlign: "middle" }}>lock</span>}
            </button>
        ))}
      </div>

      {/* Overview */}
      {active === "overview" && (
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 24px" }}>About {company.name}</h2>
          <div style={{ fontSize: "16px", color: VARIANT, lineHeight: 1.7, maxWidth: "768px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {(company.fullDescription || company.shortDescription).split("\n\n").map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
          </div>
          {stats.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))`, gap: "16px", marginTop: "32px" }}>
              {stats.map((s) => (
                <div key={s.label} style={{ padding: "16px", background: "#f5f3f2", borderRadius: "0.25rem", border: `1px solid ${PARCHMENT}` }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: OUTLINE, marginBottom: "4px" }}>{s.label}</div>
                  <div style={{ fontSize: "24px", fontWeight: 600, color: DF }}>{s.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Accreditation */}
      {active === "accreditation" && hasAccreditation && (
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 24px" }}>Accreditation &amp; Credentials</h2>
          {company.accreditation && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#f5f3f2", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "12px 16px", fontSize: "16px", fontWeight: 600, color: DF, marginBottom: "24px" }}>
              <span className="material-symbols-outlined" style={{ color: "#88B99E" }}>verified</span>
              {company.accreditation}
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {accreditations.map((a) => (
              <span key={a} style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#88B99E", border: "1px solid #88B99E", padding: "6px 12px", borderRadius: "0.25rem" }}>{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Capabilities */}
      {active === "capabilities" && hasCapabilities && (
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 24px" }}>Testing Capabilities</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
            {capabilities.map((c) => (
              <div key={c.name} style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "24px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#efedec", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: DF }}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{capIcon(c.name)}</span>
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: DF, margin: "0 0 8px" }}>{c.name}</h3>
                <p style={{ fontSize: "14px", color: VARIANT, margin: "0 0 16px", lineHeight: 1.5 }}>{c.description}</p>
                {c.method && (
                  <div style={{ fontSize: "12px", color: OUTLINE, fontFamily: "monospace", background: "#f5f3f2", padding: "4px 8px", borderRadius: "0.25rem", display: "inline-block" }}>Method: {c.method}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tabs.find(t => t.id === active)?.locked && (
        <section style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "40px 32px", textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#9CA3AF", marginBottom: "12px", display: "block" }}>lock</span>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1A1A1A", margin: "0 0 8px" }}>{isFree ? "Select Feature" : "Verified Pro Feature"}</h3>
          <p style={{ fontSize: "14px", color: "#414943", margin: "0 0 16px" }}>{isFree ? "Upgrade to add listing details." : "Upgrade to Verified Pro to unlock this section."}</p>
          <Link href="/pricing" style={{ fontSize: "13px", fontWeight: 700, color: "#003320", textDecoration: "none" }}>View Plans &rarr;</Link>
        </section>
      )}
    </div>
  );
}
