"use client";

import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import {
  Sprout, Factory, FlaskConical, Briefcase, Megaphone,
  Store, Truck, TestTube, Scale, Laptop, Building2, Landmark,
  ArrowRight,
} from "lucide-react";
import { useInView } from "@/hooks/useInView";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "cultivation-growing": <Sprout size={22} />,
  "manufacturers-suppliers": <Factory size={22} />,
  "extraction-processing": <FlaskConical size={22} />,
  "consultants-advisors": <Briefcase size={22} />,
  "marketing-branding-packaging": <Megaphone size={22} />,
  "retail-dispensary": <Store size={22} />,
  "transportation-logistics": <Truck size={22} />,
  "testing-science": <TestTube size={22} />,
  "compliance-legal": <Scale size={22} />,
  "technology-software": <Laptop size={22} />,
  "real-estate-construction": <Building2 size={22} />,
  "finance-insurance": <Landmark size={22} />,
};

const CATEGORY_COUNTS: Record<string, string> = {
  "cultivation-growing": "1,240+",
  "manufacturers-suppliers": "3,800+",
  "extraction-processing": "920+",
  "consultants-advisors": "2,100+",
  "marketing-branding-packaging": "1,650+",
  "retail-dispensary": "8,400+",
  "transportation-logistics": "710+",
  "testing-science": "480+",
  "compliance-legal": "1,320+",
  "technology-software": "990+",
  "real-estate-construction": "560+",
  "finance-insurance": "740+",
};

export default function CategoryGrid() {
  const [headerRef, headerInView] = useInView();
  const [gridRef, gridInView] = useInView();

  return (
    <section className="py-20 px-6" style={{ backgroundColor: "white" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>

        {/* Section header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="flex items-end justify-between mb-10"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <div>
            <span className="section-label">Browse Directory</span>
            <h2 className="section-title">12 Cannabis Industry Verticals</h2>
            <p style={{ color: "#6B7280", fontSize: "15px", marginTop: "8px", maxWidth: "480px" }}>
              Find vetted businesses across every segment of the cannabis supply chain.
            </p>
          </div>
          <Link
            href="/directory"
            className="hidden sm:flex items-center gap-1.5 font-semibold flex-shrink-0"
            style={{ color: "#F7941D", fontSize: "14px" }}
          >
            Browse All
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Grid */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
        >
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/directory/${cat.slug}`}
              className="group rounded-xl p-5 flex flex-col gap-3 transition-all"
              style={{
                backgroundColor: "#F8FAF8",
                border: "1px solid #E5E7EB",
                textDecoration: "none",
                opacity: gridInView ? 1 : 0,
                transform: gridInView ? "translateY(0) scale(1)" : "translateY(18px) scale(0.97)",
                transition: `opacity 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 50}ms, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${i * 50}ms`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "white";
                (e.currentTarget as HTMLElement).style.borderColor = "#1A4A35";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(26,74,53,0.10)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAF8";
                (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width: "44px",
                  height: "44px",
                  backgroundColor: "rgba(26,74,53,0.09)",
                  color: "#1A4A35",
                }}
              >
                {CATEGORY_ICONS[cat.slug]}
              </div>

              {/* Label + count */}
              <div>
                <p
                  className="font-bold leading-snug"
                  style={{ fontSize: "14px", color: "#111827", fontWeight: 700 }}
                >
                  {cat.label}
                </p>
                <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "3px", fontWeight: 500 }}>
                  {CATEGORY_COUNTS[cat.slug]} businesses
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile see all */}
        <div className="sm:hidden text-center mt-8">
          <Link href="/directory" className="btn-ghost" style={{ fontSize: "14px" }}>
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
