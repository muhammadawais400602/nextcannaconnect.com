"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import type { Company } from "@/types";

const TIER_LABELS: Record<string, string> = {
  elite:    "Verified Pro",
  featured: "Verified Pro",
  select:   "Select",
  claimed:  "Select",
  free:     "Unclaimed",
};

export default function FeaturedVendors({ companies }: { companies: Company[] }) {
  const loopedCompanies = [...companies, ...companies];

  const [headerRef, headerInView] = useInView();
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const isPaused = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = () => {
      if (!isDragging.current && !isPaused.current) {
        track.scrollLeft += 0.6;
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        animRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    startX.current = e.pageX - track.getBoundingClientRect().left;
    startScrollLeft.current = track.scrollLeft;
    track.style.cursor = "grabbing";
    track.style.userSelect = "none";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.getBoundingClientRect().left;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = startScrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
      trackRef.current.style.userSelect = "";
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const track = trackRef.current;
    if (!track) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX;
    startScrollLeft.current = track.scrollLeft;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    const walk = startX.current - e.touches[0].pageX;
    trackRef.current.scrollLeft = startScrollLeft.current + walk;
  };

  const onTouchEnd = () => { isDragging.current = false; };
  const onTouchCancel = () => { isDragging.current = false; };

  return (
    <section className="py-10 md:py-16 px-4 md:px-8" style={{ backgroundColor: "#fbf9f8" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
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
              Featured Select Listings
            </h2>
            <p style={{ color: "#414943", fontSize: "14px" }}>
              Select partners currently active in the marketplace.
            </p>
          </div>
        </div>

        {/* Scrollable marquee */}
        <div style={{ position: "relative" }}>
          {/* Fade edges */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "60px", zIndex: 2,
            background: "linear-gradient(to right, #fbf9f8, transparent)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "60px", zIndex: 2,
            background: "linear-gradient(to left, #fbf9f8, transparent)",
            pointerEvents: "none",
          }} />

          <div
            ref={trackRef}
            className="featured-scroll-track"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseOut={() => { if (!isDragging.current) isPaused.current = false; }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
          >
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
                onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
                draggable={false}
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
                    {company.bannerImageUrl ? (
                      <Image
                        src={company.bannerImageUrl}
                        alt={company.name}
                        fill
                        sizes="280px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    ) : (
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
                    )}
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
        .featured-scroll-track {
          display: flex;
          gap: 20px;
          overflow-x: scroll;
          overflow-y: hidden;
          scroll-behavior: auto;
          padding-bottom: 8px;
          cursor: grab;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .featured-scroll-track::-webkit-scrollbar {
          display: none;
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
        }
      `}</style>
    </section>
  );
}
