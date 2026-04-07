import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "General Disclaimer | NextCanna Connect",
  description: "NextCanna Connect General Disclaimer — legal terms governing your professional engagement with the B2B ecosystem.",
};

export default function DisclaimerPage() {
  return (
    <div style={{ backgroundColor: "#fbf9f8", fontFamily: "'Inter', sans-serif" }} className="text-[#1b1c1c]">
      <main className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">

        {/* Hero */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold mb-6" style={{ backgroundColor: "#cfe2f9", color: "#526478" }}>
            Institutional Terminal
          </div>
          <h1 className="text-5xl md:text-6xl text-[#003320] leading-tight mb-4 tracking-tighter" style={{ fontFamily: "'Noto Serif', serif" }}>
            NEXTCANNA CONNECT<br />GENERAL DISCLAIMER
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-[#414943] text-sm uppercase tracking-wide">
            <span>Effective Date: April 1, 2026</span>
            <span className="hidden md:block text-[#c0c9c1]">|</span>
            <span>Last Updated: April 1, 2026</span>
          </div>
        </header>

        {/* Content card */}
        <div className="bg-white p-8 md:p-16 rounded-lg" style={{ border: "0.5px solid rgba(192, 201, 193, 0.3)" }}>

          {/* Intro */}
          <div className="mb-12 pb-12" style={{ borderBottom: "0.5px solid rgba(192, 201, 193, 0.3)" }}>
            <p className="text-xl italic leading-relaxed text-[#003320]" style={{ fontFamily: "'Noto Serif', serif" }}>
              The following legal terms govern your professional engagement with the NextCanna Connect B2B ecosystem. Please review these disclosures carefully before proceeding with trade operations.
            </p>
          </div>

          {/* Section 1 */}
          <section>
            <h2 className="text-[1.75rem] text-[#003320] mt-12 mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>1. General Notice</h2>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              The information contained on the NextCanna Connect website and platform (collectively, the &quot;Site&quot;) is provided by NextCanna, LLC for general informational and business networking purposes only. Nothing on this Site constitutes legal, financial, regulatory, medical, or professional advice of any kind. Use of this Site does not create any professional relationship — including attorney-client, financial advisor-client, or consultant-client — between you and NextCanna, LLC or any of its employees, agents, or representatives.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-[1.75rem] text-[#003320] mt-12 mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>2. No Endorsement of Users or Listings</h2>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              NextCanna Connect is a B2B marketplace and partner discovery platform. The presence of any business, product, service, or individual on this platform does not constitute an endorsement, recommendation, verification, or guarantee by NextCanna, LLC. We do not independently verify the accuracy of User-submitted profiles, listings, credentials, or claims.
            </p>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              You are solely responsible for conducting your own due diligence before entering into any business relationship with any party you discover through this platform. NextCanna Connect assumes no liability for the conduct, representations, or performance of any User or third party listed on or connected through the platform.
            </p>
          </section>

          {/* Image break */}
          <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: "16/9", border: "0.5px solid rgba(192, 201, 193, 0.3)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="object-cover w-full h-full"
                style={{ filter: "grayscale(0.3)" }}
                src="https://picsum.photos/seed/nextcanna-disclaimer/600/400"
                alt="Professional workspace"
              />
            </div>
            <div className="pl-0 md:pl-8">
              <span className="material-symbols-outlined text-[#1a4a35] text-4xl mb-4 block">gavel</span>
              <p className="text-lg italic text-[#003320] leading-snug" style={{ fontFamily: "'Noto Serif', serif" }}>
                &quot;Compliance is the cornerstone of sustainable growth in the sovereign marketplace.&quot;
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <section>
            <h2 className="text-[1.75rem] text-[#003320] mt-12 mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>3. Cannabis Industry and Regulatory Disclaimer</h2>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              Cannabis and cannabis-derived products remain controlled substances under federal law in the United States. Laws governing the cultivation, manufacture, distribution, sale, and use of cannabis vary significantly by state and locality and are subject to change without notice. Nothing on this Site should be construed as legal advice regarding cannabis licensing, compliance, or regulatory requirements in any jurisdiction.
            </p>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              Users are solely responsible for ensuring that their business activities comply with all applicable federal, state, and local laws and regulations. NextCanna Connect does not facilitate, promote, or enable any unlicensed cannabis activity. Participation on this platform is limited to licensed cannabis businesses and lawful ancillary service providers.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-[1.75rem] text-[#003320] mt-12 mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>4. Product and Efficacy Disclaimer</h2>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              To the extent that any product information, descriptions, or claims appear on this platform — whether submitted by NextCanna Connect or by a third-party User — such content is provided for informational purposes only and has not been evaluated by the U.S. Food and Drug Administration (FDA) or any other regulatory body. No product or service listed on this platform is intended to diagnose, treat, cure, or prevent any disease or medical condition.
            </p>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              NextCanna Connect makes no representations regarding the safety, efficacy, quality, or legality of any product or service listed on the platform. Reliance on any product information found on this Site is solely at your own risk.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-[1.75rem] text-[#003320] mt-12 mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>5. Third-Party Content and Links</h2>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              This Site may contain links to third-party websites, resources, and services. These links are provided for convenience only. NextCanna Connect does not control, endorse, or accept responsibility for any content, privacy practices, or terms of any third-party site. Accessing third-party links is done entirely at your own risk.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-[1.75rem] text-[#003320] mt-12 mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>6. Accuracy and Currency of Information</h2>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              While we make reasonable efforts to keep information on this Site accurate and current, NextCanna Connect makes no representations or warranties — express or implied — regarding the completeness, accuracy, reliability, or timeliness of any content on the Site. Information may be changed or updated without notice.
            </p>
          </section>

          {/* Section 7 - Highlighted */}
          <section className="p-8 rounded-lg mt-12" style={{ backgroundColor: "#f6f3f2", border: "0.5px solid rgba(192, 201, 193, 0.3)" }}>
            <h2 className="text-[1.75rem] text-[#003320] mt-0 mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>7. Limitation of Liability</h2>
            <p className="font-bold text-[#003320] uppercase text-xs tracking-widest mb-4 opacity-70">Notice of Limitation</p>
            <p className="font-medium text-[#1b1c1c] leading-[1.75] text-base">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEXTCANNA, LLC SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR RELIANCE ON THIS SITE OR ANY CONTENT CONTAINED HEREIN. THIS INCLUDES, WITHOUT LIMITATION, DAMAGES FOR LOST PROFITS, LOST DATA, BUSINESS INTERRUPTION, OR ANY OTHER COMMERCIAL LOSS.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-[1.75rem] text-[#003320] mt-12 mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>8. Governing Law</h2>
            <p className="text-[#414943] leading-[1.75] text-base mb-6">
              This Disclaimer is governed by the laws of the State of Connecticut. Any disputes arising in connection with this Disclaimer are subject to the dispute resolution and arbitration provisions set forth in NextCanna Connect&apos;s Terms of Service.
            </p>
          </section>

          {/* Contact footer */}
          <footer className="mt-20 pt-12" style={{ borderTop: "0.5px solid rgba(192, 201, 193, 0.3)" }}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <h3 className="text-2xl text-[#003320] mb-2" style={{ fontFamily: "'Noto Serif', serif" }}>Contact NextCanna, LLC</h3>
                <p className="text-[#414943]">Institutional Support Team</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-tighter text-[#717973]">Direct Inquiries</span>
                <Link
                  href="mailto:info@NextCannaConnect.com"
                  className="text-xl text-[#003320] hover:border-[#003320] transition-all"
                  style={{ fontFamily: "'Noto Serif', serif", borderBottom: "1px solid rgba(0,51,32,0.2)" }}
                >
                  info@NextCannaConnect.com
                </Link>
              </div>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}
