import Link from "next/link";
import { getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import TransportListingsGrid from "./TransportListingsGrid";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const SURFACE_VARIANT = "#e4e2e1";
const OUTLINE = "#717973";

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
  const carrierCount = companies.length;
  const statesCovered = new Set(companies.map((c) => c.location.state).filter(Boolean)).size;

  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b" }}>
      <style>{`
        .transport-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .transport-container { padding-left: 64px; padding-right: 64px; } }
        .transport-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .transport-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .transport-grid { grid-template-columns: repeat(3, 1fr); } }
        .transport-list { display: flex; flex-direction: column; gap: 16px; }
        .transport-card { transition: box-shadow 0.3s; }
        .transport-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .transport-guide-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
        @media (min-width: 640px) { .transport-guide-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px) { .transport-guide-grid { grid-template-columns: repeat(4, 1fr); } }
        .transport-related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 768px) { .transport-related-grid { grid-template-columns: repeat(4, 1fr); } }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background: "#FBF9F8", padding: "12px 0", borderBottom: `1px solid ${PARCHMENT}`, marginTop: "70px" }}>
        <div className="transport-container" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600, color: OUTLINE }}>
          <Link href="/" style={{ color: OUTLINE, textDecoration: "none" }}>Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span>
          <Link href="/directory" style={{ color: OUTLINE, textDecoration: "none" }}>Directory</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>chevron_right</span>
          <span style={{ color: DF, fontWeight: 700 }}>Transportation &amp; Logistics</span>
        </div>
      </div>

      {/* Hero */}
      <header style={{ position: "relative", minHeight: "500px", height: "56vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${DF}, #00160d)` }} />
        <div style={{ position: "absolute", inset: 0, background: DF, opacity: 0.4 }} />
        <div className="transport-container" style={{ position: "relative", textAlign: "center", maxWidth: "900px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(136,185,158,0.2)", backdropFilter: "blur(4px)", border: "1px solid rgba(136,185,158,0.3)", color: SAGE, padding: "6px 16px", borderRadius: "0.75rem", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "24px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>verified</span> Verified Category
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 700, color: "white", margin: "0 0 24px", letterSpacing: "-0.02em" }}>Transportation &amp; Logistics</h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.9)", margin: "0 0 32px", maxWidth: "640px", lineHeight: 1.5 }}>
            Licensed cannabis distributors, secure carriers, and last-mile fleets moving product legally across state lines and within regulated markets.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "40px" }}>
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.75rem", padding: "8px 24px", color: "white", fontSize: "14px", fontWeight: 500 }}>
              <span style={{ fontWeight: 700, marginRight: "8px", color: SAGE }}>{carrierCount}</span> Verified Carriers
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.75rem", padding: "8px 24px", color: "white", fontSize: "14px", fontWeight: 500 }}>
              <span style={{ fontWeight: 700, marginRight: "8px", color: SAGE }}>{statesCovered}</span> States Covered
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "0.75rem", padding: "8px 24px", color: "white", fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", marginRight: "8px", color: SAGE }}>support_agent</span> 24/7 Support
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            <Link href="/signup" style={{ background: SAGE, color: DF, padding: "12px 32px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>List Your Fleet</Link>
            <Link href="/directory" style={{ border: "1px solid white", color: "white", padding: "12px 32px", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Browse All Categories</Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main style={{ background: "#f5f3f2" }}>
        <div className="transport-container" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
          <TransportListingsGrid companies={companies} />

          {/* Buyer's guide */}
          <div style={{ background: PARCHMENT, borderRadius: "0.75rem", padding: "40px", marginTop: "48px", marginBottom: "80px" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h3 style={{ fontSize: "32px", fontWeight: 600, color: DF, margin: "0 0 16px", letterSpacing: "-0.01em" }}>What to look for in a cannabis carrier</h3>
              <p style={{ fontSize: "16px", color: VARIANT, maxWidth: "640px", margin: "0 auto" }}>Essential requirements for compliant and secure transportation of cannabis products.</p>
            </div>
            <div className="transport-guide-grid">
              {GUIDE.map((g) => (
                <div key={g.title} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <div style={{ width: "64px", height: "64px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", color: SAGE, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>{g.icon}</span>
                  </div>
                  <h4 style={{ fontSize: "18px", fontWeight: 700, color: DF, margin: "0 0 8px" }}>{g.title}</h4>
                  <p style={{ fontSize: "14px", color: VARIANT, margin: 0, lineHeight: 1.5 }}>{g.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related categories */}
          <div style={{ marginBottom: "80px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 24px" }}>Related Categories</h3>
            <div className="transport-related-grid">
              {RELATED.map((r) => (
                <Link key={r.slug} href={`/directory/${r.slug}`} style={{ background: "white", border: `1px solid ${SURFACE_VARIANT}`, padding: "24px", borderRadius: "0.5rem", textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "32px", color: OUTLINE, marginBottom: "12px" }}>{r.icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: DF }}>{r.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: "768px", margin: "0 auto 80px" }}>
            <h3 style={{ fontSize: "24px", fontWeight: 600, color: DF, margin: "0 0 32px", textAlign: "center" }}>Frequently Asked Questions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {FAQS.map((f) => (
                <details key={f.q} style={{ border: `1px solid ${SURFACE_VARIANT}`, borderRadius: "0.5rem", background: "white", overflow: "hidden" }}>
                  <summary style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", listStyle: "none" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: DF }}>{f.q}</span>
                    <span className="material-symbols-outlined" style={{ color: OUTLINE }}>expand_more</span>
                  </summary>
                  <div style={{ padding: "0 24px 16px", fontSize: "14px", color: VARIANT, lineHeight: 1.6 }}>{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
