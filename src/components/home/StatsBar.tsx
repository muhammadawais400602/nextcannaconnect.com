"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const STATS: Stat[] = [
  { value: 50000, suffix: "+", label: "Licensed Businesses" },
  { value: 20000, suffix: "+", label: "Verified Vendors" },
  { value: 12, suffix: "", label: "Industry Categories" },
  { value: 2, suffix: " Countries", label: "US & Canada" },
];

function useCountUp(target: number, duration: number = 1500, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

function StatItem({ stat, animate }: { stat: Stat; animate: boolean }) {
  const count = useCountUp(stat.value, 1500, animate);
  const display = animate ? count : stat.value;
  const formatted = display >= 1000 ? (display / 1000).toFixed(0) + "K" : display.toString();

  return (
    <div className="flex flex-col items-center text-center px-6">
      <span className="font-extrabold text-white" style={{ fontSize: "28px", fontWeight: 800 }}>
        {formatted}{stat.suffix}
      </span>
      <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px" }}>
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
    <div ref={ref} className="w-full py-5" style={{ backgroundColor: "#F7941D" }}>
      <div
        className="mx-auto flex flex-wrap justify-center divide-x"
        style={{ maxWidth: "1100px" }}
      >
        {STATS.map((stat, i) => (
          <StatItem key={i} stat={stat} animate={animated} />
        ))}
      </div>
    </div>
  );
}
