import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | NextCanna Connect",
  description:
    "Founded on the principle of institutional excellence, NextCanna Connect was born from the necessity of structure in a rapidly evolving market.",
};

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fbf9f8", color: "#1b1c1c" }}>

      {/* Cinematic Hero */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ height: "870px", backgroundColor: "#003320" }}
      >
        <img
          src="https://picsum.photos/seed/lab-interior/1600/870"
          alt="Professional laboratory"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.6, mixBlendMode: "luminosity" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, #003320 0%, rgba(0,51,32,0.4) 50%, transparent 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-8 pb-24 w-full">
          <div style={{ maxWidth: "750px" }}>
            <span
              className="block mb-4 text-sm uppercase"
              style={{ color: "#88b99e", letterSpacing: "0.2em", fontFamily: "'Inter', sans-serif" }}
            >
              Institutional Standard
            </span>
            <h1
              className="font-bold leading-tight mb-8"
              style={{
                fontFamily: "'Noto Serif', serif",
                color: "#ffffff",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              }}
            >
              The Mission Behind NextCanna.
            </h1>
            <div style={{ width: "96px", height: "4px", backgroundColor: "#88b99e" }} />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24" style={{ backgroundColor: "#fbf9f8" }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left col */}
            <div className="lg:col-span-5">
              <h2
                className="font-bold mb-6"
                style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.875rem", color: "#003320" }}
              >
                Our Story
              </h2>
              <p className="leading-relaxed mb-8" style={{ color: "#78716c" }}>
                Founded on the principle of institutional excellence, NextCanna Connect was born from
                the necessity of structure in a rapidly evolving market.
              </p>
              <div className="relative group">
                <div
                  className="absolute rounded-xl transition-all"
                  style={{
                    inset: "-16px",
                    backgroundColor: "rgba(0,51,32,0.05)",
                  }}
                />
                <img
                  src="https://picsum.photos/seed/corporate-meeting/800/600"
                  alt="Corporate meeting room"
                  className="relative rounded-lg shadow-2xl w-full object-cover"
                  style={{ aspectRatio: "4/3" }}
                />
              </div>
            </div>

            {/* Right col */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="space-y-8">
                <p
                  className="font-light leading-snug"
                  style={{ fontSize: "1.5rem", color: "#1b1c1c" }}
                >
                  Building a business in the cannabis space is{" "}
                  <span className="font-semibold" style={{ color: "#003320" }}>
                    harder than it should be
                  </span>
                  .
                </p>
                <p className="leading-relaxed text-lg text-justify" style={{ color: "#6b7280", fontSize: "1.125rem" }}>
                  Not because of a lack of opportunity—but because the industry is fragmented,
                  relationship-driven, and often lacks the transparency required for
                  institutional-grade growth.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div>
                    <p className="leading-relaxed" style={{ color: "#6b7280" }}>
                      We experienced this firsthand. The barriers to entry weren&apos;t just
                      regulatory; they were structural. Information was siloed, and trust was
                      difficult to verify at scale.
                    </p>
                  </div>
                  <div>
                    <p className="leading-relaxed" style={{ color: "#6b7280" }}>
                      We built NextCanna Connect to create what we wish existed when we started. A
                      platform where legitimacy is the baseline and connectivity is seamless.
                    </p>
                  </div>
                </div>
                <div
                  className="pt-6 text-sm italic"
                  style={{
                    borderTop: "1px solid rgba(120,113,108,0.2)",
                    color: "#a8a29e",
                  }}
                >
                  (Special thanks to Mike and the United team.)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-24" style={{ backgroundColor: "#f6f3f2" }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16">
            <h2
              className="font-bold mb-4"
              style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.25rem", color: "#003320" }}
            >
              Our Commitment
            </h2>
            <p style={{ color: "#6b7280", maxWidth: "672px" }}>
              Setting the global benchmark for sovereign trade through clarity and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission card — spans 2 cols */}
            <div
              className="md:col-span-2 p-12 rounded-xl flex flex-col justify-between relative overflow-hidden"
              style={{ backgroundColor: "#003320" }}
            >
              <div
                className="absolute top-0 right-0 p-8"
                style={{ opacity: 0.1 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "9rem", color: "#ffffff" }}>
                  hub
                </span>
              </div>
              <div className="relative" style={{ zIndex: 1 }}>
                <span
                  className="block mb-6 text-xs uppercase"
                  style={{ color: "#88b99e", letterSpacing: "0.2em" }}
                >
                  The Goal
                </span>
                <p
                  className="leading-relaxed"
                  style={{
                    fontFamily: "'Noto Serif', serif",
                    color: "#ffffff",
                    fontSize: "1.875rem",
                  }}
                >
                  Our goal is simple—bring clarity, accountability, and real connectivity to the
                  global marketplace.
                </p>
              </div>
              <div
                className="relative mt-12 flex items-center space-x-4"
                style={{ zIndex: 1 }}
              >
                <div
                  className="h-px flex-grow"
                  style={{ backgroundColor: "rgba(136,185,158,0.3)" }}
                />
                <span className="text-xs" style={{ color: "#88b99e" }}>
                  EST. 2024
                </span>
              </div>
            </div>

            {/* Absolute Clarity */}
            <div
              className="p-8 rounded-xl flex flex-col items-start shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "0.5px solid rgba(113,121,115,0.15)",
              }}
            >
              <div
                className="flex items-center justify-center rounded mb-6"
                style={{ width: "48px", height: "48px", backgroundColor: "rgba(0,51,32,0.05)" }}
              >
                <span className="material-symbols-outlined" style={{ color: "#003320" }}>
                  visibility
                </span>
              </div>
              <h3
                className="font-bold mb-4"
                style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem" }}
              >
                Absolute Clarity
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                Removing the haze of fragmented markets by providing clear, real-time data and
                verified partner networks.
              </p>
            </div>

            {/* Accountability */}
            <div
              className="p-8 rounded-xl flex flex-col items-start shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "0.5px solid rgba(113,121,115,0.15)",
              }}
            >
              <div
                className="flex items-center justify-center rounded mb-6"
                style={{ width: "48px", height: "48px", backgroundColor: "rgba(0,51,32,0.05)" }}
              >
                <span className="material-symbols-outlined" style={{ color: "#003320" }}>
                  verified_user
                </span>
              </div>
              <h3
                className="font-bold mb-4"
                style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem" }}
              >
                Accountability
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                Rigorous compliance protocols and governance frameworks that ensure every
                transaction meets institutional standards.
              </p>
            </div>

            {/* Real Connectivity */}
            <div
              className="p-8 rounded-xl flex flex-col items-start shadow-sm"
              style={{
                backgroundColor: "#ffffff",
                border: "0.5px solid rgba(113,121,115,0.15)",
              }}
            >
              <div
                className="flex items-center justify-center rounded mb-6"
                style={{ width: "48px", height: "48px", backgroundColor: "rgba(0,51,32,0.05)" }}
              >
                <span className="material-symbols-outlined" style={{ color: "#003320" }}>
                  handshake
                </span>
              </div>
              <h3
                className="font-bold mb-4"
                style={{ fontFamily: "'Noto Serif', serif", fontSize: "1.25rem" }}
              >
                Real Connectivity
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                Bridging the gap between sovereign production and global demand with a seamless
                trade infrastructure.
              </p>
            </div>

            {/* Image */}
            <div className="relative rounded-xl overflow-hidden group">
              <img
                src="https://picsum.photos/seed/skyscraper-dark/600/500"
                alt="Modern architecture"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(0,51,32,0.2)", mixBlendMode: "overlay" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center" style={{ backgroundColor: "#fbf9f8" }}>
        <div className="max-w-4xl mx-auto px-8">
          <h2
            className="font-bold mb-8"
            style={{ fontFamily: "'Noto Serif', serif", fontSize: "2.25rem", color: "#003320" }}
          >
            Join the Standard.
          </h2>
          <p
            className="text-lg mb-12 mx-auto"
            style={{ color: "#6b7280", maxWidth: "672px" }}
          >
            Experience the future of the industry with a partner dedicated to your institutional
            success.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold tracking-wide transition-all hover:opacity-90"
              style={{ backgroundColor: "#003320", color: "#ffffff" }}
            >
              Apply for Access
            </Link>
            <Link
              href="/directory"
              className="w-full sm:w-auto px-8 py-4 rounded-lg font-semibold tracking-wide transition-all"
              style={{ backgroundColor: "#e4e2e1", color: "#003320" }}
            >
              Inquire for Solutions
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
