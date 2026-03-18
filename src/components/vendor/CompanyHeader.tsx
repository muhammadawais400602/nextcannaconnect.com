import { MapPin, Star, Globe, Phone, Mail, ExternalLink } from "lucide-react";
import { Company } from "@/types";
import TierBadge from "@/components/ui/TierBadge";
import { getCategoryBySlug } from "@/data/categories";
import Link from "next/link";

const TIER_ACCENT: Record<string, string> = {
  featured: "#F7941D",
  elite: "#1A4A35",
  select: "#5CB85C",
  claimed: "#F9C31A",
  free: "#E5E7EB",
};

interface CompanyHeaderProps {
  company: Company;
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  const accent = TIER_ACCENT[company.tier] || "#E5E7EB";
  const category = getCategoryBySlug(company.category);

  return (
    <div
      className="rounded-2xl overflow-hidden mb-6"
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderTop: `4px solid ${accent}`,
      }}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Logo */}
          <div
            className="rounded-2xl flex items-center justify-center font-black text-white flex-shrink-0"
            style={{
              width: "88px",
              height: "88px",
              backgroundColor: company.logoColor,
              fontSize: "24px",
            }}
          >
            {company.logoPlaceholder}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <h1
                  className="font-extrabold"
                  style={{ fontSize: "26px", color: "#111827", fontWeight: 800, letterSpacing: "-0.3px" }}
                >
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <TierBadge tier={company.tier} />
                  {category && (
                    <Link
                      href={`/directory/${company.category}`}
                      style={{ color: "#9CA3AF", fontSize: "13px", textDecoration: "none" }}
                    >
                      {category.label}
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Location + rating */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5" style={{ color: "#6B7280", fontSize: "13px" }}>
                <MapPin size={13} />
                {company.location.city}, {company.location.state}
              </div>
              {company.rating && (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        fill={s <= Math.round(company.rating!) ? "#F9C31A" : "#E5E7EB"}
                        stroke="none"
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "13px", color: "#6B7280" }}>
                    {company.rating} ({company.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.7, maxWidth: "620px", marginBottom: "20px" }}>
              {company.shortDescription}
            </p>

            {/* Contact links */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-medium transition-colors"
                  style={{ color: "#F7941D", fontSize: "13px", textDecoration: "none" }}
                >
                  <Globe size={13} /> Website
                  <ExternalLink size={11} />
                </a>
              )}
              {company.phone && (
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center gap-1.5"
                  style={{ color: "#6B7280", fontSize: "13px", textDecoration: "none" }}
                >
                  <Phone size={13} /> {company.phone}
                </a>
              )}
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-1.5"
                  style={{ color: "#6B7280", fontSize: "13px", textDecoration: "none" }}
                >
                  <Mail size={13} /> {company.email}
                </a>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary" style={{ fontSize: "14px" }}>
                Let&apos;s Connect
              </button>
              <button className="btn-ghost" style={{ fontSize: "14px" }}>
                Book a Meeting
              </button>
            </div>
          </div>
        </div>

        {/* Quick Facts bar */}
        {(company.serviceArea || company.teamSize || company.yearsInCannabis || company.pricingModel || company.minOrderQty || company.leadTime) && (
          <div
            className="mt-6 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
            style={{ backgroundColor: "#F8FAF8", border: "1px solid #E5E7EB" }}
          >
            {[
              { label: "Service Area", value: company.serviceArea },
              { label: "Team Size", value: company.teamSize },
              { label: "Years in Cannabis", value: company.yearsInCannabis ? `${company.yearsInCannabis} yrs` : undefined },
              { label: "Pricing Model", value: company.pricingModel },
              { label: "Min. Order", value: company.minOrderQty },
              { label: "Lead Time", value: company.leadTime },
            ]
              .filter(({ value }) => value)
              .slice(0, 4)
              .map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "2px", fontWeight: 500 }}>
                    {label}
                  </p>
                  <p style={{ fontSize: "13px", color: "#111827", fontWeight: 600 }}>
                    {value}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
