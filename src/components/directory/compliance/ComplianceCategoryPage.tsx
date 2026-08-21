import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import ComplianceListingsGrid from "./ComplianceListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Bar Admission", body: "Verify the attorney is licensed to practice in your state and has cannabis law experience." },
  { icon: "gavel", title: "Practice Areas", body: "Ensure they cover your specific needs — licensing, M&A, regulatory compliance, or IP protection." },
  { icon: "history", title: "Track Record", body: "Ask about notable cases, success rates, and experience with your state's regulatory authority." },
  { icon: "payments", title: "Fee Structure", body: "Understand their billing model — flat fee, hourly, retainer, or contingency — before engaging." },
];

const RELATED = [
  { icon: "account_balance", label: "Finance & Insurance", slug: "finance-insurance" },
  { icon: "support_agent", label: "Consultants & Advisors", slug: "consultants-advisors" },
  { icon: "terminal", label: "Technology & Software", slug: "technology-software" },
  { icon: "apartment", label: "Real Estate & Construction", slug: "real-estate-construction" },
];

const FAQS = [
  { q: "What type of attorney do I need for a cannabis business license application?", a: "You need an attorney experienced in cannabis regulatory law in your specific state. They should understand the application process, zoning requirements, and compliance documentation needed." },
  { q: "What is the difference between a cannabis compliance firm and a cannabis attorney?", a: "Compliance firms help with ongoing regulatory adherence, standard operating procedures, and audit preparation. Attorneys provide legal counsel, contract drafting, and representation in legal proceedings." },
  { q: "How do I verify an attorney is licensed to practice in my state?", a: "Check your state bar association's online directory. You can verify their license status, disciplinary history, and practice areas." },
  { q: "What is a typical fee structure for cannabis legal services?", a: "Fees vary widely — license applications may be flat fee ($5,000–$50,000+), ongoing compliance is often retainer-based, and litigation is typically hourly ($300–$800/hr)." },
  { q: "Can one law firm handle cannabis licensing in multiple states?", a: "Some firms operate in multiple states, but cannabis law is highly state-specific. Ensure the firm has direct experience and bar admission in each state you need." },
];

export default async function ComplianceCategoryPage() {
  const companies = await getCompaniesByCategory("compliance-legal");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Compliance & Legal"
      title="Compliance & Legal"
      description="Cannabis-specialized attorneys, licensing experts, and regulatory compliance professionals."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Firms` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "gavel", label: "Licensing to M&A" },
      ]}
      primaryCta={{ label: "List Your Firm", href: "/signup" }}
      guideTitle="What to look for in a cannabis attorney or compliance firm"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <ComplianceListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
