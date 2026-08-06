import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import TechListingsGrid from "./TechListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Compliance Integration", body: "Confirm native integration with METRC or your state track-and-trace system." },
  { icon: "lock", title: "Security Posture", body: "Look for SOC 2 / ISO 27001, encryption at rest, SSO, and role-based access." },
  { icon: "trending_up", title: "Scalability", body: "Ensure the platform supports multi-location and multi-state operations." },
  { icon: "support_agent", title: "Support & Onboarding", body: "Assess implementation support, training, and ongoing account management." },
];

const RELATED = [
  { icon: "storefront", label: "Retail & Dispensary", slug: "retail-dispensary" },
  { icon: "nature", label: "Cultivation", slug: "cultivation-growing" },
  { icon: "local_shipping", label: "Logistics & Transport", slug: "transportation-logistics" },
  { icon: "gavel", label: "Compliance & Legal", slug: "compliance-legal" },
];

const FAQS = [
  { q: "What does SOC 2 Type II mean for cannabis software?", a: "SOC 2 Type II is an independent audit of a vendor's security, availability, and confidentiality controls over time — a strong signal that your operational and customer data is well protected." },
  { q: "Does the software integrate with METRC?", a: "Compliant platforms integrate directly with METRC and other state systems to sync inventory, manifests, and sales in real time. Each listing shows its supported integrations." },
  { q: "Can these platforms handle multi-state operations?", a: "Enterprise-grade solutions are built for MSOs, supporting multiple licenses, locations, and state compliance frameworks under one account." },
  { q: "What pricing models are common?", a: "Most vendors price per location or per seat, with enterprise/custom tiers for larger operators. Pricing model is shown on each vendor's profile." },
  { q: "How long does implementation take?", a: "It varies by platform and complexity — many offer guided onboarding and data migration. Ask the vendor directly through their profile for a timeline." },
];

export default async function TechCategoryPage() {
  const companies = await getCompaniesByCategory("technology-software");
  const metrcCount = companies.filter((c) => (c.serviceTags ?? []).some((t) => t.toLowerCase().includes("metrc"))).length;

  return (
    <CategoryPageShell
      categoryLabel="Technology & Software"
      title="Technology & Software"
      description="Institutional-grade enterprise solutions for the regulated cannabis supply chain — compliant POS, seed-to-sale tracking, and robust ERP platforms."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Vendors` },
        { icon: "hub", label: `${metrcCount} Metrc Integrations` },
        { icon: "shield", label: "SOC 2 Vetted" },
      ]}
      primaryCta={{ label: "List Your Platform", href: "/signup" }}
      guideTitle="What to look for in cannabis software"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <TechListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
