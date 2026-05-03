export type Tier = "free" | "select" | "elite";

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
  secondaryCategory?: CategorySlug;
  location: { address?: string; city: string; state: string; zip?: string };
  shortDescription: string;
  fullDescription?: string;
  serviceTags: string[];
  logoPlaceholder: string;
  logoColor: string;
  bannerColor?: string;
  bannerImageUrl?: string;
  bannerCaption?: string;       // "Series-7 Supercritical Fluid Extractor"
  foundedYear?: number;         // FOUNDED stat
  website?: string;
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  // Products & Equipment
  productLines?: string[];
  products?: { name: string; description: string; imageUrl?: string }[];
  minOrderQty?: string;
  leadTime?: string;
  serviceArea?: string;
  certifications?: string[];
  // Services & Agencies
  statesServed?: string[];
  teamSize?: string;
  yearsInCannabis?: number;
  pricingModel?: string;
  caseStudies?: { title: string; summary: string }[];
  // Consultants
  specialtyAreas?: string[];
  credentials?: string[];
  yearsExperience?: number;
  hourlyRate?: string;
  availability?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
}
