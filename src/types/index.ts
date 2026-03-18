export type Tier = "free" | "claimed" | "select" | "elite" | "featured";

export type CategorySlug =
  | "cultivation-growing"
  | "manufacturers-suppliers"
  | "extraction-processing"
  | "consultants-advisors"
  | "marketing-branding-packaging"
  | "retail-dispensary"
  | "transportation-logistics"
  | "testing-science"
  | "compliance-legal"
  | "technology-software"
  | "real-estate-construction"
  | "finance-insurance";

export type TemplateType = "products-equipment" | "services-agencies" | "consultants-advisors";

export interface Category {
  slug: CategorySlug;
  label: string;
  shortLabel: string;
  description: string;
  template: TemplateType;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  tier: Tier;
  category: CategorySlug;
  secondaryCategory?: CategorySlug; // consultant double-listing
  location: { city: string; state: string };
  shortDescription: string;
  fullDescription?: string;
  serviceTags: string[];
  logoPlaceholder: string; // initials for placeholder
  logoColor: string;
  bannerColor?: string; // for featured card
  website?: string;
  phone?: string;
  email?: string;
  // Template 1 — Products & Equipment
  productLines?: string[];
  minOrderQty?: string;
  leadTime?: string;
  serviceArea?: string;
  certifications?: string[];
  // Template 2 — Services & Agencies
  statesServed?: string[];
  teamSize?: string;
  yearsInCannabis?: number;
  pricingModel?: string;
  caseStudies?: { title: string; summary: string }[];
  // Template 3 — Consultants
  specialtyAreas?: string[];
  credentials?: string[];
  yearsExperience?: number;
  hourlyRate?: string;
  availability?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
}
