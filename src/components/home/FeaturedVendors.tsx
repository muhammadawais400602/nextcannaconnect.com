"use client";

import Link from "next/link";
import { useRef } from "react";
import { getFeaturedCompanies } from "@/data/companies";

const TIER_LABELS: Record<string, string> = {
  elite: "Platinum",
  featured: "Verified",
  select: "Premier",
  claimed: "Verified",
  free: "Listed",
};

// Placeholder images using picsum with consistent seeds
const CARD_IMAGES = [
  "https://picsum.photos/seed/cannabis1/400/200",
  "https://picsum.photos/seed/cannabis2/400/200",
  "https://picsum.photos/seed/cannabis3/400/200",
  "https://picsum.photos/seed/cannabis4/400/200",
  "https://picsum.photos/seed/cannabis5/400/200",
  "https://picsum.photos/seed/cannabis6/400/200",
];

export default function FeaturedVendors() {
  const companies = getFeaturedCompanies();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }

  return (
    <section className="py-16 px-8" style={{ backgroundColor: "#fbf9f8" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "clamp(28px, 3vw, 40px)",
                fontWeight: 700,
                color: "#003320",
                marginBottom: "6px",
              }}
            >
              Featured Premium Listings
            </h2>
            <p style={{ color: "#414943", fontSize: "14px" }}>
              Top-tier verified partners currently active in the marketplace.
            </p>
          </div>

          <div className="flex items-center gap-6 flex-shrink-0">
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(65,73,67,0.5)",
              }}
            >
              Verified Ads ⓘ
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="flex items-center justify-center rounded-full"
                style={{
                  width: "44px",
                  height: "44px",
                  border: "1px solid rgba(0,51,32,0.2)",
                  color: "#003320",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#003320";
                  (e.currentTarget as HTMLElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#003320";
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_left</span>
              </button>
              <button
                onClick={() => scroll("right")}
                className="flex items-center justify-center rounded-full"
                style={{
                  width: "44px",
                  height: "44px",
                  border: "1px solid rgba(0,51,32,0.2)",
                  color: "#003320",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#003320";
                  (e.currentTarget as HTMLElement).style.color = "white";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#003320";
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {companies.map((company, i) => (
            <Link
              key={company.id}
              href={`/vendor/${company.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
              style={{
                minWidth: "280px",
                width: "calc(20% - 20px)",
                backgroundColor: "white",
                border: "1px solid rgba(192,201,193,0.3)",
                scrollSnapAlign: "start",
                textDecoration: "none",
                boxShadow: "0 1px 4px rgba(0,51,32,0.04)",
                transition: "box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,51,32,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,51,32,0.04)";
              }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: "176px" }}>
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: company.logoColor,
                    backgroundImage: `linear-gradient(135deg, ${company.logoColor} 0%, rgba(0,51,32,0.8) 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "transform 0.5s ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: "48px",
                      fontWeight: 800,
                      color: "rgba(255,255,255,0.25)",
                      fontFamily: "'Noto Serif', serif",
                    }}
                  >
                    {company.logoPlaceholder}
                  </span>
                </div>
                {/* Tier badge */}
                <div className="absolute top-3 left-3">
                  <span
                    style={{
                      backgroundColor: "rgba(0,51,32,0.9)",
                      color: "white",
                      fontSize: "8px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      padding: "4px 8px",
                      borderRadius: "2px",
                    }}
                  >
                    {TIER_LABELS[company.tier] || "Listed"}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "#003320",
                      fontSize: "15px",
                      lineHeight: 1.3,
                    }}
                  >
                    {company.name}
                  </h3>
                  {company.rating && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span style={{ color: "#f59e0b", fontSize: "12px" }}>★</span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#1b1c1c" }}>
                        {company.rating}
                      </span>
                    </div>
                  )}
                </div>

                <div
                  className="flex items-center gap-1 mb-5"
                  style={{ color: "#414943", fontSize: "11px" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>location_on</span>
                  {company.location.city}, {company.location.state}
                </div>

                <button
                  className="mt-auto w-full py-2.5 rounded-lg"
                  style={{
                    border: "1px solid rgba(192,201,193,0.5)",
                    color: "#003320",
                    fontWeight: 700,
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "#003320";
                    (e.currentTarget as HTMLElement).style.color = "white";
                    (e.currentTarget as HTMLElement).style.borderColor = "#003320";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "#003320";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,201,193,0.5)";
                  }}
                >
                  View Profile
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
