import Link from "next/link";
import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import TechListingsGrid from "./TechListingsGrid";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";

const RELATED = [
  { icon: "storefront", label: "Retail & Dispensary", desc: "Hardware, store fixtures, and retail operations services.", slug: "retail-dispensary" },
  { icon: "agriculture", label: "Cultivation Tech", desc: "Lighting, climate control, and agricultural technology.", slug: "cultivation-growing" },
  { icon: "local_shipping", label: "Logistics & Transport", desc: "Secure transport, fleet management, and distribution.", slug: "transportation-logistics" },
];

export default async function TechCategoryPage() {
  const companies = await getCompaniesByCategory("technology-software");
  const vendorCount = companies.length;
  const metrcCount = companies.filter((c) => (c.serviceTags ?? []).some((t) => t.toLowerCase().includes("metrc"))).length;

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b", paddingTop: "70px" }}>
      <style>{`
        .tech-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .tech-container { padding-left: 64px; padding-right: 64px; } }
        .tech-hero-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: center; }
        @media (min-width: 1024px) { .tech-hero-grid { grid-template-columns: repeat(2, 1fr); } }
        .tech-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .tech-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .tech-grid { grid-template-columns: repeat(3, 1fr); } }
        .tech-list { display: flex; flex-direction: column; gap: 16px; }
        .tech-card { transition: box-shadow 0.3s; }
        .tech-card:hover { box-shadow: 0 10px 30px -15px rgba(0,51,32,0.25); }
        .tech-related { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; }
        .tech-related > a { min-width: 280px; flex: 1; }
      `}</style>

      {/* Hero */}
      <section className="tech-container" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div className="tech-hero-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "0.75rem", border: `1px solid ${PARCHMENT}`, background: "white", width: "fit-content" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: SAGE, fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em" }}>Certified Vendor Directory</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: DF, margin: 0, letterSpacing: "-0.02em" }}>Technology &amp; Software</h1>
            <p style={{ fontSize: "18px", color: VARIANT, maxWidth: "560px", margin: 0, lineHeight: 1.5 }}>
              Institutional-grade enterprise solutions for the regulated cannabis supply chain. Discover compliant POS, seed-to-sale tracking, and robust ERP platforms.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "8px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px", background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", minWidth: "140px" }}>
                <span style={{ fontSize: "24px", fontWeight: 600, color: DF }}>{vendorCount}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase" }}>Verified Vendors</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "16px", background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", minWidth: "140px" }}>
                <span style={{ fontSize: "24px", fontWeight: 600, color: DF }}>{metrcCount}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase" }}>Metrc Integrations</span>
              </div>
            </div>
          </div>
          {/* Decorative visual panel */}
          <div style={{ position: "relative", height: "300px", borderRadius: "0.5rem", overflow: "hidden", border: `1px solid ${PARCHMENT}`, boxShadow: "0 10px 30px -15px rgba(0,51,32,0.1)", background: `linear-gradient(135deg, ${DF} 0%, #00160d 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "120px", color: "rgba(136,185,158,0.35)" }}>monitoring</span>
          </div>
        </div>
      </section>

      {/* Filters + listings grid (client) */}
      <TechListingsGrid companies={companies} />

      {/* Related categories */}
      <section className="tech-container" style={{ paddingTop: "64px", paddingBottom: "64px", borderTop: `1px solid ${PARCHMENT}` }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: DF, margin: "0 0 32px", letterSpacing: "-0.01em" }}>Explore Related Categories</h2>
        <div className="tech-related">
          {RELATED.map((r) => (
            <Link key={r.slug} href={`/directory/${r.slug}`} className="tech-related-card" style={{ padding: "24px", background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", textDecoration: "none", display: "block" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#efedec", display: "flex", alignItems: "center", justifyContent: "center", color: DF }}>
                  <span className="material-symbols-outlined">{r.icon}</span>
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: DF, margin: 0 }}>{r.label}</h3>
              </div>
              <p style={{ fontSize: "16px", color: VARIANT, margin: 0 }}>{r.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
