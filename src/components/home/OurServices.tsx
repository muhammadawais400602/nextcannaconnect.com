"use client";

import { useInView } from "@/hooks/useInView";

const SERVICE_ITEMS = [
  { icon: "verified_user", label: "Compliance Audits" },
  { icon: "domain", label: "Facility Design" },
  { icon: "gavel", label: "Legal Counsel" },
  { icon: "local_shipping", label: "Supply Chain Mgmt" },
];

export default function OurServices() {
  const [ref, inView] = useInView();

  return (
    <section
      className="relative py-14 md:py-24 px-4 md:px-8 overflow-hidden"
      style={{ backgroundColor: "#f6f3f2" }}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-24 relative z-10"
        style={{ maxWidth: "1440px", margin: "0 auto" }}
      >
        {/* Left: Image */}
        <div
          className="w-full lg:w-1/2 relative"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-32px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
          }}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 24px 80px rgba(0,51,32,0.12)" }}
          >
            <div
              style={{
                height: "clamp(280px, 50vw, 520px)",
                background: "linear-gradient(145deg, #1a4a35 0%, #003320 50%, #001a10 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Grid pattern overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `
                    linear-gradient(rgba(136,185,158,0.07) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(136,185,158,0.07) 1px, transparent 1px)
                  `,
                  backgroundSize: "48px 48px",
                }}
              />
              {/* Content */}
              <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "32px" }}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "80px", color: "rgba(136,185,158,0.4)", display: "block", marginBottom: "16px" }}
                >
                  hub
                </span>
                <p
                  style={{
                    fontFamily: "'Noto Serif', serif",
                    fontSize: "22px",
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.75)",
                    lineHeight: 1.5,
                  }}
                >
                  17+ Core Service Modules
                </p>
                <p style={{ fontSize: "12px", color: "rgba(136,185,158,0.6)", marginTop: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Operational Infrastructure
                </p>

                {/* Service chips */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                  {["Compliance", "Logistics", "Legal", "Finance", "Branding", "HR"].map((chip) => (
                    <span
                      key={chip}
                      style={{
                        backgroundColor: "rgba(136,185,158,0.15)",
                        border: "1px solid rgba(136,185,158,0.25)",
                        color: "rgba(136,185,158,0.85)",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        padding: "6px 14px",
                        borderRadius: "100px",
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(0,51,32,0.2) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Decorative blur */}
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,51,32,0.08)",
              filter: "blur(60px)",
              zIndex: 0,
            }}
          />
        </div>

        {/* Right: Text */}
        <div
          className="w-full lg:w-1/2"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          <span className="section-label" style={{ marginBottom: "12px" }}>
            Operational Support
          </span>
          <h2
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(32px, 3.5vw, 48px)",
              fontWeight: 700,
              color: "#003320",
              lineHeight: 1.15,
              marginBottom: "32px",
            }}
          >
            Our Services{" "}
            <br />
            <span style={{ fontStyle: "italic", color: "#88b99e" }}>Suite</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "36px" }}>
            <p style={{ fontSize: "16px", color: "#414943", lineHeight: 1.75 }}>
              Beyond commerce, NextCanna Connect provides access to 17+ core service modules designed
              to optimize every facet of your business. From seed-to-sale compliance auditing to
              institutional-grade facility management, our vetted service providers offer the
              infrastructure you need to scale with confidence.
            </p>
            <p style={{ fontSize: "16px", color: "#414943", lineHeight: 1.75 }}>
              Our ecosystem covers everything from capital financing and legal counsel to advanced
              brand strategy and secure logistics. We don&apos;t just connect you to partners;
              we connect you to the essential utilities of the modern cannabis industry.
            </p>
          </div>

          {/* Checklist */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          >
            {SERVICE_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px", color: "#003320" }}
                >
                  check_circle
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#1b1c1c",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <button
            className="group flex items-center gap-3"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#003320",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Explore all 17+ Service Modules
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
