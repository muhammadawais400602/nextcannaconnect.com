import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1C2B3A" }}>
      <div className="gradient-divider-reverse" />
      <div
        className="mx-auto px-8 py-10"
        style={{ maxWidth: "1100px" }}
      >
        {/* Logo */}
        <div className="mb-6">
          <span className="text-lg font-extrabold" style={{ color: "white" }}>NEXT</span>
          <span className="text-lg font-extrabold" style={{ color: "#5CB85C" }}>CANNA</span>
          <span className="text-lg font-extrabold" style={{ color: "#F7941D" }}>CONNECT</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
          {[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
            { label: "Browse Directory", href: "/directory" },
            { label: "Membership", href: "/membership" },
            { label: "List Your Business", href: "/signup" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms & Conditions", href: "/terms" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "16px" }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
            © 2026 NextCanna Connect. All Rights Reserved. A NextCanna Company.
          </p>
          <a
            href="mailto:Info@NextCannaConnect.com"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}
          >
            Info@NextCannaConnect.com
          </a>
        </div>
      </div>
    </footer>
  );
}
