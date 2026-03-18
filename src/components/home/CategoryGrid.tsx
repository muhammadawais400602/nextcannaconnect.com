"use client";

import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

const CATEGORY_COLORS = [
  "#F7941D", // orange
  "#1A4A35", // dark green
  "#5CB85C", // light green
  "#1C2B3A", // navy
];

const CATEGORY_ICONS: Record<string, string> = {
  "cultivation-growing": "🌱",
  "manufacturers-suppliers": "🏭",
  "extraction-processing": "⚗️",
  "consultants-advisors": "💼",
  "marketing-branding-packaging": "🎨",
  "retail-dispensary": "🏪",
  "transportation-logistics": "🚛",
  "testing-science": "🔬",
  "compliance-legal": "⚖️",
  "technology-software": "💻",
  "real-estate-construction": "🏗️",
  "finance-insurance": "💰",
};

export default function CategoryGrid() {
  return (
    <section className="py-16 px-8" style={{ backgroundColor: "#F7F9F7" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="text-center mb-10">
          <p
            className="font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#F7941D", fontSize: "11px", letterSpacing: "2px" }}
          >
            Browse by Category
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "28px", color: "#1A4A35", fontWeight: 700 }}
          >
            12 Cannabis Industry Verticals
          </h2>
        </div>

        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
          }}
        >
          {CATEGORIES.map((cat, i) => {
            const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
            return (
              <Link
                key={cat.slug}
                href={`/directory/${cat.slug}`}
                className="group flex flex-col items-start p-6 rounded-xl cursor-pointer"
                style={{
                  backgroundColor: color,
                  transition: "transform 0.2s ease, filter 0.2s ease",
                  textDecoration: "none",
                  minHeight: "120px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.04)";
                  (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.filter = "brightness(1)";
                }}
              >
                <span className="text-2xl mb-3">{CATEGORY_ICONS[cat.slug]}</span>
                <span
                  className="font-bold text-white leading-tight"
                  style={{ fontSize: "15px", fontWeight: 700 }}
                >
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
