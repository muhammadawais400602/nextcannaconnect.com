"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/data/categories";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/vendor/dashboard") || pathname.startsWith("/vendor/login") || pathname.startsWith("/admin")) return null;

  return (
    <footer style={{ backgroundColor: "#003320", color: "rgba(136,185,158,0.7)" }}>
      <div className="mx-auto px-4 md:px-8 pt-10 md:pt-14 pb-8" style={{ maxWidth: "1440px" }}>

        {/* Top: Logo + Description | Platform | Company | Legal */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-10" style={{ marginBottom: "32px" }}>
          <div className="col-span-2 sm:col-span-4 lg:col-span-3">
            <Link
              href="/"
              style={{
                fontFamily: "'Noto Serif', serif",
                fontStyle: "italic",
                fontSize: "20px",
                color: "white",
                textDecoration: "none",
                display: "block",
                marginBottom: "12px",
              }}
            >
              NextCanna Connect
            </Link>
            <p style={{ fontSize: "12px", lineHeight: 1.7, color: "rgba(136,185,158,0.7)", maxWidth: "480px" }}>
              NextCanna Connect is the commercial backbone of the cannabis industry. We unify every critical component of the value chain from funding and licensing to cultivation, manufacturing, and retail into a single, institutional-grade platform. By connecting operators with vetted partners across legal, banking, accounting, and advisory services, we enable seamless execution, faster scaling, and consistent performance across state markets.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "14px" }}>Platform</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[{ label: "Pricing", href: "/pricing" }, { label: "Blog", href: "/blog" }, { label: "Sign Up", href: "/signup" }].map((item) => (
                <Link key={item.label} href={item.href} className="footer-link" style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "14px" }}>Company</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[{ label: "About", href: "/about" }, { label: "Contact", href: "/contact" }].map((item) => (
                <Link key={item.label} href={item.href} className="footer-link" style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "14px" }}>Legal</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms & Conditions", href: "/terms" }, { label: "Disclaimer", href: "/disclaimer" }, { label: "Cookie Policy", href: "/cookie-policy" }].map((item) => (
                <Link key={item.label} href={item.href} className="footer-link" style={{ fontSize: "13px", fontWeight: 500 }}>{item.label}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "24px", marginBottom: "24px" }}>
          <h4
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              marginBottom: "16px",
            }}
          >
            Categories
          </h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/directory/${cat.slug}`}
                className="footer-link"
                style={{ fontSize: "12px", fontWeight: 500 }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "20px", textAlign: "center" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.15)",
              margin: 0,
            }}
          >
            © 2026 NextCanna Connect. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
