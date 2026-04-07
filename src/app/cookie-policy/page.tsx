import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | NextCanna Connect",
  description: "NextCanna Connect Cookie Policy — how we use cookies and similar tracking technologies.",
};

function Table({ headers, rows, note }: { headers: string[]; rows: [string, string][]; note?: string }) {
  return (
    <div className="overflow-hidden rounded-xl shadow-sm mt-4" style={{ border: "1px solid rgba(192,201,193,0.15)" }}>
      <table className="w-full text-left" style={{ fontFamily: "'Inter', sans-serif" }}>
        <thead style={{ backgroundColor: "#f6f3f2" }}>
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-6 py-4 text-[#003320] uppercase text-xs font-bold tracking-widest">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-[#c0c9c1]/10">
          {rows.map(([a, b], i) => (
            <tr key={i}>
              <td className="px-6 py-4 font-semibold text-[#003320]">{a}</td>
              <td className="px-6 py-4 text-[#414943]">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="text-xs text-[#414943] italic mt-2 px-6 pb-4 pt-2" style={{ borderTop: "1px solid rgba(192,201,193,0.15)" }}>{note}</p>}
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <div style={{ backgroundColor: "#fbf9f8", fontFamily: "'Inter', sans-serif" }} className="text-[#1b1c1c]">
      <main className="pt-32 pb-24 px-8 max-w-5xl mx-auto">

        {/* Hero */}
        <header className="mb-20">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest px-3 py-1 self-start rounded-full font-bold" style={{ color: "#88b99e", backgroundColor: "rgba(26,74,53,0.1)" }}>
              Legal Resource Center
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-[#003320] tracking-tight leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
              NEXTCANNA CONNECT COOKIE POLICY
            </h1>
            <div className="flex gap-6 mt-4 text-[#414943] text-sm pl-6" style={{ borderLeft: "2px solid rgba(192,201,193,0.3)" }}>
              <p><span className="font-semibold uppercase tracking-tighter">Effective Date:</span> April 1, 2026</p>
              <p><span className="font-semibold uppercase tracking-tighter">Last Updated:</span> April 1, 2026</p>
            </div>
          </div>
        </header>

        {/* Sections */}
        <div className="space-y-16">

          {/* 01 */}
          <section className="group">
            <div className="flex items-baseline gap-6 mb-4">
              <span className="text-4xl font-extrabold text-[#c0c9c1]/40 group-hover:text-[#003320]/20 transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>01</span>
              <h2 className="text-2xl font-bold text-[#003320] tracking-tight uppercase">Overview</h2>
            </div>
            <div className="pl-14 text-[#414943] leading-relaxed text-lg">
              <p>NextCanna Connect, operated by NextCanna, LLC, uses cookies and similar tracking technologies on its website and platform (collectively, the &quot;Site&quot;). This Cookie Policy explains what cookies are, what types we use, why we use them, and how you can manage your preferences. This Cookie Policy should be read alongside our Privacy Policy and Terms of Service, both of which are available at [insert URL].</p>
            </div>
          </section>

          {/* 02 */}
          <section className="group">
            <div className="flex items-baseline gap-6 mb-4">
              <span className="text-4xl font-extrabold text-[#c0c9c1]/40 group-hover:text-[#003320]/20 transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>02</span>
              <h2 className="text-2xl font-bold text-[#003320] tracking-tight uppercase">What Are Cookies?</h2>
            </div>
            <div className="pl-14 text-[#414943] leading-relaxed text-lg">
              <p>Cookies are small text files placed on your device by a website when you visit it. They allow the site to recognize your device, remember your preferences, and collect information about how you use the site. Cookies can be set by the site you are visiting (&quot;first-party cookies&quot;) or by third parties whose services are embedded on the site (&quot;third-party cookies&quot;). Similar technologies include web beacons, tracking pixels, and local storage objects, which function in comparable ways. For simplicity, we refer to all of these collectively as &quot;cookies&quot; throughout this Policy.</p>
            </div>
          </section>

          {/* 03 */}
          <section className="group">
            <div className="flex items-baseline gap-6 mb-8">
              <span className="text-4xl font-extrabold text-[#c0c9c1]/40 group-hover:text-[#003320]/20 transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>03</span>
              <h2 className="text-2xl font-bold text-[#003320] tracking-tight uppercase">Categories of Cookies We Use</h2>
            </div>
            <div className="pl-14 space-y-12">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#003320] italic" style={{ fontFamily: "'Noto Serif', serif" }}>A. Strictly Necessary Cookies</h3>
                <p className="text-[#414943]">These cookies are essential for the Site to function. They enable core features such as account login, session management, and security. These cookies cannot be disabled without materially impairing your ability to use the platform.</p>
                <Table
                  headers={["Purpose", "Examples"]}
                  rows={[
                    ["User authentication and session management", "Login state, session tokens"],
                    ["Security and fraud prevention", "CSRF protection"],
                    ["Platform functionality", "Saved preferences, navigation state"],
                  ]}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#003320] italic" style={{ fontFamily: "'Noto Serif', serif" }}>B. Analytics Cookies</h3>
                <p className="text-[#414943]">These cookies collect aggregated, pseudonymous data about how visitors use the Site — including pages visited, time spent, and actions taken. This data helps us understand and improve platform performance.</p>
                <Table
                  headers={["Provider", "Purpose"]}
                  rows={[["Google Analytics", "Traffic analysis, user behavior, session data"]]}
                  note="Data collected through analytics cookies may be processed by third-party providers under their own privacy policies. We encourage you to review Google's privacy policy at policies.google.com."
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#003320] italic" style={{ fontFamily: "'Noto Serif', serif" }}>C. Advertising and Retargeting Cookies</h3>
                <p className="text-[#414943]">These cookies are used to deliver relevant advertising to you across the web, based on your activity on our Site. They track whether you have visited our Site and may be used to build a profile of your interests to serve targeted ads on third-party platforms.</p>
                <Table
                  headers={["Provider", "Purpose"]}
                  rows={[
                    ["Google Ads / Google Tag Manager", "Conversion tracking, retargeting"],
                    ["Meta (Facebook) Pixel", "Retargeting, ad performance measurement"],
                    ["LinkedIn Insight Tag", "B2B audience targeting, campaign analytics"],
                  ]}
                />
                <p className="text-sm font-medium text-[#003320] mt-2">California residents have the right to opt out of this sharing. See Section 6 below.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#003320] italic" style={{ fontFamily: "'Noto Serif', serif" }}>D. Third-Party Social Pixels</h3>
                <p className="text-[#414943]">We may use social media pixels from platforms including Meta (Facebook/Instagram) and LinkedIn to measure the effectiveness of our marketing campaigns and to enable features such as social sharing or lead generation forms. These pixels may collect your IP address, browser information, and pages visited, and may associate that data with your social media profile if you are logged in to those platforms. Their use is governed by the respective platforms&apos; data policies.</p>
              </div>
            </div>
          </section>

          {/* 04 */}
          <section className="group">
            <div className="flex items-baseline gap-6 mb-4">
              <span className="text-4xl font-extrabold text-[#c0c9c1]/40 group-hover:text-[#003320]/20 transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>04</span>
              <h2 className="text-2xl font-bold text-[#003320] tracking-tight uppercase">Cookie Duration</h2>
            </div>
            <div className="pl-14 text-[#414943] leading-relaxed text-lg">
              <p>Cookies may be either session cookies (deleted when you close your browser) or persistent cookies (stored on your device for a defined period). Advertising and analytics cookies are generally persistent. Specific retention durations vary by provider and are governed by their respective policies.</p>
            </div>
          </section>

          {/* 05 */}
          <section className="group">
            <div className="flex items-baseline gap-6 mb-4">
              <span className="text-4xl font-extrabold text-[#c0c9c1]/40 group-hover:text-[#003320]/20 transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>05</span>
              <h2 className="text-2xl font-bold text-[#003320] tracking-tight uppercase">How to Manage Your Cookie Preferences</h2>
            </div>
            <div className="pl-14 space-y-8 text-[#414943] leading-relaxed text-lg">
              <p>You have several options to control or limit cookie use:</p>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-[#1a4a35] shrink-0 mt-1">settings</span>
                  <div>
                    <strong className="text-[#003320] block mb-1">Browser Settings.</strong>
                    Most browsers allow you to block or delete cookies through their settings. Note that disabling strictly necessary cookies will impair platform functionality.
                    <div className="mt-2 text-sm space-y-1">
                      <p><span className="font-semibold" style={{ color: "rgba(0,51,32,0.8)" }}>Chrome:</span> Settings &gt; Privacy and Security &gt; Cookies</p>
                      <p><span className="font-semibold" style={{ color: "rgba(0,51,32,0.8)" }}>Firefox:</span> Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data</p>
                      <p><span className="font-semibold" style={{ color: "rgba(0,51,32,0.8)" }}>Safari:</span> Preferences &gt; Privacy &gt; Manage Website Data</p>
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-[#1a4a35] shrink-0 mt-1">analytics</span>
                  <div>
                    <strong className="text-[#003320] block mb-1">Google Analytics Opt-Out.</strong>
                    You can prevent Google Analytics from collecting your data by installing the Google Analytics Opt-Out Browser Add-on, available at tools.google.com/dlpage/gaoptout.
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-[#1a4a35] shrink-0 mt-1">ads_click</span>
                  <div>
                    <strong className="text-[#003320] block mb-1">Ad Network Opt-Outs.</strong>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      {[{ label: "Google", url: "adssettings.google.com" }, { label: "Meta", url: "facebook.com/settings" }, { label: "LinkedIn", url: "linkedin.com/psettings" }].map((item) => (
                        <div key={item.label} className="p-4 rounded-lg" style={{ backgroundColor: "#f6f3f2" }}>
                          <span className="text-xs uppercase tracking-widest text-[#414943] block mb-1">{item.label}</span>
                          <span className="text-sm font-medium">{item.url}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-[#1a4a35] shrink-0 mt-1">gavel</span>
                  <div>
                    <strong className="text-[#003320] block mb-1">California Residents — Do Not Sell or Share.</strong>
                    The use of advertising and retargeting cookies constitutes &quot;sharing&quot; of personal information under the CCPA/CPRA. To opt out, email us at <span className="text-[#003320] underline font-semibold">info@NextCannaConnect.com</span> with the subject line &quot;Do Not Sell or Share My Information&quot; and we will disable advertising cookies associated with your account.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* 06 */}
          <section className="group">
            <div className="flex items-baseline gap-6 mb-4">
              <span className="text-4xl font-extrabold text-[#c0c9c1]/40 group-hover:text-[#003320]/20 transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>06</span>
              <h2 className="text-2xl font-bold text-[#003320] tracking-tight uppercase">Your California Privacy Rights</h2>
            </div>
            <div className="pl-14 text-[#414943] leading-relaxed text-lg">
              <p>Under the CCPA/CPRA, California residents have the right to opt out of the sale or sharing of personal information collected through cookies and tracking technologies. Advertising cookies and social pixels on our Site involve the sharing of data with third-party advertising partners, which may constitute &quot;sharing&quot; under California law. To exercise your opt-out right, contact us at <span className="text-[#003320] underline font-semibold">info@NextCannaConnect.com</span> with the subject line &quot;Do Not Sell or Share My Information.&quot;</p>
            </div>
          </section>

          {/* 07 */}
          <section className="group">
            <div className="flex items-baseline gap-6 mb-4">
              <span className="text-4xl font-extrabold text-[#c0c9c1]/40 group-hover:text-[#003320]/20 transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>07</span>
              <h2 className="text-2xl font-bold text-[#003320] tracking-tight uppercase">Updates to This Cookie Policy</h2>
            </div>
            <div className="pl-14 text-[#414943] leading-relaxed text-lg">
              <p>We may update this Cookie Policy from time to time to reflect changes in the technologies we use or applicable legal requirements. The &quot;Last Updated&quot; date at the top of this page will reflect any revisions. Material changes will be communicated consistent with our Privacy Policy update procedures.</p>
            </div>
          </section>

          {/* 08 Contact */}
          <section className="group p-12 rounded-2xl text-white" style={{ backgroundColor: "#1a4a35" }}>
            <div className="flex items-baseline gap-6 mb-6">
              <span className="text-4xl font-extrabold" style={{ fontFamily: "'Noto Serif', serif", color: "rgba(255,255,255,0.2)" }}>08</span>
              <h2 className="text-2xl font-bold tracking-tight uppercase">Contact Us</h2>
            </div>
            <div className="pl-14 space-y-2">
              <p className="text-lg font-bold">NextCanna, LLC</p>
              <p className="flex items-center gap-2" style={{ color: "#88b99e" }}>
                <span className="material-symbols-outlined text-sm">mail</span>
                info@NextCannaConnect.com
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
