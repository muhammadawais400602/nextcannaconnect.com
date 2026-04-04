import Link from "next/link";

const MARKET_FILTERS = [
  {
    heading: "Cultivation",
    links: ["Bulk Flower", "Genetics & Clones", "Seeds", "Biomass"],
    hrefs: ["/directory/manufacturers-suppliers", "/directory/cultivation-growing", "/directory/cultivation-growing", "/directory/cultivation-growing"],
  },
  {
    heading: "Manufacturing",
    links: ["Concentrates", "Distillates", "Edibles", "Topicals"],
    hrefs: ["/directory/extraction-processing", "/directory/extraction-processing", "/directory/manufacturers-suppliers", "/directory/manufacturers-suppliers"],
  },
  {
    heading: "Operations",
    links: ["Testing Labs", "Secure Logistics", "Warehousing", "Packaging"],
    hrefs: ["/directory/testing-science", "/directory/transportation-logistics", "/directory/transportation-logistics", "/directory/manufacturers-suppliers"],
  },
  {
    heading: "Compliance",
    links: ["Legal Counsel", "Auditing", "Track & Trace", "Licensing"],
    hrefs: ["/directory/compliance-legal", "/directory/compliance-legal", "/directory/technology-software", "/directory/compliance-legal"],
  },
  {
    heading: "Facilities",
    links: ["HVAC Systems", "LED Lighting", "Automation", "Real Estate"],
    hrefs: ["/directory/real-estate-construction", "/directory/cultivation-growing", "/directory/technology-software", "/directory/real-estate-construction"],
  },
  {
    heading: "Services",
    links: ["Brand Strategy", "Financing", "HR Solutions", "Advisory"],
    hrefs: ["/directory/marketing-branding-packaging", "/directory/finance-insurance", "/directory/consultants-advisors", "/directory/consultants-advisors"],
  },
];

const REGIONS = [
  { label: "West Coast", states: ["California", "Oregon", "Washington"] },
  { label: "Mountain", states: ["Colorado", "Nevada", "Montana"] },
  { label: "Northeast", states: ["New York", "Massachusetts", "New Jersey"] },
  { label: "Midwest", states: ["Michigan", "Illinois", "Ohio"] },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#003320", color: "rgba(136,185,158,0.7)" }}>
      <div className="mx-auto px-8 pt-24 pb-12" style={{ maxWidth: "1440px" }}>

        {/* Row 1: Logo & Description */}
        <div style={{ maxWidth: "560px", marginBottom: "80px" }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Noto Serif', serif",
              fontStyle: "italic",
              fontSize: "22px",
              color: "white",
              textDecoration: "none",
              display: "block",
              marginBottom: "20px",
            }}
          >
            NextCanna Connect
          </Link>
          <p style={{ fontSize: "13px", lineHeight: 1.75, color: "rgba(136,185,158,0.75)" }}>
            NextCanna Connect is the premier B2B commercial infrastructure for the modern cannabis
            industry. We provide an institutional-grade marketplace that bridges high-yield cultivators
            with verified retail networks through standardized transactional integrity and rigorous
            compliance oversight.
          </p>
        </div>

        {/* Row 2: Market Filters */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "64px", marginBottom: "64px" }}>
          <h4
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "40px",
            }}
          >
            Market Filters
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {MARKET_FILTERS.map((col) => (
              <div key={col.heading}>
                <h5
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "white",
                    marginBottom: "16px",
                  }}
                >
                  {col.heading}
                </h5>
                <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {col.links.map((label, i) => (
                    <li key={label}>
                      <Link
                        href={col.hrefs[i]}
                        className="footer-link"
                        style={{ display: "block" }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Regions */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "64px", marginBottom: "64px" }}>
          <h4
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "40px",
            }}
          >
            Regions
          </h4>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {REGIONS.map((region) => (
              <div key={region.label}>
                <h5
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: "10px",
                  }}
                >
                  {region.label}
                </h5>
                <div className="flex gap-4">
                  {region.states.map((state) => (
                    <Link
                      key={state}
                      href={`/directory?state=${encodeURIComponent(state)}`}
                      className="footer-link"
                    >
                      {state}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Legal & Socials */}
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "40px" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="flex flex-wrap gap-8">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Disclaimer", href: "/terms" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Cookie Policy", href: "/privacy" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="footer-link"
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-5">
            <Link href="/" style={{ color: "rgba(136,185,158,0.35)", transition: "color 0.2s" }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(136,185,158,0.35)"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>language</span>
            </Link>
            <Link href="/" style={{ color: "rgba(136,185,158,0.35)", transition: "color 0.2s" }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = "rgba(136,185,158,0.35)"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>share</span>
            </Link>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{ paddingTop: "64px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.15)",
            }}
          >
            © 2026 NextCanna Connect. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
