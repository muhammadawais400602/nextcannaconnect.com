import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NextCanna Connect",
  description: "NextCanna Connect Privacy Policy — how we collect, use, and protect your personal information.",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  color: "#4B5563",
  lineHeight: 1.8,
  margin: 0,
};

function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "14px" }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.05em", minWidth: "28px" }}>
        {number}
      </span>
      <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "22px", fontWeight: 400, color: "#111827", margin: 0 }}>
        {title}
      </h2>
    </div>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #F3F4F6" }}>
      <SectionHeading number={number} title={title} />
      {children}
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div style={{ backgroundColor: "#f5f4f1", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Hero */}
      <div style={{ padding: "60px 24px 48px" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", marginBottom: "16px" }}>
            Legal Documentation
          </p>
          <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, color: "#111827", lineHeight: 1.1, marginBottom: "20px" }}>
            Privacy Policy
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#6B7280", lineHeight: 1.7, maxWidth: "560px" }}>
            Last updated: May 24, 2024. NextCanna Connect is committed to the highest standards of data integrity and regional compliance across the global marketplace.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Section 01 */}
        <div style={{ backgroundColor: "white", borderRadius: "4px", padding: "clamp(28px, 4vw, 48px)", marginBottom: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <Section number="01" title="Introduction">
            <p style={bodyStyle}>
              NextCanna Connect ("we", "us", "our") operates the NextCanna B2B Enterprise Marketplace. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from NextCanna. We recognize the sensitive nature of the cannabis industry and prioritize discreet, secure data handling protocols.
            </p>
          </Section>

          {/* Section 02 — two column */}
          <div style={{ marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #F3F4F6" }}>
            <SectionHeading number="02" title="Personal Information We Collect" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
              <div>
                <p style={bodyStyle}>
                  When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                </p>
              </div>
              <div style={{ backgroundColor: "#003320", borderRadius: "6px", padding: "24px" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>
                  Operational Transparency
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: 1.6, margin: 0 }}>
                  Our data collection is strictly limited to information necessary for facilitating high-stakes B2B transactions and maintaining regulatory compliance within regional jurisdictions.
                </p>
              </div>
            </div>
          </div>

          {/* Section 03 */}
          <Section number="03" title="How we use your information">
            <p style={bodyStyle}>
              We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
            </p>
          </Section>

          {/* Section 04 */}
          <div style={{ marginBottom: "40px" }}>
            <SectionHeading number="04" title="Sharing your personal information" />
            <p style={bodyStyle}>
              We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store — you can read more about how Shopify uses your Personal Information here.
            </p>
          </div>
        </div>

        {/* Image with quote */}
        <div style={{ position: "relative", borderRadius: "4px", overflow: "hidden", marginBottom: "24px", minHeight: "320px", backgroundColor: "#2a2a2a" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/nextcanna-privacy/1200/500"
            alt="Data center"
            style={{ width: "100%", height: "320px", objectFit: "cover", display: "block", opacity: 0.7 }}
          />
          <div style={{
            position: "absolute",
            bottom: "32px",
            right: "40px",
            backgroundColor: "white",
            padding: "24px 28px",
            maxWidth: "320px",
            borderRadius: "4px",
          }}>
            <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "15px", fontStyle: "italic", color: "#111827", lineHeight: 1.6, marginBottom: "10px" }}>
              "Security is not a product, but a process."
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#9CA3AF", margin: 0 }}>
              — Enterprise Standards
            </p>
          </div>
        </div>

        {/* Sections 05–07 three column */}
        <div style={{ backgroundColor: "white", borderRadius: "4px", padding: "clamp(28px, 4vw, 48px)", marginBottom: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px", marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #F3F4F6" }}>
            {[
              { n: "05", title: "Behavioral Advertising", text: "As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you." },
              { n: "06", title: "Do Not Track", text: "Please note that we do not alter our Site's data collection and use practices when we see a Do Not Track signal from your browser." },
              { n: "07", title: "Your Rights", text: "If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted." },
            ].map((s) => (
              <div key={s.n}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "#9CA3AF", marginBottom: "8px" }}>{s.n}</p>
                <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "16px", fontWeight: 400, color: "#111827", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ ...bodyStyle, fontSize: "13px" }}>{s.text}</p>
              </div>
            ))}
          </div>

          {/* Sections 08–15 */}
          {[
            { n: "08", title: "Data Retention", text: "When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information." },
            { n: "09", title: "Changes to Policy", text: "We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons." },
            { n: "10", title: "Minors", text: "The Site is not intended for individuals under the age of 21. We do not knowingly collect information from individuals under this legal threshold." },
            { n: "11", title: "International Transfers", text: "Information may be transferred to and maintained on computers located outside of your state, province, country or other governmental jurisdiction." },
            { n: "12", title: "Security of Data", text: "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure." },
            { n: "13", title: "Service Providers", text: "We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, or to perform Service-related services." },
            { n: "14", title: "Links to Other Sites", text: "Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site." },
            { n: "15", title: "Analytics", text: "We may use third-party Service Providers to monitor and analyze the use of our Service, specifically tracking supply chain efficiency." },
          ].map((s, i, arr) => (
            <div key={s.n} style={{ marginBottom: i < arr.length - 1 ? "32px" : 0, paddingBottom: i < arr.length - 1 ? "32px" : 0, borderBottom: i < arr.length - 1 ? "1px solid #F3F4F6" : "none" }}>
              <SectionHeading number={s.n} title={s.title} />
              <p style={bodyStyle}>{s.text}</p>
            </div>
          ))}
        </div>

        {/* Sections 16–21 grid */}
        <div style={{ backgroundColor: "white", borderRadius: "4px", padding: "clamp(28px, 4vw, 48px)", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {[
              { n: "16", title: "Behavioral Remarketing", text: "NextCanna Connect uses remarketing services to advertise on third party websites to you after you visited our Service." },
              { n: "17", title: "Payments Compliance", text: "We provide paid products and/or services within the Service. In that case, we use third-party services for payment processing." },
              { n: "18", title: "GDPR Data Protection", text: "Our legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context." },
              { n: "19", title: "CCPA Privacy Rights", text: "This section provides additional details about the Personal Information we collect about California consumers and the rights afforded to them." },
              { n: "20", title: "Governing Law", text: "This Privacy Policy and our legal obligations are governed by the laws of the jurisdiction in which our headquarters reside." },
            ].map((s) => (
              <div key={s.n} style={{ padding: "24px", border: "1px solid #F3F4F6", borderRadius: "6px" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "#9CA3AF", marginBottom: "8px" }}>{s.n}</p>
                <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "16px", fontWeight: 400, color: "#111827", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ ...bodyStyle, fontSize: "13px" }}>{s.text}</p>
              </div>
            ))}

            {/* 21 — Contact Us (dark green) */}
            <div style={{ padding: "24px", backgroundColor: "#003320", borderRadius: "6px" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>21</p>
              <h3 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "16px", fontWeight: 400, color: "white", marginBottom: "12px" }}>Contact Us</h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "16px" }}>
                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us at{" "}
                <a href="mailto:compliance@nextcanna.connect" style={{ color: "rgba(255,255,255,0.9)", textDecoration: "underline" }}>
                  compliance@nextcanna.connect
                </a>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
