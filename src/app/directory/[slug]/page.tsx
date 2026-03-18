import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { getCompaniesByCategory } from "@/data/companies";
import CategoryNavBar from "@/components/directory/CategoryNavBar";
import FiltersPanel from "@/components/directory/FiltersPanel";
import ListingCard from "@/components/directory/ListingCard";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
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
  const featured = companies.filter((c) => c.tier === "featured");
  const elite = companies.filter((c) => c.tier === "elite");
  const select = companies.filter((c) => c.tier === "select");
  const claimed = companies.filter((c) => c.tier === "claimed");
  const free = companies.filter((c) => c.tier === "free");

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

            {/* Search bar */}
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl flex-shrink-0"
              style={{
                border: "1px solid #E5E7EB",
                backgroundColor: "#F8FAF8",
                width: "100%",
                maxWidth: "320px",
              }}
            >
              <Search size={15} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              <input
                type="text"
                placeholder={`Search ${category.shortLabel}...`}
                className="flex-1 bg-transparent outline-none"
                style={{ fontSize: "14px", color: "#111827", border: "none" }}
              />
            </div>
          </div>

          {/* Result count + sort */}
          <div className="flex items-center justify-between mt-5">
            <p style={{ color: "#6B7280", fontSize: "13px" }}>
              Showing <strong style={{ color: "#111827" }}>{companies.length}</strong> businesses
            </p>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={14} style={{ color: "#9CA3AF" }} />
              <span style={{ fontSize: "13px", color: "#6B7280" }}>Sort: Relevance</span>
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

            {/* Featured */}
            {featured.map((c) => (
              <ListingCard key={c.id} company={c} featured />
            ))}

            {/* Paid tiers */}
            {[...elite, ...select, ...claimed].map((c) => (
              <ListingCard key={c.id} company={c} />
            ))}

            {/* Unclaimed separator */}
            {free.length > 0 && (
              <>
                <div className="flex items-center gap-3 my-6">
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
                  <span
                    className="font-semibold uppercase"
                    style={{ color: "#9CA3AF", fontSize: "11px", letterSpacing: "1px", whiteSpace: "nowrap" }}
                  >
                    Unclaimed Listings
                  </span>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
                </div>
                {free.map((c) => (
                  <ListingCard key={c.id} company={c} />
                ))}
              </>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                className="rounded-lg px-4 py-2.5 font-medium transition-colors"
                style={{ fontSize: "13px", color: "#6B7280", border: "1px solid #E5E7EB", backgroundColor: "white" }}
              >
                ← Previous
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className="rounded-lg px-3.5 py-2.5 font-medium transition-colors"
                  style={{
                    fontSize: "13px",
                    backgroundColor: n === 1 ? "#F7941D" : "white",
                    color: n === 1 ? "white" : "#6B7280",
                    border: n === 1 ? "none" : "1px solid #E5E7EB",
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                className="rounded-lg px-4 py-2.5 font-medium transition-colors"
                style={{ fontSize: "13px", color: "#6B7280", border: "1px solid #E5E7EB", backgroundColor: "white" }}
              >
                Next →
              </button>
            </div>
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
