import Link from "next/link";
import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import RetailListingsGrid from "./RetailListingsGrid";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";

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

  const listingCount = companies.length;
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  const stats = [
    { icon: "verified", label: `${listingCount} Verified Listings` },
    { icon: "map", label: `${statesCovered} States Covered` },
    { icon: "update", label: "Updated Daily" },
  ];

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b" }}>
      <style>{`
        .retail-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .retail-container { padding-left: 64px; padding-right: 64px; } }
        .retail-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .retail-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .retail-grid { grid-template-columns: repeat(3, 1fr); } }
        .retail-card { transition: transform 0.3s, box-shadow 0.3s; }
        .retail-card:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,51,32,0.1); }
        .retail-guide-grid { display: grid; grid-template-columns: 1fr; gap: 32px; text-align: center; }
        @media (min-width: 768px) { .retail-guide-grid { grid-template-columns: repeat(4, 1fr); } }
        .retail-related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 768px) { .retail-related-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background: "#FBF9F8", padding: "16px 0", borderBottom: `1px solid ${PARCHMENT}`, marginTop: "70px" }}>
        <div className="retail-container">
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#414943", margin: 0 }}>
            <Link href="/" style={{ color: "#414943", textDecoration: "none" }}>Home</Link>
            {" / "}
            <Link href="/directory" style={{ color: "#414943", textDecoration: "none" }}>Directory</Link>
            {" / "}
            <span style={{ color: DF }}>Retail &amp; Dispensary</span>
          </p>
        </div>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "56vh", display: "flex", alignItems: "center", justifyContent: "center", background: DF, overflow: "hidden", padding: "64px 0" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${DF} 0%, #00251733 100%)` }} />
        <div className="retail-container" style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ background: SAGE, color: DF, fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "0.75rem", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Verified Category</span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: "#FBF9F8", margin: "0 0 16px", letterSpacing: "-0.02em" }}>Retail &amp; Dispensary</h1>
          <p style={{ fontSize: "18px", color: "rgba(251,249,248,0.9)", maxWidth: "640px", margin: "0 0 32px", lineHeight: 1.5 }}>
            Connect with licensed, verified retail operations across the nation. Browse trusted storefronts and delivery services evaluated for compliance and operational excellence.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "32px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: "rgba(251,249,248,0.1)", backdropFilter: "blur(4px)", border: "1px solid rgba(251,249,248,0.2)", padding: "8px 16px", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "8px", color: "#FBF9F8" }}>
                <span className="material-symbols-outlined" style={{ color: SAGE }}>{s.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            <Link href="/signup" style={{ fontSize: "14px", fontWeight: 500, background: SAGE, color: DF, padding: "12px 24px", borderRadius: "0.25rem", textDecoration: "none" }}>List Your Dispensary</Link>
            <Link href="/directory" style={{ fontSize: "14px", fontWeight: 500, border: "1px solid #FBF9F8", color: "#FBF9F8", padding: "12px 24px", borderRadius: "0.25rem", textDecoration: "none" }}>Browse All Categories</Link>
          </div>
        </div>
      </section>

      {/* Buyer's guide */}
      <section style={{ background: PARCHMENT, padding: "48px 0" }}>
        <div className="retail-container">
          <details style={{ background: "white", borderRadius: "0.75rem", border: `1px solid ${PARCHMENT}`, overflow: "hidden" }}>
            <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", cursor: "pointer", listStyle: "none" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: 0 }}>What to look for in a cannabis retailer</h2>
              <span className="material-symbols-outlined" style={{ color: DF }}>expand_more</span>
            </summary>
            <div style={{ padding: "24px", borderTop: `1px solid ${PARCHMENT}`, background: "#FBF9F8" }}>
              <div className="retail-guide-grid">
                {GUIDE.map((g) => (
                  <div key={g.title} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: DF, color: SAGE, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>{g.icon}</span>
                    </div>
                    <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", margin: "0 0 8px" }}>{g.title}</h3>
                    <p style={{ fontSize: "14px", color: "#414943", margin: 0, lineHeight: 1.5 }}>{g.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* Filters + listings grid (client) */}
      <RetailListingsGrid companies={companies} />

      {/* Related categories */}
      <section style={{ background: "#FBF9F8", padding: "64px 0", borderTop: `1px solid ${PARCHMENT}` }}>
        <div className="retail-container">
          <h2 style={{ fontSize: "32px", fontWeight: 600, color: DF, margin: "0 0 32px", letterSpacing: "-0.01em" }}>Explore Related Categories</h2>
          <div className="retail-related-grid">
            {RELATED.map((r) => (
              <Link key={r.slug} href={`/directory/${r.slug}`} className="retail-related-card" style={{ background: "white", padding: "24px", borderRadius: "0.75rem", border: `1px solid ${PARCHMENT}`, textAlign: "center", textDecoration: "none", display: "block" }}>
                <div style={{ width: "48px", height: "48px", margin: "0 auto 16px", borderRadius: "50%", background: "#efedec", display: "flex", alignItems: "center", justifyContent: "center", color: "#717973" }}>
                  <span className="material-symbols-outlined">{r.icon}</span>
                </div>
                <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", margin: 0 }}>{r.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "white", padding: "64px 0", borderTop: `1px solid ${PARCHMENT}` }}>
        <div className="retail-container" style={{ maxWidth: "768px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 600, color: DF, margin: "0 0 32px", textAlign: "center", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {FAQS.map((f) => (
              <details key={f.q} style={{ border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", background: "#fbf9f8" }}>
                <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", cursor: "pointer", fontSize: "14px", fontWeight: 500, color: "#1b1c1b", listStyle: "none" }}>
                  {f.q}
                  <span className="material-symbols-outlined" style={{ color: "#717973" }}>expand_more</span>
                </summary>
                <div style={{ padding: "0 16px 16px", fontSize: "14px", color: "#414943", lineHeight: 1.6 }}>{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
