import { Category } from "@/types";

export const CATEGORIES: Category[] = [
  {
    slug: "cultivation-growing",
    label: "Cultivation & Growing",
    shortLabel: "Cultivation",
    description: "Grow systems, lighting, irrigation, nutrients, greenhouse technology, and cultivation consulting.",
    template: "products-equipment",
  },
  {
    slug: "manufacturers-suppliers",
    label: "Manufacturers & Suppliers",
    shortLabel: "Manufacturers",
    description: "Equipment manufacturers, raw material suppliers, and wholesale product distributors for the cannabis industry.",
    template: "products-equipment",
  },
  {
    slug: "extraction-processing",
    label: "Extraction & Processing",
    shortLabel: "Extraction",
    description: "Extraction equipment, processing technology, concentrate production, and lab services.",
    template: "products-equipment",
  },
  {
    slug: "consultants-advisors",
    label: "Consultants & Advisors",
    shortLabel: "Consultants",
    description: "Industry experts offering strategic advisory, operational consulting, and specialized guidance for cannabis businesses.",
    template: "consultants-advisors",
  },
  {
    slug: "marketing-branding-packaging",
    label: "Marketing, Branding & Packaging",
    shortLabel: "Marketing",
    description: "Brand strategy, packaging design, digital marketing, and creative services for cannabis brands.",
    template: "services-agencies",
  },
  {
    slug: "retail-dispensary",
    label: "Retail & Dispensary",
    shortLabel: "Retail",
    description: "Dispensary operations, point-of-sale systems, retail design, and customer experience solutions.",
    template: "services-agencies",
  },
  {
    slug: "transportation-logistics",
    label: "Transportation & Logistics",
    shortLabel: "Logistics",
    description: "Licensed cannabis transportation, last-mile delivery, seed-to-sale tracking, and supply chain management.",
    template: "products-equipment",
  },
  {
    slug: "testing-science",
    label: "Testing & Science",
    shortLabel: "Testing",
    description: "Cannabis testing laboratories, R&D services, analytical science, and regulatory compliance testing.",
    template: "services-agencies",
  },
  {
    slug: "compliance-legal",
    label: "Compliance & Legal",
    shortLabel: "Compliance",
    description: "Licensing, regulatory compliance, legal counsel, and government relations for cannabis operators.",
    template: "services-agencies",
  },
  {
    slug: "technology-software",
    label: "Technology & Software",
    shortLabel: "Technology",
    description: "Seed-to-sale software, POS systems, inventory management, and cannabis-specific technology solutions.",
    template: "services-agencies",
  },
  {
    slug: "real-estate-construction",
    label: "Real Estate & Construction",
    shortLabel: "Real Estate",
    description: "Cannabis facility design, construction, real estate brokerage, and zoning consultation.",
    template: "services-agencies",
  },
  {
    slug: "finance-insurance",
    label: "Finance & Insurance",
    shortLabel: "Finance",
    description: "Banking, lending, insurance, accounting, and financial services for cannabis businesses.",
    template: "services-agencies",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
