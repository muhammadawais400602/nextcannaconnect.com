import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import CategoryPageShell from "@/components/directory/CategoryPageShell";
import RetailListingsGrid from "./RetailListingsGrid";

const GUIDE = [
  { icon: "verified", title: "Active License Verification", body: "Ensure the retailer holds a valid state license updated regularly." },
  { icon: "local_shipping", title: "Delivery Infrastructure", body: "Check if they offer secure, compliant delivery services for broader reach." },
  { icon: "inventory_2", title: "Inventory Depth", body: "Look for partners carrying a diverse, premium selection of brands." },
  { icon: "payments", title: "B2B Purchasing Power", body: "Assess their capacity for volume purchasing and reliable payment history." },
];

const RELATED = [
  { icon: "factory", label: "Manufacturers", slug: "manufacturers-suppliers" },
  { icon: "nature", label: "Cultivation", slug: "cultivation-growing" },
  { icon: "local_shipping", label: "Transportation", slug: "transportation-logistics" },
  { icon: "campaign", label: "Marketing", slug: "marketing-branding-packaging" },
];

const FAQS = [
  { q: 'What does the "Verified" badge mean?', a: "A verified badge indicates that NextCanna Connect has independently confirmed the dispensary's state operating license is currently active and in good standing. We reverify these statuses routinely." },
  { q: "Can I message a dispensary directly through the platform?", a: "Yes, if you have a registered business account, you can use our secure messaging system to contact verified dispensaries for wholesale inquiries or partnerships." },
  { q: "How often are location hours updated?", a: "Store hours are managed directly by the dispensary operators. We encourage our partners to keep their profiles updated, and we display a 'last updated' timestamp on their full profile page." },
  { q: "Does it cost money to list my dispensary?", a: "Basic listings are free for licensed operators. We offer premium placement and advanced analytics tools for a subscription fee. Contact our sales team for details." },
  { q: "What documents do I need to claim my listing?", a: "To claim and verify a listing, you will need to provide a copy of your active state cannabis business license and documentation proving you are an authorized representative of the company." },
];

export default async function RetailCategoryPage() {
  const companies = await getCompaniesByCategory("retail-dispensary");
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <CategoryPageShell
      categoryLabel="Retail & Dispensary"
      title="Retail & Dispensary"
      description="Connect with licensed, verified retail operations across the nation. Browse trusted storefronts and delivery services evaluated for compliance and operational excellence."
      stats={[
        { icon: "verified", label: `${companies.length} Verified Listings` },
        { icon: "map", label: `${statesCovered} States Covered` },
        { icon: "update", label: "Updated Daily" },
      ]}
      primaryCta={{ label: "List Your Dispensary", href: "/signup" }}
      guideTitle="What to look for in a cannabis retailer"
      guide={GUIDE}
      related={RELATED}
      faqs={FAQS}
    >
      <RetailListingsGrid companies={companies} />
    </CategoryPageShell>
  );
}
