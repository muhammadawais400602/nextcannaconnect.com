import type { Tier, CategorySlug } from "@/types";

export const TIER_LEVEL: Record<Tier, number> = {
  free: 0,
  select: 1,
  elite: 2,
};

export function canAccess(listingTier: Tier, requiredTier: Tier): boolean {
  return TIER_LEVEL[listingTier] >= TIER_LEVEL[requiredTier];
}

export function getCardFieldCount(tier: Tier): number {
  if (tier === "elite") return 4;
  if (tier === "select") return 2;
  return 0;
}

export function getCardTagCount(tier: Tier): number {
  if (tier === "elite") return 999;
  if (tier === "select") return 3;
  return 0;
}

export function showBannerImage(tier: Tier): boolean {
  return tier === "elite";
}

export function showSimilarPartners(tier: Tier): boolean {
  return tier === "elite";
}

export function getTabsAllowed(tier: Tier): "all" | "basic" | "none" {
  if (tier === "elite") return "all";
  if (tier === "select") return "basic";
  return "none";
}

export const CARD_FIELDS: Record<CategorySlug, { label: string; key: string }[]> = {
  "cultivation-growing": [
    { label: "Grow Type", key: "serviceArea" },
    { label: "Canopy Size", key: "facilitySize" },
    { label: "Team Size", key: "teamSize" },
    { label: "Wholesale", key: "pricingModel" },
  ],
  "manufacturers-suppliers": [
    { label: "MOQ", key: "minOrderQty" },
    { label: "Ships To", key: "serviceArea" },
    { label: "Lead Time", key: "leadTime" },
    { label: "OEM", key: "pricingModel" },
  ],
  "extraction-processing": [
    { label: "Method", key: "serviceArea" },
    { label: "Facility", key: "facilitySize" },
    { label: "Turnaround", key: "turnaroundTime" },
    { label: "White Label", key: "pricingModel" },
  ],
  "consultants-advisors": [
    { label: "Specialization", key: "specialtyAreas" },
    { label: "States Served", key: "statesServed" },
    { label: "Experience", key: "yearsExperience" },
    { label: "Free Consult", key: "availability" },
  ],
  "marketing-branding-packaging": [
    { label: "Services", key: "serviceArea" },
    { label: "Min Project", key: "pricingModel" },
    { label: "Turnaround", key: "leadTime" },
    { label: "Team Size", key: "teamSize" },
  ],
  "retail-dispensary": [
    { label: "License #", key: "licenseNumber" },
    { label: "Type", key: "licenseType" },
    { label: "Delivery", key: "delivery" },
    { label: "Hours", key: "hours" },
  ],
  "transportation-logistics": [
    { label: "Fleet Size", key: "vehicleCount" },
    { label: "Transport", key: "transportType" },
    { label: "Loads/Mo", key: "loadsPerMonth" },
    { label: "Dispatch", key: "dispatchHours" },
  ],
  "testing-science": [
    { label: "Accreditation", key: "accreditation" },
    { label: "TAT", key: "turnaroundTime" },
    { label: "Sample Types", key: "sampleTypes" },
    { label: "Panels", key: "panelCount" },
  ],
  "compliance-legal": [
    { label: "Bar License", key: "licenseNumber" },
    { label: "States", key: "statesServed" },
    { label: "Practice Areas", key: "specialtyAreas" },
    { label: "Free Consult", key: "availability" },
  ],
  "technology-software": [
    { label: "Certification", key: "accreditation" },
    { label: "Integrations", key: "serviceArea" },
    { label: "Pricing", key: "pricingModel" },
    { label: "Features", key: "features" },
  ],
  "real-estate-construction": [
    { label: "Projects", key: "projectsCompleted" },
    { label: "Specialty", key: "serviceArea" },
    { label: "States", key: "statesServed" },
    { label: "Credentials", key: "credentialHeadline" },
  ],
  "finance-insurance": [
    { label: "License", key: "licenseNumber" },
    { label: "Service Type", key: "pricingModel" },
    { label: "States", key: "statesServed" },
    { label: "Funding Time", key: "leadTime" },
  ],
};
