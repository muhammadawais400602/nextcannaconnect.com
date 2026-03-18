import Link from "next/link";
import { Check } from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    badge: null,
    badgeBg: null,
    features: ["Standard directory listing", "No contact info", "No lead form", "No badge"],
    cta: "Get Listed",
    ctaStyle: "ghost",
    highlight: false,
  },
  {
    name: "Claimed",
    price: "$4.99",
    period: "/mo",
    badge: "CLAIMED",
    badgeBg: "#F9C31A",
    badgeColor: "#1A2E1A",
    features: ["Standard listing", "$20 per lead", "Contact info unlocked", "Lead auto-submitted"],
    cta: "Get Claimed",
    ctaStyle: "ghost",
    highlight: false,
  },
  {
    name: "Select",
    price: "$49.99",
    period: "/mo",
    badge: "SELECT SEAL",
    badgeBg: "#5CB85C",
    badgeColor: "white",
    features: ["NextCanna Select Seal", "Full company page", "$9.99 per lead", "RFP Bid Board access"],
    cta: "Get Select",
    ctaStyle: "ghost",
    highlight: false,
  },
  {
    name: "Elite",
    price: "$99",
    period: "/mo",
    badge: "VERIFIED ✓",
    badgeBg: "#1A4A35",
    badgeColor: "#F9C31A",
    features: ["Verified Badge (vetting required)", "Premium company page", "$25 per lead", "Calendar sync + RFP access"],
    cta: "Get Elite",
    ctaStyle: "primary",
    highlight: true,
    pill: "MOST POPULAR",
  },
];

export default function TierPreviewStrip() {
  return (
    <section className="py-16 px-8" style={{ backgroundColor: "#F7F9F7" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="text-center mb-10">
          <p
            className="font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#F7941D", fontSize: "11px", letterSpacing: "2px" }}
          >
            Membership Plans
          </p>
          <h2 className="font-bold" style={{ fontSize: "28px", color: "#1A4A35", fontWeight: 700 }}>
            Grow Your Visibility
          </h2>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="relative rounded-xl p-6 flex flex-col"
              style={{
                backgroundColor: "white",
                border: `1px solid ${tier.highlight ? "#1A4A35" : "#E8EDE8"}`,
                transform: tier.highlight ? "scale(1.04)" : "scale(1)",
                boxShadow: tier.highlight ? "0 8px 24px rgba(26,74,53,0.15)" : "none",
              }}
            >
              {tier.pill && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white font-bold"
                  style={{ backgroundColor: "#F7941D", fontSize: "10px", letterSpacing: "1px", whiteSpace: "nowrap" }}
                >
                  {tier.pill}
                </div>
              )}

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

              <h3 className="font-bold mb-1" style={{ fontSize: "18px", color: "#1A2E1A", fontWeight: 700 }}>
                {tier.name}
              </h3>
              <div className="mb-4">
                <span className="font-extrabold" style={{ fontSize: "26px", color: "#1A4A35" }}>
                  {tier.price}
                </span>
                <span style={{ color: "#4A5E4A", fontSize: "13px" }}>{tier.period}</span>
              </div>

              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2" style={{ fontSize: "13px", color: "#4A5E4A" }}>
                    <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#5CB85C" }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/signup?tier=${tier.name.toLowerCase()}`}
                className={tier.ctaStyle === "primary" ? "btn-primary justify-center" : "btn-ghost justify-center"}
                style={{ textAlign: "center" }}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/membership"
            className="font-semibold"
            style={{ color: "#F7941D", fontSize: "14px" }}
          >
            Compare All Plans →
          </Link>
        </div>
      </div>
    </section>
  );
}
