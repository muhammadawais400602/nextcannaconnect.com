import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import FaqAccordion from "@/components/ui/FaqAccordion";

export const metadata: Metadata = {
  title: "Pricing | NextCanna Connect",
  description:
    "Choose the right plan for your cannabis business. Free listing, Select verification, or Verified Pro premium placement.",
};

const TIERS = [
  {
    key: "free",
    name: "Unclaimed",
    price: "$0",
    badge: null,
    highlight: false,
    pill: null,
    description: "Basic directory presence at no cost.",
    included: [
      "Basic directory listing",
      "Business name, location & circular logo",
    ],
    excluded: [
      "Full company profile",
      "Public contact information",
      "Customer inquiry form",
      "Photo gallery",
      "Analytics dashboard",
    ],
    cta: "Get Listed Free",
    ctaFilled: false,
    href: "/signup?tier=free",
  },
  {
    key: "select",
    name: "Select",
    price: "$19.99",
    badge: { label: "SELECT", bg: "#185FA5", color: "white" },
    highlight: false,
    pill: null,
    description:
      "Enhanced listing with a full company profile and business inquiries.",
    included: [
      "Everything in Unclaimed",
      "Full company profile page",
      "NextCanna Connect Select badge",
      "Public contact information",
      "Customer inquiry form",
      "Photo gallery (up to 3 photos)",
      "Basic enhanced directory card",
      "4 profile tabs",
    ],
    excluded: [
      "Priority search placement",
      "Video embedding & social links",
      "Google Reviews integration",
      "Analytics dashboard",
      "Verified Pro badge",
    ],
    cta: "Get Select",
    ctaFilled: false,
    href: "/signup?tier=select",
  },
  {
    key: "elite",
    name: "Verified Pro",
    price: "$39.99",
    badge: { label: "VERIFIED PRO", bg: "#1A4A35", color: "white" },
    highlight: true,
    pill: "MOST POPULAR",
    description:
      "Premium visibility and advanced profile tools for verified operators.",
    included: [
      "Everything in Select",
      "Verified Pro badge (after verification)",
      "Priority search placement",
      "Profile tabs (up to 7)",
      "Premium enhanced directory card",
      "Unlimited photo gallery",
      "Video embedding & social links",
      "Google Reviews integration",
      "Analytics dashboard",
    ],
    excluded: [],
    cta: "Get Verified Pro",
    ctaFilled: true,
    href: "/signup?tier=elite",
  },
];

const COMPARISON_ROWS: {
  feature: string;
  free: string;
  select: string;
  elite: string;
}[] = [
  { feature: "Basic Directory Listing", free: "✓", select: "✓", elite: "✓" },
  { feature: "Business Name, Location & Logo", free: "✓", select: "✓", elite: "✓" },
  { feature: "Full Company Profile", free: "—", select: "✓", elite: "✓" },
  { feature: "Public Contact Information", free: "—", select: "✓", elite: "✓" },
  { feature: "Customer Inquiry Form", free: "—", select: "✓", elite: "✓" },
  { feature: "Photo Gallery", free: "—", select: "Up to 3", elite: "Unlimited" },
  { feature: "Enhanced Directory Card", free: "—", select: "Basic", elite: "Premium" },
  { feature: "Profile Tabs", free: "—", select: "4", elite: "Up to 7" },
  { feature: "Priority Search Placement", free: "—", select: "—", elite: "✓" },
  { feature: "Video Embedding & Social Links", free: "—", select: "—", elite: "✓" },
  { feature: "Google Reviews Integration", free: "—", select: "—", elite: "✓" },
  { feature: "Analytics Dashboard", free: "—", select: "—", elite: "✓" },
  { feature: "Verified Pro Badge", free: "—", select: "—", elite: "After verification" },
];

const FAQS = [
  {
    q: "Can I upgrade or downgrade my plan at any time?",
    a: "Yes. Upgrades take effect immediately. Downgrades take effect at the end of your current billing cycle. You will never lose your listing data when changing plans.",
  },
  {
    q: "What is the difference between the Select badge and the Verified Pro badge?",
    a: "The Select badge means your business has a paid, active profile on NextCanna Connect. The Verified Pro badge means your business has passed our full vetting process — license verification, insurance confirmation, and compliance review — giving buyers the highest level of trust.",
  },
  {
    q: "Is the Unclaimed listing automatically created for my business?",
    a: "Unclaimed listings may be auto-generated from public cannabis license data. If your business appears in our directory, you can claim it by signing up and verifying ownership. Claiming is free — upgrading to Select or Verified Pro unlocks your full profile.",
  },
  {
    q: "What happens to my listing if I cancel my subscription?",
    a: "Your listing reverts to Unclaimed status — your business name and location remain visible in the directory but your profile page, contact info, and all paid features are hidden until you reactivate.",
  },
];

function BadgeInline({ label, tier }: { label: string; tier: string }) {
  const bg =
    tier === "elite"
      ? "rgba(26,74,53,0.12)"
      : tier === "select"
        ? "rgba(24,95,165,0.12)"
        : "#F3F4F6";
  const color =
    tier === "elite" ? "#1A4A35" : tier === "select" ? "#185FA5" : "#6B7280";
  return (
    <span
      style={{
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        padding: "3px 8px",
        borderRadius: "4px",
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  );
}

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: "#1C3B2D",
          padding: "100px 20px 80px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#88B99E",
            marginBottom: "14px",
          }}
        >
          PRICING
        </p>
        <h1
          style={{
            fontFamily: "'Noto Serif', Georgia, serif",
            fontSize: "clamp(30px, 5vw, 46px)",
            fontWeight: 700,
            color: "white",
            marginBottom: "14px",
          }}
        >
          Grow Your Cannabis Business
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.7)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Choose the plan that matches your goals. Upgrade anytime.
        </p>
      </section>

      {/* Promotional Terms */}
      <section style={{ background: "#F7F9F7", padding: "32px 20px 0" }}>
        <div
          style={{
            maxWidth: "780px",
            margin: "0 auto",
            background: "#FFFBF0",
            border: "1px solid #FDE68A",
            borderRadius: "12px",
            padding: "20px 24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#92400E",
              marginBottom: "6px",
            }}
          >
            Introductory Promotional Pricing
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#92400E",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            These prices are available for new enrollments during a 60-day
            introductory promotion. The promotional monthly rate is locked for
            the first 12 months of your subscription. Existing customers retain
            their current contractual terms.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section
        style={{
          background: "#F7F9F7",
          padding: "60px 20px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {TIERS.map((t) => (
            <div
              key={t.key}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                background: "white",
                borderRadius: "16px",
                padding: "32px 28px",
                border: t.highlight
                  ? "2px solid #1A4A35"
                  : "1px solid #E5E7EB",
                boxShadow: t.highlight
                  ? "0 12px 32px rgba(26,74,53,0.15)"
                  : "0 1px 4px rgba(0,0,0,0.04)",
                transform: t.highlight ? "scale(1.03)" : "scale(1)",
              }}
            >
              {t.pill && (
                <div
                  style={{
                    position: "absolute",
                    top: "-14px",
                    right: "20px",
                    background: "#F7941D",
                    color: "white",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    padding: "5px 14px",
                    borderRadius: "100px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.pill}
                </div>
              )}

              {t.badge && (
                <div style={{ marginBottom: "10px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      padding: "4px 10px",
                      borderRadius: "5px",
                      background: t.badge.bg,
                      color: t.badge.color,
                    }}
                  >
                    {t.badge.label}
                  </span>
                </div>
              )}

              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#0D2818",
                  marginBottom: "4px",
                }}
              >
                {t.name}
              </h3>
              <div style={{ marginBottom: "10px" }}>
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    color: "#1A4A35",
                  }}
                >
                  {t.price}
                </span>
                <span style={{ fontSize: "14px", color: "#6B7280" }}>/mo</span>
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {t.description}
              </p>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "9px",
                  flex: 1,
                }}
              >
                {t.included.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "13px",
                      color: "#1A2E1A",
                    }}
                  >
                    <Check
                      size={14}
                      style={{
                        color: "#16A34A",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    {f}
                  </li>
                ))}
                {t.excluded.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      fontSize: "13px",
                      color: "#C0C0C0",
                    }}
                  >
                    <X
                      size={14}
                      style={{
                        color: "#E5E7EB",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    {f}
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
                  background: t.ctaFilled ? "#1A4A35" : "transparent",
                  color: t.ctaFilled ? "white" : "#1A4A35",
                  border: t.ctaFilled ? "none" : "2px solid #1A4A35",
                }}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section style={{ background: "#F7F9F7", padding: "40px 20px 60px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "'Noto Serif', Georgia, serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "#0D2818",
              marginBottom: "32px",
            }}
          >
            Full Feature Comparison
          </h2>
          <div
            style={{
              background: "white",
              borderRadius: "14px",
              border: "1px solid #E5E7EB",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                  minWidth: "600px",
                }}
              >
                <thead>
                  <tr style={{ background: "#1C3B2D" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "14px 18px",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "12px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Feature
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "14px 14px",
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      Unclaimed
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "14px 14px",
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      Select
                    </th>
                    <th
                      style={{
                        textAlign: "center",
                        padding: "14px 14px",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "12px",
                      }}
                    >
                      Verified Pro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      style={{
                        background: i % 2 === 0 ? "white" : "#FAFBFA",
                        borderBottom: "1px solid #F3F4F6",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 18px",
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        {row.feature}
                      </td>
                      {[row.free, row.select, row.elite].map((val, ci) => (
                        <td
                          key={ci}
                          style={{
                            textAlign: "center",
                            padding: "12px 14px",
                          }}
                        >
                          {val === "✓" ? (
                            <Check
                              size={16}
                              style={{
                                color: "#16A34A",
                                display: "inline-block",
                              }}
                            />
                          ) : val === "—" ? (
                            <span style={{ color: "#D1D5DB" }}>{val}</span>
                          ) : val === "SELECT" || val === "VERIFIED PRO" ? (
                            <BadgeInline
                              label={val}
                              tier={
                                val === "VERIFIED PRO" ? "elite" : "select"
                              }
                            />
                          ) : (
                            <span
                              style={{ color: "#374151", fontWeight: 500 }}
                            >
                              {val}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F7F9F7", padding: "70px 20px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Noto Serif', Georgia, serif",
              fontSize: "28px",
              fontWeight: 700,
              color: "#0D2818",
              textAlign: "center",
              marginBottom: "36px",
            }}
          >
            Frequently Asked Questions
          </h2>
          <FaqAccordion
            items={FAQS}
            itemStyle={{
              background: "white",
              borderRadius: "12px",
              border: "1px solid #E5E7EB",
            }}
            questionStyle={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0D2818",
              padding: "22px 24px",
            }}
            answerStyle={{
              fontSize: "13px",
              color: "#6B7280",
              lineHeight: 1.7,
              padding: "0 24px 22px",
            }}
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          background: "#1C3B2D",
          padding: "70px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Noto Serif', Georgia, serif",
            fontSize: "clamp(24px, 4vw, 34px)",
            fontWeight: 700,
            color: "white",
            marginBottom: "12px",
          }}
        >
          Ready to Grow Your Cannabis Business?
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.65)",
            marginBottom: "28px",
            maxWidth: "460px",
            margin: "0 auto 28px",
            lineHeight: 1.6,
          }}
        >
          Join hundreds of verified cannabis operators already on NextCanna
          Connect.
        </p>
        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/signup?tier=free"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              color: "white",
              border: "2px solid rgba(255,255,255,0.5)",
              background: "transparent",
            }}
          >
            Get Listed Free
          </Link>
          <Link
            href="/signup?tier=elite"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
              textDecoration: "none",
              color: "#1C3B2D",
              background: "white",
              border: "2px solid white",
            }}
          >
            Get Verified Pro
          </Link>
        </div>
      </section>
    </>
  );
}
