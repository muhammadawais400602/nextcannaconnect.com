import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle, Users, Building2, Globe, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "About | NextCanna Connect",
  description:
    "NextCanna Connect is the verified cannabis B2B marketplace connecting licensed businesses across 12 industry verticals.",
};

const VALUES = [
  {
    icon: <Shield size={20} style={{ color: "#1A4A35" }} />,
    title: "Verified First",
    description:
      "Every business on our platform is vetted. We verify licenses, credentials, and compliance status so you can trust who you're working with.",
  },
  {
    icon: <Users size={20} style={{ color: "#1A4A35" }} />,
    title: "Community Driven",
    description:
      "Built for cannabis professionals by cannabis professionals. We understand the unique challenges of operating in a regulated industry.",
  },
  {
    icon: <Globe size={20} style={{ color: "#1A4A35" }} />,
    title: "Nationwide Reach",
    description:
      "Covering all US legal cannabis markets and Canada — find partners in your state or expand your business nationally.",
  },
  {
    icon: <Building2 size={20} style={{ color: "#1A4A35" }} />,
    title: "Every Vertical",
    description:
      "12 industry categories covering the full cannabis supply chain — from cultivation and extraction to retail, compliance, and finance.",
  },
];

const STATS = [
  { value: "50,000+", label: "Licensed Businesses" },
  { value: "12", label: "Industry Categories" },
  { value: "2", label: "Countries Covered" },
  { value: "20,000+", label: "Verified Vendors" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#F8FAF8", borderBottom: "1px solid #E5E7EB" }}>
        <div
          className="mx-auto px-6 py-20 text-center"
          style={{ maxWidth: "760px" }}
        >
          <span className="section-label">About Us</span>
          <h1
            className="font-extrabold mb-5"
            style={{
              fontSize: "clamp(32px, 4.5vw, 48px)",
              color: "#111827",
              letterSpacing: "-1px",
              lineHeight: 1.2,
            }}
          >
            The Trusted Hub for Cannabis{" "}
            <span style={{ color: "#1A4A35" }}>B2B Connections</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "17px", lineHeight: 1.7, maxWidth: "580px", margin: "0 auto 32px" }}>
            NextCanna Connect was built to solve the discovery problem in the cannabis industry —
            giving licensed operators a trusted, verified directory to find the partners they need.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/directory" className="btn-primary" style={{ fontSize: "14px" }}>
              Browse Directory <ArrowRight size={15} />
            </Link>
            <Link href="/signup" className="btn-secondary" style={{ fontSize: "14px" }}>
              List Your Business
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div
          className="mx-auto grid grid-cols-2 md:grid-cols-4"
          style={{ maxWidth: "1180px" }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center px-8 py-8"
              style={{ borderRight: i < STATS.length - 1 ? "1px solid #E5E7EB" : "none" }}
            >
              <span
                className="font-extrabold"
                style={{ fontSize: "28px", color: "#111827", fontWeight: 800 }}
              >
                {s.value}
              </span>
              <span style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px", fontWeight: 500 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <section className="py-20 px-6" style={{ backgroundColor: "white" }}>
        <div
          className="mx-auto flex flex-col lg:flex-row gap-14 items-center"
          style={{ maxWidth: "1100px" }}
        >
          <div style={{ flex: 1 }}>
            <span className="section-label">Our Mission</span>
            <h2 className="section-title mb-5">
              Connecting Cannabis Businesses with Confidence
            </h2>
            <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.75, marginBottom: "20px" }}>
              The cannabis industry moves fast. Finding reliable suppliers, compliant partners, and
              qualified service providers shouldn&apos;t slow you down. NextCanna Connect gives you
              a single, trusted source of truth for B2B discovery.
            </p>
            <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.75, marginBottom: "28px" }}>
              We verify licenses, vet credentials, and maintain up-to-date profiles so operators
              can focus on running their businesses — not chasing down referrals.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "License verification for every listed business",
                "Tiered trust badges for vetted partners",
                "Direct lead submission — no middleman",
                "Coverage across all legal US & Canadian markets",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle size={16} style={{ color: "#5CB85C", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", color: "#374151" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual card */}
          <div
            className="rounded-3xl overflow-hidden flex-shrink-0 w-full lg:w-auto"
            style={{
              background: "linear-gradient(135deg, #1A4A35 0%, #1C2B3A 100%)",
              padding: "48px 40px",
              maxWidth: "420px",
            }}
          >
            <p
              className="font-extrabold text-white mb-4"
              style={{ fontSize: "22px", lineHeight: 1.3, fontWeight: 800 }}
            >
              &ldquo;Trust is the foundation of every great B2B relationship.&rdquo;
            </p>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px", lineHeight: 1.7 }}>
              We built NextCanna Connect to make trust the default — not the exception — in
              cannabis B2B.
            </p>
            <div
              className="mt-8 pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}
            >
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>
                The NextCanna Team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6" style={{ backgroundColor: "#F8FAF8" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="text-center mb-12">
            <span className="section-label">Our Values</span>
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl p-7 flex flex-col gap-4 card-hover"
                style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
              >
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: "44px", height: "44px", backgroundColor: "rgba(26,74,53,0.08)" }}
                >
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ fontSize: "15px", color: "#111827" }}>
                    {v.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.65 }}>
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #1A4A35 0%, #1C2B3A 100%)" }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            className="font-extrabold text-white mb-4"
            style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 800 }}
          >
            Ready to Find Your Next Partner?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", marginBottom: "28px" }}>
            Browse 50,000+ licensed cannabis businesses or list your own — free forever.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/directory" className="btn-primary" style={{ fontSize: "14px" }}>
              Browse Directory <ArrowRight size={15} />
            </Link>
            <Link href="/signup" className="btn-white" style={{ fontSize: "14px" }}>
              List Your Business
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
