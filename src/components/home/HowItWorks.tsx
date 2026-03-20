"use client";

import { Search, Filter, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

const STEPS = [
  {
    number: "01",
    icon: <Search size={22} style={{ color: "#1A4A35" }} />,
    title: "Search by Category",
    description:
      "Browse 12 cannabis industry verticals — from cultivation to compliance. Filter by state, service type, or business tier.",
  },
  {
    number: "02",
    icon: <Filter size={22} style={{ color: "#1A4A35" }} />,
    title: "Filter & Compare",
    description:
      "Review detailed profiles, credentials, certifications, service areas, and tier verifications side by side.",
  },
  {
    number: "03",
    icon: <Eye size={22} style={{ color: "#1A4A35" }} />,
    title: "Review Full Profiles",
    description:
      "Explore company overviews, case studies, product lines, ratings, and verified credentials in one place.",
  },
  {
    number: "04",
    icon: <MessageSquare size={22} style={{ color: "#1A4A35" }} />,
    title: "Connect Directly",
    description:
      "Submit a direct inquiry, schedule a meeting, or reach out via the built-in lead form — fast and simple.",
  },
];

const DELAYS = [0, 100, 200, 300];

export default function HowItWorks() {
  const [headerRef, headerInView] = useInView();
  const [gridRef, gridInView] = useInView();

  return (
    <section id="how-it-works" className="py-20 px-6" style={{ backgroundColor: "#F8FAF8" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>

        {/* Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-14"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <span className="section-label">Simple Process</span>
          <h2 className="section-title">Finding a Partner Is Simple</h2>
          <p style={{ color: "#6B7280", fontSize: "16px", marginTop: "10px", maxWidth: "500px", margin: "10px auto 0" }}>
            NextCanna Connect makes B2B discovery fast, transparent, and credible.
          </p>
        </div>

        {/* Steps */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="relative rounded-2xl p-7 flex flex-col gap-4"
              style={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                opacity: gridInView ? 1 : 0,
                transform: gridInView ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${DELAYS[i]}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${DELAYS[i]}ms`,
              }}
            >
              {/* Number + Icon */}
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width: "48px",
                    height: "48px",
                    backgroundColor: "rgba(26,74,53,0.08)",
                  }}
                >
                  {step.icon}
                </div>
                <span
                  className="font-black"
                  style={{ fontSize: "36px", color: "#F3F4F6", lineHeight: 1, fontWeight: 900 }}
                >
                  {step.number}
                </span>
              </div>

              {/* Text */}
              <div>
                <h3
                  className="font-bold mb-2"
                  style={{ fontSize: "16px", color: "#111827", fontWeight: 700 }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.65 }}>
                  {step.description}
                </p>
              </div>

              {/* Connector arrow (not last) */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 font-bold"
                  style={{ color: "#D1D5DB", fontSize: "20px" }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          className="text-center mt-12"
          style={{
            opacity: gridInView ? 1 : 0,
            transform: gridInView ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1) 400ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) 400ms",
          }}
        >
          <Link href="/directory" className="btn-primary" style={{ fontSize: "14px" }}>
            Start Searching Now
          </Link>
        </div>
      </div>
    </section>
  );
}
