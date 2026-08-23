import Link from "next/link";
import Image from "next/image";
import { Company, CategorySlug } from "@/types";
import { getCardFieldCount, getCardTagCount, showBannerImage, CARD_FIELDS } from "@/lib/tier";

function getFieldValue(company: Company, key: string): string | null {
  const val = (company as unknown as Record<string, unknown>)[key];
  if (val == null || val === "") return null;
  if (Array.isArray(val)) return val.length > 0 ? val.slice(0, 3).join(", ") : null;
  if (typeof val === "number") return String(val);
  return String(val);
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
  const tier = company.tier;
  const fieldCount = getCardFieldCount(tier);
  const tagCount = getCardTagCount(tier);
  const hasBanner = showBannerImage(tier);
  const catFields = CARD_FIELDS[company.category as CategorySlug] ?? [];
  const displayFields = catFields.slice(0, fieldCount);
  const displayTags = company.serviceTags?.slice(0, tagCount) ?? [];

  // UNCLAIMED CARD
  if (tier === "free") {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #D3D1C7",
          borderRadius: "12px",
          padding: "24px",
          opacity: 0.72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "#E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: 700,
              color: "#9CA3AF",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {company.logoUrl ? (
              <Image src={company.logoUrl} alt={company.name} width={48} height={48} style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "50%" }} unoptimized />
            ) : (
              company.logoPlaceholder
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {company.name}
            </p>
            <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
              {company.location.city}, {company.location.state}
            </p>
          </div>
        </div>

        <Link
          href={`/signup?listing=${company.slug}`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#6B7280",
            border: "1px solid #D1D5DB",
            textDecoration: "none",
            background: "transparent",
          }}
        >
          Claim This Listing
        </Link>
      </div>
    );
  }

  const isElite = tier === "elite";

  // SELECT CARD
  if (tier === "select") {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "24px" }}>
          {/* Logo + name + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: company.logoColor || "#1A4A35",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                fontWeight: 700,
                color: "white",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {company.logoUrl ? (
                <Image src={company.logoUrl} alt={company.name} width={48} height={48} style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "50%" }} unoptimized />
              ) : (
                company.logoPlaceholder
              )}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {company.name}
                </h3>
                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", padding: "3px 8px", borderRadius: "5px", background: "#185FA5", color: "white", whiteSpace: "nowrap" }}>
                  SELECT
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
                {company.location.city}, {company.location.state}
              </p>
            </div>
          </div>

          {/* Field rows */}
          {displayFields.length > 0 && (
            <div style={{ marginBottom: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {displayFields.map((f) => {
                const val = getFieldValue(company, f.key);
                if (!val) return null;
                return (
                  <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 600 }}>{f.label}</span>
                    <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>{val}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tag pills */}
          {displayTags.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {displayTags.map((tag) => (
                <span key={tag} style={{ fontSize: "11px", fontWeight: 500, color: "#4A5E4A", background: "#F0F5F0", padding: "3px 10px", borderRadius: "100px" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/vendor/${company.slug}`}
            style={{
              display: "block",
              textAlign: "center",
              padding: "11px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 700,
              color: "white",
              background: "#003320",
              textDecoration: "none",
            }}
          >
            View Profile &rarr;
          </Link>
        </div>
      </div>
    );
  }

  // VERIFIED PRO CARD
  return (
    <div
      style={{
        background: "white",
        border: "1px solid rgba(26,74,53,0.2)",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(26,74,53,0.08)",
      }}
    >
      {/* Banner image */}
      <div style={{ position: "relative", height: "140px", background: `linear-gradient(135deg, ${company.logoColor || "#1A4A35"} 0%, #0D2818 100%)` }}>
        {company.bannerImageUrl && (
          <Image src={company.bannerImageUrl} alt={company.name} fill sizes="400px" style={{ objectFit: "cover" }} unoptimized />
        )}
        <span style={{
          position: "absolute", top: "10px", left: "10px",
          display: "inline-flex", alignItems: "center", gap: "4px",
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em",
          padding: "4px 10px", borderRadius: "6px",
          background: "rgba(22,163,74,0.9)", color: "white",
        }}>
          ✓ Verified
        </span>
        {/* Overlapping logo */}
        <div style={{
          position: "absolute", bottom: "-24px", left: "20px",
          width: "52px", height: "52px", borderRadius: "50%",
          border: "3px solid white",
          background: company.logoColor || "#1A4A35",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "16px", fontWeight: 700, color: "white",
          overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          {company.logoUrl ? (
            <Image src={company.logoUrl} alt={company.name} width={52} height={52} style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "50%" }} unoptimized />
          ) : (
            company.logoPlaceholder
          )}
        </div>
      </div>

      <div style={{ padding: "34px 24px 24px" }}>
        {/* Name + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "2px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#111827", margin: 0 }}>
            {company.name}
          </h3>
          <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", padding: "3px 8px", borderRadius: "5px", background: "#1A4A35", color: "white", whiteSpace: "nowrap" }}>
            VERIFIED PRO
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "14px" }}>
          {company.location.city}, {company.location.state}
        </p>

        {/* Field rows (4) */}
        {displayFields.length > 0 && (
          <div style={{ marginBottom: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {displayFields.map((f) => {
              const val = getFieldValue(company, f.key);
              if (!val) return null;
              return (
                <div key={f.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 600 }}>{f.label}</span>
                  <span style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>{val}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* All tag pills */}
        {displayTags.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {displayTags.map((tag) => (
              <span key={tag} style={{ fontSize: "11px", fontWeight: 500, color: "#4A5E4A", background: "#F0F5F0", padding: "3px 10px", borderRadius: "100px" }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/vendor/${company.slug}`}
          style={{
            display: "block",
            textAlign: "center",
            padding: "11px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 700,
            color: "white",
            background: "#003320",
            textDecoration: "none",
          }}
        >
          View Profile &rarr;
        </Link>
      </div>
    </div>
  );
}
