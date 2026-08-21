import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import FinanceListingsGrid from "./FinanceListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Licensing & Regulation", body: "Verify the provider holds appropriate NMLS, state insurance, or banking licenses for cannabis services." },
  { icon: "account_balance", title: "Cannabis Experience", body: "Cannabis banking and insurance require specialized knowledge — ensure they serve licensed operators." },
  { icon: "speed", title: "Funding Speed", body: "Check average funding or approval times and compare terms across multiple providers." },
  { icon: "shield", title: "Coverage Scope", body: "For insurance, verify they cover cannabis-specific risks including product liability and crop loss." },
];

const RELATED = [
  { icon: "gavel", label: "Compliance & Legal", slug: "compliance-legal" },
  { icon: "apartment", label: "Real Estate & Construction", slug: "real-estate-construction" },
  { icon: "terminal", label: "Technology & Software", slug: "technology-software" },
  { icon: "support_agent", label: "Consultants & Advisors", slug: "consultants-advisors" },
];

const FAQS = [
  { q: "Can cannabis businesses get a traditional business bank account?", a: "Cannabis banking is limited due to federal regulations, but specialized cannabis-friendly banks and credit unions do exist. Check each listing for their specific banking services and eligibility requirements." },
  { q: "What types of loans are available for cannabis operators?", a: "Options include equipment financing, real estate loans, lines of credit, and SBA-alternative lending. Terms and rates vary significantly — compare multiple providers." },
  { q: "What insurance coverage does a cannabis business need?", a: "Essential coverage includes general liability, product liability, property insurance, crop insurance (for cultivators), and workers' compensation. Some states require specific cannabis endorsements." },
  { q: "How do cannabis-specialized accountants differ from regular accountants?", a: "Cannabis accountants understand IRC 280E tax implications, state-by-state reporting requirements, and the unique cash-handling challenges of the cannabis industry." },
  { q: "What documentation do I need for cannabis business financing?", a: "Typically you'll need state cannabis licenses, financial statements, tax returns, a business plan, and proof of compliance. Requirements vary by lender and loan type." },
];

export default async function FinanceCategoryPage() {
  const companies = await getCompaniesByCategory("finance-insurance");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Finance & Insurance"
      title="Finance & Insurance"
      description="Cannabis-specialized banking, lending, insurance, and accounting services for licensed cannabis operators."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Providers` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "account_balance", label: "Banking to Insurance" },
      ]}
      primaryCta={{ label: "List Your Business", href: "/signup" }}
      guideTitle="What to look for in a cannabis financial services provider"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <FinanceListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
