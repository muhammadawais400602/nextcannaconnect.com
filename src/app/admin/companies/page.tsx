"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

const TIERS = [
  { value: "free",   label: "Unclaimed" },
  { value: "select", label: "Select" },
  { value: "elite",  label: "Verified Pro" },
];

const TIER_LABEL: Record<string, string> = {
  free: "Unclaimed", claimed: "Select", select: "Select", elite: "Verified Pro", featured: "Verified Pro",
};
const TIER_COLORS: Record<string, string> = {
  free: "#6B7280", claimed: "#2d6e52", select: "#2d6e52", elite: "#1A4A35", featured: "#1A4A35",
};
const TIER_BG: Record<string, string> = {
  free: "#F3F4F6", claimed: "rgba(45,110,82,0.1)", select: "rgba(45,110,82,0.1)", elite: "rgba(26,74,53,0.1)", featured: "rgba(26,74,53,0.1)",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Company = Record<string, any>;

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (tier) params.set("tier", tier);
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/companies?${params}`);
    const data = await res.json();
    setCompanies(data.companies || []);
    setLoading(false);
  }, [tier, category, search]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(slug);
    const res = await fetch(`/api/admin/companies/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setToast(`"${name}" deleted successfully`);
      setCompanies((prev) => prev.filter((c) => c.slug !== slug));
      setTimeout(() => setToast(""), 3000);
    }
    setDeleting(null);
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed", top: "20px", right: "20px", zIndex: 999,
            background: "#1A4A35", color: "white", padding: "12px 20px",
            borderRadius: "8px", fontSize: "14px", fontFamily: "sans-serif",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#0D2818", margin: 0, fontFamily: "sans-serif" }}>
            Companies
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", marginTop: "4px", fontFamily: "sans-serif" }}>
            {loading ? "Loading..." : `${companies.length} listing${companies.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/admin/companies/new"
          style={{
            padding: "10px 20px", background: "#E8821E", color: "white",
            borderRadius: "8px", textDecoration: "none", fontSize: "14px",
            fontWeight: "600", fontFamily: "sans-serif",
          }}
        >
          + Add Company
        </Link>
      </div>

      {/* Filters */}
      <div
        style={{
          background: "white", borderRadius: "12px", padding: "16px 20px",
          marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 200px", padding: "8px 12px", border: "1px solid #D1D5DB",
            borderRadius: "8px", fontSize: "14px", fontFamily: "sans-serif",
            outline: "none", color: "#111827",
          }}
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          style={{
            padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "8px",
            fontSize: "14px", fontFamily: "sans-serif", outline: "none",
            color: "#374151", background: "white",
          }}
        >
          <option value="">All Tiers</option>
          {TIERS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "8px 12px", border: "1px solid #D1D5DB", borderRadius: "8px",
            fontSize: "14px", fontFamily: "sans-serif", outline: "none",
            color: "#374151", background: "white",
          }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.shortLabel}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: "white", borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "sans-serif" }}>
            Loading companies...
          </div>
        ) : companies.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#9CA3AF", fontFamily: "sans-serif" }}>
            No companies found. <Link href="/admin/companies/new" style={{ color: "#E8821E" }}>Add one?</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Company", "Category", "Location", "Tier", "Contact", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 20px", textAlign: "left", fontSize: "11px",
                      fontWeight: "700", color: "#6B7280", textTransform: "uppercase",
                      letterSpacing: "0.05em", fontFamily: "sans-serif",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {companies.map((c, i) => (
                <tr
                  key={c._id || c.slug}
                  style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "36px", height: "36px", borderRadius: "8px",
                          background: c.logoColor || "#1A4A35", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "12px", fontWeight: "700", color: "white",
                          fontFamily: "sans-serif",
                        }}
                      >
                        {c.logoPlaceholder}
                      </div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827", fontFamily: "sans-serif" }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "sans-serif" }}>
                          /{c.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>
                    {CATEGORIES.find((cat) => cat.slug === c.category)?.shortLabel ?? c.category}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>
                    {c.location?.city}, {c.location?.state}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        fontSize: "11px", fontWeight: "700", textTransform: "capitalize",
                        color: TIER_COLORS[c.tier] || "#6B7280",
                        background: TIER_BG[c.tier] || "#F9FAFB",
                        padding: "3px 10px", borderRadius: "20px", fontFamily: "sans-serif",
                      }}
                    >
                      {TIER_LABEL[c.tier] ?? c.tier}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: "13px", color: "#6B7280", fontFamily: "sans-serif" }}>
                    {c.email || c.website || "—"}
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link
                        href={`/admin/companies/${c.slug}/edit`}
                        style={{
                          padding: "6px 12px", background: "#F3F4F6", color: "#374151",
                          borderRadius: "6px", textDecoration: "none", fontSize: "12px",
                          fontWeight: "500", fontFamily: "sans-serif",
                        }}
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/vendor/${c.slug}`}
                        target="_blank"
                        style={{
                          padding: "6px 12px", background: "#EFF6FF", color: "#2563EB",
                          borderRadius: "6px", textDecoration: "none", fontSize: "12px",
                          fontWeight: "500", fontFamily: "sans-serif",
                        }}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(c.slug, c.name)}
                        disabled={deleting === c.slug}
                        style={{
                          padding: "6px 12px", background: "#FEF2F2", color: "#EF4444",
                          border: "none", borderRadius: "6px", fontSize: "12px",
                          fontWeight: "500", cursor: "pointer", fontFamily: "sans-serif",
                        }}
                      >
                        {deleting === c.slug ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
