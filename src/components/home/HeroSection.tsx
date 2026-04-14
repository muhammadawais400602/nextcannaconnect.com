"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/data/categories";

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];
const CA_PROVINCES = ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"];

export default function HeroSection() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");

  function handleSearch() {
    const path = category ? `/directory/${category}` : "/directory";
    const params = new URLSearchParams();
    if (state) {
      params.set("state", state);
    }
    const qs = params.toString();
    router.push(qs ? `${path}?${qs}` : path);
  }

  return (
    <section
      style={{
        position: "relative",
        minHeight: "700px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        paddingTop: "80px",
        overflow: "hidden",
        backgroundColor: "#eeeae3",
      }}
    >
      {/* Background image */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
      <div
        className="hero-section-content"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "64px 32px 80px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Badge */}
          <div style={{ marginBottom: "32px" }}>
            <span
              style={{
                display: "inline-block",
                backgroundColor: "#1a4a35",
                color: "#88b99e",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "8px 20px",
                borderRadius: "9999px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              WHERE CANNABIS OPERATORS CONNECT
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Noto Serif', Georgia, serif",
              fontSize: "clamp(38px, 5.5vw, 76px)",
              fontWeight: 400,
              color: "#003320",
              lineHeight: 1.1,
              marginBottom: "24px",
              letterSpacing: "-0.3px",
            }}
            className="hero-headline"
          >
            Cultivated Partners.{" "}
            <br />
            <span
              style={{
                fontStyle: "italic",
                color: "#88b99e",
              }}
            >
              Built for Growth.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              color: "#5a6360",
              lineHeight: 1.7,
              margin: "0 auto 48px",
            }}
          >
            Connect with the right partners to grow your cannabis business.
          </p>

          {/* Search Bar */}
          <div
            style={{
              maxWidth: "860px",
              margin: "0 auto",
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "12px",
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              boxShadow: "0 8px 40px -8px rgba(0,51,32,0.18), 0 2px 8px rgba(0,0,0,0.04)",
              border: "1px solid rgba(192,201,193,0.25)",
            }}
            className="hero-search-bar"
          >
            {/* Service dropdown */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 16px",
                backgroundColor: "#f6f3f2",
                borderRadius: "10px",
                border: "1px solid rgba(192,201,193,0.35)",
                minWidth: 0,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px", color: "#717973", flexShrink: 0 }}
              >
                category
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: category ? "#003320" : "#717973",
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                    appearance: "none",
                    padding: 0,
                  }}
                >
                  <option value="">Select Service</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px", color: "#9CA3AF", flexShrink: 0 }}
              >
                expand_more
              </span>
            </div>

            {/* State dropdown */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 16px",
                backgroundColor: "#f6f3f2",
                borderRadius: "10px",
                border: "1px solid rgba(192,201,193,0.35)",
                minWidth: 0,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "20px", color: "#717973", flexShrink: 0 }}
              >
                location_on
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: state ? "#003320" : "#717973",
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                    appearance: "none",
                    padding: 0,
                  }}
                >
                  <option value="">Select State / Province</option>
                  <optgroup label="United States">
                    <option value="all-us">All States (USA)</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Canada">
                    <option value="all-ca">All Provinces (Canada)</option>
                    {CA_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px", color: "#9CA3AF", flexShrink: 0 }}
              >
                expand_more
              </span>
            </div>

            {/* Browse button */}
            <button
              onClick={handleSearch}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#003320",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "12px 32px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#1a4a35"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#003320"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>search</span>
              Browse
            </button>
          </div>

        </div>
      </div>

      <style>{`
        .hero-headline {
          white-space: normal;
        }
        @media (max-width: 768px) {
          .hero-search-bar {
            flex-direction: column !important;
            padding: 10px !important;
            gap: 10px !important;
          }
          .hero-headline {
            font-size: clamp(28px, 8vw, 46px) !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
            margin-bottom: 32px !important;
          }
        }
        @media (max-width: 600px) {
          .hero-section-content {
            padding: 24px 16px 48px !important;
          }
          .hero-subtitle {
            font-size: 14px !important;
          }
          .hero-badge {
            font-size: 9px !important;
            padding: 6px 14px !important;
          }
        }
      `}</style>
    </section>
  );
}
