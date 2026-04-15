import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NextCanna Connect",
  description: "NextCanna Connect Privacy Policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="text-[#1b1c1c]" style={{ backgroundColor: "#fbf9f8" }}>

      {/* Hero */}
      <section className="w-full pt-32 pb-20 px-4 md:px-8 lg:px-16 max-w-5xl mx-auto">
        <div className="space-y-6">
          <span className="text-[#003320] font-medium tracking-widest text-[0.6875rem] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
            Legal Documentation
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-[#003320] tracking-tight leading-none" style={{ fontFamily: "'Noto Serif', serif" }}>
            Privacy Policy
          </h1>
          <p className="text-[#4e6073] text-lg max-w-2xl leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            Last updated: May 24, 2024. NextCanna Connect is committed to the highest standards of data integrity and regional compliance across the global marketplace.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full px-4 md:px-8 lg:px-16 max-w-5xl mx-auto pb-32">
        <div className="grid grid-cols-1 gap-16">

          {/* 01 Introduction */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-[#1a4a35]/20" style={{ fontFamily: "'Noto Serif', serif" }}>01</span>
              <h2 className="text-2xl font-bold text-[#003320]" style={{ fontFamily: "'Noto Serif', serif" }}>Introduction</h2>
            </div>
            <p className="text-[#414943] leading-loose text-[0.875rem]" style={{ fontFamily: "'Inter', sans-serif" }}>
              NextCanna Connect (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the NextCanna B2B Enterprise Marketplace. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from NextCanna. We recognize the sensitive nature of the cannabis industry and prioritize discreet, secure data handling protocols.
            </p>
          </div>

          {/* 02 Data Collection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 space-y-4" style={{ border: "0.5px solid rgba(192, 201, 193, 0.3)" }}>
              <div className="flex items-center gap-4 text-[#003320] mb-2">
                <span className="material-symbols-outlined">dataset</span>
                <span className="text-[0.6875rem] font-bold uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>Section 02</span>
              </div>
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif', serif" }}>Personal Information We Collect</h3>
              <p className="text-[#414943] text-[0.875rem] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
              </p>
            </div>
            <div className="bg-[#003320] text-white p-10 space-y-4 flex flex-col justify-center">
              <h3 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif', serif" }}>Operational Transparency</h3>
              <p className="text-[#88b99e] text-[0.875rem] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Our data collection is strictly limited to information necessary for facilitating high-stakes B2B transactions and maintaining regulatory compliance within regional jurisdictions.
              </p>
            </div>
          </div>

          {/* 03 & 04 */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="w-8 h-px bg-[#1a4a35] inline-block"></span>
                03. How we use your information
              </h3>
              <p className="text-[#414943] leading-loose text-[0.875rem] pl-11" style={{ fontFamily: "'Inter', sans-serif" }}>
                We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-3" style={{ fontFamily: "'Noto Serif', serif" }}>
                <span className="w-8 h-px bg-[#1a4a35] inline-block"></span>
                04. Sharing your personal information
              </h3>
              <p className="text-[#414943] leading-loose text-[0.875rem] pl-11" style={{ fontFamily: "'Inter', sans-serif" }}>
                We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store—you can read more about how Shopify uses your Personal Information here.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative w-full overflow-hidden group" style={{ height: "400px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/nextcanna-privacy-hero/1200/500"
              alt="Professional server room"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-[#003320]/20 mix-blend-multiply"></div>
            <div className="absolute bottom-8 right-8 bg-white p-8 max-w-sm shadow-sm" style={{ border: "0.5px solid rgba(192, 201, 193, 0.3)" }}>
              <p className="italic text-[#003320] text-lg" style={{ fontFamily: "'Noto Serif', serif" }}>&quot;Security is not a product, but a process.&quot;</p>
              <p className="text-[0.6875rem] mt-2 text-[#4e6073] font-bold uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>— Enterprise Standards</p>
            </div>
          </div>

          {/* 05–07 Three column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#c0c9c1]/20 pt-16">
            {[
              { n: "05. Behavioral Advertising", text: "As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you." },
              { n: "06. Do Not Track", text: "Please note that we do not alter our Site's data collection and use practices when we see a Do Not Track signal from your browser." },
              { n: "07. Your Rights", text: "If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted." },
            ].map((s) => (
              <div key={s.n} className="space-y-4">
                <h4 className="font-bold text-[#003320]" style={{ fontFamily: "'Noto Serif', serif" }}>{s.n}</h4>
                <p className="text-[0.875rem] text-[#414943] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{s.text}</p>
              </div>
            ))}
          </div>

          {/* 08–15 */}
          <div className="space-y-16 max-w-3xl">
            {[
              { n: "08. Data Retention", text: "When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information." },
              { n: "09. Changes to Policy", text: "We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons." },
              { n: "10. Minors", text: "The Site is not intended for individuals under the age of 21. We do not knowingly collect information from individuals under this legal threshold." },
              { n: "11. International Transfers", text: "Information may be transferred to and maintained on computers located outside of your state, province, country or other governmental jurisdiction." },
              { n: "12. Security of Data", text: "The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure." },
              { n: "13. Service Providers", text: "We may employ third party companies and individuals to facilitate our Service, to provide the Service on our behalf, or to perform Service-related services." },
              { n: "14. Links to Other Sites", text: "Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site." },
              { n: "15. Analytics", text: "We may use third-party Service Providers to monitor and analyze the use of our Service, specifically tracking supply chain efficiency." },
            ].map((s) => (
              <div key={s.n} className="space-y-4">
                <h3 className="text-xl font-bold" style={{ fontFamily: "'Noto Serif', serif" }}>{s.n}</h3>
                <p className="text-[#414943] text-[0.875rem] leading-loose" style={{ fontFamily: "'Inter', sans-serif" }}>{s.text}</p>
              </div>
            ))}
          </div>

          {/* 16–21 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { n: "16. Behavioral Remarketing", text: "NextCanna Connect uses remarketing services to advertise on third party websites to you after you visited our Service." },
              { n: "17. Payments Compliance", text: "We provide paid products and/or services within the Service. In that case, we use third-party services for payment processing." },
              { n: "18. GDPR Data Protection", text: "Our legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context." },
              { n: "19. CCPA Privacy Rights", text: "This section provides additional details about the personal information we collect about California consumers and the rights afforded to them." },
              { n: "20. Governing Law", text: "This Privacy Policy and our legal obligations are governed by the laws of the jurisdiction in which our headquarters reside." },
            ].map((s) => (
              <div key={s.n} className="p-8" style={{ border: "0.5px solid rgba(192, 201, 193, 0.3)", backgroundColor: "rgba(246, 243, 242, 0.3)" }}>
                <h4 className="font-bold text-[#003320] mb-4 uppercase text-[0.6875rem] tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>{s.n}</h4>
                <p className="text-[0.875rem] text-[#414943] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{s.text}</p>
              </div>
            ))}
            <div className="p-8 bg-[#003320] text-white" style={{ border: "0.5px solid rgba(192, 201, 193, 0.3)" }}>
              <h4 className="font-bold mb-4 uppercase text-[0.6875rem] tracking-tighter" style={{ fontFamily: "'Inter', sans-serif" }}>21. Contact Us</h4>
              <p className="text-[0.875rem] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us at compliance@nextcanna.connect
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
