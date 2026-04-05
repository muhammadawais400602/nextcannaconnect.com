import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { getCompaniesByCategory } from "@/data/companies";
import FiltersPanel from "@/components/directory/FiltersPanel";
import DirectoryListings from "@/components/directory/DirectoryListings";
import DirectoryHero from "@/components/directory/DirectoryHero";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const companies = getCompaniesByCategory(slug);

  return (
    <>
      <DirectoryHero activeSlug={slug} />

      <div style={{ backgroundColor: "#f6f3f2", minHeight: "60vh" }}>
        <div
          className="mx-auto px-4 md:px-8 py-10"
          style={{ maxWidth: "1440px" }}
        >
          <div
            style={{
              display: "flex",
              gap: "40px",
              alignItems: "flex-start",
            }}
          >
            {/* Sidebar */}
            <div
              className="hidden lg:block"
              style={{ width: "220px", flexShrink: 0 }}
            >
              <FiltersPanel category={category} />
            </div>

            {/* Listings */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Suspense
                fallback={
                  <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
                    Loading listings…
                  </div>
                }
              >
                <DirectoryListings
                  companies={companies}
                  categoryShortLabel={category.shortLabel}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
