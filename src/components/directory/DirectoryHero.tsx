"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomDropdown from "@/components/ui/CustomDropdown";

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

export default function DirectoryHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("");

  function handleBrowse() {
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (query) params.set("q", query);
    const qs = params.toString();
    router.push(`/directory${qs ? `?${qs}` : ""}`);
  }

  return (
    <section
      style={{
        backgroundColor: "#003320",
        paddingTop: "120px",
        paddingBottom: "64px",
      }}
    >
      <div
        className="mx-auto px-4 md:px-8"
        style={{ maxWidth: "1440px", textAlign: "center" }}
      >
        <h1
          style={{
            fontFamily: "'Noto Serif', Georgia, serif",
            fontSize: "clamp(32px, 4.5vw, 62px)",
            fontWeight: 400,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Your Gateway to Elite{" "}
          <span style={{ color: "#88b99e", fontStyle: "italic" }}>B2B Procurement</span>
        </h1>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.7,
            marginBottom: "40px",
          }}
        >
          Access the industry&apos;s most rigorous network of verified cultivators,
          extractors, and logistics partners across North America.
        </p>

        {/* Search bar */}
        <div
          className="directory-hero-search"
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0",
            backgroundColor: "white",
            borderRadius: "12px",
            overflow: "hidden",
            maxWidth: "760px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
            margin: "0 auto",
          }}
        >
          {/* Text search */}
          <div
            style={{
              flex: 2,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 18px",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px", color: "#9CA3AF", flexShrink: 0 }}
            >
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBrowse()}
              placeholder="Search by partner name…"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "14px",
                color: "#111827",
                fontFamily: "'Inter', sans-serif",
                backgroundColor: "transparent",
              }}
            />
          </div>

          {/* State dropdown */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 16px",
              borderRight: "1px solid #e5e7eb",
              minWidth: 0,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px", color: "#9CA3AF", flexShrink: 0 }}
            >
              location_on
            </span>
            <CustomDropdown
              value={state}
              onChange={setState}
              placeholder="All States"
              wrapperStyle={{ flex: 1, minWidth: 0 }}
              triggerStyle={{ color: state ? "#111827" : "#9CA3AF", fontSize: "13px" }}
              items={US_STATES.map((s) => ({ value: s, label: s }))}
            />
          </div>

          {/* Browse button */}
          <button
            onClick={handleBrowse}
            style={{
              backgroundColor: "#003320",
              color: "white",
              border: "none",
              padding: "14px 28px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.05em",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#1a4a35"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#003320"; }}
          >
            Browse Marketplace
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .directory-hero-search {
            flex-direction: column !important;
            border-radius: 12px !important;
          }
          .directory-hero-search > div,
          .directory-hero-search > button {
            border-right: none !important;
            border-bottom: 1px solid #e5e7eb;
          }
          .directory-hero-search > button {
            border-bottom: none !important;
            border-radius: 0 0 12px 12px;
          }
        }
      `}</style>
    </section>
  );
}
