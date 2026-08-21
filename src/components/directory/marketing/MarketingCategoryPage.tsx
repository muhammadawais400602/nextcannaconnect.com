import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import MarketingListingsGrid from "./MarketingListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Cannabis Specialization", body: "Ensure the agency has specific cannabis industry experience and understands compliance requirements." },
  { icon: "palette", title: "Portfolio Quality", body: "Review their portfolio for cannabis-specific work including packaging, branding, and digital campaigns." },
  { icon: "gavel", title: "Compliance Knowledge", body: "Cannabis marketing has strict regulations — verify they understand state-by-state advertising rules." },
  { icon: "timer", title: "Turnaround & Process", body: "Understand their typical project timeline, revision policy, and communication cadence." },
];

const RELATED = [
  { icon: "terminal", label: "Technology & Software", slug: "technology-software" },
  { icon: "storefront", label: "Retail & Dispensary", slug: "retail-dispensary" },
  { icon: "support_agent", label: "Consultants & Advisors", slug: "consultants-advisors" },
  { icon: "gavel", label: "Compliance & Legal", slug: "compliance-legal" },
];

const FAQS = [
  { q: "What makes cannabis-compliant packaging different from standard design?", a: "Cannabis packaging must meet state-specific requirements for child-resistance, labeling, THC warnings, and opacity. A specialized agency ensures your packaging is both compliant and compelling." },
  { q: "How do I verify an agency has cannabis marketing experience?", a: "Review their portfolio for cannabis clients, ask for case studies with measurable outcomes, and check if they understand platform-specific advertising restrictions." },
  { q: "What is a typical budget for a cannabis brand identity project?", a: "Brand identity projects typically range from $5,000 to $50,000+ depending on scope — including logo, packaging, brand guidelines, and collateral. Check each agency's project minimum." },
  { q: "Can a cannabis marketing agency manage my social media legally?", a: "Yes, but cannabis social media requires careful compliance with platform policies. Experienced agencies know how to create engaging content while avoiding account restrictions." },
  { q: "How long does a packaging design project take?", a: "Typical timelines range from 4-12 weeks from brief to print-ready files, depending on complexity, number of SKUs, and revision rounds." },
];

export default async function MarketingCategoryPage() {
  const companies = await getCompaniesByCategory("marketing-branding-packaging");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Marketing, Branding & Packaging"
      title="Marketing, Branding & Packaging"
      description="Cannabis-specialized agencies offering brand strategy, packaging design, digital marketing, and creative services."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Agencies` },
        { icon: "palette", label: "Cannabis Compliance Experts" },
        { icon: "brush", label: "Full-Service Creative" },
      ]}
      primaryCta={{ label: "List Your Agency", href: "/signup" }}
      guideTitle="What to look for in a cannabis marketing agency"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <MarketingListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
