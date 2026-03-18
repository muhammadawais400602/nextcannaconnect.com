import { MapPin, Star, Globe, Phone, Mail } from "lucide-react";
import { Company } from "@/types";
import TierBadge from "@/components/ui/TierBadge";
import { getCategoryBySlug } from "@/data/categories";

const TIER_BORDER: Record<string, string> = {
  featured: "#F7941D",
  elite: "#1A4A35",
  select: "#5CB85C",
  claimed: "#F9C31A",
  free: "#E8EDE8",
};

interface CompanyHeaderProps {
  company: Company;
}

export default function CompanyHeader({ company }: CompanyHeaderProps) {
  const borderColor = TIER_BORDER[company.tier] || "#E8EDE8";
  const category = getCategoryBySlug(company.category);

  return (
    <div
      className="rounded-xl overflow-hidden mb-6"
      style={{
        backgroundColor: "white",
        border: "1px solid #E8EDE8",
        borderTop: `5px solid ${borderColor}`,
      }}
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Logo */}
          <div
            className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: company.logoColor,
              fontSize: "22px",
              fontWeight: 800,
            }}
          >
            {company.logoPlaceholder}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <h1 className="font-bold" style={{ fontSize: "26px", color: "#1A2E1A", fontWeight: 800 }}>
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <TierBadge tier={company.tier} />
                  {category && (
                    <span style={{ color: "#4A5E4A", fontSize: "13px" }}>
                      {category.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="flex items-center gap-1" style={{ color: "#4A5E4A", fontSize: "13px" }}>
                <MapPin size={13} />
                {company.location.city}, {company.location.state}
              </div>
              {company.rating && (
                <div className="flex items-center gap-1">
                  <Star size={13} fill="#F9C31A" stroke="#F9C31A" />
                  <span style={{ fontSize: "13px", color: "#4A5E4A" }}>
                    {company.rating} ({company.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            <p style={{ color: "#4A5E4A", fontSize: "14px", lineHeight: 1.6, maxWidth: "600px", marginBottom: "16px" }}>
              {company.shortDescription}
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                  style={{ color: "#F7941D", fontSize: "13px" }}
                >
                  <Globe size={13} /> Website
                </a>
              )}
              {company.phone && (
                <a href={`tel:${company.phone}`} className="flex items-center gap-1.5" style={{ color: "#4A5E4A", fontSize: "13px" }}>
                  <Phone size={13} /> {company.phone}
                </a>
              )}
              {company.email && (
                <a href={`mailto:${company.email}`} className="flex items-center gap-1.5" style={{ color: "#4A5E4A", fontSize: "13px" }}>
                  <Mail size={13} /> {company.email}
                </a>
              )}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="btn-primary">Let&apos;s Connect</button>
              <button className="btn-ghost">Book a Meeting</button>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        {(company.serviceArea || company.teamSize || company.yearsInCannabis || company.pricingModel) && (
          <div
            className="mt-6 rounded-lg p-4"
            style={{ border: "1px solid #E8EDE8", backgroundColor: "#F7F9F7" }}
          >
            <p className="font-semibold uppercase mb-3" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
              Quick Facts
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {company.serviceArea && (
                <div>
                  <p style={{ fontSize: "11px", color: "#4A5E4A" }}>Service Area</p>
                  <p style={{ fontSize: "13px", color: "#1A2E1A", fontWeight: 600 }}>{company.serviceArea}</p>
                </div>
              )}
              {company.teamSize && (
                <div>
                  <p style={{ fontSize: "11px", color: "#4A5E4A" }}>Team Size</p>
                  <p style={{ fontSize: "13px", color: "#1A2E1A", fontWeight: 600 }}>{company.teamSize}</p>
                </div>
              )}
              {company.yearsInCannabis && (
                <div>
                  <p style={{ fontSize: "11px", color: "#4A5E4A" }}>Years in Cannabis</p>
                  <p style={{ fontSize: "13px", color: "#1A2E1A", fontWeight: 600 }}>{company.yearsInCannabis} years</p>
                </div>
              )}
              {company.pricingModel && (
                <div>
                  <p style={{ fontSize: "11px", color: "#4A5E4A" }}>Pricing Model</p>
                  <p style={{ fontSize: "13px", color: "#1A2E1A", fontWeight: 600 }}>{company.pricingModel}</p>
                </div>
              )}
              {company.minOrderQty && (
                <div>
                  <p style={{ fontSize: "11px", color: "#4A5E4A" }}>Min. Order</p>
                  <p style={{ fontSize: "13px", color: "#1A2E1A", fontWeight: 600 }}>{company.minOrderQty}</p>
                </div>
              )}
              {company.leadTime && (
                <div>
                  <p style={{ fontSize: "11px", color: "#4A5E4A" }}>Lead Time</p>
                  <p style={{ fontSize: "13px", color: "#1A2E1A", fontWeight: 600 }}>{company.leadTime}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
