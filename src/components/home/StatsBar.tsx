"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  display: string;
  label: string;
}

const STATS: Stat[] = [
  { display: "50k+", label: "Global\nBusinesses" },
  { display: "20k+", label: "Verified\nVendors" },
  { display: "$4.2B", label: "Transaction\nVolume" },
  { display: "12", label: "Regulatory\nNodes" },
];

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "#1a4a35",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "32px 32px",
      }}
    >
      <div
        className="flex flex-wrap justify-between items-center gap-8 mx-auto"
        style={{ maxWidth: "1440px" }}
      >
        {STATS.map((stat, i) => (
          <div key={i} className="flex items-center gap-5">
            <span
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "clamp(28px, 3vw, 40px)",
                fontWeight: 700,
                color: "#88b99e",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
              }}
            >
              {stat.display}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(136,185,158,0.5)",
                lineHeight: 1.5,
                whiteSpace: "pre-line",
                opacity: inView ? 1 : 0,
                transition: `opacity 0.6s ease ${i * 100 + 50}ms`,
              }}
            >
              {stat.label}
            </span>
            {i < STATS.length - 1 && (
              <div
                className="hidden md:block"
                style={{ width: "1px", height: "32px", backgroundColor: "rgba(255,255,255,0.08)", marginLeft: "12px" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
