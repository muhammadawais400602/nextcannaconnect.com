"use client";

import { useState } from "react";
import { Company } from "@/types";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";

function StatTile({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "16px", textAlign: "center" }}>
      <span className="material-symbols-outlined" style={{ fontSize: "24px", color: SAGE, display: "block", marginBottom: "8px" }}>{icon}</span>
      <div style={{ fontSize: "24px", fontWeight: 600, color: "#001c10" }}>{value}</div>
      <div style={{ fontSize: "12px", fontWeight: 600, color: VARIANT }}>{label}</div>
    </div>
  );
}

export default function TransportProfileTabs({ company }: { company: Company }) {
  const stats = [
    company.foundedYear ? { icon: "corporate_fare", value: String(company.foundedYear), label: "Founded" } : null,
    company.vehicleCount ? { icon: "local_shipping", value: String(company.vehicleCount), label: "Vehicles" } : null,
    company.statesActive || company.statesServed?.length
      ? { icon: "map", value: String(company.statesActive ?? company.statesServed!.length), label: "States Active" }
      : null,
    company.loadsPerMonth ? { icon: "sync_alt", value: company.loadsPerMonth, label: "Loads/mo" } : null,
  ].filter(Boolean) as { icon: string; value: string; label: string }[];

  const licenses = company.licensesTable ?? [];
  const services = company.serviceTags ?? [];

  const hasLicenses = licenses.length > 0;
  const hasServices = services.length > 0;

  const tabs = [
    { id: "overview", label: "Overview" },
    hasLicenses ? { id: "licenses", label: "Licenses" } : null,
    hasServices ? { id: "services", label: "Services" } : null,
  ].filter(Boolean) as { id: string; label: string }[];

  const [active, setActive] = useState("overview");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${PARCHMENT}`, overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "32px", minWidth: "max-content" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              style={{
                paddingBottom: "12px",
                borderBottom: active === t.id ? `2px solid ${DF}` : "2px solid transparent",
                color: active === t.id ? DF : VARIANT,
                fontWeight: active === t.id ? 700 : 500,
                fontSize: "14px",
                whiteSpace: "nowrap",
                background: "none",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {active === "overview" && (
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#001c10", margin: 0 }}>About {company.name}</h2>
          <div style={{ fontSize: "16px", color: VARIANT, lineHeight: 1.7, maxWidth: "768px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {(company.fullDescription || company.shortDescription).split("\n\n").map((p, i) => <p key={i} style={{ margin: 0 }}>{p}</p>)}
          </div>
          {stats.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`, gap: "16px", paddingTop: "16px" }}>
              {stats.map((s) => <StatTile key={s.label} icon={s.icon} value={s.value} label={s.label} />)}
            </div>
          )}
        </section>
      )}

      {/* Licenses */}
      {active === "licenses" && hasLicenses && (
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#001c10", margin: 0 }}>Licenses &amp; Credentials</h2>
          <div style={{ background: "white", borderRadius: "0.5rem", border: `1px solid ${PARCHMENT}`, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "16px" }}>
                <thead style={{ background: "rgba(228,226,225,0.3)", borderBottom: `1px solid ${PARCHMENT}` }}>
                  <tr>
                    {["Type", "Issuing Authority", "License / Policy #", "Status"].map((h) => (
                      <th key={h} style={{ padding: "16px", fontWeight: 500, fontSize: "14px", color: DF, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {licenses.map((l, i) => (
                    <tr key={i} style={{ borderTop: i > 0 ? `1px solid ${PARCHMENT}` : "none" }}>
                      <td style={{ padding: "16px" }}>{l.type}</td>
                      <td style={{ padding: "16px", color: VARIANT }}>{l.authority}</td>
                      <td style={{ padding: "16px", fontFamily: "monospace", fontSize: "14px" }}>{l.number}</td>
                      <td style={{ padding: "16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: SAGE, fontSize: "12px", fontWeight: 600, background: "rgba(184,235,206,0.2)", padding: "4px 8px", borderRadius: "0.25rem" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check_circle</span>
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

      {/* Services */}
      {active === "services" && hasServices && (
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#001c10", margin: 0 }}>Services</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {services.map((s) => (
              <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "10px 16px", fontSize: "14px", fontWeight: 500, color: "#1b1c1b" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: SAGE }}>check_circle</span>
                {s}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
