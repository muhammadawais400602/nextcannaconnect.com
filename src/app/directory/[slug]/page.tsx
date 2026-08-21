import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/data/categories";
import RetailCategoryPage from "@/components/directory/retail/RetailCategoryPage";
import TransportCategoryPage from "@/components/directory/transport/TransportCategoryPage";
import TestingCategoryPage from "@/components/directory/testing/TestingCategoryPage";
import TechCategoryPage from "@/components/directory/tech/TechCategoryPage";
import RealEstateCategoryPage from "@/components/directory/realestate/RealEstateCategoryPage";
import CultivationCategoryPage from "@/components/directory/cultivation/CultivationCategoryPage";
import ManufacturersCategoryPage from "@/components/directory/manufacturers/ManufacturersCategoryPage";
import ExtractionCategoryPage from "@/components/directory/extraction/ExtractionCategoryPage";
import ConsultantsCategoryPage from "@/components/directory/consultants/ConsultantsCategoryPage";
import MarketingCategoryPage from "@/components/directory/marketing/MarketingCategoryPage";
import ComplianceCategoryPage from "@/components/directory/compliance/ComplianceCategoryPage";
import FinanceCategoryPage from "@/components/directory/finance/FinanceCategoryPage";

interface Props {
  params: Promise<{ slug: string }>;
}

const CUSTOM_TEMPLATE_SLUGS = new Set([
  "retail-dispensary",
  "transportation-logistics",
  "testing-science",
  "technology-software",
  "real-estate-construction",
  "cultivation-growing",
  "manufacturers-suppliers",
  "extraction-processing",
  "consultants-advisors",
  "marketing-branding-packaging",
  "compliance-legal",
  "finance-insurance",
]);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.label} Directory | NextCanna Connect`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "retail-dispensary") {
    return <RetailCategoryPage />;
  }

  if (slug === "transportation-logistics") {
    return <TransportCategoryPage />;
  }

  if (slug === "testing-science") {
    return <TestingCategoryPage />;
  }

  if (slug === "technology-software") {
    return <TechCategoryPage />;
  }

  if (slug === "real-estate-construction") {
    return <RealEstateCategoryPage />;
  }

  if (slug === "cultivation-growing") {
    return <CultivationCategoryPage />;
  }

  if (slug === "manufacturers-suppliers") {
    return <ManufacturersCategoryPage />;
  }

  if (slug === "extraction-processing") {
    return <ExtractionCategoryPage />;
  }

  if (slug === "consultants-advisors") {
    return <ConsultantsCategoryPage />;
  }

  if (slug === "marketing-branding-packaging") {
    return <MarketingCategoryPage />;
  }

  if (slug === "compliance-legal") {
    return <ComplianceCategoryPage />;
  }

  if (slug === "finance-insurance") {
    return <FinanceCategoryPage />;
  }

  if (!CUSTOM_TEMPLATE_SLUGS.has(slug)) {
    redirect(`/directory?category=${slug}`);
  }
}
