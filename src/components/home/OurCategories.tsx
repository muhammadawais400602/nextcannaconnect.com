"use client";

import Link from "next/link";
import { useRef } from "react";

const CATEGORIES_DISPLAY = [
  {
    icon: "potted_plant",
    title: "Genetics & Clones",
    description: "High-yield, lab-verified genetics and proprietary strains for commercial cultivation.",
    slug: "cultivation-growing",
  },
  {
    icon: "inventory_2",
    title: "Bulk Flower",
    description: "Wholesale cannabis flower sourced from premium licensed cultivators nationwide.",
    slug: "manufacturers-suppliers",
  },
  {
    icon: "science",
    title: "Concentrates",
    description: "Extracts, distillates, and isolates refined by certified extraction facilities.",
    slug: "extraction-processing",
  },
  {
    icon: "medical_services",
    title: "Ancillary Goods",
    description: "Packaging, cultivation equipment, and hardware for vertically integrated operations.",
    slug: "manufacturers-suppliers",
  },
  {
    icon: "gavel",
    title: "Compliance & Legal",
    description: "Regulatory experts, licensing specialists, and legal counsel for cannabis operators.",
    slug: "compliance-legal",
  },
  {
    icon: "laptop_mac",
    title: "Technology & Software",
    description: "Seed-to-sale platforms, POS systems, and cannabis-specific SaaS tools.",
    slug: "technology-software",
  },
];

export default function OurCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" });
  }

  return (
    <section
      className="py-24 px-8 overflow-hidden"
      style={{ backgroundColor: "#fbf9f8", borderTop: "1px solid rgba(192,201,193,0.3)", borderBottom: "1px solid rgba(192,201,193,0.3)" }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <div>
            <h2
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "clamp(28px, 3vw, 40px)",
                fontWeight: 700,
                color: "#003320",
                marginBottom: "12px",
              }}
            >
              Our Categories
            </h2>
            <p style={{ color: "#414943", fontSize: "15px", maxWidth: "540px", lineHeight: 1.65 }}>
              Browse the marketplace through our specialized product and operational
              classifications. Expertly curated for rapid sourcing.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
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

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto no-scrollbar pb-4"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {CATEGORIES_DISPLAY.map((cat) => (
            <Link
              key={cat.title}
              href={`/directory/${cat.slug}`}
              className="group flex-shrink-0 rounded-2xl"
              style={{
                minWidth: "calc(25% - 24px)",
                backgroundColor: "white",
                padding: "32px",
                border: "1px solid rgba(192,201,193,0.35)",
                scrollSnapAlign: "start",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,51,32,0.1)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,51,32,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,201,193,0.35)";
              }}
            >
              {/* Icon circle */}
              <div
                className="flex items-center justify-center rounded-full mb-6"
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "rgba(0,51,32,0.05)",
                  color: "#003320",
                  transition: "all 0.3s ease",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>{cat.icon}</span>
              </div>

              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#003320",
                  marginBottom: "10px",
                }}
              >
                {cat.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#414943",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                }}
              >
                {cat.description}
              </p>

              <div
                className="flex items-center gap-2"
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#003320",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Explore Category
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
