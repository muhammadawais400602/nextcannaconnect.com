"use client";

import { useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Company } from "@/types";
import FiltersPanel from "@/components/directory/FiltersPanel";
import DirectoryListings from "@/components/directory/DirectoryListings";

interface Props {
  companies: Company[];
}

export default function DirectoryContent({ companies }: Props) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const [verificationFilters, setVerificationFilters] = useState<string[]>([]);
  const [serviceFilters, setServiceFilters] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  function handleCategoryChange(slug: string | null) {
    setSelectedCategory(slug);
    setServiceFilters([]);
  }

  const activeFilterCount =
    verificationFilters.length + serviceFilters.length + (selectedCategory ? 1 : 0);

  return (
    <>
      {/* Mobile filter drawer overlay */}
      {mobileFiltersOpen && (
        <div
          onClick={() => setMobileFiltersOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 100,
            animation: "fadeOverlay 0.2s ease",
          }}
        />
      )}

      {/* Mobile filter drawer panel — flex column so button never overlaps */}
      <div
        className="mobile-filter-drawer"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "300px",
          maxWidth: "85vw",
          backgroundColor: "white",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          transform: mobileFiltersOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: mobileFiltersOpen ? "4px 0 24px rgba(0,0,0,0.15)" : "none",
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px 14px",
            flexShrink: 0,
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#111827",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Filters
          </span>
          <button
            onClick={() => setMobileFiltersOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
          </button>
        </div>

        {/* Scrollable filters area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <FiltersPanel
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            verificationFilters={verificationFilters}
            onVerificationChange={setVerificationFilters}
            serviceFilters={serviceFilters}
            onServiceChange={setServiceFilters}
          />
        </div>

        {/* Sticky footer button */}
        <div
          style={{
            padding: "12px 20px 16px",
            flexShrink: 0,
            borderTop: "1px solid #f3f4f6",
            backgroundColor: "white",
          }}
        >
          <button
            onClick={() => setMobileFiltersOpen(false)}
            style={{
              width: "100%",
              backgroundColor: "#003320",
              color: "white",
              border: "none",
              borderRadius: "10px",
              padding: "13px",
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "0.05em",
              cursor: "pointer",
            }}
          >
            Show Results
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
        {/* Desktop sidebar */}
        <div className="hidden lg:block" style={{ width: "220px", flexShrink: 0 }}>
          <FiltersPanel
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            verificationFilters={verificationFilters}
            onVerificationChange={setVerificationFilters}
            serviceFilters={serviceFilters}
            onServiceChange={setServiceFilters}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Suspense
            fallback={
              <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
                Loading listings…
              </div>
            }
          >
            <DirectoryListings
              companies={companies}
              categoryFilter={selectedCategory}
              verificationFilters={verificationFilters}
              serviceFilters={serviceFilters}
              onMobileFiltersOpen={() => setMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
            />
          </Suspense>
        </div>
      </div>

      <style>{`
        @keyframes fadeOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (min-width: 1024px) {
          .mobile-filter-drawer {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
