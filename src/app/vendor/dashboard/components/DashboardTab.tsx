"use client";

import Link from "next/link";
import ProfileCompletionBar, {
  getProfileCompletion,
} from "./ProfileCompletion";
import { TIER_LABELS, TIER_COLORS, cardStyle } from "./shared";
import type { VendorUser, CompanyData } from "./shared";
import type { TabKey } from "./TabNavigation";

export default function DashboardTab({
  vendor,
  company,
  onTabChange,
}: {
  vendor: VendorUser;
  company: CompanyData | null;
  onTabChange: (tab: TabKey) => void;
}) {
  const { percent, incomplete } = getProfileCompletion(company);
  const tierStyle = TIER_COLORS[vendor.tier] ?? TIER_COLORS.free;
  const tierLabel = TIER_LABELS[vendor.tier] ?? "Unclaimed";

  const listingStatus = company
    ? vendor.tier === "free"
      ? "Unclaimed"
      : "Active"
    : "Pending";

  const statusColor =
    listingStatus === "Active"
      ? "#16A34A"
      : listingStatus === "Pending"
        ? "#F59E0B"
        : "#6B7280";

  return (
    <div>
      <ProfileCompletionBar percent={percent} />

      {/* Stats row */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4"
        style={{ gap: "12px", marginBottom: "24px" }}
      >
        <StatCard label="Profile Views" value="—" sub="Last 30 days" />
        <StatCard label="Inquiries" value="—" sub="Last 30 days" />
        <StatCard
          label="Listing Status"
          value={listingStatus}
          valueColor={statusColor}
        />
        <StatCard
          label="Current Plan"
          value={tierLabel}
          badge
          badgeBg={tierStyle.bg}
          badgeColor={tierStyle.color}
        />
      </div>

      {/* Complete Your Profile */}
      {incomplete.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: "16px" }}>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1A4A35",
              marginBottom: "14px",
            }}
          >
            Complete Your Profile
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {incomplete.slice(0, 3).map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "#FFFBF0",
                  border: "1px solid #FDE68A",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "2px solid #FDE68A",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#92400E",
                    }}
                  >
                    Add your {item.label}
                  </span>
                </div>
                <button
                  onClick={() => onTabChange(item.tab as TabKey)}
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#1A4A35",
                    background: "none",
                    border: "1px solid #C6E0D0",
                    borderRadius: "6px",
                    padding: "4px 12px",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Go to {item.tab === "media" ? "Media" : "Profile"} →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Inquiries */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1A4A35",
              margin: 0,
            }}
          >
            Recent Inquiries
          </h3>
          <button
            onClick={() => onTabChange("analytics")}
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#1A4A35",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View All →
          </button>
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: "#9CA3AF",
            fontSize: "13px",
          }}
        >
          No inquiries yet. Once visitors contact you through your listing,
          they&apos;ll appear here.
        </div>
      </div>

      {/* View Listing */}
      {company && (
        <div style={{ textAlign: "center" }}>
          <Link
            href={`/vendor/${company.slug}`}
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "#1A4A35",
              color: "white",
              padding: "12px 28px",
              borderRadius: "9px",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            View Live Listing →
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  valueColor,
  badge,
  badgeBg,
  badgeColor,
}: {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
  badge?: boolean;
  badgeBg?: string;
  badgeColor?: string;
}) {
  return (
    <div style={{ ...cardStyle, padding: "16px 18px" }}>
      <p
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "#9CA3AF",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      {badge ? (
        <span
          style={{
            display: "inline-block",
            padding: "3px 12px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 700,
            background: badgeBg,
            color: badgeColor,
          }}
        >
          {value}
        </span>
      ) : (
        <p
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: valueColor || "#0D2818",
            margin: 0,
          }}
        >
          {value}
        </p>
      )}
      {sub && (
        <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "4px 0 0" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
