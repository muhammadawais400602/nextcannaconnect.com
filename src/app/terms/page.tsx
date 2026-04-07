import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | NextCanna Connect",
  description: "Terms of Service governing the NextCanna Connect B2B enterprise marketplace ecosystem.",
};

export default function TermsPage() {
  return (
    <div style={{ backgroundColor: "#f5f4f1", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Hero */}
      <div style={{ backgroundColor: "#f5f4f1", padding: "60px 24px 48px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: "16px" }}>
            Legal Framework
          </p>
          <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, color: "#111827", lineHeight: 1.1, marginBottom: "20px" }}>
            Terms of Service
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", borderLeft: "3px solid #003320", paddingLeft: "16px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontStyle: "italic", color: "#6B7280" }}>
              Governing the B2B enterprise marketplace ecosystem.
            </p>
            <span style={{ color: "#D1D5DB" }}>·</span>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#6B7280", whiteSpace: "nowrap" }}>
              Effective Date: April 1, 2026
            </p>
          </div>
        </div>
      </div>

      {/* Main content card */}
      <div style={{ maxWidth: "780px", margin: "0 auto 48px", padding: "0 24px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "4px", padding: "clamp(32px, 5vw, 56px)", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>

          {/* Intro */}
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#4B5563", lineHeight: 1.8, marginBottom: "48px" }}>
            Welcome to NextCanna Connect. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and NextCanna Connect ("we," "us," or "our") governing your access to and use of our B2B marketplace platform and associated enterprise services.
          </p>

          {/* Section 1 */}
          <Section number="1" title="Eligibility and Registration">
            <p style={bodyStyle}>
              Access to the NextCanna Connect platform is restricted to authorized commercial entities operating within legally compliant jurisdictions. By registering, you represent that you have the legal authority to bind your organization.
            </p>
            <SubPoint number="1.1" text="Verification: We reserve the right to verify licenses and tax documentation prior to account activation." />
            <SubPoint number="1.2" text="Security: Users are responsible for maintaining the confidentiality of their credentials." />
          </Section>

          {/* Section 2 */}
          <Section number="2" title="Marketplace Transactions">
            <p style={bodyStyle}>
              The platform facilitates B2B transactions. NextCanna Connect acts as a platform provider and, unless explicitly stated otherwise, is not a party to the underlying commercial agreements between buyers and sellers.
            </p>
            <blockquote style={{ margin: "24px 0", padding: "20px 24px", backgroundColor: "#f9fafb", borderLeft: "4px solid #003320", borderRadius: "0 4px 4px 0" }}>
              <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "14px", fontStyle: "italic", color: "#374151", lineHeight: 1.7, margin: 0 }}>
                "Compliance is the cornerstone of the NextCanna ecosystem. All trades must adhere to regional regulatory requirements."
              </p>
            </blockquote>
          </Section>

          {/* Section 3 */}
          <Section number="3" title="Compliance and Regional Laws">
            <p style={bodyStyle}>
              Users must comply with all local, state, and international regulations pertaining to their specific product categories. Our automated compliance tracking tools are provided for convenience but do not substitute for professional legal counsel.
            </p>
            <SubPoint number="3.1" text="Documentation: All necessary shipping manifests and compliance certificates must be uploaded to the secure vault." />
            <SubPoint number="3.2" text="Reporting: Suspected fraudulent activity must be reported immediately via the Support hub." />
          </Section>

          {/* Section 4 */}
          <Section number="4" title="Intellectual Property">
            <p style={bodyStyle}>
              All software, branding, data visualization techniques, and proprietary algorithms used on the platform are the exclusive property of NextCanna Connect. Users are granted a limited, revocable license to access these tools for commercial use.
            </p>
          </Section>

          {/* Section 5 */}
          <Section number="5" title="Limitation of Liability" last>
            <p style={{ ...bodyStyle, textTransform: "uppercase", fontSize: "13px", fontWeight: 500 }}>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEXTCANNA CONNECT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.
            </p>
          </Section>

          {/* CTA */}
          <div style={{ textAlign: "center", padding: "40px 0 16px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#6B7280", marginBottom: "20px" }}>
              Have questions regarding our enterprise terms?
            </p>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                backgroundColor: "#003320",
                color: "white",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                padding: "13px 28px",
                borderRadius: "4px",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              Contact Legal Support
            </Link>
          </div>
        </div>
      </div>

      {/* Commitment to Transparency */}
      <div style={{ maxWidth: "780px", margin: "0 auto 80px", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", borderRadius: "4px", overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.08)" }}>
          {/* Demo image */}
          <div style={{ position: "relative", minHeight: "280px", backgroundColor: "#c8c5bc" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/nextcanna-tos/600/400"
              alt="Office building"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          {/* Text */}
          <div style={{ backgroundColor: "white", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "22px", fontWeight: 400, color: "#111827", marginBottom: "16px", lineHeight: 1.3 }}>
              Our Commitment to Transparency
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#6B7280", lineHeight: 1.7, marginBottom: "24px" }}>
              NextCanna Connect operates with a mandate of absolute clarity. Our terms are designed to protect both the integrity of the marketplace and the growth of your enterprise.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>🛡️</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#374151" }}>
                ISO 27001 Certified Infrastructure
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  color: "#4B5563",
  lineHeight: 1.8,
  marginBottom: "16px",
};

function Section({ number, title, children, last }: { number: string; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : "40px", paddingBottom: last ? 0 : "40px", borderBottom: last ? "none" : "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "24px", fontWeight: 400, color: "#111827", marginBottom: "16px" }}>
        {number}. {title}
      </h2>
      {children}
    </div>
  );
}

function SubPoint({ number, text }: { number: string; text: string }) {
  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, color: "#003320", flexShrink: 0, minWidth: "28px" }}>{number}</span>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#4B5563", lineHeight: 1.7, margin: 0 }}>{text}</p>
    </div>
  );
}
