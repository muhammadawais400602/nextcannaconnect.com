"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ListingCard from "@/components/directory/ListingCard";
import { Company } from "@/types";

const PAGE_SIZE = 10;

interface Props {
  companies: Company[];
  categoryShortLabel: string;
}

export default function DirectoryListings({ companies, categoryShortLabel }: Props) {
  const searchParams = useSearchParams();
  const initialState = searchParams.get("state") ?? "";

  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState(initialState);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [page, setPage] = useState(1);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [query, stateFilter, verifiedOnly]);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (verifiedOnly && c.tier !== "elite" && c.tier !== "select") return false;
      if (stateFilter && c.location.state !== stateFilter) return false;
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
  }, [companies, query, stateFilter, verifiedOnly]);

  const featured = filtered.filter((c) => c.tier === "featured");
  const paid = filtered.filter((c) => ["elite", "select", "claimed"].includes(c.tier));
  const free = filtered.filter((c) => c.tier === "free");
  const allNonFree = [...featured, ...paid];

  const totalPages = Math.max(1, Math.ceil((allNonFree.length + free.length) / PAGE_SIZE));
  const pagedNonFree = allNonFree.slice(0, Math.min(page * PAGE_SIZE, allNonFree.length));
  const pagedFree = free.slice(0, Math.max(0, page * PAGE_SIZE - allNonFree.length));

  const hasFilters = query || stateFilter || verifiedOnly;

  return (
    <>
      {/* Search + controls bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5"
        style={{ flexWrap: "wrap" }}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl flex-1"
          style={{
            border: "1px solid #E5E7EB",
            backgroundColor: "#F8FAF8",
            minWidth: "200px",
            maxWidth: "380px",
          }}
        >
          <Search size={15} style={{ color: "#9CA3AF", flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${categoryShortLabel}...`}
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: "14px", color: "#111827", border: "none" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* State filter */}
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="rounded-xl px-3 py-3"
          style={{
            border: "1px solid #E5E7EB",
            backgroundColor: "#F8FAF8",
            fontSize: "13px",
            color: stateFilter ? "#111827" : "#9CA3AF",
            outline: "none",
            minWidth: "140px",
          }}
        >
          <option value="">All States</option>
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Verified toggle */}
        <button
          onClick={() => setVerifiedOnly(!verifiedOnly)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all"
          style={{
            border: `1px solid ${verifiedOnly ? "#1A4A35" : "#E5E7EB"}`,
            backgroundColor: verifiedOnly ? "rgba(26,74,53,0.07)" : "#F8FAF8",
            color: verifiedOnly ? "#1A4A35" : "#6B7280",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <SlidersHorizontal size={14} />
          Verified Only
        </button>

        {/* Clear all */}
        {hasFilters && (
          <button
            onClick={() => { setQuery(""); setStateFilter(""); setVerifiedOnly(false); }}
            className="flex items-center gap-1.5 font-semibold"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#F7941D", fontSize: "13px" }}
          >
            <X size={13} /> Clear Filters
          </button>
        )}
      </div>

      {/* Result count */}
      <p style={{ color: "#6B7280", fontSize: "13px", marginBottom: "16px" }}>
        Showing <strong style={{ color: "#111827" }}>{filtered.length}</strong> businesses
        {hasFilters && <span style={{ color: "#9CA3AF" }}> (filtered)</span>}
      </p>

      {/* No results */}
      {filtered.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
        >
          <p className="font-semibold mb-2" style={{ fontSize: "16px", color: "#111827" }}>
            No results found
          </p>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => { setQuery(""); setStateFilter(""); setVerifiedOnly(false); }}
            className="btn-primary mt-4"
            style={{ fontSize: "13px" }}
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Featured */}
      {pagedNonFree
        .filter((c) => c.tier === "featured")
        .map((c) => <ListingCard key={c.id} company={c} featured />)}

      {/* Paid tiers */}
      {pagedNonFree
        .filter((c) => c.tier !== "featured")
        .map((c) => <ListingCard key={c.id} company={c} />)}

      {/* Unclaimed separator */}
      {pagedFree.length > 0 && (
        <>
          <div className="flex items-center gap-3 my-6">
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
            <span
              className="font-semibold uppercase"
              style={{ color: "#9CA3AF", fontSize: "11px", letterSpacing: "1px", whiteSpace: "nowrap" }}
            >
              Unclaimed Listings
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }} />
          </div>
          {pagedFree.map((c) => <ListingCard key={c.id} company={c} />)}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg px-4 py-2.5 font-medium transition-colors"
            style={{
              fontSize: "13px",
              color: page === 1 ? "#D1D5DB" : "#6B7280",
              border: "1px solid #E5E7EB",
              backgroundColor: "white",
              cursor: page === 1 ? "default" : "pointer",
            }}
          >
            ← Previous
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className="rounded-lg px-3.5 py-2.5 font-medium transition-colors"
              style={{
                fontSize: "13px",
                backgroundColor: n === page ? "#F7941D" : "white",
                color: n === page ? "white" : "#6B7280",
                border: n === page ? "none" : "1px solid #E5E7EB",
                cursor: "pointer",
              }}
            >
              {n}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg px-4 py-2.5 font-medium transition-colors"
            style={{
              fontSize: "13px",
              color: page === totalPages ? "#D1D5DB" : "#6B7280",
              border: "1px solid #E5E7EB",
              backgroundColor: "white",
              cursor: page === totalPages ? "default" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];
