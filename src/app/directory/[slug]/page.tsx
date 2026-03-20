import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { getCompaniesByCategory } from "@/data/companies";
import CategoryNavBar from "@/components/directory/CategoryNavBar";
import FiltersPanel from "@/components/directory/FiltersPanel";
import DirectoryListings from "@/components/directory/DirectoryListings";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
      {/* Category Nav */}
      <CategoryNavBar activeSlug={slug} />

      {/* Page header */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div className="mx-auto px-6 py-8" style={{ maxWidth: "1180px" }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2" style={{ fontSize: "13px", color: "#9CA3AF" }}>
                <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</Link>
                <span>/</span>
                <Link href="/directory" style={{ color: "#9CA3AF", textDecoration: "none" }}>Directory</Link>
                <span>/</span>
                <span style={{ color: "#374151" }}>{category.label}</span>
              </div>
              <h1 className="font-extrabold" style={{ fontSize: "26px", color: "#111827", fontWeight: 800, letterSpacing: "-0.3px" }}>
                {category.label}
              </h1>
              <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="px-6 py-8" style={{ backgroundColor: "#F8FAF8", minHeight: "60vh" }}>
        <div
          className="mx-auto flex gap-7"
          style={{ maxWidth: "1180px", alignItems: "flex-start" }}
        >
          {/* Sidebar filters */}
          <div className="hidden lg:block flex-shrink-0" style={{ width: "230px" }}>
            <FiltersPanel categoryLabel={category.shortLabel} />
          </div>

          {/* Main listings */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>Loading listings…</div>}>
              <DirectoryListings companies={companies} categoryShortLabel={category.shortLabel} />
            </Suspense>
          </div>

          {/* Right ad sidebar */}
          <div className="hidden xl:flex flex-col gap-5 flex-shrink-0" style={{ width: "280px" }}>
            {/* Sponsored card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E5E7EB", backgroundColor: "white" }}
            >
              <div
                className="px-4 py-2.5"
                style={{ backgroundColor: "#F8FAF8", borderBottom: "1px solid #E5E7EB" }}
              >
                <span style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
                  Sponsored
                </span>
              </div>
              <div className="p-5">
                <p className="font-bold mb-1" style={{ fontSize: "15px", color: "#111827" }}>
                  CannaShield Insurance
                </p>
                <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "12px", lineHeight: 1.55 }}>
                  Specialized cannabis business insurance — product liability, crop & property.
                </p>
                <a
                  href="/vendor/canna-shield-insurance"
                  className="inline-flex items-center gap-1.5 font-semibold"
                  style={{ color: "#F7941D", fontSize: "13px" }}
                >
                  Get a Quote <ArrowRight size={13} />
                </a>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: "#1A4A35" }}
            >
              <p
                className="font-bold text-white mb-2"
                style={{ fontSize: "15px", fontWeight: 700 }}
              >
                Boost your visibility
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", marginBottom: "16px", lineHeight: 1.55 }}>
                Upgrade to Elite or Select to get priority placement and verified badge.
              </p>
              <Link
                href="/membership"
                className="btn-primary w-full justify-center"
                style={{ fontSize: "13px", padding: "10px" }}
              >
                View Plans
              </Link>
            </div>

            {/* 300x250 ad slot */}
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{
                width: "100%",
                height: "220px",
                backgroundColor: "#F3F4F6",
                border: "2px dashed #D1D5DB",
              }}
            >
              <div className="text-center">
                <p className="font-semibold" style={{ color: "#9CA3AF", fontSize: "12px" }}>AD SLOT</p>
                <p style={{ color: "#9CA3AF", fontSize: "11px" }}>300 × 250</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
