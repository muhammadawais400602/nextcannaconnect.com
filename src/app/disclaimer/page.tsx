import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Disclaimer | NextCanna Connect",
  description: "NextCanna Connect General Disclaimer — legal terms governing your professional engagement with the B2B ecosystem.",
};

const body: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  color: "#4B5563",
  lineHeight: 1.8,
  marginBottom: "16px",
};

function Section({ number, title, children, last }: { number: string; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ marginBottom: last ? 0 : "40px", paddingBottom: last ? 0 : "40px", borderBottom: last ? "none" : "1px solid #F3F4F6" }}>
      <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 400, color: "#111827", marginBottom: "14px" }}>
        {number}. {title}
      </h2>
      {children}
    </div>
  );
}

export default function DisclaimerPage() {
  return (
    <div style={{ backgroundColor: "#f5f4f1", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Hero */}
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "860px", padding: "60px 0 48px" }}>
        <div className="px-4 md:px-8">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#003320", marginBottom: "16px", display: "inline-block", backgroundColor: "rgba(0,51,32,0.08)", padding: "4px 10px", borderRadius: "3px" }}>
            Institutional Terminal
          </p>
          <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "#111827", lineHeight: 1.1, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
            NextCanna Connect<br />General Disclaimer
          </h1>
          <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: "32px" }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF" }}>
              Effective Date: April 1, 2026
            </p>
            <span style={{ color: "#D1D5DB" }}>|</span>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF" }}>
              Last Updated: April 1, 2026
            </p>
          </div>
          <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(14px, 2vw, 16px)", fontStyle: "italic", color: "#6B7280", lineHeight: 1.7, maxWidth: "600px" }}>
            The following legal terms govern your professional engagement with the NextCanna Connect B2B ecosystem. Please review these disclosures carefully before proceeding with trade operations.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "860px", paddingBottom: "80px" }}>

        {/* Sections 1–6 card */}
        <div className="rounded" style={{ backgroundColor: "white", padding: "clamp(24px, 4vw, 52px)", marginBottom: "24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>

          <Section number="1" title="General Notice">
            <p style={body}>
              The information contained on the NextCanna Connect website and platform (collectively, the "Site") is provided by NextCanna, LLC for general informational and business networking purposes only. Nothing on this Site constitutes legal, financial, regulatory, medical, or professional advice of any kind. Use of this Site does not create any professional relationship — including attorney-client, financial advisor-client, or consultant-client — between you and NextCanna, LLC or any of its employees, agents, or representatives.
            </p>
          </Section>

          <Section number="2" title="No Endorsement of Users or Listings">
            <p style={body}>
              NextCanna Connect is a B2B marketplace and partner discovery platform. The presence of any business, product, service, or individual on this platform does not constitute an endorsement, recommendation, verification, or guarantee by NextCanna, LLC. We do not independently verify the accuracy of User-submitted profiles, listings, credentials, or claims.
            </p>
            <p style={body}>
              You are solely responsible for conducting your own due diligence before entering into any business relationship with any party you discover through this platform. NextCanna Connect assumes no liability for the conduct, representations, or performance of any User or third party listed on or connected through the platform.
            </p>
          </Section>

          {/* Image + quote row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded overflow-hidden" style={{ marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #F3F4F6" }}>
            <div style={{ borderRadius: "6px", overflow: "hidden", minHeight: "200px", backgroundColor: "#c8c5bc" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/nextcanna-disclaimer/600/400"
                alt="Cannabis marketplace"
                style={{ width: "100%", height: "100%", minHeight: "200px", objectFit: "cover", display: "block" }}
              />
            </div>
            <div className="flex items-center justify-center" style={{ padding: "16px" }}>
              <div>
                <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#003320", display: "block", marginBottom: "12px" }}>balance</span>
                <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(14px, 2vw, 16px)", fontStyle: "italic", color: "#374151", lineHeight: 1.7 }}>
                  "Compliance is the cornerstone of sustainable growth in the sovereign marketplace."
                </p>
              </div>
            </div>
          </div>

          <Section number="3" title="Cannabis Industry and Regulatory Disclaimer">
            <p style={body}>
              Cannabis and cannabis-derived products remain controlled substances under federal law in the United States. Laws governing the cultivation, manufacture, distribution, sale, and use of cannabis vary significantly by state and locality and are subject to change without notice. Nothing on this Site should be construed as legal advice regarding cannabis licensing, compliance, or regulatory requirements in any jurisdiction.
            </p>
            <p style={body}>
              Users are solely responsible for ensuring that their business activities comply with all applicable federal, state, and local laws and regulations. NextCanna Connect does not facilitate, promote, or enable any unlicensed cannabis activity. Participation on this platform is limited to licensed cannabis businesses and lawful ancillary service providers.
            </p>
          </Section>

          <Section number="4" title="Product and Efficacy Disclaimer">
            <p style={body}>
              To the extent that any product information, descriptions, or claims appear on this platform — whether submitted by NextCanna Connect or by a third-party user — such content is provided for informational purposes only and has not been evaluated by the U.S. Food and Drug Administration (FDA) or any other regulatory body. No product or service listed on this platform is intended to diagnose, treat, cure, or prevent any disease or medical condition.
            </p>
            <p style={body}>
              NextCanna Connect makes no representations regarding the safety, efficacy, quality, or legality of any product or service listed on the platform. Reliance on any product information found on this Site is solely at your own risk.
            </p>
          </Section>

          <Section number="5" title="Third-Party Content and Links">
            <p style={body}>
              This Site may contain links to third-party websites, resources, and services. These links are provided for convenience only. NextCanna Connect does not control, endorse, or accept responsibility for any content, privacy practices, or terms of any third-party site. Accessing third-party links is done entirely at your own risk.
            </p>
          </Section>

          <Section number="6" title="Accuracy and Currency of Information">
            <p style={{ ...body, marginBottom: 0 }}>
              While we make reasonable efforts to keep information on this Site accurate and current, NextCanna Connect makes no representations or warranties — express or implied — regarding the completeness, accuracy, reliability, or timeliness of any content on the Site. Information may be changed or updated without notice.
            </p>
          </Section>
        </div>

        {/* Section 7 — Limitation of Liability (highlighted) */}
        <div className="rounded" style={{ backgroundColor: "white", padding: "clamp(24px, 4vw, 52px)", marginBottom: "24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", borderLeft: "4px solid #003320" }}>
          <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 400, color: "#111827", marginBottom: "8px" }}>
            7. Limitation of Liability
          </h2>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "20px" }}>
            Notice of Limitation
          </p>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#374151", lineHeight: 1.9, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.01em" }}>
            TO THE <strong>MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW</strong>, NEXTCANNA, LLC SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR RELIANCE ON THIS SITE OR ANY CONTENT CONTAINED HEREIN. THIS INCLUDES, WITHOUT LIMITATION, DAMAGES FOR LOST PROFITS, LOST DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL LOSS.
          </p>
        </div>

        {/* Section 8 */}
        <div className="rounded" style={{ backgroundColor: "white", padding: "clamp(24px, 4vw, 52px)", marginBottom: "24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(18px, 3vw, 24px)", fontWeight: 400, color: "#111827", marginBottom: "14px" }}>
            8. Governing Law
          </h2>
          <p style={{ ...body, marginBottom: 0 }}>
            This Disclaimer is governed by the laws of the State of Connecticut. Any disputes arising in connection with this Disclaimer are subject to the dispute resolution and arbitration provisions set forth in NextCanna Connect&apos;s Terms of Service.
          </p>
        </div>

        {/* Contact card */}
        <div className="rounded grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ backgroundColor: "white", padding: "clamp(24px, 4vw, 40px)", boxShadow: "0 1px 8px rgba(0,0,0,0.06)", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "6px" }}>
              Contact NextCanna, LLC
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#374151", fontWeight: 600, marginBottom: "4px" }}>
              Institutional Support Team
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#6B7280" }}>
              Institutional Support Team
            </p>
          </div>
          <div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "6px" }}>
              Direct Inquiries
            </p>
            <a href="mailto:info@NextCannaConnect.com" style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(14px, 2vw, 18px)", fontStyle: "italic", color: "#003320", textDecoration: "none", fontWeight: 400 }}>
              info@NextCannaConnect.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
