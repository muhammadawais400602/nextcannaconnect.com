"use client";

import { cardStyle } from "./shared";
import type { CompanyData } from "./shared";

export default function ListingDetailsTab({
  company,
  tier,
}: {
  company: CompanyData;
  tier: string;
  onSaved: () => void;
}) {
  const categoryLabel = company.category
    ? company.category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Not Selected";

  return (
    <div style={cardStyle}>
      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1A4A35", marginBottom: "8px" }}>
        Listing Details
      </h2>
      <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "20px" }}>
        Category-specific fields for <strong>{categoryLabel}</strong>.
        {tier === "free" && " Upgrade to Select to make your listing details public."}
      </p>
      <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "14px" }}>
        Coming soon — category-specific fields will appear here based on your selected category.
      </div>
    </div>
  );
}
