import type { Metadata } from "next";
import Link from "next/link";
import SectionDivider from "@/components/ui/SectionDivider";
import SponsoredBanner from "@/components/home/SponsoredBanner";
import { Check, X } from "lucide-react";

export const metadata: Metadata = {
  title: "Membership Plans | NextCanna Connect",
  description:
    "Choose the right membership tier for your cannabis business. Free, Claimed, Select, and Elite plans available.",
};

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    badge: null,
    badgeBg: null,
    highlight: false,
    pill: null,
    description: "Get your business listed in our directory at no cost.",
    cta: "Get Listed Free",
    ctaHref: "/signup?tier=free",
    features: [
      { label: "Standard directory listing", included: true },
      { label: "Name, category & location visible", included: true },
      { label: "Contact information", included: false },
      { label: "Lead form", included: false },
      { label: "Full company page", included: false },
      { label: "Tier badge", included: false },
      { label: "RFP Bid Board access", included: false },
      { label: "Calendar booking", included: false },
    ],
    leadPrice: null,
  },
  {
    name: "Claimed",
    price: "$4.99",
    period: "/mo",
    badge: "CLAIMED",
    badgeBg: "#F9C31A",
    badgeColor: "#1A2E1A",
    highlight: false,
    pill: null,
    description: "Claim your listing and start receiving leads from interested buyers.",
    cta: "Get Claimed",
    ctaHref: "/signup?tier=claimed",
    features: [
      { label: "Standard directory listing", included: true },
      { label: "Contact info unlocked on lead", included: true },
      { label: "Lead auto-submitted to company", included: true },
      { label: "Yellow CLAIMED badge", included: true },
      { label: "Full company page", included: false },
      { label: "RFP Bid Board access", included: false },
      { label: "Calendar booking", included: false },
      { label: "Priority search placement", included: false },
    ],
    leadPrice: "$20 per lead",
  },
  {
    name: "Select",
    price: "$49.99",
    period: "/mo",
    badge: "SELECT SEAL",
    badgeBg: "#5CB85C",
    badgeColor: "white",
    highlight: false,
    pill: null,
    description: "A full company profile with the NextCanna Select Seal and reduced lead pricing.",
    cta: "Get Select",
    ctaHref: "/signup?tier=select",
    features: [
      { label: "Full company page", included: true },
      { label: "NextCanna Select Seal badge", included: true },
      { label: "RFP Bid Board access", included: true },
      { label: "Enhanced directory card", included: true },
      { label: "Contact info on profile", included: true },
      { label: "Calendar booking", included: false },
      { label: "Priority search placement", included: false },
      { label: "Full vetting & Verified badge", included: false },
    ],
    leadPrice: "$9.99 per lead",
  },
  {
    name: "Elite",
    price: "$99",
    period: "/mo",
    badge: "VERIFIED ✓",
    badgeBg: "#1A4A35",
    badgeColor: "#F9C31A",
    highlight: true,
    pill: "MOST POPULAR",
    description: "The highest tier — full vetting, premium placement, and real-time calendar sync.",
    cta: "Get Elite",
    ctaHref: "/signup?tier=elite",
    features: [
      { label: "Premium company page", included: true },
      { label: "NextCanna Verified badge (full vetting)", included: true },
      { label: "Priority search placement", included: true },
      { label: "Real-time calendar sync", included: true },
      { label: "RFP Bid Board access", included: true },
      { label: "Google Reviews integration", included: true },
      { label: "All contact info visible", included: true },
      { label: "Dedicated account support", included: true },
    ],
    leadPrice: "$25 per lead",
  },
];

const COMPARISON = [
  { feature: "Directory Listing", free: true, claimed: true, select: true, elite: true },
  { feature: "Tier Badge", free: false, claimed: "CLAIMED", select: "SELECT SEAL", elite: "VERIFIED ✓" },
  { feature: "Contact Info", free: false, claimed: "On lead", select: true, elite: true },
  { feature: "Full Company Page", free: false, claimed: false, select: true, elite: true },
  { feature: "Lead Price", free: "—", claimed: "$20/lead", select: "$9.99/lead", elite: "$25/lead" },
  { feature: "RFP Bid Board", free: false, claimed: false, select: true, elite: true },
  { feature: "Calendar Booking", free: false, claimed: false, select: false, elite: true },
  { feature: "Priority Placement", free: false, claimed: false, select: false, elite: true },
  { feature: "Vetting Required", free: false, claimed: false, select: false, elite: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} style={{ color: "#5CB85C", margin: "0 auto" }} />;
  if (value === false) return <X size={16} style={{ color: "#E8EDE8", margin: "0 auto" }} />;
  return <span style={{ fontSize: "12px", color: "#4A5E4A", fontWeight: 600 }}>{value}</span>;
}

export default function MembershipPage() {
  return (
    <>
      <SectionDivider />

      {/* Hero */}
      <div className="py-14 px-8 text-center" style={{ backgroundColor: "#1A4A35" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p className="font-semibold uppercase tracking-widest mb-2" style={{ color: "#F7941D", fontSize: "11px", letterSpacing: "2px" }}>
            Membership
          </p>
          <h1 className="font-bold text-white mb-3" style={{ fontSize: "36px", fontWeight: 800 }}>
            Grow Your Cannabis Business
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>
            Choose the plan that matches your goals. Upgrade anytime as your business grows.
          </p>
        </div>
      </div>

      <SectionDivider />

      {/* Tier cards */}
      <div className="py-16 px-8" style={{ backgroundColor: "#F7F9F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="relative flex flex-col rounded-xl p-6"
                style={{
                  backgroundColor: "white",
                  border: `2px solid ${tier.highlight ? "#1A4A35" : "#E8EDE8"}`,
                  transform: tier.highlight ? "scale(1.04)" : "scale(1)",
                  boxShadow: tier.highlight ? "0 12px 32px rgba(26,74,53,0.18)" : "none",
                }}
              >
                {tier.pill && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-bold text-white"
                    style={{ backgroundColor: "#F7941D", fontSize: "10px", letterSpacing: "1px", whiteSpace: "nowrap" }}
                  >
                    {tier.pill}
                  </div>
                )}

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

                <h2 className="font-bold mb-1" style={{ fontSize: "20px", color: "#1A2E1A", fontWeight: 800 }}>
                  {tier.name}
                </h2>
                <div className="mb-3">
                  <span className="font-extrabold" style={{ fontSize: "30px", color: "#1A4A35" }}>{tier.price}</span>
                  <span style={{ color: "#4A5E4A", fontSize: "14px" }}>{tier.period}</span>
                </div>

                {tier.leadPrice && (
                  <div
                    className="mb-3 px-3 py-1.5 rounded-lg text-center"
                    style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8" }}
                  >
                    <span style={{ fontSize: "12px", color: "#4A5E4A" }}>+ </span>
                    <span style={{ fontSize: "13px", color: "#1A4A35", fontWeight: 600 }}>{tier.leadPrice}</span>
                  </div>
                )}

                <p style={{ color: "#4A5E4A", fontSize: "13px", lineHeight: 1.5, marginBottom: "16px" }}>
                  {tier.description}
                </p>

                <ul className="flex flex-col gap-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f.label} className="flex items-start gap-2" style={{ fontSize: "13px", color: f.included ? "#1A2E1A" : "#C0C0C0" }}>
                      {f.included
                        ? <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#5CB85C" }} />
                        : <X size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#E8EDE8" }} />
                      }
                      {f.label}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.ctaHref}
                  className={tier.highlight ? "btn-primary justify-center" : "btn-ghost justify-center"}
                  style={{ textAlign: "center" }}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* Comparison table */}
      <div className="py-16 px-8" style={{ backgroundColor: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 className="font-bold text-center mb-10" style={{ fontSize: "26px", color: "#1A4A35", fontWeight: 700 }}>
            Full Feature Comparison
          </h2>

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E8EDE8" }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#1A4A35" }}>
                  <th className="px-5 py-4 text-left" style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                    Feature
                  </th>
                  {["Free", "Claimed", "Select", "Elite"].map((t) => (
                    <th key={t} className="px-4 py-4 text-center" style={{ fontSize: "13px", color: "white", fontWeight: 700 }}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} style={{ backgroundColor: i % 2 === 0 ? "white" : "#F7F9F7", borderBottom: "1px solid #E8EDE8" }}>
                    <td className="px-5 py-3" style={{ fontSize: "13px", color: "#1A2E1A", fontWeight: 500 }}>
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-center"><Cell value={row.free} /></td>
                    <td className="px-4 py-3 text-center"><Cell value={row.claimed} /></td>
                    <td className="px-4 py-3 text-center"><Cell value={row.select} /></td>
                    <td className="px-4 py-3 text-center"><Cell value={row.elite} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SectionDivider reverse />

      <SponsoredBanner
        companyName="Cannabis Law Group"
        tagline="Need legal guidance for your cannabis license? Our attorneys are licensed in 18 states."
        logoInitials="CL"
        destinationUrl="/vendor/cannabis-law-group"
        ctaText="Speak to an Attorney →"
      />

      <SectionDivider />
    </>
  );
}
