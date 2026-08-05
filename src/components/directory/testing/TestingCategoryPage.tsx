import Link from "next/link";
import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import TestingListingsGrid from "./TestingListingsGrid";

const DF = "#003320";
const SAGE = "#88B99E";

export default async function TestingCategoryPage() {
  const companies = await getCompaniesByCategory("testing-science");
  const labCount = companies.length;
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  const stats = [
    { icon: "verified", label: `${labCount} Verified Labs` },
    { icon: "map", label: `${statesCovered} States Covered` },
    { icon: "science", label: "ISO 17025 Accredited" },
  ];

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b" }}>
      <style>{`
        .testing-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .testing-container { padding-left: 64px; padding-right: 64px; } }
        .testing-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .testing-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .testing-grid { grid-template-columns: repeat(3, 1fr); } }
        .testing-card { transition: box-shadow 0.3s; }
        .testing-card:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
      `}</style>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "400px", height: "58vh", display: "flex", alignItems: "center", justifyContent: "center", background: DF, marginTop: "70px" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${DF} 0%, #001c10 100%)` }} />
        <div style={{ position: "absolute", inset: 0, background: DF, opacity: 0.7 }} />
        <div className="testing-container" style={{ position: "relative", width: "100%" }}>
          <nav style={{ display: "flex", color: "rgba(251,249,248,0.8)", fontSize: "12px", fontWeight: 600, marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <Link href="/" style={{ color: "rgba(251,249,248,0.8)", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <Link href="/directory" style={{ color: "rgba(251,249,248,0.8)", textDecoration: "none" }}>Directory</Link>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "white", fontWeight: 600 }}>Testing &amp; Science</span>
          </nav>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: "white", margin: "0 0 16px", letterSpacing: "-0.02em" }}>Testing &amp; Science</h1>
          <p style={{ fontSize: "18px", color: "rgba(251,249,248,0.9)", maxWidth: "640px", margin: "0 0 32px", lineHeight: 1.5 }}>
            ISO 17025-accredited cannabis testing laboratories and analytical service providers.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.75rem", padding: "8px 16px", color: "white", fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{s.icon}</span> {s.label}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <Link href="/signup" style={{ background: SAGE, color: DF, padding: "12px 24px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>List Your Lab</Link>
            <Link href="/directory" style={{ background: "transparent", border: "1px solid white", color: "white", padding: "12px 24px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Browse All Categories</Link>
          </div>
        </div>
      </section>

      {/* Filters + listings grid (client) */}
      <TestingListingsGrid companies={companies} />

      {/* CTA band */}
      <section style={{ background: DF, padding: "64px 0", textAlign: "center" }}>
        <div className="testing-container" style={{ maxWidth: "768px" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 700, color: "white", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Need a compliant cannabis testing lab?</h2>
          <p style={{ fontSize: "18px", color: "#a0d2b6", margin: "0 0 32px" }}>Connect with verified, ISO-accredited facilities to ensure your products meet regulatory standards.</p>
          <Link href="/signup" style={{ display: "inline-block", background: SAGE, color: "#001c10", padding: "16px 32px", borderRadius: "0.25rem", fontSize: "18px", fontWeight: 600, textDecoration: "none" }}>Post a Testing Request</Link>
        </div>
      </section>
    </div>
  );
}
