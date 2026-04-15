import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import DirectoryHero from "@/components/directory/DirectoryHero";
import DirectoryContent from "@/components/directory/DirectoryContent";

export const revalidate = 1800; // revalidate every 30 minutes

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.label} | NextCanna Connect Directory`,
    description: category.description,
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const companies = await getCompaniesByCategory(slug);

  return (
    <>
      <DirectoryHero activeSlug={slug} />

      <div style={{ backgroundColor: "#f6f3f2", minHeight: "60vh" }}>
        <div className="mx-auto px-4 md:px-8 py-10" style={{ maxWidth: "1440px" }}>
          <DirectoryContent category={category} companies={companies} />
        </div>
      </div>
    </>
  );
}
