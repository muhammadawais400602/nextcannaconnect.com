"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/data/categories";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/vendor/dashboard") || pathname.startsWith("/vendor/login") || pathname.startsWith("/admin")) return null;

  return (
    <footer style={{ backgroundColor: "#003320", color: "rgba(136,185,158,0.7)" }}>
      <div className="mx-auto px-4 md:px-8 pt-14 md:pt-24 pb-12" style={{ maxWidth: "1440px" }}>

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
            NextCanna Connect is the commercial backbone of the cannabis industry. We unify every critical component of the value chain from funding and licensing to cultivation, manufacturing, and retail into a single, institutional-grade platform. By connecting operators with vetted partners across legal, banking, accounting, and advisory services, we enable seamless execution, faster scaling, and consistent performance across state markets.
          </p>
        </div>

        {/* Row 2: Categories */}
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
            Categories
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/directory/${cat.slug}`}
                className="footer-link"
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Row 3: Platform & Blog links */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "48px", marginBottom: "48px" }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>Platform</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[{ label: "Directory", href: "/directory" }, { label: "Pricing", href: "/membership" }, { label: "Blog", href: "/blog" }, { label: "Sign Up", href: "/signup" }].map((item) => (
                  <Link key={item.label} href={item.href} className="footer-link" style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>Company</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }].map((item) => (
                  <Link key={item.label} href={item.href} className="footer-link" style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>Legal</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms & Conditions", href: "/terms" }, { label: "Disclaimer", href: "/disclaimer" }].map((item) => (
                  <Link key={item.label} href={item.href} className="footer-link" style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</Link>
                ))}
              </div>
            </div>
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
              { label: "Disclaimer", href: "/disclaimer" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Cookie Policy", href: "/cookie-policy" },
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
