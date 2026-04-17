"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

// ── Image uploader ────────────────────────────────────────────────────────────
function ImageUploader({
  value,
  onChange,
  hint,
}: {
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/vendor/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.detail || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {value ? (
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <div style={{ position: "relative", width: "100%", height: "160px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
            <Image src={value} alt="Preview" fill style={{ objectFit: "cover" }} unoptimized />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer" }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          style={{ border: "2px dashed #C6E0D0", borderRadius: "8px", padding: "32px 16px", textAlign: "center", cursor: uploading ? "not-allowed" : "pointer", background: "#F7FBF9", marginBottom: "10px" }}
        >
          {uploading ? (
            <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>Uploading…</p>
          ) : (
            <>
              <p style={{ color: "#1A4A35", fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>Click to upload image</p>
              <p style={{ color: "#9CA3AF", fontSize: "12px", margin: 0 }}>JPG, PNG, WebP — max 5 MB</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} style={{ display: "none" }} />
      {!value && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>or paste a URL</span>
          <div style={{ flex: 1, height: "1px", background: "#E5E7EB" }} />
        </div>
      )}
      {!value && (
        <input
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", marginTop: "8px", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "14px", color: "#111827", background: "white", outline: "none", boxSizing: "border-box" }}
        />
      )}
      {hint && !value && <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "5px" }}>{hint}</p>}
      {error && <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "5px" }}>{error}</p>}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────


const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"];
const CA_PROVINCES = ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"];

interface Product { name: string; description: string; imageUrl: string }
interface FormState {
  category: string;
  shortDescription: string;
  fullDescription: string;
  website: string;
  phone: string;
  linkedinUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  bannerImageUrl: string;
  bannerCaption: string;
  foundedYear: string;
  teamSize: string;
  serviceArea: string;
  yearsInCannabis: string;
  serviceTags: string;
  certifications: string;
  products: Product[];
}

interface VendorUser { email: string; fullName: string; companyName?: string; tier: string }
interface Company { slug: string; name: string; tier: string; location?: { city: string; state: string } }

const TIER_LABELS: Record<string, string> = {
  free: "Claimed",
  select: "Select",
  elite: "Verified Pro",
};
const TIER_COLORS: Record<string, { bg: string; color: string }> = {
  free:   { bg: "#F3F4F6", color: "#6B7280" },
  select: { bg: "#EFF6FF", color: "#2563EB" },
  elite:  { bg: "#E8F5EE", color: "#1A4A35" },
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB",
  borderRadius: "8px", fontSize: "14px", color: "#111827",
  background: "white", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: "#4A5E4A", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "5px",
};
const sectionStyle: React.CSSProperties = {
  background: "white", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "16px",
};
const sectionTitle: React.CSSProperties = {
  fontSize: "14px", fontWeight: 700, color: "#1A4A35", marginBottom: "18px",
  paddingBottom: "12px", borderBottom: "1px solid #F3F4F6",
};
const gridTwo: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" };

function emptyForm(): FormState {
  return {
    category: "", shortDescription: "", fullDescription: "", website: "", phone: "",
    linkedinUrl: "", instagramUrl: "", youtubeUrl: "",
    address: "", city: "", state: "", zip: "", bannerImageUrl: "", bannerCaption: "",
    foundedYear: "", teamSize: "", serviceArea: "", yearsInCannabis: "",
    serviceTags: "", certifications: "",
    products: [
      { name: "", description: "", imageUrl: "" },
      { name: "", description: "", imageUrl: "" },
      { name: "", description: "", imageUrl: "" },
    ],
  };
}

function companyToForm(c: Record<string, unknown>): FormState {
  const loc = (c.location as { address?: string; city?: string; state?: string; zip?: string }) ?? {};
  const products = Array.isArray(c.products) ? c.products : [];
  const filled = products.map((p: { name?: string; description?: string; imageUrl?: string }) => ({
    name: p.name ?? "", description: p.description ?? "", imageUrl: p.imageUrl ?? "",
  }));
  while (filled.length < 3) filled.push({ name: "", description: "", imageUrl: "" });

  return {
    category: String(c.category ?? ""),
    shortDescription: String(c.shortDescription ?? ""),
    fullDescription: String(c.fullDescription ?? ""),
    website: String(c.website ?? ""),
    phone: String(c.phone ?? ""),
    linkedinUrl: String(c.linkedinUrl ?? ""),
    instagramUrl: String(c.instagramUrl ?? ""),
    youtubeUrl: String(c.youtubeUrl ?? ""),
    address: String(loc.address ?? ""),
    city: String(loc.city ?? ""),
    state: String(loc.state ?? ""),
    zip: String(loc.zip ?? ""),
    bannerImageUrl: String(c.bannerImageUrl ?? ""),
    bannerCaption: String(c.bannerCaption ?? ""),
    foundedYear: c.foundedYear ? String(c.foundedYear) : "",
    teamSize: String(c.teamSize ?? ""),
    serviceArea: String(c.serviceArea ?? ""),
    yearsInCannabis: c.yearsInCannabis ? String(c.yearsInCannabis) : "",
    serviceTags: Array.isArray(c.serviceTags) ? (c.serviceTags as string[]).join(", ") : "",
    certifications: Array.isArray(c.certifications) ? (c.certifications as string[]).join(", ") : "",
    products: filled.slice(0, 6),
  };
}

export default function VendorDashboardPage() {
  const [vendor, setVendor] = useState<VendorUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [nameSaving, setNameSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/vendor-me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/vendor/company").then((r) => (r.ok ? r.json() : null)),
    ]).then(([meData, companyData]) => {
      if (!meData) { window.location.href = "/vendor/login"; return; }
      setVendor(meData.user);
      setNameValue(meData.user?.fullName ?? "");
      if (companyData?.company) {
        setCompany(companyData.company as Company);
        setForm(companyToForm(companyData.company as Record<string, unknown>));
      }
      setLoading(false);
    }).catch(() => { window.location.href = "/vendor/login"; });
  }, []);

  function setField(key: keyof Omit<FormState, "products">, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  function setProduct(i: number, key: keyof Product, value: string) {
    setForm((f) => {
      const products = [...f.products];
      products[i] = { ...products[i], [key]: value };
      return { ...f, products };
    });
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      const payload = {
        ...form,
        foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
        yearsInCannabis: form.yearsInCannabis ? Number(form.yearsInCannabis) : undefined,
        serviceTags: form.serviceTags.split(",").map((s) => s.trim()).filter(Boolean),
        certifications: form.certifications.split(",").map((s) => s.trim()).filter(Boolean),
        products: form.products.filter((p) => p.name.trim()),
        address: form.address,
        zip: form.zip,
      };
      const res = await fetch("/api/vendor/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveName() {
    if (!nameValue.trim()) return;
    setNameSaving(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: nameValue.trim() }),
      });
      if (res.ok) {
        setVendor((v) => v ? { ...v, fullName: nameValue.trim() } : v);
        setEditingName(false);
      }
    } finally {
      setNameSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/vendor-logout", { method: "POST" });
    window.location.href = "/vendor/login";
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F7F9F7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#6B7280", fontSize: "14px" }}>Loading…</div>
      </div>
    );
  }

  const tierStyle = TIER_COLORS[vendor?.tier ?? "free"];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F9F7" }}>
      {/* Nav */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", fontSize: "17px", fontWeight: 800, color: "#1A4A35", fontFamily: "serif" }}>
            NextCanna Connect
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {company && (
              <Link
                href={`/vendor/${company.slug}`}
                target="_blank"
                style={{ fontSize: "13px", color: "#1A4A35", fontWeight: 600, textDecoration: "none", border: "1px solid #C6E0D0", borderRadius: "7px", padding: "5px 12px" }}
              >
                View Listing →
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: "7px", padding: "5px 12px", fontSize: "13px", color: "#6B7280", cursor: "pointer" }}
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {editingName ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    autoFocus
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditingName(false); }}
                    style={{ fontSize: "18px", fontWeight: 700, color: "#0D2818", border: "1px solid #C6E0D0", borderRadius: "6px", padding: "3px 8px", outline: "none", background: "white" }}
                  />
                  <button onClick={saveName} disabled={nameSaving} style={{ fontSize: "12px", fontWeight: 600, color: "white", background: "#1A4A35", border: "none", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}>
                    {nameSaving ? "…" : "Save"}
                  </button>
                  <button onClick={() => setEditingName(false)} style={{ fontSize: "12px", color: "#9CA3AF", background: "none", border: "none", cursor: "pointer" }}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0D2818", margin: 0 }}>
                    Welcome back, {vendor?.fullName?.split(" ")[0]}
                  </h1>
                  <button
                    onClick={() => { setNameValue(vendor?.fullName ?? ""); setEditingName(true); }}
                    style={{ fontSize: "11px", color: "#9CA3AF", background: "none", border: "1px solid #E5E7EB", borderRadius: "5px", padding: "2px 8px", cursor: "pointer" }}
                  >
                    Edit name
                  </button>
                </div>
              )}
              <span style={{ padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600, ...tierStyle }}>
                {TIER_LABELS[vendor?.tier ?? "free"]}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>
              {company?.name ?? vendor?.companyName} · {vendor?.email}
            </p>
          </div>
          {company && (
            <Link
              href={`/vendor/${company.slug}`}
              target="_blank"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#1A4A35", color: "white", padding: "10px 20px", borderRadius: "9px", fontSize: "14px", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}
            >
              View Live Listing →
            </Link>
          )}
        </div>

        {!company && (
          <div style={{ ...sectionStyle, textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>⏳</div>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#1A4A35", marginBottom: "8px" }}>Your listing is being set up</h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>
              Your company listing will appear here shortly. If it&apos;s been more than a few minutes,{" "}
              <a href="mailto:hello@nextcannaconnect.com" style={{ color: "#1A4A35" }}>contact support</a>.
            </p>
          </div>
        )}

        {company && (
          <form onSubmit={handleSave}>
            {/* Business Profile */}
            <div style={sectionStyle}>
              <h2 style={sectionTitle}>Business Profile</h2>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Category <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— which directory your listing appears in</span></label>
                <select
                  style={{ ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "32px", cursor: "pointer" }}
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  <option value="">— Select a category —</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Tagline <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— shown under your name</span></label>
                <input style={inputStyle} value={form.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} placeholder="e.g. Premium cannabis equipment manufacturer" maxLength={200} />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>About Your Business</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
                  value={form.fullDescription}
                  onChange={(e) => setField("fullDescription", e.target.value)}
                  placeholder="Describe your business, expertise, and what sets you apart…"
                />
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>YouTube Video URL <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— shown below your overview on the listing page</span></label>
                <input
                  style={inputStyle}
                  value={form.youtubeUrl}
                  onChange={(e) => setField("youtubeUrl", e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  type="url"
                />
              </div>
              <div style={{ ...gridTwo, marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>Website</label>
                  <input style={inputStyle} value={form.website} onChange={(e) => setField("website", e.target.value)} placeholder="https://yoursite.com" type="url" />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input style={inputStyle} value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div style={{ ...gridTwo, marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>LinkedIn URL</label>
                  <input style={inputStyle} value={form.linkedinUrl} onChange={(e) => setField("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/company/..." type="url" />
                </div>
                <div>
                  <label style={labelStyle}>Instagram URL</label>
                  <input style={inputStyle} value={form.instagramUrl} onChange={(e) => setField("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." type="url" />
                </div>
              </div>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Street Address <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— optional, used for the map pin</span></label>
                <input style={inputStyle} value={form.address} onChange={(e) => setField("address", e.target.value)} placeholder="e.g. 123 Cannabis Blvd, Suite 400" />
              </div>
              <div style={{ ...gridTwo, marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input style={inputStyle} value={form.city} onChange={(e) => setField("city", e.target.value)} placeholder="e.g. Denver" />
                </div>
                <div>
                  <label style={labelStyle}>ZIP / Postal Code</label>
                  <input style={inputStyle} value={form.zip} onChange={(e) => setField("zip", e.target.value)} placeholder="e.g. 80202" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>State / Province</label>
                <select
                  style={{ ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "32px", cursor: "pointer" }}
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                >
                  <option value="">— Select state / province —</option>
                  <optgroup label="United States">
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </optgroup>
                  <optgroup label="Canada">
                    {CA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Hero Banner */}
            <div style={sectionStyle}>
              <h2 style={sectionTitle}>Hero Banner Image</h2>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Banner Image <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— recommended 1200 × 600 px</span></label>
                <ImageUploader value={form.bannerImageUrl} onChange={(url) => { setField("bannerImageUrl", url); setSaved(false); }} />
                {form.bannerImageUrl && (
                  <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "6px", wordBreak: "break-all" }}>
                    Saved URL: <a href={form.bannerImageUrl} target="_blank" rel="noreferrer" style={{ color: "#2563EB" }}>{form.bannerImageUrl}</a>
                  </p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Banner Caption <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— optional overlay text</span></label>
                <input style={inputStyle} value={form.bannerCaption} onChange={(e) => setField("bannerCaption", e.target.value)} placeholder="e.g. Series-7 Supercritical Fluid Extractor" maxLength={120} />
              </div>
            </div>

            {/* Business Details */}
            <div style={sectionStyle}>
              <h2 style={sectionTitle}>Business Details</h2>
              <div style={{ ...gridTwo, marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>Founded Year</label>
                  <input style={inputStyle} value={form.foundedYear} onChange={(e) => setField("foundedYear", e.target.value)} placeholder="e.g. 2018" type="number" min="1900" max="2100" />
                </div>
                <div>
                  <label style={labelStyle}>Team Size</label>
                  <input style={inputStyle} value={form.teamSize} onChange={(e) => setField("teamSize", e.target.value)} placeholder="e.g. 10-50" />
                </div>
              </div>
              <div style={{ ...gridTwo }}>
                <div>
                  <label style={labelStyle}>Service Area / Regions</label>
                  <input style={inputStyle} value={form.serviceArea} onChange={(e) => setField("serviceArea", e.target.value)} placeholder="e.g. NA / EU" />
                </div>
                <div>
                  <label style={labelStyle}>Years in Cannabis</label>
                  <input style={inputStyle} value={form.yearsInCannabis} onChange={(e) => setField("yearsInCannabis", e.target.value)} placeholder="e.g. 5" type="number" min="0" />
                </div>
              </div>
            </div>

            {/* Services & Certifications */}
            <div style={sectionStyle}>
              <h2 style={sectionTitle}>Services &amp; Certifications</h2>
              <div style={{ marginBottom: "14px" }}>
                <label style={labelStyle}>Core Services <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— comma-separated</span></label>
                <input style={inputStyle} value={form.serviceTags} onChange={(e) => setField("serviceTags", e.target.value)} placeholder="e.g. Custom Equipment Design, Facility Workflow, Remote Monitoring" />
              </div>
              <div>
                <label style={labelStyle}>Certifications <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— comma-separated</span></label>
                <input style={inputStyle} value={form.certifications} onChange={(e) => setField("certifications", e.target.value)} placeholder="e.g. ISO, GMP, CE, UL" />
              </div>
            </div>

            {/* Products / Offerings */}
            <div style={sectionStyle}>
              <h2 style={sectionTitle}>Products &amp; Offerings <span style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 400 }}>— up to 6</span></h2>
              {form.products.map((p, i) => (
                <div key={i} style={{ marginBottom: i < form.products.length - 1 ? "20px" : 0, paddingBottom: i < form.products.length - 1 ? "20px" : 0, borderBottom: i < form.products.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#9CA3AF", marginBottom: "10px" }}>
                    PRODUCT / OFFERING {i + 1}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={labelStyle}>Name</label>
                    <input style={inputStyle} value={p.name} onChange={(e) => setProduct(i, "name", e.target.value)} placeholder="e.g. CO2 Extraction Systems" maxLength={100} />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={labelStyle}>Description</label>
                    <input style={inputStyle} value={p.description} onChange={(e) => setProduct(i, "description", e.target.value)} placeholder="Short description of this product or service" maxLength={300} />
                  </div>
                  <div>
                    <label style={labelStyle}>Image <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>— optional</span></label>
                    <ImageUploader value={p.imageUrl} onChange={(url) => { setProduct(i, "imageUrl", url); setSaved(false); }} />
                  </div>
                </div>
              ))}
              {form.products.length < 6 && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, products: [...f.products, { name: "", description: "", imageUrl: "" }] }))}
                  style={{ marginTop: "16px", background: "none", border: "1px dashed #C6E0D0", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", color: "#1A4A35", cursor: "pointer", width: "100%" }}
                >
                  + Add another product
                </button>
              )}
            </div>

            {/* Save */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", paddingBottom: "40px" }}>
              <button
                type="submit"
                disabled={saving}
                style={{ padding: "13px 32px", background: "#1A4A35", color: "white", border: "none", borderRadius: "9px", fontSize: "15px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              {saved && (
                <>
                  <span style={{ color: "#1A4A35", fontSize: "14px", fontWeight: 600 }}>✓ Changes saved</span>
                  <Link
                    href={`/vendor/${company.slug}`}
                    target="_blank"
                    style={{ fontSize: "14px", color: "#2563EB", fontWeight: 600, textDecoration: "none" }}
                  >
                    View listing →
                  </Link>
                </>
              )}
              {saveError && <span style={{ color: "#DC2626", fontSize: "13px" }}>{saveError}</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
