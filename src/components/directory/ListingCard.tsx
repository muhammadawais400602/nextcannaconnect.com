import Link from "next/link";
import { MapPin, ArrowRight, Star, ExternalLink } from "lucide-react";
import { Company } from "@/types";
import TierBadge from "@/components/ui/TierBadge";

const TIER_ACCENT: Record<string, string> = {
  featured: "#F7941D",
  elite: "#1A4A35",
  select: "#5CB85C",
  claimed: "#F9C31A",
  free: "#E5E7EB",
};

interface ListingCardProps {
  company: Company;
  featured?: boolean;
}

export default function ListingCard({ company, featured = false }: ListingCardProps) {
  const isFree = company.tier === "free";
  const accent = TIER_ACCENT[company.tier];

  if (featured) {
    return (
      <div
        className="rounded-2xl overflow-hidden mb-5 card-hover"
        style={{
          backgroundColor: "white",
          border: "1px solid #E5E7EB",
          borderLeft: `4px solid ${accent}`,
        }}
      >
        {/* Featured label bar */}
        <div
          className="px-5 py-2.5 flex items-center gap-2"
          style={{ backgroundColor: "#FAFAF5", borderBottom: "1px solid #E5E7EB" }}
        >
          <Star size={13} fill="#F7941D" stroke="none" />
          <span
            className="font-bold uppercase"
            style={{ color: "#F7941D", fontSize: "11px", letterSpacing: "1px" }}
          >
            Featured Listing
          </span>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Logo */}
            <div
              className="rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: company.logoColor,
                fontSize: "18px",
                fontWeight: 800,
              }}
            >
              {company.logoPlaceholder}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-bold" style={{ fontSize: "18px", color: "#111827", fontWeight: 700 }}>
                    {company.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1" style={{ color: "#9CA3AF", fontSize: "12px" }}>
                      <MapPin size={11} />
                      {company.location.city}, {company.location.state}
                    </span>
                    {company.rating && (
                      <span className="flex items-center gap-1">
                        <Star size={11} fill="#F9C31A" stroke="none" />
                        <span style={{ fontSize: "12px", color: "#6B7280" }}>
                          {company.rating} ({company.reviewCount})
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <TierBadge tier={company.tier} />
              </div>

              <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.6, marginBottom: "14px" }}>
                {company.shortDescription}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {company.serviceTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "#F3F4F6",
                        color: "#374151",
                        fontSize: "12px",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/vendor/${company.slug}`}
                  className="btn-primary flex-shrink-0"
                  style={{ fontSize: "13px", padding: "9px 18px" }}
                >
                  View Full Profile
                  <ArrowRight size={13} />
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
      className={`rounded-xl overflow-hidden card-hover ${isFree ? "opacity-75" : ""}`}
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderLeft: `3px solid ${accent}`,
        marginBottom: "10px",
      }}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div
            className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: isFree ? "#D1D5DB" : company.logoColor,
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {company.logoPlaceholder}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name + badge */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3
                className="font-bold leading-tight"
                style={{ fontSize: "15px", color: isFree ? "#6B7280" : "#111827", fontWeight: 700 }}
              >
                {company.name}
              </h3>
              <TierBadge tier={company.tier} />
            </div>

            {/* Location + rating */}
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span
                className="flex items-center gap-1"
                style={{ color: "#9CA3AF", fontSize: "12px" }}
              >
                <MapPin size={10} />
                {company.location.city}, {company.location.state}
              </span>
              {company.rating && !isFree && (
                <span className="flex items-center gap-1">
                  <Star size={11} fill="#F9C31A" stroke="none" />
                  <span style={{ fontSize: "12px", color: "#6B7280" }}>
                    {company.rating} ({company.reviewCount})
                  </span>
                </span>
              )}
            </div>

            {!isFree && (
              <>
                <p style={{ color: "#6B7280", fontSize: "13px", lineHeight: 1.55, marginBottom: "10px" }}>
                  {company.shortDescription.slice(0, 120)}...
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {company.serviceTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full"
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
              </>
            )}

            {/* Action */}
            {isFree ? (
              <Link
                href={`/signup?listing=${company.slug}`}
                className="inline-flex items-center gap-1 font-semibold"
                style={{ color: "#9CA3AF", fontSize: "12px" }}
              >
                Claim this listing →
              </Link>
            ) : (
              <Link
                href={`/vendor/${company.slug}`}
                className="inline-flex items-center gap-1 font-semibold transition-colors"
                style={{ color: "#F7941D", fontSize: "13px" }}
              >
                View Full Profile
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
