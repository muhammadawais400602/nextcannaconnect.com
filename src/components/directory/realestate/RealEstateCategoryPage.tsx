import Link from "next/link";
import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import RealEstateListingsGrid from "./RealEstateListingsGrid";

const DF = "#003320";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";

export default async function RealEstateCategoryPage() {
  const companies = await getCompaniesByCategory("real-estate-construction");
  const firmCount = companies.length;

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b", paddingTop: "70px" }}>
      <style>{`
        .re-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .re-container { padding-left: 64px; padding-right: 64px; } }
        .re-hero { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: center; }
        @media (min-width: 1024px) { .re-hero { grid-template-columns: repeat(2, 1fr); } }
        .re-layout { display: flex; flex-direction: column; gap: 24px; }
        @media (min-width: 768px) { .re-layout { flex-direction: row; } }
        .re-sidebar { width: 100%; flex-shrink: 0; }
        @media (min-width: 768px) { .re-sidebar { width: 256px; } }
        .re-grid-wrap { flex: 1; min-width: 0; }
        .re-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-content: start; }
        @media (min-width: 1280px) { .re-grid { grid-template-columns: repeat(2, 1fr); } }
        .re-card { transition: box-shadow 0.3s; }
        .re-card:hover { box-shadow: 0 4px 24px rgba(0,51,32,0.05); }
        @media (min-width: 768px) { .re-cta-row { flex-direction: row !important; justify-content: space-between; align-items: center; } }
      `}</style>

      <main className="re-container" style={{ paddingTop: "40px", paddingBottom: "80px" }}>
        {/* Hero */}
        <section className="re-hero" style={{ marginBottom: "64px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", fontSize: "14px", fontWeight: 500, color: VARIANT }}>
              <Link href="/directory" style={{ color: VARIANT, textDecoration: "none" }}>Directory</Link>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
              <span style={{ color: DF, fontWeight: 700 }}>Real Estate &amp; Construction</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: "#001c10", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Real Estate &amp; Construction</h1>
            <p style={{ fontSize: "18px", color: VARIANT, margin: "0 0 32px", maxWidth: "560px", lineHeight: 1.5 }}>
              Institutional-grade architecture, general contracting, and specialized engineering firms verified for commercial cannabis cultivation and retail buildouts.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "16px", minWidth: "160px" }}>
                <div style={{ fontSize: "32px", fontWeight: 600, color: DF }}>{firmCount}</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>Verified Firms</div>
              </div>
              <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", padding: "16px", minWidth: "160px" }}>
                <div style={{ fontSize: "32px", fontWeight: 600, color: DF }}>100%</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>Cannabis-Zoned Specs</div>
              </div>
            </div>
          </div>
          {/* Decorative visual */}
          <div style={{ height: "400px", borderRadius: "0.25rem", overflow: "hidden", border: `1px solid ${PARCHMENT}`, background: `linear-gradient(135deg, ${DF} 0%, #00160d 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "140px", color: "rgba(136,185,158,0.3)" }}>architecture</span>
          </div>
        </section>

        {/* Filters + grid (client) */}
        <RealEstateListingsGrid companies={companies} />
      </main>
    </div>
  );
}
