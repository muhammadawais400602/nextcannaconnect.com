import Link from "next/link";

const NAV_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Browse Directory", href: "/directory" },
      { label: "Membership Plans", href: "/membership" },
      { label: "List Your Business", href: "/signup" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    heading: "Categories",
    links: [
      { label: "Cultivation & Growing", href: "/directory/cultivation-growing" },
      { label: "Manufacturers & Suppliers", href: "/directory/manufacturers-suppliers" },
      { label: "Extraction & Processing", href: "/directory/extraction-processing" },
      { label: "Consultants & Advisors", href: "/directory/consultants-advisors" },
      { label: "Marketing & Branding", href: "/directory/marketing-branding-packaging" },
      { label: "Retail & Dispensary", href: "/directory/retail-dispensary" },
    ],
  },
  {
    heading: "More Categories",
    links: [
      { label: "Transportation & Logistics", href: "/directory/transportation-logistics" },
      { label: "Testing & Science", href: "/directory/testing-science" },
      { label: "Compliance & Legal", href: "/directory/compliance-legal" },
      { label: "Technology & Software", href: "/directory/technology-software" },
      { label: "Real Estate & Construction", href: "/directory/real-estate-construction" },
      { label: "Finance & Insurance", href: "/directory/finance-insurance" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Cannabis B2B Blog", href: "/blog" },
      { label: "Industry Guides", href: "/guides" },
      { label: "For Vendors", href: "/signup" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#111827" }}>
      {/* Top divider accent */}
      <div
        style={{
          height: "3px",
          background: "linear-gradient(90deg, #1A4A35, #5CB85C, #F9C31A, #F7941D)",
        }}
      />

      {/* Main footer */}
      <div className="mx-auto px-6 py-16" style={{ maxWidth: "1180px" }}>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 select-none">
              <div
                className="flex items-center justify-center rounded-lg font-black text-white"
                style={{ width: "30px", height: "30px", backgroundColor: "#1A4A35", fontSize: "13px" }}
              >
                N
              </div>
              <span className="font-extrabold" style={{ color: "white", fontSize: "15px", letterSpacing: "-0.3px" }}>
                NextCanna<span style={{ color: "#F7941D" }}>Connect</span>
              </span>
            </Link>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.7 }}>
              The verified B2B marketplace for the cannabis industry.
            </p>
            <a
              href="mailto:Info@NextCannaConnect.com"
              className="block mt-4"
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}
            >
              Info@NextCannaConnect.com
            </a>
          </div>

          {/* Link columns */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4
                className="font-bold mb-4 uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", letterSpacing: "1.2px" }}
              >
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="footer-link"
                      style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", textDecoration: "none" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          className="mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ maxWidth: "1180px" }}
        >
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            © 2026 NextCanna Connect. All Rights Reserved. A NextCanna Company.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
              Privacy
            </Link>
            <Link href="/terms" style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
              Terms
            </Link>
            <Link href="/contact" style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
