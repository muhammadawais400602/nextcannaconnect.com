"use client";

import { useState } from "react";
import TierGate from "./TierGate";
import { inputStyle, labelStyle, cardStyle, sectionTitle, gridTwo } from "./shared";
import type { CompanyData } from "./shared";

interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "select" | "number" | "toggle";
  options?: string[];
  placeholder?: string;
  tier?: "select" | "elite";
}

const CATEGORY_FIELDS: Record<string, { title: string; fields: FieldDef[] }> = {
  "cultivation-growing": {
    title: "Cultivation & Growing",
    fields: [
      { key: "facilitySize", label: "Canopy / Facility Size", placeholder: "e.g. 50,000 sq ft" },
      { key: "serviceArea", label: "Grow Type", type: "select", options: ["Indoor", "Outdoor", "Greenhouse", "Mixed"] },
      { key: "teamSize", label: "Team Size", placeholder: "e.g. 45 employees" },
      { key: "pricingModel", label: "Wholesale Available", type: "select", options: ["Yes", "No"] },
      { key: "licenseNumber", label: "License Number", placeholder: "e.g. CCL20-0001234", tier: "select" },
      { key: "certifications", label: "Certifications", placeholder: "e.g. Clean Green Certified, GAP", tier: "select" },
    ],
  },
  "manufacturers-suppliers": {
    title: "Manufacturers & Suppliers",
    fields: [
      { key: "minOrderQty", label: "Minimum Order Qty", placeholder: "e.g. 500 units" },
      { key: "leadTime", label: "Lead Time", placeholder: "e.g. 2-3 Weeks" },
      { key: "pricingModel", label: "OEM Available", type: "select", options: ["Yes", "No"] },
      { key: "serviceArea", label: "Ships To", placeholder: "e.g. Nationwide, West Coast" },
      { key: "certifications", label: "Certifications", placeholder: "e.g. ISO 9001, GMP", tier: "select" },
      { key: "productLines", label: "Product Lines", placeholder: "e.g. Vape Hardware, Packaging, Extracts", tier: "select" },
    ],
  },
  "extraction-processing": {
    title: "Extraction & Processing",
    fields: [
      { key: "serviceArea", label: "Extraction Method", type: "select", options: ["CO2", "Ethanol", "Hydrocarbon", "Solventless", "Multi-Method"] },
      { key: "facilitySize", label: "Facility Size", placeholder: "e.g. 10,000 sq ft" },
      { key: "turnaroundTime", label: "Turnaround Time", placeholder: "e.g. 5-7 Days" },
      { key: "pricingModel", label: "White Label Available", type: "select", options: ["Yes", "No"] },
      { key: "licenseNumber", label: "License Number", placeholder: "e.g. CDPH-T00001234", tier: "select" },
      { key: "certifications", label: "Certifications", placeholder: "e.g. GMP, ISO 17025", tier: "select" },
    ],
  },
  "consultants-advisors": {
    title: "Consultants & Advisors",
    fields: [
      { key: "specialtyAreas", label: "Specialization", placeholder: "e.g. Licensing, Operations, Compliance" },
      { key: "yearsExperience", label: "Years of Experience", type: "number", placeholder: "e.g. 12" },
      { key: "availability", label: "Free Consultation", type: "select", options: ["Yes", "No"] },
      { key: "credentials", label: "Credentials", placeholder: "e.g. JD, MBA, CPA" },
      { key: "hourlyRate", label: "Hourly Rate", placeholder: "e.g. $150-300/hr", tier: "select" },
      { key: "bio", label: "Consultant Bio", placeholder: "Brief professional biography...", tier: "select" },
    ],
  },
  "marketing-branding-packaging": {
    title: "Marketing, Branding & Packaging",
    fields: [
      { key: "serviceArea", label: "Core Services", placeholder: "e.g. Branding, Packaging Design, SEO" },
      { key: "pricingModel", label: "Project Minimum", placeholder: "e.g. $2,500" },
      { key: "leadTime", label: "Avg Turnaround", placeholder: "e.g. 2-4 Weeks" },
      { key: "teamSize", label: "Team Size", placeholder: "e.g. 15 people" },
      { key: "statesServed", label: "States Served", placeholder: "e.g. Nationwide", tier: "select" },
      { key: "certifications", label: "Industry Awards", placeholder: "e.g. Dieline Award, Cannabis Marketing Assoc.", tier: "elite" },
    ],
  },
  "retail-dispensary": {
    title: "Retail & Dispensary",
    fields: [
      { key: "licenseNumber", label: "License Number", placeholder: "e.g. 403-01234" },
      { key: "licenseType", label: "License Type", type: "select", options: ["Rec + Medical", "Recreational", "Medical Only"] },
      { key: "delivery", label: "Delivery", type: "select", options: ["Yes", "No", "Delivery Only"] },
      { key: "hours", label: "Hours", placeholder: "e.g. 9AM - 10PM" },
      { key: "locationsCount", label: "Number of Locations", type: "number", placeholder: "e.g. 3" },
      { key: "metrcIntegrated", label: "METRC Integrated", type: "toggle" },
    ],
  },
  "transportation-logistics": {
    title: "Transportation & Logistics",
    fields: [
      { key: "vehicleCount", label: "Number of Vehicles", type: "number", placeholder: "e.g. 24" },
      { key: "transportType", label: "Transport Type", type: "select", options: ["Temp Controlled", "Dry Goods", "Armored", "Refrigerated"] },
      { key: "loadsPerMonth", label: "Loads per Month", placeholder: "e.g. 480+" },
      { key: "cargoInsurance", label: "Cargo Insurance", placeholder: "e.g. $5M Cargo Coverage" },
      { key: "dispatchHours", label: "Dispatch Hours", placeholder: "e.g. 24/7 Dispatch" },
      { key: "gpsTracked", label: "GPS Tracked", type: "toggle" },
    ],
  },
  "testing-science": {
    title: "Testing & Science",
    fields: [
      { key: "accreditation", label: "Accreditation", placeholder: "e.g. ISO/IEC 17025" },
      { key: "turnaroundTime", label: "Turnaround Time", placeholder: "e.g. 48 Hours" },
      { key: "sampleTypes", label: "Sample Types", placeholder: "e.g. Flower, Oil, Edibles" },
      { key: "panelCount", label: "Test Panels", placeholder: "e.g. 11 Categories" },
      { key: "facilitySize", label: "Facility Size", placeholder: "e.g. 12k sqft" },
      { key: "rushService", label: "Rush Service", placeholder: "e.g. 24hr (+50%)", tier: "select" },
    ],
  },
  "compliance-legal": {
    title: "Compliance & Legal",
    fields: [
      { key: "licenseNumber", label: "Bar License / ID", placeholder: "e.g. CA Bar #123456" },
      { key: "specialtyAreas", label: "Practice Areas", placeholder: "e.g. Licensing, IP, Corporate" },
      { key: "statesServed", label: "States Practiced", placeholder: "e.g. CA, CO, OR" },
      { key: "availability", label: "Free Consultation", type: "select", options: ["Yes", "No"] },
      { key: "yearsExperience", label: "Years of Experience", type: "number", placeholder: "e.g. 15" },
      { key: "credentials", label: "Credentials", placeholder: "e.g. JD, LL.M Cannabis Law", tier: "select" },
    ],
  },
  "technology-software": {
    title: "Technology & Software",
    fields: [
      { key: "accreditation", label: "Certification", placeholder: "e.g. SOC 2 Type II" },
      { key: "serviceArea", label: "Integrations", placeholder: "e.g. Metrc, BioTrack, QuickBooks" },
      { key: "pricingModel", label: "Pricing Model", placeholder: "e.g. Per Location / Per Seat" },
      { key: "features", label: "Key Features", placeholder: "e.g. Inventory, POS, Compliance Reporting" },
      { key: "securityFeatures", label: "Security Features", placeholder: "e.g. AES-256, SAML SSO, RBAC", tier: "select" },
    ],
  },
  "real-estate-construction": {
    title: "Real Estate & Construction",
    fields: [
      { key: "projectsCompleted", label: "Projects Completed", placeholder: "e.g. 120+" },
      { key: "credentialHeadline", label: "Credential Headline", placeholder: "e.g. Credentialed in 5 States" },
      { key: "serviceArea", label: "Service Focus", placeholder: "e.g. Architecture, HVAC, General Contracting" },
      { key: "statesServed", label: "States Served", placeholder: "e.g. CA, CO, WA" },
      { key: "certifications", label: "Licenses & Certifications", placeholder: "e.g. General Contractor B, LEED AP", tier: "select" },
    ],
  },
  "finance-insurance": {
    title: "Finance & Insurance",
    fields: [
      { key: "licenseNumber", label: "License (NMLS / State)", placeholder: "e.g. NMLS #123456" },
      { key: "pricingModel", label: "Service Type", type: "select", options: ["Banking", "Lending", "Insurance", "Tax & Accounting", "Payment Processing"] },
      { key: "statesServed", label: "States Served", placeholder: "e.g. All 50 States" },
      { key: "leadTime", label: "Avg Funding / Processing Time", placeholder: "e.g. 5-10 Business Days" },
      { key: "certifications", label: "Industry Certifications", placeholder: "e.g. AICPA, CFP", tier: "select" },
    ],
  },
};

function parseArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string" && val.trim()) return val.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

export default function ListingDetailsTab({
  company,
  tier,
  onSaved,
}: {
  company: CompanyData;
  tier: string;
  onSaved: () => void;
}) {
  const catConfig = CATEGORY_FIELDS[company.category];
  const categoryLabel = company.category
    ? company.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Not Selected";

  const [form, setForm] = useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {};
    if (catConfig) {
      for (const f of catConfig.fields) {
        init[f.key] = company[f.key] ?? "";
      }
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (!catConfig) {
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A4A35", marginBottom: "8px" }}>
          Listing Details
        </h2>
        <p style={{ fontSize: "13px", color: "#6B7280" }}>
          No category-specific fields available for <strong>{categoryLabel}</strong>.
        </p>
      </div>
    );
  }

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of catConfig.fields) {
        const gated = f.tier && !tierMet(tier, f.tier);
        if (gated) continue;
        const val = form[f.key];
        if (f.type === "number") {
          payload[f.key] = val ? Number(val) : undefined;
        } else if (f.type === "toggle") {
          payload[f.key] = !!val;
        } else if (["certifications", "productLines", "specialtyAreas", "credentials", "statesServed", "features", "securityFeatures"].includes(f.key)) {
          payload[f.key] = typeof val === "string" ? val.split(",").map((s: string) => s.trim()).filter(Boolean) : val;
        } else {
          payload[f.key] = val;
        }
      }
      const res = await fetch("/api/vendor/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave}>
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>{catConfig.title} Details</h2>
        <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>
          Category-specific fields for your <strong>{categoryLabel}</strong> listing.
          {tier === "free" && " Upgrade to Select to make these details public on your listing page."}
        </p>

        <div style={gridTwo}>
          {catConfig.fields.map((f) => {
            const gated = f.tier && !tierMet(tier, f.tier);

            if (gated) {
              return (
                <div key={f.key} style={{ gridColumn: "1 / -1" }}>
                  <TierGate
                    requiredTier={f.tier!}
                    currentTier={tier}
                    label={`Upgrade to ${f.tier === "elite" ? "Verified Pro" : "Select"} to edit ${f.label}`}
                  >
                    <div />
                  </TierGate>
                </div>
              );
            }

            if (f.type === "select") {
              return (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <select
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={String(form[f.key] ?? "")}
                    onChange={(e) => setField(f.key, e.target.value)}
                  >
                    <option value="">— Select —</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              );
            }

            if (f.type === "toggle") {
              return (
                <div key={f.key} style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "22px" }}>
                  <button
                    type="button"
                    onClick={() => setField(f.key, !form[f.key])}
                    style={{
                      width: "40px",
                      height: "22px",
                      borderRadius: "11px",
                      border: "none",
                      background: form[f.key] ? "#1A4A35" : "#D1D5DB",
                      cursor: "pointer",
                      position: "relative",
                      transition: "background 0.2s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: form[f.key] ? "20px" : "2px",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: "white",
                        transition: "left 0.2s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </button>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{f.label}</label>
                </div>
              );
            }

            if (f.type === "number") {
              return (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input
                    type="number"
                    style={inputStyle}
                    value={String(form[f.key] ?? "")}
                    onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    min={0}
                  />
                </div>
              );
            }

            const isArrayField = ["certifications", "productLines", "specialtyAreas", "credentials", "statesServed", "features", "securityFeatures"].includes(f.key);
            const displayVal = isArrayField
              ? (Array.isArray(form[f.key]) ? (form[f.key] as string[]).join(", ") : String(form[f.key] ?? ""))
              : String(form[f.key] ?? "");

            return (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  style={inputStyle}
                  value={displayVal}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={f.placeholder}
                />
                {isArrayField && (
                  <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "3px" }}>Separate with commas</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky save */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "rgba(247,249,247,0.95)",
          backdropFilter: "blur(8px)",
          padding: "14px 0",
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          zIndex: 5,
        }}
      >
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "12px 28px",
            background: "#1A4A35",
            color: "white",
            border: "none",
            borderRadius: "9px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Listing Details"}
        </button>
        {saved && <span style={{ color: "#16A34A", fontSize: "13px", fontWeight: 600 }}>✓ Saved</span>}
        {error && <span style={{ color: "#DC2626", fontSize: "13px" }}>{error}</span>}
      </div>
    </form>
  );
}

function tierMet(current: string, required: "select" | "elite"): boolean {
  const order = { free: 0, select: 1, elite: 2 };
  return (order[current as keyof typeof order] ?? 0) >= (order[required] ?? 0);
}
