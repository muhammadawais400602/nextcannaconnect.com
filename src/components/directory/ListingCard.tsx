import Link from "next/link";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { Company } from "@/types";
import TierBadge from "@/components/ui/TierBadge";

const TIER_BORDER: Record<string, string> = {
  featured: "#F7941D",
  elite: "#1A4A35",
  select: "#5CB85C",
  claimed: "#F9C31A",
  free: "#E8EDE8",
};

const TIER_BG: Record<string, string> = {
  featured: "white",
  elite: "white",
  select: "white",
  claimed: "white",
  free: "#FAFAFA",
};

interface ListingCardProps {
  company: Company;
  featured?: boolean;
}

export default function ListingCard({ company, featured = false }: ListingCardProps) {
  const isFree = company.tier === "free";
  const borderColor = TIER_BORDER[company.tier];
  const bgColor = TIER_BG[company.tier];

  if (featured) {
    // Full-width featured card
    return (
      <div
        className="card-hover rounded-xl overflow-hidden mb-4"
        style={{
          backgroundColor: "white",
          border: `1px solid ${borderColor}`,
          borderTop: `4px solid ${borderColor}`,
        }}
      >
        {/* Banner */}
        <div
          className="w-full flex items-center px-6 py-3"
          style={{ background: "linear-gradient(135deg, #1A4A35, #1C2B3A)", minHeight: "60px" }}
        >
          <span
            className="font-semibold uppercase"
            style={{ color: "#F7941D", fontSize: "11px", letterSpacing: "2px" }}
          >
            ★ FEATURED LISTING
          </span>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Logo */}
            <div
              className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: company.logoColor,
                fontSize: "16px",
              }}
            >
              {company.logoPlaceholder}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold" style={{ fontSize: "18px", color: "#1A2E1A", fontWeight: 700 }}>
                    {company.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5" style={{ color: "#4A5E4A", fontSize: "13px" }}>
                    <MapPin size={12} />
                    {company.location.city}, {company.location.state}
                  </div>
                </div>
                <TierBadge tier={company.tier} />
              </div>

              <p style={{ color: "#4A5E4A", fontSize: "14px", lineHeight: 1.6, marginBottom: "12px" }}>
                {company.shortDescription}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {company.serviceTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "#F7F9F7", color: "#4A5E4A", fontSize: "12px", border: "1px solid #E8EDE8" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/vendor/${company.slug}`}
                  className="btn-primary"
                  style={{ fontSize: "13px", padding: "8px 16px" }}
                >
                  View Full Profile <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard card
  return (
    <div
      className={`card-hover rounded-xl overflow-hidden ${isFree ? "opacity-80" : ""}`}
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderLeft: `4px solid ${borderColor}`,
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div
            className="rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: isFree ? "#C0C0C0" : company.logoColor,
              fontSize: "13px",
            }}
          >
            {company.logoPlaceholder}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="font-bold truncate"
                style={{ fontSize: "15px", color: isFree ? "#4A5E4A" : "#1A2E1A", fontWeight: 700 }}
              >
                {company.name}
              </h3>
              <TierBadge tier={company.tier} />
            </div>

            <div className="flex items-center gap-1 mb-2" style={{ color: "#4A5E4A", fontSize: "12px" }}>
              <MapPin size={11} />
              {company.location.city}, {company.location.state}
            </div>

            {!isFree && (
              <p style={{ color: "#4A5E4A", fontSize: "13px", lineHeight: 1.5, marginBottom: "10px" }}>
                {company.shortDescription}
              </p>
            )}

            {/* Rating */}
            {company.rating && !isFree && (
              <div className="flex items-center gap-1 mb-2">
                <Star size={12} fill="#F9C31A" stroke="#F9C31A" />
                <span style={{ fontSize: "12px", color: "#4A5E4A" }}>
                  {company.rating} ({company.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Service tags */}
            {!isFree && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {company.serviceTags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "#F7F9F7", color: "#4A5E4A", fontSize: "11px", border: "1px solid #E8EDE8" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action button */}
            {isFree ? (
              <Link
                href={`/signup?listing=${company.slug}`}
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: "#4A5E4A", fontSize: "12px", textDecoration: "underline" }}
              >
                Claim This Listing →
              </Link>
            ) : (
              <Link
                href={`/vendor/${company.slug}`}
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: "#F7941D", fontSize: "13px" }}
              >
                View Full Profile <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
