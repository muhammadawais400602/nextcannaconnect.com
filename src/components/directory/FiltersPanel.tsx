"use client";

import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import type { Category } from "@/types";

interface FiltersPanelProps {
  category: Category | null;
  activeSlug: string;
  verificationFilters: string[];
  onVerificationChange: (filters: string[]) => void;
  serviceFilters: string[];
  onServiceChange: (filters: string[]) => void;
}

const VERIFICATION_OPTIONS = [
  { id: "verified-pro", label: "Verified Pro" },
  { id: "select",       label: "Select" },
  { id: "unclaimed",    label: "Unclaimed" },
];

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "rgba(65,73,67,0.5)",
  marginBottom: "14px",
  fontFamily: "'Inter', sans-serif",
};

export default function FiltersPanel({
  category,
  activeSlug,
  verificationFilters,
  onVerificationChange,
  serviceFilters,
  onServiceChange,
}: FiltersPanelProps) {
  const router = useRouter();

  const serviceOptions = category?.description
    ? category.description.split(",").slice(0, 4).map((item) => item.trim().split(" ").slice(0, 2).join(" "))
    : [];

  const hasFilters = verificationFilters.length > 0 || serviceFilters.length > 0;

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

      {/* Category */}
      <div style={{ marginBottom: "28px" }}>
        <p style={labelStyle}>Category</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <button
            onClick={() => router.push("/directory/all")}
            style={{
              textAlign: "left",
              background: activeSlug === "all" ? "rgba(0,51,32,0.08)" : "none",
              border: "none",
              borderRadius: "6px",
              padding: "6px 10px",
              fontSize: "13px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: activeSlug === "all" ? 700 : 400,
              color: activeSlug === "all" ? "#003320" : "#374151",
              cursor: "pointer",
            }}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => router.push(`/directory/${cat.slug}`)}
              style={{
                textAlign: "left",
                background: activeSlug === cat.slug ? "rgba(0,51,32,0.08)" : "none",
                border: "none",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "13px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: activeSlug === cat.slug ? 700 : 400,
                color: activeSlug === cat.slug ? "#003320" : "#374151",
                cursor: "pointer",
              }}
            >
              {cat.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: "1px", backgroundColor: "#e5e7eb", marginBottom: "28px" }} />

      {/* Verification Status */}
      <div style={{ marginBottom: "28px" }}>
        <p style={labelStyle}>Verification Status</p>
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
                style={{ width: "15px", height: "15px", accentColor: "#003320", cursor: "pointer", flexShrink: 0 }}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Service Vertical — only shown when a specific category is active */}
      {serviceOptions.length > 0 && (
        <>
          <div style={{ height: "1px", backgroundColor: "#e5e7eb", marginBottom: "28px" }} />
          <div style={{ marginBottom: "28px" }}>
            <p style={labelStyle}>Service Vertical</p>
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
                    style={{ width: "15px", height: "15px", accentColor: "#003320", cursor: "pointer", flexShrink: 0 }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Clear All */}
      {hasFilters && (
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
