import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import ConsultantsListingsGrid from "./ConsultantsListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Industry Experience", body: "Look for consultants with 5+ years of hands-on cannabis industry experience and proven results." },
  { icon: "assignment", title: "Track Record", body: "Ask for case studies, client references, and measurable outcomes from past engagements." },
  { icon: "gavel", title: "Licensing Expertise", body: "For license applications, ensure they have experience with your state's specific regulatory framework." },
  { icon: "handshake", title: "Engagement Model", body: "Understand whether they work on retainer, per-project, or hourly — and what deliverables to expect." },
];

const RELATED = [
  { icon: "gavel", label: "Compliance & Legal", slug: "compliance-legal" },
  { icon: "account_balance", label: "Finance & Insurance", slug: "finance-insurance" },
  { icon: "terminal", label: "Technology & Software", slug: "technology-software" },
  { icon: "campaign", label: "Marketing & Branding", slug: "marketing-branding-packaging" },
];

const FAQS = [
  { q: "When should a cannabis business hire a consultant?", a: "Consider hiring a consultant during license applications, facility build-outs, operational launches, compliance audits, or when scaling to new markets. Early engagement often prevents costly mistakes." },
  { q: "What is the difference between a cannabis consultant and a cannabis attorney?", a: "Consultants focus on business strategy, operations, and licensing guidance. Attorneys provide legal advice, draft contracts, and represent you in regulatory proceedings. Many operators need both." },
  { q: "How do I verify a consultant's track record?", a: "Ask for case studies, client references, and specific outcomes from past engagements. Look for verified reviews on their profile and check their industry credentials." },
  { q: "What does a cannabis licensing consultant do?", a: "They guide you through the license application process — from site selection and business plan development to application drafting and regulatory compliance documentation." },
  { q: "What is a typical consulting engagement model?", a: "Common models include project-based (fixed scope and fee), retainer (monthly advisory), and hourly consulting. The right model depends on your needs and timeline." },
];

export default async function ConsultantsCategoryPage() {
  const companies = await getCompaniesByCategory("consultants-advisors");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Consultants & Advisors"
      title="Consultants & Advisors"
      description="Strategic advisors, operational consultants, and specialized guidance for cannabis business owners at every stage."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Consultants` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "school", label: "Licensing to Operations" },
      ]}
      primaryCta={{ label: "List Your Practice", href: "/signup" }}
      guideTitle="What to look for in a cannabis consultant"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <ConsultantsListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
