import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import ManufacturersListingsGrid from "./ManufacturersListingsGrid";

const GUIDE = [
  { icon: "verified", title: "GMP Certification", body: "Verify the manufacturer holds current Good Manufacturing Practice certification." },
  { icon: "local_shipping", title: "Shipping Coverage", body: "Check how many states they ship to and their typical lead times." },
  { icon: "inventory_2", title: "Product Range", body: "Assess their catalog depth and whether they offer custom OEM or white label options." },
  { icon: "shield", title: "Quality Assurance", body: "Look for ISO 9001 certification and documented quality control processes." },
];

const RELATED = [
  { icon: "nature", label: "Cultivation & Growing", slug: "cultivation-growing" },
  { icon: "science", label: "Extraction & Processing", slug: "extraction-processing" },
  { icon: "terminal", label: "Technology & Software", slug: "technology-software" },
  { icon: "apartment", label: "Real Estate & Construction", slug: "real-estate-construction" },
];

const FAQS = [
  { q: "What is a minimum order quantity (MOQ) and why does it matter?", a: "MOQ is the smallest order a supplier will accept. It matters because it affects your purchasing strategy, inventory management, and cash flow planning." },
  { q: "How do I verify a supplier's GMP certification?", a: "Request a copy of their current GMP certificate and verify it with the issuing body. Check the certification date and scope of coverage." },
  { q: "Which states can licensed cannabis suppliers ship to?", a: "Shipping is restricted to states where cannabis is legal. Each listing shows the number of states they currently serve." },
  { q: "Do manufacturers offer custom OEM or white label products?", a: "Many manufacturers offer OEM and white label services. Check each listing's capabilities section for custom manufacturing options." },
  { q: "What is the typical lead time for cannabis equipment orders?", a: "Lead times vary by product complexity and order volume, typically ranging from 2-8 weeks. Check each listing for specific lead time estimates." },
];

export default async function ManufacturersCategoryPage() {
  const companies = await getCompaniesByCategory("manufacturers-suppliers");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Manufacturers & Suppliers"
      title="Manufacturers & Suppliers"
      description="Equipment manufacturers, raw material suppliers, and wholesale distributors serving licensed cannabis operators."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Suppliers` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "inventory_2", label: "B2B & Wholesale" },
      ]}
      primaryCta={{ label: "List Your Business", href: "/signup" }}
      guideTitle="What to look for in a manufacturer or supplier"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <ManufacturersListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
