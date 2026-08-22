import type { Metadata } from "next";
import Link from "next/link";
import SectionDivider from "@/components/ui/SectionDivider";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | NextCanna Connect",
  description: "Choose the right plan for your cannabis business. Free listing, Select verification, or Verified Pro premium placement.",
};

const TIERS = [
  {
    key: "free",
    name: "Unclaimed",
    price: "$0",
    period: "/mo",
    highlight: false,
    pill: null,
    description: "Get your business listed in our directory at no cost. Basic visibility for new operators.",
    features: [
      { label: "Standard directory listing", included: true },
      { label: "Name, category & location visible", included: true },
      { label: "Contact information on profile", included: false },
      { label: "Full company page", included: false },
      { label: "Tier badge", included: false },
      { label: "Priority search placement", included: false },
      { label: "Featured homepage carousel", included: false },
    ],
    cta: "Get Started Free",
    href: "/signup?tier=free",
  },
  {
    key: "select",
    name: "Select",
    price: "$49.99",
    period: "/mo",
    highlight: false,
    pill: null,
    description: "A full company profile with the NextCanna Select Seal and reduced lead pricing.",
    features: [
      { label: "Full company page", included: true },
      { label: "NextCanna Select Seal badge", included: true },
      { label: "Contact info on profile", included: true },
      { label: "Enhanced directory card", included: true },
      { label: "Reduced lead pricing", included: true },
      { label: "Priority search placement", included: false },
      { label: "Featured homepage carousel", included: false },
    ],
    cta: "Choose Select",
    href: "/signup?tier=select",
  },
  {
    key: "elite",
    name: "Verified Pro",
    price: "$99",
    period: "/mo",
    highlight: true,
    pill: "BEST VALUE",
    description: "The highest tier — full vetting, premium placement, real-time calendar sync, and featured homepage carousel.",
    features: [
      { label: "Premium company page", included: true },
      { label: "NextCanna Verified badge (full vetting)", included: true },
      { label: "Priority search placement", included: true },
      { label: "Real-time calendar sync", included: true },
      { label: "Dedicated account support", included: true },
      { label: "Social media links & certifications", included: true },
      { label: "Featured homepage carousel", included: true },
    ],
    cta: "Choose Verified Pro",
    href: "/signup?tier=elite",
  },
];

export default function PricingPage() {
  return (
    <>
      <SectionDivider />
      <div style={{ backgroundColor: "#F7F9F7", paddingTop: "120px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#F7941D", marginBottom: "12px" }}>
              Pricing Plans
            </p>
            <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, color: "#1A4A35", marginBottom: "12px" }}>
              The Right Plan for Your Business
            </h1>
            <p style={{ fontSize: "15px", color: "#4A5E4A", maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>
              Whether you&apos;re just getting started or ready to dominate your market, we have a tier built for you.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
            {TIERS.map((t) => (
              <div
                key={t.key}
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "white",
                  borderRadius: "16px",
                  padding: "32px 28px",
                  border: t.highlight ? "2px solid #1A4A35" : "1px solid #E8EDE8",
                  boxShadow: t.highlight ? "0 12px 32px rgba(26,74,53,0.18)" : "0 1px 4px rgba(0,0,0,0.04)",
                  transform: t.highlight ? "scale(1.04)" : "scale(1)",
                }}
              >
                {t.pill && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)",
                    backgroundColor: "#F7941D", color: "white", fontSize: "10px", fontWeight: 700,
                    letterSpacing: "1px", padding: "5px 16px", borderRadius: "100px", whiteSpace: "nowrap",
                  }}>
                    {t.pill}
                  </div>
                )}

                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#1A2E1A", marginBottom: "4px" }}>{t.name}</h3>
                <div style={{ marginBottom: "12px" }}>
                  <span style={{ fontSize: "36px", fontWeight: 800, color: "#1A4A35" }}>{t.price}</span>
                  <span style={{ fontSize: "14px", color: "#4A5E4A" }}>{t.period}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#4A5E4A", lineHeight: 1.5, marginBottom: "24px" }}>{t.description}</p>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                  {t.features.map((f) => (
                    <li key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: f.included ? "#1A2E1A" : "#C0C0C0" }}>
                      {f.included
                        ? <Check size={14} style={{ color: "#5CB85C", flexShrink: 0, marginTop: "2px" }} />
                        : <X size={14} style={{ color: "#E8EDE8", flexShrink: 0, marginTop: "2px" }} />}
                      {f.label}
                    </li>
                  ))}
                </ul>

                <Link
                  href={t.href}
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "14px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: 700,
                    textDecoration: "none",
                    backgroundColor: t.highlight ? "#1A4A35" : "transparent",
                    color: t.highlight ? "white" : "#1A4A35",
                    border: t.highlight ? "none" : "2px solid #1A4A35",
                  }}
                >
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "#4A5E4A" }}>
              Questions? <Link href="/contact" style={{ color: "#F7941D", fontWeight: 600, textDecoration: "none" }}>Contact us</Link> and we&apos;ll help you choose.
            </p>
          </div>
        </div>
      </div>
      <SectionDivider reverse />
    </>
  );
}
