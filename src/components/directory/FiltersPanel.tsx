"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

interface FiltersPanelProps {
  categoryLabel: string;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: "1px solid #F3F4F6", paddingBottom: "16px", marginBottom: "16px" }}>
      <button
        className="w-full flex items-center justify-between mb-3"
        onClick={() => setOpen(!open)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <span
          className="font-semibold uppercase tracking-wider"
          style={{ fontSize: "11px", color: "#374151", letterSpacing: "1px" }}
        >
          {label}
        </span>
        {open ? (
          <ChevronUp size={14} style={{ color: "#9CA3AF" }} />
        ) : (
          <ChevronDown size={14} style={{ color: "#9CA3AF" }} />
        )}
      </button>
      {open && children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#111827",
  backgroundColor: "white",
  outline: "none",
};

export default function FiltersPanel({ categoryLabel }: FiltersPanelProps) {
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [licenseType, setLicenseType] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const hasFilters = location || serviceType !== "all" || licenseType !== "all" || verifiedOnly;

  return (
    <div
      className="rounded-2xl p-5 sticky top-24"
      style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold" style={{ fontSize: "14px", color: "#111827", fontWeight: 700 }}>
          Filters
        </h3>
        {hasFilters && (
          <button
            className="flex items-center gap-1 transition-colors"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#F7941D",
              fontSize: "12px",
              fontWeight: 600,
            }}
            onClick={() => {
              setLocation("");
              setServiceType("all");
              setLicenseType("all");
              setVerifiedOnly(false);
            }}
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
      </div>

      {/* Verified toggle */}
      <div
        className="flex items-center justify-between p-3 rounded-xl mb-5 cursor-pointer"
        style={{
          backgroundColor: verifiedOnly ? "rgba(26,74,53,0.07)" : "#F8FAF8",
          border: verifiedOnly ? "1px solid #1A4A35" : "1px solid #E5E7EB",
        }}
        onClick={() => setVerifiedOnly(!verifiedOnly)}
      >
        <span style={{ fontSize: "13px", color: "#111827", fontWeight: 500 }}>
          Verified Only
        </span>
        <div
          className="rounded-full flex items-center flex-shrink-0 transition-colors"
          style={{
            width: "36px",
            height: "20px",
            backgroundColor: verifiedOnly ? "#1A4A35" : "#D1D5DB",
            padding: "2px",
          }}
        >
          <div
            className="rounded-full bg-white transition-transform"
            style={{
              width: "16px",
              height: "16px",
              transform: verifiedOnly ? "translateX(16px)" : "translateX(0)",
            }}
          />
        </div>
      </div>

      {/* Location */}
      <FilterSection label="Location">
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        >
          <option value="">All States</option>
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </FilterSection>

      {/* Service Type */}
      <FilterSection label="Service Type">
        <div className="flex flex-col gap-2">
          {["all", "manufacturing", "consulting", "distribution", "software"].map((v) => (
            <label
              key={v}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <input
                type="radio"
                name="serviceType"
                value={v}
                checked={serviceType === v}
                onChange={() => setServiceType(v)}
                style={{ accentColor: "#F7941D", width: "14px", height: "14px" }}
              />
              <span style={{ fontSize: "13px", color: "#374151" }}>
                {v === "all" ? "All Services" : v.charAt(0).toUpperCase() + v.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* License Type */}
      <FilterSection label="License Type">
        <select
          value={licenseType}
          onChange={(e) => setLicenseType(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All License Types</option>
          <option value="cultivator">Cultivator</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="distributor">Distributor</option>
          <option value="retailer">Retailer</option>
          <option value="testing">Testing Lab</option>
        </select>
      </FilterSection>
    </div>
  );
}
