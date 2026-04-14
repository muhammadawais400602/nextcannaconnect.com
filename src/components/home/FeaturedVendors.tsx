"use client";

import Link from "next/link";
import { getFeaturedCompanies } from "@/data/companies";

const TIER_LABELS: Record<string, string> = {
  elite: "Verified",
  featured: "Verified",
  select: "Select",
  claimed: "Select",
  free: "Unclaimed",
};

export default function FeaturedVendors() {
  const companies = getFeaturedCompanies();
  // Duplicate cards for seamless infinite loop
  const loopedCompanies = [...companies, ...companies];

  return (
    <section className="py-10 md:py-16 px-4 md:px-8" style={{ backgroundColor: "#fbf9f8" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "clamp(28px, 3vw, 40px)",
                fontWeight: 400,
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

          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(65,73,67,0.5)",
              flexShrink: 0,
            }}
          >
            Verified Ads ⓘ
          </span>
        </div>

        {/* Auto-scrolling marquee container */}
        <div
          style={{ overflow: "hidden", position: "relative" }}
          className="featured-marquee-wrapper"
        >
          {/* Fade edges */}
          <div className="marquee-fade-left" style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "60px", zIndex: 2,
            background: "linear-gradient(to right, #fbf9f8, transparent)",
            pointerEvents: "none",
          }} />
          <div className="marquee-fade-right" style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "60px", zIndex: 2,
            background: "linear-gradient(to left, #fbf9f8, transparent)",
            pointerEvents: "none",
          }} />

          <div className="featured-marquee-track">
            {loopedCompanies.map((company, i) => (
              <Link
                key={`${company.id}-${i}`}
                href={`/vendor/${company.slug}`}
                className="featured-card group flex flex-col rounded-2xl overflow-hidden flex-shrink-0"
                style={{
                  textDecoration: "none",
                  backgroundColor: "white",
                  border: "1px solid rgba(192,201,193,0.3)",
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
                {/* Image / color block */}
                <div className="relative overflow-hidden" style={{ height: "176px" }}>
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      backgroundColor: company.logoColor,
                      backgroundImage: `linear-gradient(135deg, ${company.logoColor} 0%, rgba(0,51,32,0.8) 100%)`,
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
                  <div className="mb-1">
                    <h3 style={{ fontWeight: 700, color: "#003320", fontSize: "15px", lineHeight: 1.3 }}>
                      {company.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 mb-5" style={{ color: "#414943", fontSize: "11px" }}>
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
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .featured-marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: marquee 30s linear infinite;
          padding-bottom: 8px;
        }

        .featured-marquee-wrapper:hover .featured-marquee-track {
          animation-play-state: paused;
        }

        .featured-card {
          width: 260px;
          min-width: 260px;
        }

        @media (max-width: 480px) {
          .featured-card {
            width: 220px;
            min-width: 220px;
          }
          .marquee-fade-left, .marquee-fade-right {
            width: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
