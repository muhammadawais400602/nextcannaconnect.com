"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { useState } from "react";
import { CATEGORIES } from "@/data/categories";

const US_STATES = [
  "All States", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
  "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

const POPULAR_CATEGORIES = [
  "Cultivation & Growing",
  "Extraction & Processing",
  "Compliance & Legal",
  "Technology & Software",
  "Retail & Dispensary",
];

export default function HeroSection() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");

  function handleSearch() {
    const path = category ? `/directory/${category}` : "/directory";
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    const qs = params.toString();
    router.push(qs ? `${path}?${qs}` : path);
  }

  return (
    <section className="w-full" style={{ backgroundColor: "#F8FAF8", borderBottom: "1px solid #E5E7EB" }}>
      <div
        className="mx-auto px-6 py-20 flex flex-col items-center text-center"
        style={{ maxWidth: "800px" }}
      >
        {/* Tag */}
        <span
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold mb-6 animate-fade-in"
          style={{ animationDelay: "0ms" }}
          style={{
            backgroundColor: "rgba(26,74,53,0.08)",
            color: "#1A4A35",
            fontSize: "13px",
            border: "1px solid rgba(26,74,53,0.15)",
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: "7px", height: "7px", backgroundColor: "#5CB85C" }}
          />
          The Verified Cannabis B2B Marketplace
        </span>

        {/* Headline */}
        <h1
          className="font-extrabold mb-5 leading-tight animate-fade-in-up"
          style={{
            animationDelay: "80ms",
            fontSize: "clamp(36px, 5.5vw, 54px)",
            color: "#111827",
            fontWeight: 900,
            letterSpacing: "-1.5px",
          }}
        >
          Find Trusted Cannabis{" "}
          <span style={{ color: "#1A4A35" }}>Industry Partners</span>
        </h1>

        <p
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: "160ms",
            color: "#6B7280",
            fontSize: "18px",
            lineHeight: 1.65,
            maxWidth: "560px",
          }}
        >
          Connect with verified manufacturers, consultants, labs, and service providers
          across 12 cannabis industry categories.
        </p>

        {/* Search Card */}
        <div
          className="w-full rounded-2xl p-2 flex flex-col sm:flex-row gap-2 animate-fade-in-up"
          style={{
            animationDelay: "240ms",
            backgroundColor: "white",
            boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
            border: "1px solid #E5E7EB",
            maxWidth: "680px",
          }}
        >
          {/* Category selector */}
          <div className="flex-1 relative">
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#F8FAF8", border: "1px solid #E5E7EB" }}
            >
              <Search size={16} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 bg-transparent outline-none appearance-none cursor-pointer"
                style={{ fontSize: "14px", color: category ? "#111827" : "#9CA3AF", border: "none" }}
              >
                <option value="">Browse by category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />
            </div>
          </div>

          {/* State selector */}
          <div className="sm:w-44 relative">
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#F8FAF8", border: "1px solid #E5E7EB" }}
            >
              <MapPin size={16} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="flex-1 bg-transparent outline-none appearance-none cursor-pointer"
                style={{ fontSize: "14px", color: state ? "#111827" : "#9CA3AF", border: "none" }}
              >
                {US_STATES.map((s) => (
                  <option key={s} value={s === "All States" ? "" : s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />
            </div>
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="btn-primary sm:flex-shrink-0 justify-center"
            style={{ fontSize: "14px", padding: "12px 24px", borderRadius: "10px" }}
          >
            <Search size={15} />
            Search
          </button>
        </div>

        {/* Popular quick links */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <span style={{ fontSize: "13px", color: "#9CA3AF", fontWeight: 500 }}>Popular:</span>
          {POPULAR_CATEGORIES.map((label) => {
            const cat = CATEGORIES.find((c) => c.label === label);
            return (
              <Link
                key={label}
                href={cat ? `/directory/${cat.slug}` : "/directory"}
                className="rounded-full transition-colors"
                style={{
                  fontSize: "13px",
                  color: "#374151",
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  padding: "4px 12px",
                  fontWeight: 500,
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
