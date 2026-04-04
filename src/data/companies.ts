import { Company } from "@/types";

export const COMPANIES: Company[] = [
  // ─── CULTIVATION & GROWING ───────────────────────────────────────────────
  {
    id: "1",
    slug: "evergreen-grow-systems",
    name: "Evergreen Grow Systems",
    tier: "featured",
    category: "cultivation-growing",
    location: { city: "Denver", state: "CO" },
    shortDescription:
      "Commercial greenhouse systems designed specifically for cannabis cultivation operations. Specializing in lighting integration, environmental controls, and large-scale grow facility design.",
    fullDescription:
      "Evergreen Grow Systems is the industry leader in commercial cannabis cultivation infrastructure. With over 15 years of experience designing and building grow facilities across North America, we deliver turnkey solutions that maximize yield, efficiency, and compliance. Our proprietary LED integration technology reduces energy costs by up to 40% while maintaining optimal light spectrum for each growth stage.",
    serviceTags: ["Greenhouse Design", "Lighting Systems", "Irrigation", "Environmental Controls"],
    logoPlaceholder: "EG",
    logoColor: "#1A4A35",
    bannerColor: "#1A4A35",
    website: "https://evergreen-grow.com",
    phone: "(720) 555-0101",
    email: "info@evergreen-grow.com",
    productLines: ["EcoGrow LED Series", "AquaFlow Irrigation", "ClimateControl Pro"],
    minOrderQty: "1 unit",
    leadTime: "6–8 weeks",
    serviceArea: "US & Canada",
    certifications: ["ISO 9001", "UL Listed", "DLC Certified"],
    rating: 4.9,
    reviewCount: 84,
  },
  {
    id: "2",
    slug: "lumigrow-technologies",
    name: "LumiGrow Technologies",
    tier: "elite",
    category: "cultivation-growing",
    location: { city: "San Jose", state: "CA" },
    shortDescription:
      "Manufacturer of high-performance LED grow lights engineered for cannabis cultivation environments.",
    fullDescription:
      "LumiGrow Technologies develops smart LED horticultural lighting systems trusted by cannabis cultivators worldwide. Our lights adapt in real-time to plant growth stages, delivering measurable improvements in yield, potency, and consistency.",
    serviceTags: ["LED Lighting", "Energy Optimization", "Smart Controls", "Spectrum Management"],
    logoPlaceholder: "LT",
    logoColor: "#F7941D",
    website: "https://lumigrow.com",
    phone: "(408) 555-0234",
    email: "sales@lumigrow.com",
    productLines: ["SmartPAR 400", "SmartPAR 650", "Greenhouse Series"],
    minOrderQty: "4 units",
    leadTime: "3–4 weeks",
    serviceArea: "Nationwide",
    certifications: ["DLC Premium", "ETL Listed", "CE Marked"],
    rating: 4.8,
    reviewCount: 62,
  },
  {
    id: "3",
    slug: "greenroot-consulting",
    name: "GreenRoot Consulting",
    tier: "select",
    category: "cultivation-growing",
    secondaryCategory: "consultants-advisors",
    location: { city: "Portland", state: "OR" },
    shortDescription:
      "Cultivation consulting firm helping operators maximize yield, efficiency, and plant health.",
    serviceTags: ["Cultivation Consulting", "Grow Optimization", "IPM Programs", "Staff Training"],
    logoPlaceholder: "GR",
    logoColor: "#5CB85C",
    website: "https://greenroot.consulting",
    yearsExperience: 12,
    specialtyAreas: ["Yield Optimization", "IPM", "Facility Design"],
    rating: 4.7,
    reviewCount: 38,
  },
  {
    id: "4",
    slug: "hydroleaf-systems",
    name: "HydroLeaf Systems",
    tier: "free",
    category: "cultivation-growing",
    location: { city: "Las Vegas", state: "NV" },
    shortDescription:
      "Supplier of irrigation and fertigation systems for indoor cannabis cultivation facilities.",
    serviceTags: ["Irrigation Systems", "Nutrient Delivery", "Hydroponic Equipment"],
    logoPlaceholder: "HL",
    logoColor: "#4A5E4A",
  },
  {
    id: "5",
    slug: "canopy-automation",
    name: "Canopy Automation",
    tier: "free",
    category: "cultivation-growing",
    location: { city: "Temecula", state: "CA" },
    shortDescription:
      "Automated fertigation and climate control systems for large-scale cannabis production.",
    serviceTags: ["Climate Control", "Fertigation", "Automation", "HVAC"],
    logoPlaceholder: "CA",
    logoColor: "#4A5E4A",
  },
  {
    id: "6",
    slug: "bloom-nutrients",
    name: "Bloom Nutrients",
    tier: "claimed",
    category: "cultivation-growing",
    location: { city: "Eugene", state: "OR" },
    shortDescription:
      "Premium cannabis-specific nutrient lines formulated for maximum yield and terpene expression.",
    serviceTags: ["Nutrients", "Soil Amendments", "Foliar Sprays"],
    logoPlaceholder: "BN",
    logoColor: "#F9C31A",
    website: "https://bloomnutrients.com",
    rating: 4.5,
    reviewCount: 22,
  },

  // ─── MANUFACTURERS & SUPPLIERS ───────────────────────────────────────────
  {
    id: "7",
    slug: "apex-cannabis-equipment",
    name: "Apex Cannabis Equipment",
    tier: "elite",
    category: "manufacturers-suppliers",
    location: { city: "Denver", state: "CO" },
    shortDescription:
      "Full-line cannabis equipment manufacturer supplying trimming machines, packaging equipment, and post-harvest solutions.",
    fullDescription:
      "Apex Cannabis Equipment has been a trusted partner to cannabis operators since legalization began. Our product line spans the entire post-harvest workflow — from trimming and curing to packaging and labeling — all engineered to reduce labor costs and improve product consistency.",
    serviceTags: ["Trimming Machines", "Packaging Equipment", "Post-Harvest", "Curing Systems"],
    logoPlaceholder: "AX",
    logoColor: "#1A4A35",
    productLines: ["AutoTrim 5000", "PackMaster Pro", "CureMate"],
    minOrderQty: "1 unit",
    leadTime: "2–4 weeks",
    serviceArea: "US & Canada",
    certifications: ["CE", "UL Listed"],
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: "8",
    slug: "greenpack-supply",
    name: "GreenPack Supply Co.",
    tier: "select",
    category: "manufacturers-suppliers",
    location: { city: "Phoenix", state: "AZ" },
    shortDescription:
      "Compliant cannabis packaging supplier offering child-resistant containers, bags, and custom printed solutions.",
    serviceTags: ["Child-Resistant Packaging", "Custom Printing", "Bags & Pouches", "Labels"],
    logoPlaceholder: "GP",
    logoColor: "#5CB85C",
    website: "https://greenpack.supply",
    minOrderQty: "500 units",
    leadTime: "1–2 weeks",
    serviceArea: "Nationwide",
    rating: 4.6,
    reviewCount: 41,
  },
  {
    id: "9",
    slug: "terracycle-containers",
    name: "TerraCycle Containers",
    tier: "claimed",
    category: "manufacturers-suppliers",
    location: { city: "Seattle", state: "WA" },
    shortDescription:
      "Sustainable cannabis container manufacturer specializing in eco-friendly, compostable packaging solutions.",
    serviceTags: ["Eco Packaging", "Compostable Containers", "Sustainable Materials"],
    logoPlaceholder: "TC",
    logoColor: "#F9C31A",
  },
  {
    id: "10",
    slug: "delta-supplies",
    name: "Delta Cannabis Supplies",
    tier: "free",
    category: "manufacturers-suppliers",
    location: { city: "Las Vegas", state: "NV" },
    shortDescription:
      "Wholesale distributor of grow supplies, nutrients, and cultivation accessories.",
    serviceTags: ["Wholesale Distribution", "Grow Supplies", "Accessories"],
    logoPlaceholder: "DS",
    logoColor: "#4A5E4A",
  },

  // ─── CONSULTANTS & ADVISORS ───────────────────────────────────────────────
  {
    id: "11",
    slug: "marcus-reyes-consulting",
    name: "Marcus Reyes Consulting",
    tier: "elite",
    category: "consultants-advisors",
    location: { city: "Los Angeles", state: "CA" },
    shortDescription:
      "Cannabis industry strategist with 14 years of experience guiding operators from license application through scale.",
    fullDescription:
      "Marcus Reyes has advised over 80 cannabis businesses across licensing, operations, and exit strategy. Specializing in multi-state operators navigating complex regulatory environments, Marcus brings a data-driven approach to every engagement.",
    serviceTags: ["License Applications", "Business Strategy", "Multi-State Operations", "Investor Relations"],
    logoPlaceholder: "MR",
    logoColor: "#1A4A35",
    specialtyAreas: ["License Applications", "MSO Strategy", "Capital Raises"],
    credentials: ["MBA - Wharton", "Cannabis Business Summit Speaker", "Former State Regulator"],
    yearsExperience: 14,
    hourlyRate: "$350/hr",
    availability: "Taking new clients Q2 2026",
    bio: "Marcus spent 6 years as a state cannabis regulator before moving to private practice. His insider perspective on compliance and licensing has helped clients achieve a 94% license approval rate.",
    rating: 4.9,
    reviewCount: 47,
  },
  {
    id: "12",
    slug: "canna-finance-advisors",
    name: "CannaFinance Advisors",
    tier: "select",
    category: "consultants-advisors",
    secondaryCategory: "finance-insurance",
    location: { city: "Chicago", state: "IL" },
    shortDescription:
      "Financial advisory firm specializing in cannabis business valuation, fundraising, and M&A.",
    serviceTags: ["Business Valuation", "M&A Advisory", "Capital Raises", "Financial Modeling"],
    logoPlaceholder: "CF",
    logoColor: "#5CB85C",
    yearsExperience: 9,
    specialtyAreas: ["Mergers & Acquisitions", "Capital Raises", "Valuations"],
    hourlyRate: "$275/hr",
    rating: 4.6,
    reviewCount: 29,
  },
  {
    id: "13",
    slug: "compliance-edge",
    name: "Compliance Edge LLC",
    tier: "claimed",
    category: "consultants-advisors",
    secondaryCategory: "compliance-legal",
    location: { city: "Denver", state: "CO" },
    shortDescription:
      "Regulatory compliance consultants helping cannabis operators maintain license integrity and audit readiness.",
    serviceTags: ["Regulatory Compliance", "License Renewals", "Audit Prep", "SOP Development"],
    logoPlaceholder: "CE",
    logoColor: "#F9C31A",
  },

  // ─── MARKETING & BRANDING ─────────────────────────────────────────────────
  {
    id: "14",
    slug: "green-signal-agency",
    name: "Green Signal Agency",
    tier: "elite",
    category: "marketing-branding-packaging",
    location: { city: "New York", state: "NY" },
    shortDescription:
      "Full-service cannabis marketing agency specializing in brand identity, digital strategy, and compliant advertising.",
    fullDescription:
      "Green Signal is the cannabis industry's most awarded creative agency. Our team of 45 specialists operates at the intersection of brand strategy, digital performance, and regulatory compliance — helping cannabis brands build lasting consumer loyalty.",
    serviceTags: ["Brand Strategy", "Digital Marketing", "Packaging Design", "Social Media", "SEO"],
    logoPlaceholder: "GS",
    logoColor: "#1A4A35",
    statesServed: ["NY", "CA", "IL", "CO", "WA", "OR", "MI"],
    teamSize: "45 people",
    yearsInCannabis: 8,
    pricingModel: "Retainer / Project",
    rating: 4.8,
    reviewCount: 73,
  },
  {
    id: "15",
    slug: "budcraft-design",
    name: "BudCraft Design Studio",
    tier: "select",
    category: "marketing-branding-packaging",
    location: { city: "Austin", state: "TX" },
    shortDescription:
      "Cannabis-focused packaging design and brand identity studio. From concept to print-ready.",
    serviceTags: ["Packaging Design", "Brand Identity", "Label Design", "Print Production"],
    logoPlaceholder: "BD",
    logoColor: "#5CB85C",
    pricingModel: "Project-based",
    rating: 4.5,
    reviewCount: 34,
  },

  // ─── COMPLIANCE & LEGAL ───────────────────────────────────────────────────
  {
    id: "16",
    slug: "cannabis-law-group",
    name: "Cannabis Law Group",
    tier: "elite",
    category: "compliance-legal",
    location: { city: "Denver", state: "CO" },
    shortDescription:
      "Premier cannabis law firm providing licensing, compliance, contracts, and transactional legal services.",
    fullDescription:
      "Cannabis Law Group is a nationally recognized firm with attorneys licensed in 18 states. We handle the full spectrum of cannabis legal matters — from initial licensing and regulatory counsel to M&A due diligence and litigation defense.",
    serviceTags: ["Cannabis Licensing", "Regulatory Counsel", "M&A Legal", "Contract Law", "Litigation"],
    logoPlaceholder: "CL",
    logoColor: "#1A4A35",
    statesServed: ["CO", "CA", "IL", "MI", "NY", "WA", "OR", "AZ", "NV"],
    teamSize: "28 attorneys",
    yearsInCannabis: 11,
    pricingModel: "Hourly / Retainer",
    rating: 4.9,
    reviewCount: 91,
  },
  {
    id: "17",
    slug: "green-compliance-co",
    name: "Green Compliance Co.",
    tier: "select",
    category: "compliance-legal",
    location: { city: "Sacramento", state: "CA" },
    shortDescription:
      "Compliance consulting firm specializing in California cannabis regulations, Metrc tracking, and license renewals.",
    serviceTags: ["California Compliance", "Metrc", "License Renewals", "SOP Writing"],
    logoPlaceholder: "GC",
    logoColor: "#5CB85C",
    rating: 4.5,
    reviewCount: 26,
  },

  // ─── TECHNOLOGY & SOFTWARE ────────────────────────────────────────────────
  {
    id: "18",
    slug: "leafworks-software",
    name: "LeafWorks Software",
    tier: "elite",
    category: "technology-software",
    location: { city: "San Francisco", state: "CA" },
    shortDescription:
      "All-in-one cannabis ERP platform covering seed-to-sale tracking, inventory, POS, and compliance reporting.",
    fullDescription:
      "LeafWorks is the fastest-growing cannabis software company in North America. Our cloud-based ERP integrates with every major state tracking system and provides real-time visibility across cultivation, manufacturing, distribution, and retail operations.",
    serviceTags: ["Seed-to-Sale", "Inventory Management", "POS Integration", "Compliance Reporting", "ERP"],
    logoPlaceholder: "LW",
    logoColor: "#1A4A35",
    statesServed: ["All US Legal States"],
    teamSize: "120+ people",
    yearsInCannabis: 7,
    pricingModel: "Monthly SaaS subscription",
    rating: 4.7,
    reviewCount: 118,
  },

  // ─── TESTING & SCIENCE ─────────────────────────────────────────────────────
  {
    id: "19",
    slug: "purity-labs",
    name: "Purity Analytics Labs",
    tier: "elite",
    category: "testing-science",
    location: { city: "Phoenix", state: "AZ" },
    shortDescription:
      "ISO-accredited cannabis testing laboratory providing potency, terpene, contaminant, and pesticide analysis.",
    fullDescription:
      "Purity Analytics is Arizona's leading cannabis testing laboratory, ISO 17025 accredited with a 48-hour turnaround guarantee. We provide the full testing panel required for state compliance plus optional advanced terpene profiling.",
    serviceTags: ["Potency Testing", "Terpene Profiling", "Pesticide Screening", "Heavy Metals", "Microbial"],
    logoPlaceholder: "PL",
    logoColor: "#1A4A35",
    statesServed: ["AZ", "NM", "NV"],
    teamSize: "35 scientists",
    yearsInCannabis: 9,
    pricingModel: "Per-test pricing",
    certifications: ["ISO 17025", "DEA Registered", "State Licensed"],
    rating: 4.9,
    reviewCount: 67,
  },

  // ─── FINANCE & INSURANCE ──────────────────────────────────────────────────
  {
    id: "20",
    slug: "canna-shield-insurance",
    name: "CannaShield Insurance",
    tier: "select",
    category: "finance-insurance",
    location: { city: "Chicago", state: "IL" },
    shortDescription:
      "Specialized cannabis business insurance covering product liability, property, crop, and professional liability.",
    serviceTags: ["Product Liability", "Crop Insurance", "Property Coverage", "Professional Liability"],
    logoPlaceholder: "CS",
    logoColor: "#5CB85C",
    rating: 4.6,
    reviewCount: 43,
  },
];

export function getCompaniesByCategory(categorySlug: string): Company[] {
  return COMPANIES.filter(
    (c) => c.category === categorySlug || c.secondaryCategory === categorySlug
  ).sort((a, b) => {
    const order: Record<string, number> = {
      featured: 0,
      elite: 1,
      select: 2,
      claimed: 3,
      free: 4,
    };
    return order[a.tier] - order[b.tier];
  });
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}

export function getFeaturedCompanies(): Company[] {
  return COMPANIES.filter((c) =>
    c.tier === "elite" || c.tier === "featured" || c.tier === "select"
  ).slice(0, 8);
}
