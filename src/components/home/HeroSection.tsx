"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/data/categories";

const US_STATES = [
  "California, USA", "Colorado, USA", "Oregon, USA", "Washington, USA",
  "Nevada, USA", "New York, USA", "Michigan, USA", "Massachusetts, USA",
  "Illinois, USA", "New Jersey, USA", "Arizona, USA", "Montana, USA",
  "New Mexico, USA", "Connecticut, USA", "Maryland, USA",
];

export default function HeroSection() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");

  function handleSearch() {
    const path = category ? `/directory/${category}` : "/directory";
    const params = new URLSearchParams();
    if (state) {
      const stateOnly = state.replace(", USA", "").replace(", Canada", "");
      params.set("state", stateOnly);
    }
    const qs = params.toString();
    router.push(qs ? `${path}?${qs}` : path);
  }

  return (
    <section
      className="relative w-full overflow-hidden flex items-center"
      style={{ minHeight: "700px", paddingTop: "80px", backgroundColor: "#fbf9f8" }}
    >
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(26,74,53,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(136,185,158,0.08) 0%, transparent 50%)
          `,
        }}
      />

      <div
        className="relative z-10 w-full mx-auto px-8 lg:px-16 text-center"
        style={{ maxWidth: "1440px", paddingTop: "48px", paddingBottom: "80px" }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {/* Badge */}
          <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
            <span
              className="inline-block px-4 py-1.5 rounded-full"
              style={{
                backgroundColor: "#1a4a35",
                color: "#88b99e",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "28px",
              }}
            >
              Premier B2B Infrastructure
            </span>
          </div>

          {/* Headline */}
          <h1
            className="animate-fade-in-up"
            style={{
              animationDelay: "80ms",
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(42px, 6vw, 72px)",
              fontWeight: 700,
              color: "#003320",
              lineHeight: 1.1,
              marginBottom: "24px",
            }}
          >
            The Modern Authority in{" "}
            <br />
            <span style={{ fontStyle: "italic", color: "#88b99e" }}>
              Cannabis Commerce.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up"
            style={{
              animationDelay: "160ms",
              color: "#414943",
              fontSize: "17px",
              lineHeight: 1.65,
              maxWidth: "540px",
              margin: "0 auto 48px",
            }}
          >
            Connecting high-yield cultivators with verified retail networks.
            Find the right partners for your growth journey.
          </p>

          {/* Search Bar */}
          <div
            className="animate-fade-in-up search-shadow"
            style={{
              animationDelay: "240ms",
              maxWidth: "820px",
              margin: "0 auto",
            }}
          >
            <div
              className="flex flex-col md:flex-row items-stretch gap-4 p-4 rounded-2xl"
              style={{
                backgroundColor: "white",
                border: "1px solid rgba(192,201,193,0.3)",
              }}
            >
              {/* State selector */}
              <div
                className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: "#f6f3f2",
                  border: "1px solid rgba(192,201,193,0.4)",
                }}
              >
                <span
                  className="material-symbols-outlined flex-shrink-0"
                  style={{ color: "#414943", fontSize: "20px" }}
                >
                  location_on
                </span>
                <div className="flex flex-col items-start w-full">
                  <label
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(65,73,67,0.6)",
                      marginBottom: "2px",
                    }}
                  >
                    Select State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-transparent border-none appearance-none"
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: state ? "#003320" : "#9CA3AF",
                      padding: 0,
                    }}
                  >
                    <option value="">All States</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category selector */}
              <div
                className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: "#f6f3f2",
                  border: "1px solid rgba(192,201,193,0.4)",
                }}
              >
                <span
                  className="material-symbols-outlined flex-shrink-0"
                  style={{ color: "#414943", fontSize: "20px" }}
                >
                  category
                </span>
                <div className="flex flex-col items-start w-full">
                  <label
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(65,73,67,0.6)",
                      marginBottom: "2px",
                    }}
                  >
                    Select Service
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-transparent border-none appearance-none"
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: category ? "#003320" : "#9CA3AF",
                      padding: 0,
                    }}
                  >
                    <option value="">All Services</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 rounded-xl"
                style={{
                  backgroundColor: "#003320",
                  color: "white",
                  padding: "14px 36px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  boxShadow: "0 4px 16px rgba(0,51,32,0.25)",
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

          {/* Popular quick links */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 animate-fade-in"
            style={{ animationDelay: "400ms", marginTop: "24px" }}
          >
            <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 500 }}>Popular:</span>
            {["Cultivation & Growing", "Testing & Science", "Compliance & Legal", "Retail & Dispensary"].map((label) => {
              const cat = CATEGORIES.find((c) => c.label === label);
              return (
                <Link
                  key={label}
                  href={cat ? `/directory/${cat.slug}` : "/directory"}
                  className="rounded-full transition-all"
                  style={{
                    fontSize: "12px",
                    color: "#414943",
                    backgroundColor: "white",
                    border: "1px solid rgba(192,201,193,0.5)",
                    padding: "4px 14px",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "#003320";
                    (e.currentTarget as HTMLElement).style.color = "#003320";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,201,193,0.5)";
                    (e.currentTarget as HTMLElement).style.color = "#414943";
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
