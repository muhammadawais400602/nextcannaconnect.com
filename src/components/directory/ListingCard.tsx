import Link from "next/link";
import Image from "next/image";
import { Company } from "@/types";

function getBadge(company: Company): { label: string; color: string; bg: string } | null {
  if (company.tier === "elite" || company.tier === "featured") {
    return { label: "Verified Partner", color: "#1a4a35", bg: "rgba(26,74,53,0.1)" };
  }
  if (company.tier === "select") {
    return { label: "Certified Member", color: "#2d6e52", bg: "rgba(45,110,82,0.1)" };
  }
  if (company.tier === "claimed") {
    return { label: "Claimed Listing", color: "#6B7280", bg: "#F3F4F6" };
  }
  return null;
}

function getStat1(company: Company): { label: string; value: string } {
  if (company.serviceTags?.[0]) {
    return { label: "Specialization", value: company.serviceTags[0] };
  }
  return { label: "Category", value: "Cannabis B2B" };
}

function getStat2(company: Company): { label: string; value: string } {
  if (company.statesServed && company.statesServed.length > 0) {
    return { label: "States Served", value: `${company.statesServed.length} States` };
  }
  if (company.serviceArea) return { label: "Service Area", value: company.serviceArea };
  if (company.minOrderQty) return { label: "Min. Order", value: company.minOrderQty };
  return { label: "Coverage", value: "Nationwide" };
}

function getStat3(company: Company): { label: string; value: string } {
  if (company.certifications?.[0]) {
    return { label: "Certifications", value: company.certifications[0] };
  }
  if (company.yearsInCannabis) {
    return { label: "Experience", value: `${company.yearsInCannabis}+ Years` };
  }
  if (company.leadTime) return { label: "Lead Time", value: company.leadTime };
  return { label: "Status", value: "Verified" };
}

function getSecondaryAction(company: Company): string {
  if (company.category === "transportation-logistics") return "Schedule Route";
  if (company.category === "testing-science") return "Order Testing";
  if (company.category === "finance-insurance") return "Get a Quote";
  if (company.category === "consultants-advisors") return "Schedule Call";
  if (["cultivation-growing", "extraction-processing", "manufacturers-suppliers"].includes(company.category)) {
    return "Request Quote";
  }
  return "Get Proposal";
}

interface Props {
  company: Company;
}

export default function ListingCard({ company }: Props) {
  const isFree = company.tier === "free";
  const badge = getBadge(company);
  const stat1 = getStat1(company);
  const stat2 = getStat2(company);
  const stat3 = getStat3(company);
  const secondaryAction = getSecondaryAction(company);

  if (isFree) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "20px 24px",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          opacity: 0.65,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "#D1D5DB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: "#9CA3AF",
              flexShrink: 0,
            }}
          >
            {company.logoPlaceholder}
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#6B7280", fontFamily: "'Inter', sans-serif" }}>
              {company.name}
            </p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
              {company.location.city}, {company.location.state}
            </p>
          </div>
        </div>
        <Link
          href={`/signup?listing=${company.slug}`}
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "#003320",
            textDecoration: "none",
            border: "1px solid #003320",
            borderRadius: "8px",
            padding: "7px 14px",
            whiteSpace: "nowrap",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Claim Listing
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        marginBottom: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
      className="directory-listing-card"
    >
      {/* Left image */}
      <div
        style={{
          width: "160px",
          flexShrink: 0,
          background: `linear-gradient(135deg, ${company.logoColor} 0%, ${company.bannerColor ?? company.logoColor}dd 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          position: "relative",
          overflow: "hidden",
        }}
        className="listing-card-image"
      >
        {company.bannerImageUrl ? (
          <Image
            src={company.bannerImageUrl}
            alt={company.name}
            fill
            sizes="160px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          <span
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "36px",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.3)",
              fontWeight: 700,
              userSelect: "none",
            }}
          >
            {company.logoPlaceholder}
          </span>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: "20px 24px", minWidth: 0 }}>
        {/* Top row: badge + rating + score */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "10px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {badge && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: badge.bg,
                  color: badge.color,
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: "0.03em",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "13px" }}
                >
                  verified
                </span>
                {badge.label}
              </span>
            )}
            {company.rating && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ color: "#F59E0B" }}>★</span>
                {company.rating}
                {company.reviewCount && (
                  <span style={{ color: "#9CA3AF" }}>({company.reviewCount} reviews)</span>
                )}
              </span>
            )}
          </div>

        </div>

        {/* Company name */}
        <h3
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "20px",
            fontWeight: 700,
            color: "#111827",
            marginBottom: "4px",
            lineHeight: 1.2,
          }}
        >
          {company.name}
        </h3>

        {/* Location */}
        <p
          style={{
            fontSize: "12px",
            color: "#9CA3AF",
            fontFamily: "'Inter', sans-serif",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>location_on</span>
          {company.location.city}, {company.location.state}
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: "13px",
            color: "#6B7280",
            lineHeight: 1.65,
            marginBottom: "16px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {company.shortDescription}
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            flexWrap: "wrap",
            paddingTop: "14px",
            borderTop: "1px solid #f3f4f6",
            marginBottom: "16px",
          }}
        >
          {[stat1, stat2, stat3].map((stat) => (
            <div key={stat.label}>
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(65,73,67,0.4)",
                  fontFamily: "'Inter', sans-serif",
                  marginBottom: "3px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#111827",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href={`/vendor/${company.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#003320",
              color: "white",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              padding: "10px 20px",
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            View Profile
          </Link>
          <Link
            href={`/vendor/${company.slug}#contact`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "transparent",
              color: "#003320",
              textDecoration: "none",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid rgba(0,51,32,0.25)",
              fontFamily: "'Inter', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {secondaryAction}
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .directory-listing-card {
            flex-direction: column !important;
          }
          .listing-card-image {
            width: 100% !important;
            min-height: 120px !important;
          }
        }
      `}</style>
    </div>
  );
}
