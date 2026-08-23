import type React from "react";

export const TIER_LABELS: Record<string, string> = {
  free: "Unclaimed",
  select: "Select",
  elite: "Verified Pro",
};

export const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  free: { bg: "#F3F4F6", color: "#6B7280" },
  select: { bg: "rgba(45,110,82,0.1)", color: "#2d6e52" },
  elite: { bg: "rgba(26,74,53,0.1)", color: "#1A4A35" },
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#111827",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#4A5E4A",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  marginBottom: "5px",
};

export const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "14px",
  border: "1px solid #E5E7EB",
  padding: "24px",
};

export const sectionTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#1A4A35",
  marginBottom: "18px",
  paddingBottom: "12px",
  borderBottom: "1px solid #F3F4F6",
};

export const gridTwo: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
};

export interface VendorUser {
  email: string;
  fullName: string;
  companyName?: string;
  tier: string;
}

export interface CompanyData {
  _id?: string;
  slug: string;
  name: string;
  tier: string;
  category: string;
  location?: { address?: string; city?: string; state?: string; zip?: string };
  shortDescription?: string;
  fullDescription?: string;
  website?: string;
  phone?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  bannerImageUrl?: string;
  bannerCaption?: string;
  logoUrl?: string;
  foundedYear?: number;
  teamSize?: string;
  serviceArea?: string;
  yearsInCannabis?: number;
  serviceTags?: string[];
  certifications?: string[];
  products?: { name: string; description: string; imageUrl?: string }[];
  categoryData?: Record<string, unknown>;
  [key: string]: unknown;
}
