"use client";

import Link from "next/link";

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
  {
    icon: "local_shipping",
    title: "Transportation",
    description: "Licensed cannabis transport, last-mile delivery, and supply chain management.",
    slug: "transportation-logistics",
  },
  {
    icon: "biotech",
    title: "Testing Labs",
    description: "Accredited facilities for potency, purity, pesticides, and regulatory compliance.",
    slug: "testing-science",
  },
  {
    icon: "storefront",
    title: "Retail & Dispensary",
    description: "Dispensary operations, POS systems, retail design, and customer experience solutions.",
    slug: "retail-dispensary",
  },
  {
    icon: "domain",
    title: "Real Estate",
    description: "Cannabis facility design, construction, real estate brokerage, and zoning consultation.",
    slug: "real-estate-construction",
  },
  {
    icon: "campaign",
    title: "Marketing & Branding",
    description: "Brand strategy, packaging design, digital marketing, and creative services.",
    slug: "marketing-branding-packaging",
  },
  {
    icon: "account_balance",
    title: "Finance & Insurance",
    description: "Banking, lending, insurance, accounting, and financial services for cannabis businesses.",
    slug: "finance-insurance",
  },
];

// Duplicate for seamless loop
const LOOPED = [...CATEGORIES_DISPLAY, ...CATEGORIES_DISPLAY];

export default function OurCategories() {
  return (
    <section
      style={{
        backgroundColor: "#fbf9f8",
        borderTop: "1px solid rgba(192,201,193,0.25)",
        borderBottom: "1px solid rgba(192,201,193,0.25)",
        padding: "80px 0",
        overflow: "hidden",
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
          Our Categories
        </h2>
        <p style={{ color: "#414943", fontSize: "15px", lineHeight: 1.65, maxWidth: "520px" }}>
          Browse the marketplace through our specialized product and operational classifications.
          Expertly curated for rapid sourcing.
        </p>
      </div>

      {/* Marquee track */}
      <div
        className="categories-marquee-wrapper"
        style={{ position: "relative", overflow: "hidden" }}
      >
        {/* Fade edges */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", zIndex: 2,
          background: "linear-gradient(to right, #fbf9f8, transparent)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", zIndex: 2,
          background: "linear-gradient(to left, #fbf9f8, transparent)",
          pointerEvents: "none",
        }} />

        <div className="categories-marquee-track">
          {LOOPED.map((cat, i) => (
            <Link
              key={`${cat.slug}-${i}`}
              href={`/directory/${cat.slug}`}
              className="category-card"
              style={{ textDecoration: "none" }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "#f0eded",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  flexShrink: 0,
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "24px",
                    color: "#003320",
                    fontVariationSettings: "'FILL' 0, 'wght' 200, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  {cat.icon}
                </span>
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
        @keyframes categoriesMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .categories-marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: categoriesMarquee 40s linear infinite;
          padding: 8px 32px 16px;
        }

        .categories-marquee-wrapper:hover .categories-marquee-track {
          animation-play-state: paused;
        }

        .category-card {
          width: 280px;
          min-width: 280px;
          background: white;
          border: 1px solid rgba(192,201,193,0.35);
          border-radius: 16px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
        }

        .category-card:hover {
          box-shadow: 0 8px 32px rgba(0,51,32,0.1);
          border-color: rgba(0,51,32,0.2);
        }
      `}</style>
    </section>
  );
}
