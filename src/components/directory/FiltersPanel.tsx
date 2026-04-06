"use client";

import { Category } from "@/types";

interface FiltersPanelProps {
  category: Category;
  verificationFilters: string[];
  onVerificationChange: (filters: string[]) => void;
  serviceFilters: string[];
  onServiceChange: (filters: string[]) => void;
}

const VERIFICATION_OPTIONS = [
  { id: "verified", label: "Verified Partner" },
  { id: "certified", label: "Certified Member" },
  { id: "claimed", label: "Claimed Listing" },
  { id: "unclaimed", label: "Unclaimed Listing" },
];

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export default function FiltersPanel({
  category,
  verificationFilters,
  onVerificationChange,
  serviceFilters,
  onServiceChange,
}: FiltersPanelProps) {
  const serviceOptions = category.description
    .split(",")
    .slice(0, 4)
    .map((item) => item.trim().split(" ").slice(0, 2).join(" "));

  return (
    <div className="sticky" style={{ top: "100px" }}>
      <h3
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 700,
          color: "#111827",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          marginBottom: "24px",
        }}
      >
        Refine Results
      </h3>

      {/* Verification Status */}
      <div style={{ marginBottom: "28px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(65,73,67,0.5)",
            marginBottom: "14px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Verification Status
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {VERIFICATION_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                fontSize: "13px",
                color: "#374151",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <input
                type="checkbox"
                checked={verificationFilters.includes(opt.id)}
                onChange={() => onVerificationChange(toggle(verificationFilters, opt.id))}
                style={{
                  width: "15px",
                  height: "15px",
                  accentColor: "#003320",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#e5e7eb", marginBottom: "28px" }} />

      {/* Service Vertical */}
      <div style={{ marginBottom: "28px" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(65,73,67,0.5)",
            marginBottom: "14px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Service Vertical
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {serviceOptions.map((label) => (
            <label
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                fontSize: "13px",
                color: "#374151",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <input
                type="checkbox"
                checked={serviceFilters.includes(label)}
                onChange={() => onServiceChange(toggle(serviceFilters, label))}
                style={{
                  width: "15px",
                  height: "15px",
                  accentColor: "#003320",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Clear All */}
      {(verificationFilters.length > 0 || serviceFilters.length > 0) && (
        <button
          onClick={() => { onVerificationChange([]); onServiceChange([]); }}
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#003320",
            fontFamily: "'Inter', sans-serif",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
          }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
