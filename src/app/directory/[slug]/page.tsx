import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/data/categories";
import RetailCategoryPage from "@/components/directory/retail/RetailCategoryPage";

interface Props {
  params: Promise<{ slug: string }>;
}

// Categories that have their own dedicated template page
const CUSTOM_TEMPLATE_SLUGS = new Set(["retail-dispensary"]);

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

  // All other categories still use the shared directory filter view
  if (!CUSTOM_TEMPLATE_SLUGS.has(slug)) {
    redirect(`/directory?category=${slug}`);
  }
}
