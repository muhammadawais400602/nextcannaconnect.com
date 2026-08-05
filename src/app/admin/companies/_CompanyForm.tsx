"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import CustomSelect from "@/components/ui/CustomSelect";

const TIERS = [
  { value: "free",  label: "Unclaimed" },
  { value: "select", label: "Select" },
  { value: "elite", label: "Verified Pro" },
];
const TIER_LABEL: Record<string, string> = {
  free: "Unclaimed", select: "Select", elite: "Verified Pro",
};
const LOGO_COLORS = ["#1A4A35", "#2563EB", "#7C3AED", "#E8821E", "#0D2818", "#047857", "#DC2626"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Company = Record<string, any>;

interface Props {
  initial?: Company;
  mode: "new" | "edit";
}

function TagInput({
  label, value, onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [input, setInput] = useState("");
  function add() {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  }
  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); add(); }
            if (e.key === ",") { e.preventDefault(); add(); }
          }}
          placeholder="Type and press Enter"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button type="button" onClick={add} style={smallBtnStyle}>Add</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {value.map((tag) => (
          <span
            key={tag}
            style={{
              background: "#E8F5EE", color: "#1A4A35", padding: "3px 10px",
              borderRadius: "20px", fontSize: "12px", fontFamily: "sans-serif",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              style={{ border: "none", background: "none", cursor: "pointer", color: "#1A4A35", fontWeight: "700", padding: 0 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", border: "1px solid #D1D5DB",
  borderRadius: "8px", fontSize: "14px", fontFamily: "sans-serif",
  outline: "none", color: "#111827", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "13px", fontWeight: "600", color: "#374151",
  marginBottom: "5px", fontFamily: "sans-serif",
};
const smallBtnStyle: React.CSSProperties = {
  padding: "9px 14px", background: "#1A4A35", color: "white",
  border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer",
  fontFamily: "sans-serif", fontWeight: "600", whiteSpace: "nowrap",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "white", borderRadius: "12px", padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: "20px",
      }}
    >
      <h3
        style={{
          fontSize: "15px", fontWeight: "700", color: "#0D2818",
          margin: "0 0 20px", fontFamily: "sans-serif",
          paddingBottom: "12px", borderBottom: "1px solid #F3F4F6",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "grid", gap: "16px" }}>{children}</div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>{children}</div>;
}

export default function CompanyForm({ initial, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<Company>({
    name: "", slug: "", tier: "free", category: "cultivation-growing",
    shortDescription: "", fullDescription: "",
    location: { city: "", state: "" },
    website: "", phone: "", email: "",
    logoPlaceholder: "", logoColor: "#1A4A35", logoUrl: "",
    bannerImageUrl: "", bannerCaption: "", foundedYear: "",
    serviceTags: [], certifications: [], statesServed: [],
    productLines: [], specialtyAreas: [], credentials: [],
    products: [],
    teamSize: "", yearsInCannabis: "", pricingModel: "",
    minOrderQty: "", leadTime: "", serviceArea: "",
    yearsExperience: "", hourlyRate: "", availability: "", bio: "",
    rating: "", reviewCount: "",
    licenseNumber: "", licenseType: "", delivery: "", hours: "",
    insuranceOnFile: false, metrcIntegrated: false, verifiedDate: "",
    locationsCount: "", faqs: [],
    vehicleCount: "", transportType: "", loadsPerMonth: "", statesActive: "",
    cargoInsurance: "", gpsTracked: false, dispatchHours: "", licensesTable: [],
    accreditation: "", turnaroundTime: "", panelCount: "", licenseStatus: "",
    facilitySize: "", samplesTested: "", sampleTypes: "", rushService: "",
    sampleIntakeHours: "", accreditations: [], capabilities: [],
    ...initial,
  });

  function set(key: string, value: unknown) {
    setForm((prev: Company) => ({ ...prev, [key]: value }));
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      foundedYear: form.foundedYear ? Number(form.foundedYear) : undefined,
      yearsInCannabis: form.yearsInCannabis ? Number(form.yearsInCannabis) : undefined,
      yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
      rating: form.rating ? Number(form.rating) : undefined,
      reviewCount: form.reviewCount ? Number(form.reviewCount) : undefined,
      locationsCount: form.locationsCount ? Number(form.locationsCount) : undefined,
      faqs: (form.faqs || []).filter((f: { question: string; answer: string }) => f.question?.trim()),
      vehicleCount: form.vehicleCount ? Number(form.vehicleCount) : undefined,
      statesActive: form.statesActive ? Number(form.statesActive) : undefined,
      licensesTable: (form.licensesTable || []).filter((l: { type: string }) => l.type?.trim()),
      capabilities: (form.capabilities || []).filter((c: { name: string }) => c.name?.trim()),
    };

    const url = mode === "edit" ? `/api/admin/companies/${initial?.slug}` : "/api/admin/companies";
    const method = mode === "edit" ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/companies");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to save company");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626",
            padding: "12px 16px", borderRadius: "8px", marginBottom: "20px",
            fontSize: "14px", fontFamily: "sans-serif",
          }}
        >
          {error}
        </div>
      )}

      <Section title="Basic Information">
        <Row>
          <div>
            <label style={labelStyle}>Company Name *</label>
            <input
              style={inputStyle} required value={form.name}
              onChange={(e) => {
                set("name", e.target.value);
                if (mode === "new") set("slug", autoSlug(e.target.value));
                if (!form.logoPlaceholder || mode === "new")
                  set("logoPlaceholder", e.target.value.substring(0, 2).toUpperCase());
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>Slug * (URL path)</label>
            <input
              style={inputStyle} required value={form.slug}
              onChange={(e) => set("slug", autoSlug(e.target.value))}
              readOnly={mode === "edit"}
            />
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Tier *</label>
            <CustomSelect
              value={form.tier}
              onChange={(e) => set("tier", e.target.value)}
            >
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </CustomSelect>
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <CustomSelect value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </CustomSelect>
          </div>
        </Row>
        <div>
          <label style={labelStyle}>Short Description * (shown in listings)</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            required value={form.shortDescription}
            onChange={(e) => set("shortDescription", e.target.value)}
          />
        </div>
        <div>
          <label style={labelStyle}>Full Description (shown on profile page)</label>
          <textarea
            style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
            value={form.fullDescription || ""}
            onChange={(e) => set("fullDescription", e.target.value)}
          />
        </div>
      </Section>

      <Section title="Location & Contact">
        <Row>
          <div>
            <label style={labelStyle}>City *</label>
            <input
              style={inputStyle} required value={form.location?.city || ""}
              onChange={(e) => set("location", { ...form.location, city: e.target.value })}
            />
          </div>
          <div>
            <label style={labelStyle}>State *</label>
            <input
              style={inputStyle} required value={form.location?.state || ""}
              onChange={(e) => set("location", { ...form.location, state: e.target.value })}
            />
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Website</label>
            <input
              style={inputStyle} type="url" value={form.website || ""}
              onChange={(e) => set("website", e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              style={inputStyle} type="email" value={form.email || ""}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
        </Row>
        <div>
          <label style={labelStyle}>Phone</label>
          <input
            style={{ ...inputStyle, maxWidth: "300px" }} value={form.phone || ""}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
      </Section>

      <Section title="Listing Page — Banner & Stats">
        <div>
          <label style={labelStyle}>Banner Image URL</label>
          <input
            style={inputStyle} value={form.bannerImageUrl || ""}
            onChange={(e) => set("bannerImageUrl", e.target.value)}
            placeholder="https://... (hero image shown at top of listing page)"
          />
        </div>
        <div>
          <label style={labelStyle}>Banner Caption (Featured Installation text)</label>
          <input
            style={inputStyle} value={form.bannerCaption || ""}
            onChange={(e) => set("bannerCaption", e.target.value)}
            placeholder="e.g. Series-7 Supercritical Fluid Extractor"
          />
        </div>
        <Row>
          <div>
            <label style={labelStyle}>Founded Year</label>
            <input
              style={inputStyle} type="number" min="1900" max="2099"
              value={form.foundedYear || ""}
              onChange={(e) => set("foundedYear", e.target.value)}
              placeholder="e.g. 2018"
            />
          </div>
          <div>
            <label style={labelStyle}>Team Size / Employees</label>
            <input
              style={inputStyle} value={form.teamSize || ""}
              onChange={(e) => set("teamSize", e.target.value)}
              placeholder="e.g. 50-100"
            />
          </div>
        </Row>
        <div>
          <label style={labelStyle}>Regions Served (shown as &quot;REGIONS&quot; stat)</label>
          <input
            style={{ ...inputStyle, maxWidth: "400px" }} value={form.serviceArea || ""}
            onChange={(e) => set("serviceArea", e.target.value)}
            placeholder="e.g. NA / EU"
          />
        </div>
      </Section>

      <Section title="Product Offerings (shown on listing page)">
        <div>
          <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 12px", fontFamily: "sans-serif" }}>
            Add up to 3 products/services displayed in the grid on the listing page.
          </p>
          {(form.products || []).map((product: { name: string; description: string; imageUrl?: string }, i: number) => (
            <div key={i} style={{ background: "#F9FAFB", borderRadius: "10px", padding: "16px", marginBottom: "12px", border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#374151", fontFamily: "sans-serif" }}>Product {i + 1}</span>
                <button
                  type="button"
                  onClick={() => set("products", (form.products || []).filter((_: unknown, idx: number) => idx !== i))}
                  style={{ fontSize: "12px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}
                >
                  Remove
                </button>
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                <input
                  style={inputStyle}
                  placeholder="Product name"
                  value={product.name}
                  onChange={(e) => {
                    const updated = [...(form.products || [])];
                    updated[i] = { ...updated[i], name: e.target.value };
                    set("products", updated);
                  }}
                />
                <input
                  style={inputStyle}
                  placeholder="Short description (1–2 sentences)"
                  value={product.description}
                  onChange={(e) => {
                    const updated = [...(form.products || [])];
                    updated[i] = { ...updated[i], description: e.target.value };
                    set("products", updated);
                  }}
                />
                <input
                  style={inputStyle}
                  placeholder="Image URL (optional)"
                  value={product.imageUrl || ""}
                  onChange={(e) => {
                    const updated = [...(form.products || [])];
                    updated[i] = { ...updated[i], imageUrl: e.target.value };
                    set("products", updated);
                  }}
                />
              </div>
            </div>
          ))}
          {(form.products || []).length < 3 && (
            <button
              type="button"
              onClick={() => set("products", [...(form.products || []), { name: "", description: "", imageUrl: "" }])}
              style={{ ...smallBtnStyle, background: "white", color: "#1A4A35", border: "1px solid #1A4A35" }}
            >
              + Add Product
            </button>
          )}
        </div>
      </Section>

      <Section title="Branding">
        <div>
          <label style={labelStyle}>Logo Image URL</label>
          <input
            style={inputStyle}
            value={form.logoUrl || ""}
            onChange={(e) => set("logoUrl", e.target.value)}
            placeholder="https://... (logo image — shown instead of initials when provided)"
          />
          {form.logoUrl && (
            <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.logoUrl}
                alt="Logo preview"
                style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover", border: "1px solid #E5E7EB" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <span style={{ fontSize: "12px", color: "#6B7280", fontFamily: "sans-serif" }}>Preview</span>
            </div>
          )}
        </div>
        <Row>
          <div>
            <label style={labelStyle}>Logo Initials (2 chars, used when no image)</label>
            <input
              style={{ ...inputStyle, maxWidth: "100px", textTransform: "uppercase" }}
              maxLength={2} value={form.logoPlaceholder || ""}
              onChange={(e) => set("logoPlaceholder", e.target.value.toUpperCase())}
            />
          </div>
          <div>
            <label style={labelStyle}>Logo Color</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {LOGO_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => set("logoColor", color)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: color, border: form.logoColor === color ? "3px solid #E8821E" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                />
              ))}
              <input
                type="color" value={form.logoColor || "#1A4A35"}
                onChange={(e) => set("logoColor", e.target.value)}
                style={{ width: "36px", height: "28px", border: "none", cursor: "pointer", borderRadius: "4px" }}
              />
            </div>
          </div>
        </Row>
      </Section>

      <Section title="Services & Tags">
        <TagInput label="Service Tags" value={form.serviceTags || []} onChange={(v) => set("serviceTags", v)} />
        <TagInput label="Certifications" value={form.certifications || []} onChange={(v) => set("certifications", v)} />
        <TagInput label="States Served" value={form.statesServed || []} onChange={(v) => set("statesServed", v)} />
      </Section>

      <Section title="Products & Equipment (Template 1)">
        <TagInput label="Product Lines" value={form.productLines || []} onChange={(v) => set("productLines", v)} />
        <Row>
          <div>
            <label style={labelStyle}>Min Order Qty</label>
            <input style={inputStyle} value={form.minOrderQty || ""} onChange={(e) => set("minOrderQty", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Lead Time</label>
            <input style={inputStyle} value={form.leadTime || ""} onChange={(e) => set("leadTime", e.target.value)} />
          </div>
        </Row>
        <div>
          <label style={labelStyle}>Service Area</label>
          <input style={{ ...inputStyle, maxWidth: "400px" }} value={form.serviceArea || ""} onChange={(e) => set("serviceArea", e.target.value)} />
        </div>
      </Section>

      <Section title="Services & Agencies (Template 2)">
        <Row>
          <div>
            <label style={labelStyle}>Team Size</label>
            <input style={inputStyle} value={form.teamSize || ""} onChange={(e) => set("teamSize", e.target.value)} placeholder="e.g. 10-50" />
          </div>
          <div>
            <label style={labelStyle}>Years in Cannabis</label>
            <input style={inputStyle} type="number" min="0" value={form.yearsInCannabis || ""} onChange={(e) => set("yearsInCannabis", e.target.value)} />
          </div>
        </Row>
        <div>
          <label style={labelStyle}>Pricing Model</label>
          <input style={{ ...inputStyle, maxWidth: "400px" }} value={form.pricingModel || ""} onChange={(e) => set("pricingModel", e.target.value)} placeholder="e.g. Monthly retainer, Project-based" />
        </div>
      </Section>

      <Section title="Consultants & Advisors (Template 3)">
        <TagInput label="Specialty Areas" value={form.specialtyAreas || []} onChange={(v) => set("specialtyAreas", v)} />
        <TagInput label="Credentials" value={form.credentials || []} onChange={(v) => set("credentials", v)} />
        <Row>
          <div>
            <label style={labelStyle}>Years Experience</label>
            <input style={inputStyle} type="number" min="0" value={form.yearsExperience || ""} onChange={(e) => set("yearsExperience", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Hourly Rate</label>
            <input style={inputStyle} value={form.hourlyRate || ""} onChange={(e) => set("hourlyRate", e.target.value)} placeholder="e.g. $200–$350/hr" />
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Availability</label>
            <input style={inputStyle} value={form.availability || ""} onChange={(e) => set("availability", e.target.value)} placeholder="e.g. Accepting new clients" />
          </div>
          <div>
            <label style={labelStyle}>Rating (0–5)</label>
            <input style={inputStyle} type="number" min="0" max="5" step="0.1" value={form.rating || ""} onChange={(e) => set("rating", e.target.value)} />
          </div>
        </Row>
        <div>
          <label style={labelStyle}>Bio</label>
          <textarea style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} />
        </div>
      </Section>

      <Section title="Retail & Dispensary (Template 4)">
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 4px", fontFamily: "sans-serif" }}>
          These fields power the Retail &amp; Dispensary listing cards and profile page. Only used when Category is set to “Retail &amp; Dispensary”.
        </p>
        <Row>
          <div>
            <label style={labelStyle}>License Number</label>
            <input style={inputStyle} value={form.licenseNumber || ""} onChange={(e) => set("licenseNumber", e.target.value)} placeholder="e.g. 403-01234" />
          </div>
          <div>
            <label style={labelStyle}>License Type</label>
            <CustomSelect value={form.licenseType || ""} onChange={(e) => set("licenseType", e.target.value)}>
              <option value="">Select…</option>
              <option value="Rec + Medical">Rec + Medical</option>
              <option value="Recreational">Recreational</option>
              <option value="Medical Only">Medical Only</option>
            </CustomSelect>
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Delivery</label>
            <CustomSelect value={form.delivery || ""} onChange={(e) => set("delivery", e.target.value)}>
              <option value="">Select…</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Only">Delivery Only</option>
            </CustomSelect>
          </div>
          <div>
            <label style={labelStyle}>Hours</label>
            <input style={inputStyle} value={form.hours || ""} onChange={(e) => set("hours", e.target.value)} placeholder="e.g. 9AM - 10PM" />
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Verified Date (badge text)</label>
            <input style={inputStyle} value={form.verifiedDate || ""} onChange={(e) => set("verifiedDate", e.target.value)} placeholder="e.g. Oct 2025" />
          </div>
          <div>
            <label style={labelStyle}># of Locations</label>
            <input style={inputStyle} type="number" min="0" value={form.locationsCount || ""} onChange={(e) => set("locationsCount", e.target.value)} placeholder="e.g. 3" />
          </div>
        </Row>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#374151", fontFamily: "sans-serif" }}>
            <input type="checkbox" checked={!!form.insuranceOnFile} onChange={(e) => set("insuranceOnFile", e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "#1A4A35" }} />
            Insurance on File
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#374151", fontFamily: "sans-serif" }}>
            <input type="checkbox" checked={!!form.metrcIntegrated} onChange={(e) => set("metrcIntegrated", e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "#1A4A35" }} />
            Metrc Integrated
          </label>
        </div>
        <Row>
          <div>
            <label style={labelStyle}>Rating (0–5)</label>
            <input style={inputStyle} type="number" min="0" max="5" step="0.1" value={form.rating || ""} onChange={(e) => set("rating", e.target.value)} placeholder="e.g. 4.8" />
          </div>
          <div>
            <label style={labelStyle}>Review Count</label>
            <input style={inputStyle} type="number" min="0" value={form.reviewCount || ""} onChange={(e) => set("reviewCount", e.target.value)} placeholder="e.g. 124" />
          </div>
        </Row>

        {/* FAQs */}
        <div>
          <label style={labelStyle}>FAQs (shown on listing page)</label>
          {(form.faqs || []).map((faq: { question: string; answer: string }, i: number) => (
            <div key={i} style={{ background: "#F9FAFB", borderRadius: "10px", padding: "16px", marginBottom: "12px", border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#374151", fontFamily: "sans-serif" }}>FAQ {i + 1}</span>
                <button
                  type="button"
                  onClick={() => set("faqs", (form.faqs || []).filter((_: unknown, idx: number) => idx !== i))}
                  style={{ fontSize: "12px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}
                >
                  Remove
                </button>
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                <input
                  style={inputStyle}
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) => {
                    const updated = [...(form.faqs || [])];
                    updated[i] = { ...updated[i], question: e.target.value };
                    set("faqs", updated);
                  }}
                />
                <textarea
                  style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => {
                    const updated = [...(form.faqs || [])];
                    updated[i] = { ...updated[i], answer: e.target.value };
                    set("faqs", updated);
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("faqs", [...(form.faqs || []), { question: "", answer: "" }])}
            style={{ ...smallBtnStyle, background: "white", color: "#1A4A35", border: "1px solid #1A4A35" }}
          >
            + Add FAQ
          </button>
        </div>
      </Section>

      <Section title="Transportation & Logistics (Template 5)">
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 4px", fontFamily: "sans-serif" }}>
          These fields power the Transportation &amp; Logistics carrier cards and profile page. Only used when Category is set to “Transportation &amp; Logistics”.
        </p>
        <Row>
          <div>
            <label style={labelStyle}># of Vehicles</label>
            <input style={inputStyle} type="number" min="0" value={form.vehicleCount || ""} onChange={(e) => set("vehicleCount", e.target.value)} placeholder="e.g. 24" />
          </div>
          <div>
            <label style={labelStyle}>Transport Type</label>
            <CustomSelect value={form.transportType || ""} onChange={(e) => set("transportType", e.target.value)}>
              <option value="">Select…</option>
              <option value="Temp Controlled">Temp Controlled</option>
              <option value="Dry Goods">Dry Goods</option>
              <option value="Armored">Armored</option>
              <option value="Refrigerated">Refrigerated</option>
            </CustomSelect>
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Loads per Month</label>
            <input style={inputStyle} value={form.loadsPerMonth || ""} onChange={(e) => set("loadsPerMonth", e.target.value)} placeholder="e.g. 480+" />
          </div>
          <div>
            <label style={labelStyle}># of States Active</label>
            <input style={inputStyle} type="number" min="0" value={form.statesActive || ""} onChange={(e) => set("statesActive", e.target.value)} placeholder="e.g. 6" />
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Cargo Insurance (trust badge)</label>
            <input style={inputStyle} value={form.cargoInsurance || ""} onChange={(e) => set("cargoInsurance", e.target.value)} placeholder="e.g. $5M Cargo Coverage" />
          </div>
          <div>
            <label style={labelStyle}>Dispatch Hours</label>
            <input style={inputStyle} value={form.dispatchHours || ""} onChange={(e) => set("dispatchHours", e.target.value)} placeholder="e.g. 24/7 Dispatch" />
          </div>
        </Row>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#374151", fontFamily: "sans-serif" }}>
          <input type="checkbox" checked={!!form.gpsTracked} onChange={(e) => set("gpsTracked", e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "#1A4A35" }} />
          GPS Tracked
        </label>

        {/* Licenses table */}
        <div>
          <label style={labelStyle}>Licenses &amp; Credentials (shown as a table on profile)</label>
          {(form.licensesTable || []).map((lic: { type: string; authority: string; number: string; status: string }, i: number) => (
            <div key={i} style={{ background: "#F9FAFB", borderRadius: "10px", padding: "16px", marginBottom: "12px", border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#374151", fontFamily: "sans-serif" }}>License {i + 1}</span>
                <button
                  type="button"
                  onClick={() => set("licensesTable", (form.licensesTable || []).filter((_: unknown, idx: number) => idx !== i))}
                  style={{ fontSize: "12px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}
                >
                  Remove
                </button>
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                <Row>
                  <input style={inputStyle} placeholder="Type (e.g. Cannabis Distributor)" value={lic.type} onChange={(e) => { const u = [...(form.licensesTable || [])]; u[i] = { ...u[i], type: e.target.value }; set("licensesTable", u); }} />
                  <input style={inputStyle} placeholder="Issuing Authority (e.g. California DCC)" value={lic.authority || ""} onChange={(e) => { const u = [...(form.licensesTable || [])]; u[i] = { ...u[i], authority: e.target.value }; set("licensesTable", u); }} />
                </Row>
                <Row>
                  <input style={inputStyle} placeholder="License / Policy # (e.g. C11-0004928)" value={lic.number || ""} onChange={(e) => { const u = [...(form.licensesTable || [])]; u[i] = { ...u[i], number: e.target.value }; set("licensesTable", u); }} />
                  <input style={inputStyle} placeholder="Status (e.g. Active)" value={lic.status || ""} onChange={(e) => { const u = [...(form.licensesTable || [])]; u[i] = { ...u[i], status: e.target.value }; set("licensesTable", u); }} />
                </Row>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("licensesTable", [...(form.licensesTable || []), { type: "", authority: "", number: "", status: "Active" }])}
            style={{ ...smallBtnStyle, background: "white", color: "#1A4A35", border: "1px solid #1A4A35" }}
          >
            + Add License
          </button>
        </div>
      </Section>

      <Section title="Testing & Science (Template 6)">
        <p style={{ fontSize: "13px", color: "#6B7280", margin: "0 0 4px", fontFamily: "sans-serif" }}>
          These fields power the Testing &amp; Science lab cards and profile page. Only used when Category is set to “Testing &amp; Science”.
        </p>
        <Row>
          <div>
            <label style={labelStyle}>Accreditation (badge)</label>
            <input style={inputStyle} value={form.accreditation || ""} onChange={(e) => set("accreditation", e.target.value)} placeholder="e.g. ISO/IEC 17025" />
          </div>
          <div>
            <label style={labelStyle}>Turnaround Time (TAT)</label>
            <input style={inputStyle} value={form.turnaroundTime || ""} onChange={(e) => set("turnaroundTime", e.target.value)} placeholder="e.g. 48 Hours" />
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Panels (card)</label>
            <input style={inputStyle} value={form.panelCount || ""} onChange={(e) => set("panelCount", e.target.value)} placeholder="e.g. 11 Categories" />
          </div>
          <div>
            <label style={labelStyle}>State License Status</label>
            <input style={inputStyle} value={form.licenseStatus || ""} onChange={(e) => set("licenseStatus", e.target.value)} placeholder="e.g. Active" />
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Facility Size</label>
            <input style={inputStyle} value={form.facilitySize || ""} onChange={(e) => set("facilitySize", e.target.value)} placeholder="e.g. 12k sqft" />
          </div>
          <div>
            <label style={labelStyle}>Samples Tested</label>
            <input style={inputStyle} value={form.samplesTested || ""} onChange={(e) => set("samplesTested", e.target.value)} placeholder="e.g. 50k+" />
          </div>
        </Row>
        <Row>
          <div>
            <label style={labelStyle}>Sample Types</label>
            <input style={inputStyle} value={form.sampleTypes || ""} onChange={(e) => set("sampleTypes", e.target.value)} placeholder="e.g. Flower, Oil, Edibles" />
          </div>
          <div>
            <label style={labelStyle}>Rush Service</label>
            <input style={inputStyle} value={form.rushService || ""} onChange={(e) => set("rushService", e.target.value)} placeholder="e.g. 24hr (+50%)" />
          </div>
        </Row>
        <div>
          <label style={labelStyle}>Sample Intake Hours</label>
          <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={form.sampleIntakeHours || ""} onChange={(e) => set("sampleIntakeHours", e.target.value)} placeholder={"Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 2:00 PM"} />
        </div>
        <TagInput label="Accreditation Badges (A2LA, DCC Licensed, etc.)" value={form.accreditations || []} onChange={(v) => set("accreditations", v)} />
        <p style={{ fontSize: "12px", color: "#6B7280", margin: "8px 0 0", fontFamily: "sans-serif" }}>
          Tip: Use <strong>Service Tags</strong> (above) for the test-category chips shown on lab cards (e.g. Potency, Pesticides, Heavy Metals).
        </p>

        {/* Testing capabilities */}
        <div>
          <label style={labelStyle}>Testing Capabilities (bento cards on profile)</label>
          {(form.capabilities || []).map((cap: { name: string; description: string; method: string }, i: number) => (
            <div key={i} style={{ background: "#F9FAFB", borderRadius: "10px", padding: "16px", marginBottom: "12px", border: "1px solid #E5E7EB" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#374151", fontFamily: "sans-serif" }}>Capability {i + 1}</span>
                <button
                  type="button"
                  onClick={() => set("capabilities", (form.capabilities || []).filter((_: unknown, idx: number) => idx !== i))}
                  style={{ fontSize: "12px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontFamily: "sans-serif" }}
                >
                  Remove
                </button>
              </div>
              <div style={{ display: "grid", gap: "10px" }}>
                <input style={inputStyle} placeholder="Name (e.g. Potency Profiling)" value={cap.name} onChange={(e) => { const u = [...(form.capabilities || [])]; u[i] = { ...u[i], name: e.target.value }; set("capabilities", u); }} />
                <input style={inputStyle} placeholder="Short description" value={cap.description || ""} onChange={(e) => { const u = [...(form.capabilities || [])]; u[i] = { ...u[i], description: e.target.value }; set("capabilities", u); }} />
                <input style={inputStyle} placeholder="Method (e.g. HPLC-DAD)" value={cap.method || ""} onChange={(e) => { const u = [...(form.capabilities || [])]; u[i] = { ...u[i], method: e.target.value }; set("capabilities", u); }} />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => set("capabilities", [...(form.capabilities || []), { name: "", description: "", method: "" }])}
            style={{ ...smallBtnStyle, background: "white", color: "#1A4A35", border: "1px solid #1A4A35" }}
          >
            + Add Capability
          </button>
        </div>
      </Section>

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => router.push("/admin/companies")}
          style={{
            padding: "11px 24px", background: "white", color: "#374151",
            border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "14px",
            fontWeight: "600", cursor: "pointer", fontFamily: "sans-serif",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "11px 28px",
            background: saving ? "#9CA3AF" : "#E8821E",
            color: "white", border: "none", borderRadius: "8px",
            fontSize: "14px", fontWeight: "600", cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "sans-serif",
          }}
        >
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Company"}
        </button>
      </div>
    </form>
  );
}
