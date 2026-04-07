import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | NextCanna Connect",
  description: "NextCanna Connect Cookie Policy — how we use cookies and similar tracking technologies.",
};

const body: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "14px",
  color: "#4B5563",
  lineHeight: 1.8,
  marginBottom: "16px",
};

const sectionNum: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "11px",
  fontWeight: 700,
  color: "#9CA3AF",
  letterSpacing: "0.05em",
  minWidth: "32px",
  flexShrink: 0,
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#111827",
};

const subheading: React.CSSProperties = {
  fontFamily: "'Noto Serif', Georgia, serif",
  fontSize: "15px",
  fontStyle: "italic",
  fontWeight: 400,
  color: "#111827",
  marginBottom: "10px",
};

const tableHeader: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#9CA3AF",
  padding: "10px 14px",
  textAlign: "left" as const,
  backgroundColor: "#f9fafb",
  borderBottom: "1px solid #F3F4F6",
};

const tableCell: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "13px",
  color: "#4B5563",
  padding: "11px 14px",
  borderBottom: "1px solid #F3F4F6",
};

function SectionBlock({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "40px", paddingBottom: "40px", borderBottom: "1px solid #F3F4F6" }}>
      <div className="flex items-baseline gap-4" style={{ marginBottom: "16px" }}>
        <span style={sectionNum}>{number}</span>
        <span style={sectionTitle}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function CookieTable({ headers, rows, note }: { headers: string[]; rows: string[][]; note?: string }) {
  return (
    <div style={{ border: "1px solid #F3F4F6", borderRadius: "6px", overflow: "hidden", marginBottom: note ? "10px" : "0" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h) => <th key={h} style={tableHeader}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "white" : "#fafafa" }}>
              {row.map((cell, j) => <td key={j} style={{ ...tableCell, borderBottom: i < rows.length - 1 ? "1px solid #F3F4F6" : "none" }}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#9CA3AF", lineHeight: 1.6, padding: "10px 14px", borderTop: "1px solid #F3F4F6", margin: 0 }}>{note}</p>}
    </div>
  );
}

function ManageItem({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4" style={{ marginBottom: "24px" }}>
      <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#003320", flexShrink: 0, marginTop: "2px" }}>{icon}</span>
      <div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "6px" }}>{title}</p>
        {children}
      </div>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <div style={{ backgroundColor: "#f5f4f1", minHeight: "100vh", paddingTop: "80px" }}>

      {/* Hero */}
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "860px", paddingTop: "60px", paddingBottom: "48px" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#003320", marginBottom: "16px", display: "inline-block", backgroundColor: "rgba(0,51,32,0.08)", padding: "4px 10px", borderRadius: "3px" }}>
          Legal Resource Center
        </p>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(26px, 5vw, 44px)", fontWeight: 800, color: "#111827", lineHeight: 1.05, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
          NextCanna Connect<br />Cookie Policy
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF" }}>
            Effective Date: April 1, 2026
          </p>
          <span style={{ color: "#D1D5DB" }}>|</span>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9CA3AF" }}>
            Last Updated: April 1, 2026
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "860px", paddingBottom: "80px" }}>
        <div className="rounded" style={{ backgroundColor: "white", padding: "clamp(24px, 4vw, 52px)", marginBottom: "24px", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>

          {/* 01 Overview */}
          <SectionBlock number="01" title="Overview">
            <p style={body}>
              NextCanna Connect, operated by NextCanna, LLC, uses cookies and similar tracking technologies on its website and platform (collectively, the "Site"). This Cookie Policy explains what cookies are, what types we use, why we use them, and how you can manage your preferences. This Cookie Policy should be read alongside our Privacy Policy and Terms of Service, both of which are available at [insert URL].
            </p>
          </SectionBlock>

          {/* 02 What are cookies */}
          <SectionBlock number="02" title="What Are Cookies?">
            <p style={body}>
              Cookies are small text files placed on your device by a website when you visit it. They allow the site to recognize your device, remember your preferences, and collect information about how you use the site. Cookies can be set by the site you are visiting ("first-party cookies") or by third parties whose services are embedded on the site ("third-party cookies"). Similar technologies include web beacons, tracking pixels, and local storage objects, which function in comparable ways. For simplicity, we refer to all of these collectively as "cookies" throughout this Policy.
            </p>
          </SectionBlock>

          {/* 03 Categories */}
          <SectionBlock number="03" title="Categories of Cookies We Use">

            {/* A */}
            <p style={subheading}>A. Strictly Necessary Cookies</p>
            <p style={{ ...body, marginBottom: "16px" }}>
              These cookies are essential for the Site to function. They enable core features such as account login, session management, and security. These cookies cannot be disabled without materially impairing your ability to use the platform.
            </p>
            <CookieTable
              headers={["Purpose", "Examples"]}
              rows={[
                ["User authentication and session management", "Login state, session tokens"],
                ["Security and fraud prevention", "CSRF protection"],
                ["Platform functionality", "Saved preferences, navigation state"],
              ]}
            />
            <div style={{ marginBottom: "28px" }} />

            {/* B */}
            <p style={subheading}>B. Analytics Cookies</p>
            <p style={{ ...body, marginBottom: "16px" }}>
              These cookies collect aggregated, pseudonymous data about how visitors use the Site — including pages visited, time spent, and actions taken. This data helps us understand and improve platform performance.
            </p>
            <CookieTable
              headers={["Provider", "Purpose"]}
              rows={[["Google Analytics", "Traffic analysis, user behavior, session data"]]}
              note="Data collected through analytics cookies may be processed by third-party providers under their own privacy policies. We encourage you to review Google's privacy policy at policies.google.com."
            />
            <div style={{ marginBottom: "28px" }} />

            {/* C */}
            <p style={subheading}>C. Advertising and Retargeting Cookies</p>
            <p style={{ ...body, marginBottom: "16px" }}>
              These cookies are used to deliver relevant advertising to you across the web, based on your activity on our Site. They track whether you have visited our Site and may be used to build a profile of your interests to serve targeted ads on third-party platforms.
            </p>
            <CookieTable
              headers={["Provider", "Purpose"]}
              rows={[
                ["Google Ads / Google Tag Manager", "Conversion tracking, retargeting"],
                ["Meta (Facebook) Pixel", "Retargeting, ad performance measurement"],
                ["LinkedIn Insight Tag", "B2B audience targeting, campaign analytics"],
              ]}
            />
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#6B7280", lineHeight: 1.6, marginTop: "10px", marginBottom: "28px" }}>
              California residents have the right to opt out of this sharing. See Section 6 below.
            </p>

            {/* D */}
            <p style={subheading}>D. Third-Party Social Pixels</p>
            <p style={{ ...body, marginBottom: 0 }}>
              We may use social media pixels from platforms including Meta (Facebook/Instagram) and LinkedIn to measure the effectiveness of our marketing campaigns and to enable features such as social sharing or lead generation forms. These pixels may collect your IP address, browser information, and pages visited, and may associate that data with your social media profile if you are logged in to those platforms. Their use is governed by the respective platforms' data policies.
            </p>
          </SectionBlock>

          {/* 04 Cookie Duration */}
          <SectionBlock number="04" title="Cookie Duration">
            <p style={{ ...body, marginBottom: 0 }}>
              Cookies may be either session cookies (deleted when you close your browser) or persistent cookies (stored on your device for a defined period). Advertising and analytics cookies are generally persistent. Specific retention durations vary by provider and are governed by their respective policies.
            </p>
          </SectionBlock>

          {/* 05 How to Manage */}
          <SectionBlock number="05" title="How to Manage Your Cookie Preferences">
            <p style={{ ...body, marginBottom: "20px" }}>You have several options to control or limit cookie use:</p>

            <ManageItem icon="settings" title="Browser Settings.">
              <p style={{ ...body, marginBottom: "8px" }}>
                Most browsers allow you to block or delete cookies through their settings. Note that disabling strictly necessary cookies will impair platform functionality.
              </p>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#6B7280", lineHeight: 1.8 }}>
                <p style={{ margin: 0 }}>Chrome: Settings &gt; Privacy and Security &gt; Cookies</p>
                <p style={{ margin: 0 }}>Firefox: Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</p>
                <p style={{ margin: 0 }}>Safari: Preferences &gt; Privacy &gt; Manage Website Data</p>
              </div>
            </ManageItem>

            <ManageItem icon="analytics" title="Google Analytics Opt-Out.">
              <p style={{ ...body, marginBottom: 0 }}>
                You can prevent Google Analytics from collecting your data by installing the Google Analytics Opt-Out Browser Add-on, available at tools.google.com/dlpage/gaoptout.
              </p>
            </ManageItem>

            <ManageItem icon="ads_click" title="Ad Network Opt-Outs.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginTop: "8px" }}>
                {[
                  { label: "Google", url: "adssettings.google.com" },
                  { label: "Meta", url: "facebook.com/settings" },
                  { label: "LinkedIn", url: "linkedin.com/psettings" },
                ].map((item) => (
                  <div key={item.label} style={{ padding: "10px 14px", border: "1px solid #F3F4F6", borderRadius: "6px" }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "4px" }}>{item.label}</p>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#9CA3AF", margin: 0 }}>{item.url}</p>
                  </div>
                ))}
              </div>
            </ManageItem>

            <ManageItem icon="do_not_disturb_on" title="California Residents — Do Not Sell or Share.">
              <p style={{ ...body, marginBottom: 0 }}>
                The use of advertising and retargeting cookies constitutes "sharing" of personal information under the CCPA/CPRA. To opt out, email us at{" "}
                <a href="mailto:info@NextCannaConnect.com" style={{ color: "#003320", textDecoration: "underline" }}>info@NextCannaConnect.com</a>
                {" "}with the subject line "Do Not Sell or Share My Information" and we will disable advertising cookies associated with your account.
              </p>
            </ManageItem>
          </SectionBlock>

          {/* 06 California */}
          <SectionBlock number="06" title="Your California Privacy Rights">
            <p style={{ ...body, marginBottom: 0 }}>
              Under the CCPA/CPRA, California residents have the right to opt out of the sale or sharing of personal information collected through cookies and tracking technologies. Advertising cookies and social pixels on our Site involve the sharing of data with third-party advertising partners, which may constitute "sharing" under California law. To exercise your opt-out right, contact us at{" "}
              <a href="mailto:info@NextCannaConnect.com" style={{ color: "#003320", textDecoration: "underline" }}>info@NextCannaConnect.com</a>
              {" "}with the subject line "Do Not Sell or Share My Information."
            </p>
          </SectionBlock>

          {/* 07 Updates */}
          <div style={{ marginBottom: "40px" }}>
            <div className="flex items-baseline gap-4" style={{ marginBottom: "16px" }}>
              <span style={sectionNum}>07</span>
              <span style={sectionTitle}>Updates to This Cookie Policy</span>
            </div>
            <p style={{ ...body, marginBottom: 0 }}>
              We may update this Cookie Policy from time to time to reflect changes in the technologies we use or applicable legal requirements. The "Last Updated" date at the top of this page will reflect any revisions. Material changes will be communicated consistent with our Privacy Policy update procedures.
            </p>
          </div>

          {/* 08 Contact — dark green */}
          <div className="rounded-md" style={{ backgroundColor: "#003320", padding: "clamp(24px, 4vw, 36px)" }}>
            <div className="flex items-baseline gap-4" style={{ marginBottom: "16px" }}>
              <span style={{ ...sectionNum, color: "rgba(255,255,255,0.4)" }}>08</span>
              <span style={{ ...sectionTitle, color: "white", letterSpacing: "0.25em" }}>Contact Us</span>
            </div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: "white", marginBottom: "4px" }}>
              NextCanna, LLC
            </p>
            <a href="mailto:info@NextCannaConnect.com" className="flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>mail</span>
              info@NextCannaConnect.com
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
