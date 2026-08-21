import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import TransportListingsGrid from "./TransportListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Active Licensing", body: "Ensure the carrier holds valid distributor or transport licenses for all jurisdictions crossed." },
  { icon: "local_shipping", title: "Secure Vehicles", body: "Look for unmarked, armored, or specialized secure transport vehicles with alarm systems." },
  { icon: "thermostat", title: "Climate Control", body: "Crucial for maintaining product integrity, especially for concentrates, edibles, and fresh flower." },
  { icon: "gps_fixed", title: "Real-Time Tracking", body: "Continuous GPS monitoring and integration with state track-and-trace systems (like METRC)." },
];

const RELATED = [
  { icon: "storefront", label: "Retail & Dispensaries", slug: "retail-dispensary" },
  { icon: "precision_manufacturing", label: "Manufacturers", slug: "manufacturers-suppliers" },
  { icon: "agriculture", label: "Cultivation", slug: "cultivation-growing" },
  { icon: "gavel", label: "Legal & Compliance", slug: "compliance-legal" },
];

const FAQS = [
  { q: "Are cannabis carriers federally regulated?", a: "Cannabis remains federally illegal, so licensed carriers operate strictly within state lines under state-issued distribution and transport licenses. They must comply with each state's regulatory framework rather than federal interstate commerce rules." },
  { q: "How do carriers handle cross-border transport?", a: "Because product cannot legally cross state lines, carriers operate intra-state. Multi-state operators maintain separate licensed fleets and facilities in each state they serve." },
  { q: "What insurance should a cannabis transport company carry?", a: "Look for cargo insurance (often $1M–$5M in coverage), commercial auto liability, and general liability. Verified carriers list their coverage limits on their profile." },
  { q: "Do carriers integrate directly with METRC?", a: "Most compliant carriers integrate with METRC or the applicable state track-and-trace system to log manifests, chain of custody, and delivery confirmation in real time." },
  { q: "What is the difference between distribution and transport only?", a: "A distributor can take ownership of product, store it, and sell it onward, while a transport-only carrier simply moves product between licensed parties without taking ownership." },
];

export default async function TransportCategoryPage() {
  const companies = await getCompaniesByCategory("transportation-logistics");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Transportation & Logistics"
      title="Transportation & Logistics"
      description="Licensed cannabis distributors, secure carriers, and last-mile fleets moving product legally across state lines and within regulated markets."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Carriers` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "support_agent", label: "24/7 Support" },
      ]}
      primaryCta={{ label: "List Your Fleet", href: "/signup" }}
      guideTitle="What to look for in a cannabis carrier"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <TransportListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
