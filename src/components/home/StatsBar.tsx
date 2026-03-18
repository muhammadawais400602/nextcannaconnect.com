"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Users, LayoutGrid, Globe } from "lucide-react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: React.ReactNode;
}

const STATS: Stat[] = [
  { value: 50000, suffix: "+", label: "Licensed Businesses", icon: <Building2 size={20} style={{ color: "#1A4A35" }} /> },
  { value: 20000, suffix: "+", label: "Verified Vendors", icon: <Users size={20} style={{ color: "#1A4A35" }} /> },
  { value: 12, suffix: "", label: "Industry Categories", icon: <LayoutGrid size={20} style={{ color: "#1A4A35" }} /> },
  { value: 2, suffix: "", label: "Countries (US & Canada)", icon: <Globe size={20} style={{ color: "#1A4A35" }} /> },
];

function useCountUp(target: number, duration: number = 1400, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ stat, animate }: { stat: Stat; animate: boolean }) {
  const count = useCountUp(stat.value, 1400, animate);
  const display = animate ? count : stat.value;
  const formatted = display >= 1000 ? (display / 1000).toFixed(0) + "K" : display.toString();

  return (
    <div className="flex flex-col items-center text-center px-8 py-6">
      <div
        className="flex items-center justify-center rounded-xl mb-3"
        style={{ width: "44px", height: "44px", backgroundColor: "rgba(26,74,53,0.08)" }}
      >
        {stat.icon}
      </div>
      <span
        className="font-extrabold"
        style={{ fontSize: "26px", color: "#111827", fontWeight: 800, lineHeight: 1.1 }}
      >
        {formatted}{stat.suffix}
      </span>
      <span style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px", fontWeight: 500 }}>
        {stat.label}
      </span>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full"
      style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}
    >
      <div
        className="mx-auto grid grid-cols-2 md:grid-cols-4"
        style={{ maxWidth: "1180px" }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            style={{
              borderRight: i < STATS.length - 1 ? "1px solid #E5E7EB" : "none",
              borderBottom: "none",
            }}
          >
            <StatItem stat={stat} animate={animated} />
          </div>
        ))}
      </div>
    </div>
  );
}
