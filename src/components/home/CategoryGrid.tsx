"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";

const VERTICALS = [
  {
    icon: "eco",
    title: "Cultivation",
    description: "Bulk raw material, specialized genetics, and licensed grow operations.",
    count: "1,420",
    slug: "cultivation-growing",
  },
  {
    icon: "storefront",
    title: "Retail & Dispensary",
    description: "Licensed retail storefronts and delivery service networks.",
    count: "3,890",
    slug: "retail-dispensary",
  },
  {
    icon: "biotech",
    title: "Testing Labs",
    description: "Accredited testing facilities for potency, purity, and compliance.",
    count: "412",
    slug: "testing-science",
  },
  {
    icon: "local_shipping",
    title: "Distribution",
    description: "Secure logistics, specialized transport, and supply chain solutions.",
    count: "215",
    slug: "transportation-logistics",
  },
];

export default function CategoryGrid() {
  const [ref, inView] = useInView();

  return (
    <section className="py-14 md:py-24 px-4 md:px-8" style={{ backgroundColor: "#f6f3f2" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4 md:gap-6">
          <div style={{ maxWidth: "520px" }}>
            <h2
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "clamp(28px, 3vw, 40px)",
                fontWeight: 700,
                color: "#003320",
                marginBottom: "12px",
              }}
            >
              Ecosystem Verticals
            </h2>
            <p style={{ color: "#414943", fontSize: "15px", lineHeight: 1.7 }}>
              Our marketplace is structurally segmented into specialized nodes, ensuring
              high-fidelity discovery and transactional security across all sectors.
            </p>
          </div>
          <Link
            href="/directory"
            className="flex items-center gap-2 flex-shrink-0"
            style={{
              color: "#003320",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "gap 0.2s ease",
            }}
          >
            View Entire Directory
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </Link>
        </div>

        {/* 4-column grid */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {VERTICALS.map((v, i) => (
            <Link
              key={v.slug}
              href={`/directory/${v.slug}`}
              className="group relative rounded-xl overflow-hidden"
              style={{
                backgroundColor: "white",
                padding: "32px",
                textDecoration: "none",
                transition: "box-shadow 0.4s ease",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 80}ms`,
                transitionProperty: "opacity, transform, box-shadow",
                transitionDuration: inView ? "0.5s" : "0s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 60px rgba(0,51,32,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-lg mb-6"
                style={{
                  width: "48px",
                  height: "48px",
                  backgroundColor: "#f0eded",
                  color: "#003320",
                  transition: "transform 0.3s ease",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>{v.icon}</span>
              </div>

              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#003320",
                  marginBottom: "8px",
                }}
              >
                {v.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#414943",
                  lineHeight: 1.65,
                  marginBottom: "24px",
                }}
              >
                {v.description}
              </p>

              {/* Footer row */}
              <div
                className="flex justify-between items-center pt-5"
                style={{ borderTop: "1px solid rgba(192,201,193,0.4)" }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#88b99e",
                  }}
                >
                  {v.count} Listings
                </span>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#c0c9c1" }}>
                  chevron_right
                </span>
              </div>

              {/* Background ghost icon */}
              <div
                className="absolute pointer-events-none"
                style={{
                  right: "-48px",
                  bottom: "-48px",
                  opacity: 0.03,
                  transition: "opacity 0.3s ease",
                  fontSize: "0px",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "180px" }}>{v.icon}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
