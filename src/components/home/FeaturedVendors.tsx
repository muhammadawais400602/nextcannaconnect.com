"use client";

import Link from "next/link";
import { getFeaturedCompanies } from "@/data/companies";
import { MapPin, ArrowRight, Star } from "lucide-react";
import TierBadge from "@/components/ui/TierBadge";
import { useInView } from "@/hooks/useInView";

export default function FeaturedVendors() {
  const companies = getFeaturedCompanies();
  const [headerRef, headerInView] = useInView();
  const [gridRef, gridInView] = useInView();

  return (
    <section className="py-20 px-6" style={{ backgroundColor: "#F8FAF8" }}>
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
            <span className="section-label">Featured Listings</span>
            <h2 className="section-title">Top Verified Businesses</h2>
            <p style={{ color: "#6B7280", fontSize: "15px", marginTop: "8px" }}>
              Vetted, verified partners ready to work with your cannabis operation.
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

        {/* Cards grid */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))" }}
        >
          {companies.map((company, i) => (
            <Link
              key={company.id}
              href={`/vendor/${company.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden card-hover"
              style={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                textDecoration: "none",
                opacity: gridInView ? 1 : 0,
                transform: gridInView ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms`,
              }}
            >
              {/* Card top band */}
              <div
                className="h-1.5 w-full flex-shrink-0"
                style={{ backgroundColor: company.logoColor }}
              />

              <div className="p-6 flex flex-col flex-1">
                {/* Logo + name */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
                    style={{
                      width: "52px",
                      height: "52px",
                      backgroundColor: company.logoColor,
                      fontSize: "15px",
                      fontWeight: 800,
                    }}
                  >
                    {company.logoPlaceholder}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="font-bold leading-tight"
                        style={{ fontSize: "15px", color: "#111827", fontWeight: 700 }}
                      >
                        {company.name}
                      </h3>
                      <TierBadge tier={company.tier} />
                    </div>
                    <div
                      className="flex items-center gap-1 mt-1"
                      style={{ color: "#9CA3AF", fontSize: "12px" }}
                    >
                      <MapPin size={11} />
                      {company.location.city}, {company.location.state}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {company.rating && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= Math.round(company.rating!) ? "#F9C31A" : "#E5E7EB"}
                          stroke="none"
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>
                      {company.rating} ({company.reviewCount} reviews)
                    </span>
                  </div>
                )}

                {/* Description */}
                <p
                  className="flex-1"
                  style={{ color: "#6B7280", fontSize: "13px", lineHeight: 1.6, marginBottom: "16px" }}
                >
                  {company.shortDescription.slice(0, 110)}...
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {company.serviceTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "#F3F4F6",
                        color: "#374151",
                        fontSize: "11px",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className="flex items-center gap-1 font-semibold transition-colors"
                  style={{ color: "#F7941D", fontSize: "13px" }}
                >
                  View Full Profile
                  <ArrowRight
                    size={13}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div
          className="text-center mt-10"
          style={{
            opacity: gridInView ? 1 : 0,
            transition: "opacity 0.5s ease 350ms",
          }}
        >
          <Link href="/directory" className="btn-primary" style={{ fontSize: "14px" }}>
            Browse Full Directory
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
