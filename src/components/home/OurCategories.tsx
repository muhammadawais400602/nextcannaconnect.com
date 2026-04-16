"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { CATEGORIES } from "@/data/categories";

const CATEGORY_ICONS: Record<string, string> = {
  "cultivation-growing": "potted_plant",
  "manufacturers-suppliers": "inventory_2",
  "extraction-processing": "science",
  "consultants-advisors": "groups",
  "marketing-branding-packaging": "campaign",
  "retail-dispensary": "storefront",
  "transportation-logistics": "local_shipping",
  "testing-science": "biotech",
  "compliance-legal": "gavel",
  "technology-software": "laptop_mac",
  "real-estate-construction": "domain",
  "finance-insurance": "account_balance",
};

const CATEGORY_IMAGES: Record<string, string> = {
  "cultivation-growing": "/cannabis growth and cultivation.jpg",
  "manufacturers-suppliers": "/cannabis manufacture and supplier.jpg",
  "extraction-processing": "/cannabis extraction.jpg",
  "consultants-advisors": "/consultants and advisors.jpg",
  "marketing-branding-packaging": "/cannabis marketing.jpg",
  "retail-dispensary": "/cannabis retails.jpg",
  "transportation-logistics": "/cannabis transportation.jpg",
  "testing-science": "/cannabis testing.jpg",
  "compliance-legal": "/cannabis finance and compliance.jpg",
  "technology-software": "/cannabis technology.jpg",
  "real-estate-construction": "/cannabis real estate.jpg",
  "finance-insurance": "/cannabis consultants.jpg",
};

const CATEGORIES_DISPLAY = CATEGORIES.map((cat) => ({
  icon: CATEGORY_ICONS[cat.slug] ?? "category",
  image: CATEGORY_IMAGES[cat.slug] ?? null,
  title: cat.label,
  description: cat.description,
  slug: cat.slug,
}));

const LOOPED = [...CATEGORIES_DISPLAY, ...CATEGORIES_DISPLAY];

export default function OurCategories() {
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
        track.scrollLeft += 0.5;
        if (track.scrollLeft >= track.scrollWidth / 2) {
          track.scrollLeft = 0;
        }
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
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

  return (
    <section
      style={{
        backgroundColor: "#fbf9f8",
        borderTop: "1px solid rgba(192,201,193,0.25)",
        borderBottom: "1px solid rgba(192,201,193,0.25)",
        padding: "56px 0 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 32px",
          marginBottom: "48px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Noto Serif', Georgia, serif",
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 400,
            color: "#003320",
            marginBottom: "10px",
          }}
        >
          Our Marketplace
        </h2>
        <p style={{ color: "#414943", fontSize: "15px", lineHeight: 1.65, maxWidth: "520px" }}>
          Browse the marketplace through our specialized product and operational classifications.
          Expertly curated for rapid sourcing.
        </p>
      </div>

      {/* Scrollable track */}
      <div style={{ position: "relative" }}>
        {/* Fade edges */}
        <div className="cat-fade-edge" style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "60px", zIndex: 2,
          background: "linear-gradient(to right, #fbf9f8, transparent)",
          pointerEvents: "none",
        }} />
        <div className="cat-fade-edge" style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "60px", zIndex: 2,
          background: "linear-gradient(to left, #fbf9f8, transparent)",
          pointerEvents: "none",
        }} />

        <div
          ref={trackRef}
          className="categories-scroll-track"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onMouseEnter={() => { isPaused.current = true; }}
          onMouseOut={() => { if (!isDragging.current) isPaused.current = false; }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {LOOPED.map((cat, i) => (
            <Link
              key={`${cat.slug}-${i}`}
              href={`/directory/${cat.slug}`}
              className="category-card"
              style={{ textDecoration: "none" }}
              onClick={(e) => { if (isDragging.current) e.preventDefault(); }}
              draggable={false}
            >
              {/* Category image */}
              <div className="category-card-image">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="260px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    draggable={false}
                  />
                )}
              </div>

              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "17px",
                  color: "#003320",
                  marginBottom: "10px",
                  lineHeight: 1.3,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {cat.title}
              </h3>

              <p
                style={{
                  fontSize: "13px",
                  color: "#5a6360",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                  flex: 1,
                }}
              >
                {cat.description}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#003320",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Explore Category
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .categories-scroll-track {
          display: flex;
          gap: 20px;
          overflow-x: scroll;
          overflow-y: hidden;
          scroll-behavior: auto;
          padding: 8px 32px 16px;
          cursor: grab;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .categories-scroll-track::-webkit-scrollbar {
          display: none;
        }
        .category-card {
          width: 260px;
          min-width: 260px;
          background: white;
          border: 1px solid rgba(192,201,193,0.35);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          flex-shrink: 0;
        }
        .category-card-image {
          position: relative;
          height: 160px;
          border-radius: 15px 15px 0 0;
          overflow: hidden;
          margin: -24px -24px 20px -24px;
          flex-shrink: 0;
          background-color: #1a4a35;
        }
        .category-card:hover {
          box-shadow: 0 8px 32px rgba(0,51,32,0.1);
          border-color: rgba(0,51,32,0.2);
        }
        @media (max-width: 480px) {
          .category-card {
            width: 220px;
            min-width: 220px;
            padding: 20px;
          }
          .category-card-image {
            margin: -20px -20px 20px -20px;
          }
          .cat-fade-edge {
            width: 32px !important;
          }
        }
      `}</style>
    </section>
  );
}
