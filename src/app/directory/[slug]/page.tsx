import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, getCategoryBySlug } from "@/data/categories";
import { getCompaniesByCategory } from "@/data/companies";
import CategoryNavBar from "@/components/directory/CategoryNavBar";
import FiltersPanel from "@/components/directory/FiltersPanel";
import ListingCard from "@/components/directory/ListingCard";
import SponsoredBanner from "@/components/home/SponsoredBanner";
import SectionDivider from "@/components/ui/SectionDivider";
import { Search } from "lucide-react";

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

      {/* Search Bar */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E8EDE8" }}>
        <div className="mx-auto px-8 py-4" style={{ maxWidth: "1100px" }}>
          <div
            className="flex items-center gap-3 rounded-lg px-4 py-2.5"
            style={{ border: "1px solid #E8EDE8", backgroundColor: "#F7F9F7", maxWidth: "600px" }}
          >
            <Search size={16} style={{ color: "#4A5E4A" }} />
            <input
              type="text"
              placeholder="Search the cannabis industry network..."
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: "14px", color: "#1A2E1A", border: "none" }}
            />
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Category Title */}
      <div className="px-8 py-8" style={{ backgroundColor: "#F7F9F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h1 className="font-bold mb-1" style={{ fontSize: "28px", color: "#1A4A35", fontWeight: 700 }}>
            {category.label}
          </h1>
          <p style={{ color: "#4A5E4A", fontSize: "15px" }}>{category.description}</p>
        </div>
      </div>

      {/* Sponsored leaderboard */}
      <SponsoredBanner
        companyName="LeafWorks Software"
        tagline="The all-in-one cannabis ERP. Seed-to-sale tracking, POS, and compliance in one platform."
        logoInitials="LW"
        destinationUrl="/vendor/leafworks-software"
        ctaText="See Platform →"
      />

      <SectionDivider />

      {/* Main layout: filters + listings */}
      <div className="px-8 py-8" style={{ backgroundColor: "#F7F9F7" }}>
        <div
          className="mx-auto flex gap-6"
          style={{ maxWidth: "1100px", alignItems: "flex-start" }}
        >
          {/* LEFT: Filters */}
          <div className="hidden lg:block flex-shrink-0" style={{ width: "220px" }}>
            <FiltersPanel categoryLabel={category.shortLabel} />
          </div>

          {/* RIGHT: Listings + Sidebar */}
          <div className="flex-1 min-w-0 flex gap-5" style={{ alignItems: "flex-start" }}>
            {/* Listings column */}
            <div className="flex-1 min-w-0">
              <p style={{ color: "#4A5E4A", fontSize: "13px", marginBottom: "16px" }}>
                Showing <strong>{companies.length}</strong> businesses in {category.label}
              </p>

              {/* Featured */}
              {featured.map((c) => (
                <ListingCard key={c.id} company={c} featured />
              ))}

              {/* Elite */}
              {elite.length > 0 && (
                <div className="flex flex-col gap-3 mb-3">
                  {elite.map((c) => <ListingCard key={c.id} company={c} />)}
                </div>
              )}

              {/* Select */}
              {select.length > 0 && (
                <div className="flex flex-col gap-3 mb-3">
                  {select.map((c) => <ListingCard key={c.id} company={c} />)}
                </div>
              )}

              {/* Claimed */}
              {claimed.length > 0 && (
                <div className="flex flex-col gap-3 mb-3">
                  {claimed.map((c) => <ListingCard key={c.id} company={c} />)}
                </div>
              )}

              {/* Unclaimed separator */}
              {free.length > 0 && (
                <>
                  <div className="flex items-center gap-3 my-5">
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#E8EDE8" }} />
                    <span style={{ color: "#4A5E4A", fontSize: "12px", fontWeight: 600 }}>UNCLAIMED LISTINGS</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#E8EDE8" }} />
                  </div>
                  <div className="flex flex-col gap-3">
                    {free.map((c) => <ListingCard key={c.id} company={c} />)}
                  </div>
                </>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  className="px-3 py-1.5 rounded font-medium"
                  style={{ fontSize: "13px", color: "#4A5E4A", border: "1px solid #E8EDE8" }}
                >
                  ← Previous
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className="px-3 py-1.5 rounded font-medium"
                    style={{
                      fontSize: "13px",
                      backgroundColor: n === 1 ? "#F7941D" : "transparent",
                      color: n === 1 ? "white" : "#4A5E4A",
                      border: n === 1 ? "none" : "1px solid #E8EDE8",
                    }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="px-3 py-1.5 rounded font-medium"
                  style={{ fontSize: "13px", color: "#4A5E4A", border: "1px solid #E8EDE8" }}
                >
                  Next →
                </button>
              </div>
            </div>

            {/* RIGHT sidebar ad slots */}
            <div className="hidden xl:flex flex-col gap-4 flex-shrink-0" style={{ width: "300px" }}>
              {/* Yellow sponsored card */}
              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: "#F9C31A" }}
              >
                <p className="font-bold text-sm mb-1" style={{ color: "#1A2E1A" }}>SPONSORED</p>
                <p className="font-bold mb-2" style={{ fontSize: "16px", color: "#1A2E1A" }}>CannaShield Insurance</p>
                <p style={{ fontSize: "13px", color: "#1A2E1A", marginBottom: "12px" }}>
                  Specialized cannabis business insurance. Product liability, crop, and property coverage.
                </p>
                <a
                  href="/vendor/canna-shield-insurance"
                  className="inline-block font-bold text-sm px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "#1A4A35", color: "white" }}
                >
                  Get a Quote →
                </a>
              </div>

              {/* 300x250 IAB placeholder */}
              <div
                className="rounded-xl flex items-center justify-center"
                style={{ width: "300px", height: "250px", backgroundColor: "#E8EDE8", border: "2px dashed #C0C0C0" }}
              >
                <div className="text-center">
                  <p className="font-semibold" style={{ color: "#4A5E4A", fontSize: "13px" }}>AD SLOT</p>
                  <p style={{ color: "#4A5E4A", fontSize: "11px" }}>300 × 250</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionDivider reverse />
    </>
  );
}
