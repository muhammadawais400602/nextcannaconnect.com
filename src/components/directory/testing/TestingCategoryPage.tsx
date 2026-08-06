import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import TestingListingsGrid from "./TestingListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Active Accreditation", body: "Confirm the lab holds current ISO/IEC 17025 accreditation and state licensing." },
  { icon: "timer", title: "Turnaround Time", body: "Check average TAT and whether rush service is available for time-sensitive batches." },
  { icon: "science", title: "Panel Coverage", body: "Ensure they run the full required panels — potency, pesticides, microbials, solvents." },
  { icon: "biotech", title: "Instrumentation", body: "Look for validated methods (LC-MS/MS, GC-MS, qPCR) and proven analytical rigor." },
];

const RELATED = [
  { icon: "nature", label: "Cultivation", slug: "cultivation-growing" },
  { icon: "factory", label: "Manufacturers", slug: "manufacturers-suppliers" },
  { icon: "gavel", label: "Compliance & Legal", slug: "compliance-legal" },
  { icon: "terminal", label: "Technology", slug: "technology-software" },
];

const FAQS = [
  { q: "What does ISO 17025 accreditation mean?", a: "ISO/IEC 17025 is the international standard for testing and calibration laboratories. It confirms the lab operates a validated quality-management system and produces technically valid results." },
  { q: "How fast can I get results?", a: "Turnaround varies by lab and panel — most offer 48–72 hours standard, with same-day or 24-hour rush service for an added fee. Each listing shows its average TAT." },
  { q: "What sample types can labs handle?", a: "Most accredited labs test flower, concentrates/oil, and edibles. Check each listing's Quick Facts for the specific sample types they accept." },
  { q: "Do labs integrate with METRC?", a: "Compliant labs integrate with METRC or the applicable state track-and-trace system to report results directly against your manifests." },
  { q: "How do I submit samples?", a: "Contact the lab directly to arrange intake — many offer scheduled pickup and have posted sample-intake hours on their profile." },
];

export default async function TestingCategoryPage() {
  const companies = await getCompaniesByCategory("testing-science");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Testing & Science"
      title="Testing & Science"
      description="ISO 17025-accredited cannabis testing laboratories and analytical service providers."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Labs` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "science", label: "ISO 17025 Accredited" },
      ]}
      primaryCta={{ label: "List Your Lab", href: "/signup" }}
      guideTitle="What to look for in a testing lab"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <TestingListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
