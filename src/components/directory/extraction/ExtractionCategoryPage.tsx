import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import ExtractionListingsGrid from "./ExtractionListingsGrid";

const GUIDE = [
  { icon: "verified", title: "State License", body: "Confirm the facility holds a valid state processing license and is in good standing." },
  { icon: "science", title: "Extraction Methods", body: "Understand which methods they use — CO₂, ethanol, or hydrocarbon — and their purity capabilities." },
  { icon: "assignment", title: "Lab Testing", body: "Verify all output comes with a Certificate of Analysis (COA) from an accredited lab." },
  { icon: "inventory_2", title: "White Label Options", body: "Check if they offer toll processing and white label packaging for your brand." },
];

const RELATED = [
  { icon: "nature", label: "Cultivation & Growing", slug: "cultivation-growing" },
  { icon: "biotech", label: "Testing & Science", slug: "testing-science" },
  { icon: "factory", label: "Manufacturers & Suppliers", slug: "manufacturers-suppliers" },
  { icon: "storefront", label: "Retail & Dispensary", slug: "retail-dispensary" },
];

const FAQS = [
  { q: "What extraction methods are used in cannabis processing?", a: "Common methods include supercritical CO₂ extraction, ethanol extraction, and hydrocarbon extraction (butane/propane). Each produces different end products with varying purity levels." },
  { q: "What is toll processing and how does it work?", a: "Toll processing means you supply the raw material and the facility processes it for a per-pound fee, returning the finished concentrate to you." },
  { q: "What does a Certificate of Analysis (COA) tell me?", a: "A COA details potency (THC/CBD percentages), terpene profiles, and confirms the product is free of contaminants like pesticides, heavy metals, and residual solvents." },
  { q: "How do I verify an extraction facility is licensed?", a: "Request their state processing license number and verify it with the state regulatory authority. Licensed facilities can also show METRC integration." },
  { q: "What is the difference between distillate, shatter, and live resin?", a: "Distillate is a highly refined, potent oil. Shatter is a glass-like concentrate made via hydrocarbon extraction. Live resin is made from flash-frozen plant material, preserving terpene profiles." },
];

export default async function ExtractionCategoryPage() {
  const companies = await getCompaniesByCategory("extraction-processing");

  return (
    <CategoryPageShell
      categoryLabel="Extraction & Processing"
      title="Extraction & Processing"
      description="Licensed extraction and processing facilities producing concentrates, distillates, and refined cannabis products."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Facilities` },
        { icon: "science", label: "CO₂ / Ethanol / Hydrocarbon" },
        { icon: "inventory_2", label: "White Label Available" },
      ]}
      primaryCta={{ label: "List Your Facility", href: "/signup" }}
      guideTitle="What to look for in an extraction facility"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <ExtractionListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
