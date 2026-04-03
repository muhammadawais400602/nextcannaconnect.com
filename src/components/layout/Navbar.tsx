"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Directory", href: "/directory" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Membership", href: "/membership" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/directory") return pathname.startsWith("/directory");
    return pathname === href;
  };

  return (
    <nav
      className="fixed top-0 w-full z-50 glass-panel"
      style={{
        borderBottom: "1px solid rgba(192,201,193,0.3)",
        boxShadow: "0 4px 60px rgba(27,28,28,0.05)",
      }}
    >
      <div
        className="flex justify-between items-center w-full px-8 py-4 mx-auto"
        style={{ maxWidth: "1440px" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="select-none flex-shrink-0"
          style={{
            fontFamily: "'Noto Serif', serif",
            fontStyle: "italic",
            fontSize: "20px",
            fontWeight: 400,
            color: "#003320",
            textDecoration: "none",
          }}
        >
          NextCanna Connect
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive(link.href) ? "#003320" : "#6b7280",
                borderBottom: isActive(link.href) ? "2px solid #003320" : "2px solid transparent",
                paddingBottom: "2px",
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!isActive(link.href)) {
                  (e.currentTarget as HTMLElement).style.color = "#003320";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(link.href)) {
                  (e.currentTarget as HTMLElement).style.color = "#6b7280";
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/signin"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#6b7280",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#003320"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="btn-primary"
            style={{ fontSize: "11px", padding: "10px 20px" }}
          >
            List Your Business
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "#003320" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: "rgba(251,249,248,0.98)",
            borderBottom: "1px solid rgba(192,201,193,0.4)",
          }}
        >
          <div className="flex flex-col px-8 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 font-medium"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: isActive(link.href) ? "#003320" : "#6b7280",
                  fontWeight: isActive(link.href) ? 700 : 500,
                  textDecoration: "none",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 flex flex-col gap-3 border-t mt-2" style={{ borderColor: "rgba(192,201,193,0.4)" }}>
              <Link href="/signin" className="btn-ghost w-full justify-center" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>
                List Your Business
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
