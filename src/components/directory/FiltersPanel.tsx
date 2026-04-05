"use client";

import Link from "next/link";
import { Category } from "@/types";

interface FiltersPanelProps {
  category: Category;
}

const VERIFICATION_OPTIONS = [
  { id: "verified", label: "Verified Partner" },
  { id: "certified", label: "Certified Member" },
  { id: "claimed", label: "Claimed Listing" },
];

export default function FiltersPanel({ category }: FiltersPanelProps) {
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
          {category.description
            .split(",")
            .slice(0, 4)
            .map((item) => item.trim().split(" ").slice(0, 2).join(" "))
            .map((label, i) => (
              <label
                key={i}
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

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "#e5e7eb", marginBottom: "28px" }} />

      {/* Member Benefit Card */}
      <div
        style={{
          backgroundColor: "#003320",
          borderRadius: "14px",
          padding: "20px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "inline-block",
            backgroundColor: "rgba(136,185,158,0.2)",
            color: "#88b99e",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: "999px",
            marginBottom: "12px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Member Benefit
        </span>
        <p
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "15px",
            fontWeight: 700,
            color: "white",
            lineHeight: 1.3,
            marginBottom: "10px",
          }}
        >
          Priority Analytics Now Available
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.65,
            marginBottom: "16px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Gain deep insights into market pricing and output trends across all 50 states.
        </p>
        <Link
          href="/membership"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#88b99e",
            textDecoration: "none",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          Upgrade Today
          <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
