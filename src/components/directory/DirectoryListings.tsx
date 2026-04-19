"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/directory/ListingCard";
import { Company } from "@/types";
import { getCategoryBySlug } from "@/data/categories";
import CustomDropdown from "@/components/ui/CustomDropdown";

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: "rating", label: "Rating" },
  { value: "name", label: "Name (A–Z)" },
];

// Maps filter checkbox IDs to the tiers they represent
const TIER_MAP: Record<string, string[]> = {
  "verified-pro": ["featured", "elite"],
  select:         ["claimed", "select"],
  unclaimed:      ["free"],
};

interface Props {
  companies: Company[];
  categoryFilter: string | null;
  verificationFilters: string[];
  serviceFilters: string[];
  onMobileFiltersOpen?: () => void;
  activeFilterCount?: number;
}

export default function DirectoryListings({ companies, categoryFilter, verificationFilters, serviceFilters, onMobileFiltersOpen, activeFilterCount = 0 }: Props) {
  const categoryShortLabel = categoryFilter ? (getCategoryBySlug(categoryFilter)?.shortLabel ?? "Partners") : "All Categories";
  const searchParams = useSearchParams();
  const initialState = searchParams.get("state") ?? "";
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [stateFilter, setStateFilter] = useState(initialState);
  const [sort, setSort] = useState("rating");
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [query, stateFilter, sort, verificationFilters, serviceFilters, categoryFilter]);

  const filtered = useMemo(() => {
    // Build allowed tiers from verification checkboxes
    const allowedTiers =
      verificationFilters.length > 0
        ? verificationFilters.flatMap((id) => TIER_MAP[id] ?? [])
        : null; // null = no filter applied

    let list = companies.filter((c) => {
      if (categoryFilter && c.category !== categoryFilter) return false;
      if (stateFilter && c.location.state !== stateFilter) return false;
      if (allowedTiers && !allowedTiers.includes(c.tier)) return false;
      if (serviceFilters.length > 0) {
        const tags = (c.serviceTags ?? []).map((t) => t.toLowerCase());
        const matches = serviceFilters.some((sf) =>
          tags.some((t) => t.includes(sf.toLowerCase()))
        );
        if (!matches) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.shortDescription?.toLowerCase().includes(q) ||
          c.serviceTags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return list;
  }, [companies, query, stateFilter, sort, verificationFilters, serviceFilters, categoryFilter]);

  const paid = filtered.filter((c) => c.tier !== "free");
  const free = filtered.filter((c) => c.tier === "free");

  const totalPages = Math.max(1, Math.ceil((paid.length + free.length) / PAGE_SIZE));
  const pagedPaid = paid.slice(0, Math.min(page * PAGE_SIZE, paid.length));
  const pagedFree = free.slice(0, Math.max(0, page * PAGE_SIZE - paid.length));

  const verifiedCount = paid.length;

  return (
    <>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(65,73,67,0.45)",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "6px",
            }}
          >
            Marketplace Listings
          </p>
          <h2
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
            }}
          >
            Found{" "}
            <span style={{ color: "#003320" }}>{verifiedCount}</span>{" "}
            Verified Partners
          </h2>
        </div>

        {/* Filters + sort row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Mobile: Filters button */}
          {onMobileFiltersOpen && (
            <button
              onClick={onMobileFiltersOpen}
              className="dir-filters-btn-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 14px",
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#111827",
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#003320" }}>tune</span>
              Filters
              {activeFilterCount > 0 && (
                <span
                  style={{
                    backgroundColor: "#003320",
                    color: "white",
                    borderRadius: "9999px",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 6px",
                    lineHeight: 1.4,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
          {/* Sort */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 14px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#6B7280",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Sort by:
            </span>
            <CustomDropdown
              value={sort}
              onChange={setSort}
              wrapperStyle={{ minWidth: "100px" }}
              triggerStyle={{ fontWeight: 600, color: "#111827", fontSize: "13px" }}
              items={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            />
          </div>
        </div>

        <style>{`
          @media (min-width: 1024px) {
            .dir-filters-btn-mobile { display: none !important; }
          }
          @media (max-width: 1023px) {
            .dir-search-desktop { display: none !important; }
          }
        `}</style>
      </div>

      {/* No results */}
      {filtered.length === 0 && (
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "16px",
            padding: "60px 24px",
            textAlign: "center",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#D1D5DB" }}>
            search_off
          </span>
          <p style={{ fontSize: "16px", fontWeight: 600, color: "#111827", margin: "12px 0 6px", fontFamily: "'Inter', sans-serif" }}>
            No results found
          </p>
          <p style={{ color: "#9CA3AF", fontSize: "14px", fontFamily: "'Inter', sans-serif" }}>
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => { setQuery(""); setStateFilter(""); }}
            style={{
              marginTop: "16px",
              backgroundColor: "#003320",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Paid listings — 2-column grid */}
      <div className="listings-grid">
        {pagedPaid.map((c) => <ListingCard key={c.id} company={c} />)}
      </div>

      {/* Unclaimed separator */}
      {pagedFree.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "28px 0 16px",
            }}
          >
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#9CA3AF",
                whiteSpace: "nowrap",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Claimed Listings
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
          </div>
          <div className="listings-grid">
            {pagedFree.map((c) => <ListingCard key={c.id} company={c} />)}
          </div>
        </>
      )}

      <style>{`
        .listings-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 900px) {
          .listings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginTop: "40px",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              color: page === 1 ? "#D1D5DB" : "#6B7280",
              cursor: page === 1 ? "default" : "pointer",
              fontSize: "16px",
            }}
          >
            ‹
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              style={{
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                border: n === page ? "none" : "1px solid #e5e7eb",
                backgroundColor: n === page ? "#003320" : "white",
                color: n === page ? "white" : "#6B7280",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: n === page ? 700 : 500,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {n}
            </button>
          ))}

          {totalPages > 5 && (
            <>
              <span style={{ color: "#9CA3AF", fontSize: "13px" }}>…</span>
              <button
                onClick={() => setPage(totalPages)}
                style={{
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                  color: "#6B7280",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              backgroundColor: "white",
              color: page === totalPages ? "#D1D5DB" : "#6B7280",
              cursor: page === totalPages ? "default" : "pointer",
              fontSize: "16px",
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
