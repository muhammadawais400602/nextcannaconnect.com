import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | NextCanna Connect",
  description: "Terms of Service governing the NextCanna Connect B2B enterprise marketplace ecosystem.",
};

export default function TermsPage() {
  return (
    <div className="text-[#1b1c1c]" style={{ backgroundColor: "#fbf9f8", fontFamily: "'Inter', sans-serif" }}>
      <main className="pt-32 pb-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <div className="mb-16">
            <span className="text-[#003320] font-medium tracking-[0.2em] text-[0.6875rem] uppercase mb-4 block">
              Legal Framework
            </span>
            <h1 className="text-[3.5rem] leading-[1.1] text-[#003320] mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>
              Terms of Service
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-[#414943]">
              <p className="text-[0.875rem] border-l-2 border-[#1a4a35] pl-4 italic">
                Governing the B2B enterprise marketplace ecosystem.
              </p>
              <span className="hidden md:block w-1 h-1 rounded-full bg-[#c0c9c1]"></span>
              <p className="text-[0.875rem] font-medium">Effective Date: April 1, 2026</p>
            </div>
          </div>

          {/* Content card */}
          <article className="bg-white p-8 md:p-16 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32" style={{ backgroundColor: "rgba(26,74,53,0.05)", filter: "blur(80px)" }}></div>
            <div className="relative z-10">
              <p className="text-[1rem] leading-relaxed text-[#414943] mb-12">
                Welcome to NextCanna Connect. These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User,&quot; &quot;you,&quot; or &quot;your&quot;) and NextCanna Connect (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) governing your access to and use of our B2B marketplace platform and associated enterprise services.
              </p>

              {/* Section 1 */}
              <section className="mb-12">
                <h2 className="text-[1.75rem] text-[#003320] mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>1. Eligibility and Registration</h2>
                <div className="space-y-4 text-[#414943] leading-relaxed text-[0.875rem]">
                  <p>Access to the NextCanna Connect platform is restricted to authorized commercial entities operating within legally compliant jurisdictions. By registering, you represent that you have the legal authority to bind your organization.</p>
                  <ul className="list-none space-y-3 pl-0">
                    <li className="flex gap-4">
                      <span className="text-[#1a4a35] font-bold">1.1</span>
                      <span>Verification: We reserve the right to verify licenses and tax documentation prior to account activation.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-[#1a4a35] font-bold">1.2</span>
                      <span>Security: Users are responsible for maintaining the confidentiality of their credentials.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="mb-12">
                <h2 className="text-[1.75rem] text-[#003320] mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>2. Marketplace Transactions</h2>
                <div className="space-y-4 text-[#414943] leading-relaxed text-[0.875rem]">
                  <p>The platform facilitates B2B transactions. NextCanna Connect acts as a platform provider and, unless explicitly stated otherwise, is not a party to the underlying commercial agreements between buyers and sellers.</p>
                  <div className="p-6 rounded-md border-l-4 border-[#003320]" style={{ backgroundColor: "#f6f3f2" }}>
                    <p className="italic">&quot;Compliance is the cornerstone of the NextCanna ecosystem. All trades must adhere to regional regulatory requirements.&quot;</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="mb-12">
                <h2 className="text-[1.75rem] text-[#003320] mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>3. Compliance and Regional Laws</h2>
                <div className="space-y-4 text-[#414943] leading-relaxed text-[0.875rem]">
                  <p>Users must comply with all local, state, and international regulations pertaining to their specific product categories. Our automated compliance tracking tools are provided for convenience but do not substitute for professional legal counsel.</p>
                  <ul className="list-none space-y-3 pl-0">
                    <li className="flex gap-4">
                      <span className="text-[#1a4a35] font-bold">3.1</span>
                      <span>Documentation: All necessary shipping manifests and compliance certificates must be uploaded to the secure vault.</span>
                    </li>
                    <li className="flex gap-4">
                      <span className="text-[#1a4a35] font-bold">3.2</span>
                      <span>Reporting: Suspected fraudulent activity must be reported immediately via the Support hub.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="mb-12">
                <h2 className="text-[1.75rem] text-[#003320] mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>4. Intellectual Property</h2>
                <div className="space-y-4 text-[#414943] leading-relaxed text-[0.875rem]">
                  <p>All software, branding, data visualization techniques, and proprietary algorithms used on the platform are the exclusive property of NextCanna Connect. Users are granted a limited, revocable license to access these tools for commercial use.</p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-12">
                <h2 className="text-[1.75rem] text-[#003320] mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>5. Limitation of Liability</h2>
                <div className="space-y-4 text-[#414943] leading-relaxed text-[0.875rem]">
                  <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEXTCANNA CONNECT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM.</p>
                </div>
              </section>

              {/* CTA */}
              <div className="mt-20 pt-12 border-t border-[#c0c9c1]/20 flex flex-col items-center text-center">
                <p className="text-[#414943] text-[0.875rem] mb-6">Have questions regarding our enterprise terms?</p>
                <Link
                  href="/contact"
                  className="text-white px-8 py-3 rounded-md font-medium text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "#003320" }}
                >
                  Contact Legal Support
                </Link>
              </div>
            </div>
          </article>

          {/* Commitment to Transparency */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-xl overflow-hidden group" style={{ aspectRatio: "4/3" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Modern corporate office architecture"
                className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
                src="https://picsum.photos/seed/nextcanna-tos/600/450"
              />
              <div className="absolute inset-0 bg-[#003320]/20 mix-blend-overlay"></div>
            </div>
            <div className="pl-0 md:pl-8">
              <h3 className="text-[1.5rem] text-[#003320] mb-4" style={{ fontFamily: "'Noto Serif', serif" }}>Our Commitment to Transparency</h3>
              <p className="text-[#414943] text-[0.875rem] leading-relaxed mb-6">
                NextCanna Connect operates with a mandate of absolute clarity. Our terms are designed to protect both the integrity of the marketplace and the growth of your enterprise.
              </p>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#1a4a35]">verified_user</span>
                <span className="text-[0.6875rem] uppercase tracking-widest font-bold text-[#003320]">ISO 27001 Certified Infrastructure</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
