import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import RealEstateListingsGrid from "./RealEstateListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Active Licensing", body: "Confirm the firm holds valid contractor/architect licenses for every state you operate in." },
  { icon: "shield", title: "Insurance & Bonding", body: "Look for adequate general liability, professional (E&O) coverage, and bonding." },
  { icon: "nature", title: "Cannabis Experience", body: "Prioritize firms with proven cannabis buildouts — cultivation, extraction, and retail." },
  { icon: "photo_library", title: "Portfolio & References", body: "Review completed projects and square footage delivered to gauge real capability." },
];

const RELATED = [
  { icon: "storefront", label: "Retail & Dispensary", slug: "retail-dispensary" },
  { icon: "nature", label: "Cultivation", slug: "cultivation-growing" },
  { icon: "factory", label: "Manufacturers", slug: "manufacturers-suppliers" },
  { icon: "gavel", label: "Compliance & Legal", slug: "compliance-legal" },
];

const FAQS = [
  { q: "Why do I need a cannabis-specialized contractor?", a: "Cannabis facilities have unique requirements — biosecurity zoning, heavy HVAC and electrical loads, odor control, security, and strict local code. Specialists de-risk permitting and compliance." },
  { q: "What licenses should a construction firm hold?", a: "Look for an active General Contractor license (and Architect/Engineer where relevant) in each state of operation. Each firm lists its jurisdictions and license numbers." },
  { q: "What insurance coverage is standard?", a: "Expect general liability (often $2M–$10M), professional liability (E&O), and workers' compensation at statutory limits — shown in each firm's Insurance Snapshot." },
  { q: "Do these firms handle design and build?", a: "Many are design-build firms covering feasibility, architectural design, and full construction management. Their profile outlines their process." },
  { q: "How do I request a quote?", a: "Use the Request Project Quote button on any firm's profile to reach their team directly with your project scope." },
];

export default async function RealEstateCategoryPage() {
  const companies = await getCompaniesByCategory("real-estate-construction");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Real Estate & Construction"
      title="Real Estate & Construction"
      description="Institutional-grade architecture, general contracting, and specialized engineering firms verified for commercial cannabis cultivation and retail buildouts."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Firms` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "task_alt", label: "100% Cannabis-Zoned Specs" },
      ]}
      primaryCta={{ label: "List Your Firm", href: "/signup" }}
      guideTitle="What to look for in a construction partner"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <RealEstateListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
