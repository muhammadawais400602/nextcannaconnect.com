import Link from "next/link";
import { Check, Star } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Get discovered in the cannabis ecosystem.",
    badge: null,
    badgeBg: null,
    features: [
      "Standard directory listing",
      "Business name & location",
      "Category placement",
      "Claimable by owner",
    ],
    cta: "Get Listed Free",
    ctaHref: "/signup?tier=free",
    highlight: false,
    pill: null,
    accentColor: "#9CA3AF",
  },
  {
    name: "Claimed",
    price: "$4.99",
    period: "/mo",
    description: "Own your listing and receive leads.",
    badge: "CLAIMED",
    badgeBg: "#F9C31A",
    badgeColor: "#1A2E1A",
    features: [
      "Everything in Free",
      "Claim & manage your profile",
      "Contact info visible",
      "$20 per lead received",
    ],
    cta: "Get Claimed",
    ctaHref: "/signup?tier=claimed",
    highlight: false,
    pill: null,
    accentColor: "#F9C31A",
  },
  {
    name: "Select",
    price: "$49.99",
    period: "/mo",
    description: "Stand out with a verified seal.",
    badge: "SELECT SEAL ✓",
    badgeBg: "#5CB85C",
    badgeColor: "white",
    features: [
      "Everything in Claimed",
      "NextCanna Select Seal",
      "Full company profile page",
      "$9.99 per lead",
      "RFP Bid Board access",
    ],
    cta: "Get Select",
    ctaHref: "/signup?tier=select",
    highlight: false,
    pill: null,
    accentColor: "#5CB85C",
  },
  {
    name: "Elite",
    price: "$99",
    period: "/mo",
    description: "Maximum trust. Maximum visibility.",
    badge: "VERIFIED ✓",
    badgeBg: "#1A4A35",
    badgeColor: "#F9C31A",
    features: [
      "Everything in Select",
      "Verified Badge (vetting required)",
      "Premium company page",
      "$25 per lead",
      "Calendar sync + RFP access",
      "Priority placement",
    ],
    cta: "Get Elite",
    ctaHref: "/signup?tier=elite",
    highlight: true,
    pill: "MOST POPULAR",
    accentColor: "#1A4A35",
  },
];

export default function TierPreviewStrip() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: "white" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-label">Membership Plans</span>
          <h2 className="section-title">Grow Your Business Visibility</h2>
          <p style={{ color: "#6B7280", fontSize: "16px", marginTop: "10px" }}>
            Choose the plan that fits your stage — upgrade or downgrade anytime.
          </p>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="relative rounded-2xl flex flex-col overflow-hidden"
              style={{
                backgroundColor: "white",
                border: tier.highlight ? "2px solid #1A4A35" : "1px solid #E5E7EB",
                boxShadow: tier.highlight ? "0 8px 32px rgba(26,74,53,0.13)" : "none",
              }}
            >
              {/* Top accent */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: tier.accentColor }}
              />

              {/* Popular pill */}
              {tier.pill && (
                <div
                  className="absolute top-4 right-4 px-2.5 py-1 rounded-full font-bold"
                  style={{
                    backgroundColor: "#F7941D",
                    color: "white",
                    fontSize: "10px",
                    letterSpacing: "0.8px",
                  }}
                >
                  {tier.pill}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Badge */}
                {tier.badge && (
                  <div className="mb-3">
                    <span
                      className="tier-badge"
                      style={{ backgroundColor: tier.badgeBg!, color: tier.badgeColor! }}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                <h3
                  className="font-bold mb-1"
                  style={{ fontSize: "18px", color: "#111827", fontWeight: 700 }}
                >
                  {tier.name}
                </h3>
                <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "16px" }}>
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-5">
                  <span className="font-extrabold" style={{ fontSize: "30px", color: "#111827", fontWeight: 800 }}>
                    {tier.price}
                  </span>
                  <span style={{ color: "#9CA3AF", fontSize: "13px" }}>{tier.period}</span>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5"
                      style={{ fontSize: "13px", color: "#374151" }}
                    >
                      <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#5CB85C" }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={tier.ctaHref}
                  className="w-full justify-center text-center font-semibold py-3 px-4 rounded-xl transition-colors"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: tier.highlight ? "#1A4A35" : "#F8FAF8",
                    color: tier.highlight ? "white" : "#111827",
                    border: tier.highlight ? "none" : "1px solid #E5E7EB",
                    fontSize: "14px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/membership"
            className="font-semibold"
            style={{ color: "#F7941D", fontSize: "14px" }}
          >
            Compare all plans in detail →
          </Link>
        </div>
      </div>
    </section>
  );
}
