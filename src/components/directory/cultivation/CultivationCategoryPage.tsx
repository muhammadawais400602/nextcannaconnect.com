import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import CultivationListingsGrid from "./CultivationListingsGrid";

const GUIDE = [
  { icon: "verified", title: "State License", body: "Confirm the grower holds a current state cultivation license and is METRC compliant." },
  { icon: "eco", title: "Grow Type", body: "Understand whether they operate indoor, outdoor, or greenhouse — each has distinct quality profiles." },
  { icon: "science", title: "Testing & Compliance", body: "Verify all product is lab tested and pesticide-free before entering the supply chain." },
  { icon: "local_shipping", title: "Wholesale Capability", body: "Confirm they can supply wholesale quantities to licensed dispensaries and processors." },
];

const RELATED = [
  { icon: "science", label: "Extraction & Processing", slug: "extraction-processing" },
  { icon: "factory", label: "Manufacturers & Suppliers", slug: "manufacturers-suppliers" },
  { icon: "biotech", label: "Testing & Science", slug: "testing-science" },
  { icon: "terminal", label: "Technology & Software", slug: "technology-software" },
];

const FAQS = [
  { q: "What does a state cultivation license cover?", a: "A state cultivation license authorizes the holder to grow cannabis commercially within that state's regulatory framework, covering plant counts, canopy limits, and compliance requirements." },
  { q: "What is the difference between indoor, outdoor, and greenhouse grows?", a: "Indoor grows use controlled environments with artificial lighting for year-round production. Outdoor grows use natural sunlight and are seasonal. Greenhouse grows combine natural light with environmental controls for efficiency." },
  { q: "How do I verify a grower is METRC compliant?", a: "Ask for their METRC integration documentation and verify their license number with the state regulatory authority. Compliant growers can provide manifest tracking for all transfers." },
  { q: "Do cultivators sell wholesale to licensed dispensaries?", a: "Yes, most licensed cultivators sell wholesale to dispensaries and processors. Check each listing for wholesale availability and minimum order requirements." },
  { q: "What certifications should a premium cultivator have?", a: "Look for organic certifications, pesticide-free testing results, state licensing, METRC integration, and insurance documentation." },
];

export default async function CultivationCategoryPage() {
  const companies = await getCompaniesByCategory("cultivation-growing");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Cultivation & Growing"
      title="Cultivation & Growing"
      description="Licensed cannabis cultivation operations — indoor, outdoor, and greenhouse grows supplying the commercial supply chain."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Cultivators` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "nature", label: "Indoor & Outdoor" },
      ]}
      primaryCta={{ label: "List Your Grow", href: "/signup" }}
      guideTitle="What to look for in a cultivation partner"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <CultivationListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
