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
  logoUrl?: string;
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
  facebookUrl?: string;
  twitterUrl?: string;
  yelpUrl?: string;
  leaflyUrl?: string;
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
  // Retail & Dispensary
  licenseNumber?: string;
  licenseType?: string;       // "Rec + Medical" | "Recreational" | "Medical Only"
  delivery?: string;          // "Yes" | "No" | "Only"
  hours?: string;             // "9AM - 10PM"
  insuranceOnFile?: boolean;
  metrcIntegrated?: boolean;
  verifiedDate?: string;      // "Oct 2025"
  locationsCount?: number;
  faqs?: { question: string; answer: string }[];
  // Transportation & Logistics
  vehicleCount?: number;
  transportType?: string;     // "Temp Controlled" | "Dry Goods" | "Armored"
  loadsPerMonth?: string;     // "480+"
  statesActive?: number;
  cargoInsurance?: string;    // "$5M Cargo Coverage"
  gpsTracked?: boolean;
  dispatchHours?: string;     // "24/7 Dispatch"
  licensesTable?: { type: string; authority: string; number: string; status: string }[];
}
