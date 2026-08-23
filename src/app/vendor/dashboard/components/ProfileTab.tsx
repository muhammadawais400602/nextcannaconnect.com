"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/categories";
import CustomSelect from "@/components/ui/CustomSelect";
import TierGate from "./TierGate";
import { inputStyle, labelStyle, cardStyle, sectionTitle, gridTwo } from "./shared";
import type { CompanyData } from "./shared";

const US_STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","District of Columbia"];
const CA_PROVINCES = ["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"];

interface ProfileForm {
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
}

function companyToProfileForm(c: CompanyData): ProfileForm {
  const loc = c.location ?? {};
  return {
    category: c.category ?? "",
    shortDescription: c.shortDescription ?? "",
    fullDescription: c.fullDescription ?? "",
    website: c.website ?? "",
    phone: c.phone ?? "",
    linkedinUrl: c.linkedinUrl ?? "",
    instagramUrl: c.instagramUrl ?? "",
    youtubeUrl: c.youtubeUrl ?? "",
    address: loc.address ?? "",
    city: loc.city ?? "",
    state: loc.state ?? "",
    zip: loc.zip ?? "",
  };
}

export default function ProfileTab({
  company,
  tier,
  onSaved,
}: {
  company: CompanyData;
  tier: string;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<ProfileForm>(companyToProfileForm(company));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key: keyof ProfileForm, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/vendor/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaved(true);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const isElite = tier === "elite";
  const isSelect = tier === "select" || isElite;

  return (
    <form onSubmit={handleSave}>
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>Business Profile</h2>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>
            Category{" "}
            <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>
              — which directory your listing appears in
            </span>
          </label>
          <CustomSelect value={form.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">— Select a category —</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.label}</option>
            ))}
          </CustomSelect>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Tagline</label>
          {isSelect ? (
            <input
              style={inputStyle}
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="e.g. Premium cannabis equipment manufacturer"
              maxLength={200}
            />
          ) : (
            <TierGate requiredTier="select" currentTier={tier} label="Upgrade to add a tagline">
              <input style={inputStyle} disabled />
            </TierGate>
          )}
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>About Your Business</label>
          {isSelect ? (
            <textarea
              style={{ ...inputStyle, minHeight: "120px", resize: "vertical" }}
              value={form.fullDescription}
              onChange={(e) => set("fullDescription", e.target.value)}
              placeholder="Describe your business, expertise, and what sets you apart..."
            />
          ) : (
            <TierGate requiredTier="select" currentTier={tier} label="Upgrade to Select to add a business description">
              <textarea style={{ ...inputStyle, minHeight: "120px" }} disabled />
            </TierGate>
          )}
        </div>

        <div style={{ ...gridTwo, marginBottom: "14px" }}>
          <div>
            <label style={labelStyle}>Website URL</label>
            {isSelect ? (
              <input
                style={inputStyle}
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://yoursite.com"
                type="url"
              />
            ) : (
              <TierGate requiredTier="select" currentTier={tier} label="Upgrade to Select to add your website">
                <input style={inputStyle} disabled />
              </TierGate>
            )}
          </div>
          <div>
            <label style={labelStyle}>Public Phone</label>
            <input
              style={inputStyle}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>LinkedIn URL</label>
          {isElite ? (
            <input
              style={inputStyle}
              value={form.linkedinUrl}
              onChange={(e) => set("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/company/..."
              type="url"
            />
          ) : (
            <TierGate requiredTier="elite" currentTier={tier} label="Upgrade to Verified Pro to add social links">
              <input style={inputStyle} disabled />
            </TierGate>
          )}
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Instagram URL</label>
          {isElite ? (
            <input
              style={inputStyle}
              value={form.instagramUrl}
              onChange={(e) => set("instagramUrl", e.target.value)}
              placeholder="https://instagram.com/..."
              type="url"
            />
          ) : (
            <TierGate requiredTier="elite" currentTier={tier} label="Upgrade to Verified Pro to add social links">
              <input style={inputStyle} disabled />
            </TierGate>
          )}
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>YouTube Video URL</label>
          {isElite ? (
            <input
              style={inputStyle}
              value={form.youtubeUrl}
              onChange={(e) => set("youtubeUrl", e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              type="url"
            />
          ) : (
            <TierGate requiredTier="elite" currentTier={tier} label="Upgrade to Verified Pro to embed a video">
              <input style={inputStyle} disabled />
            </TierGate>
          )}
        </div>
      </div>

      {/* Address */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>Location</h2>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Street Address</label>
          <input
            style={inputStyle}
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="e.g. 123 Cannabis Blvd, Suite 400"
          />
        </div>

        <div style={{ ...gridTwo, marginBottom: "14px" }}>
          <div>
            <label style={labelStyle}>City</label>
            <input
              style={inputStyle}
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="e.g. Denver"
            />
          </div>
          <div>
            <label style={labelStyle}>ZIP / Postal Code</label>
            <input
              style={inputStyle}
              value={form.zip}
              onChange={(e) => set("zip", e.target.value)}
              placeholder="e.g. 80202"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>State / Province</label>
          <CustomSelect value={form.state} onChange={(e) => set("state", e.target.value)}>
            <option value="">— Select state / province —</option>
            <optgroup label="United States">
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </optgroup>
            <optgroup label="Canada">
              {CA_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </optgroup>
          </CustomSelect>
        </div>
      </div>

      {/* Sticky save */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "rgba(247,249,247,0.95)",
          backdropFilter: "blur(8px)",
          padding: "14px 0",
          borderTop: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          zIndex: 5,
        }}
      >
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "12px 28px",
            background: "#1A4A35",
            color: "white",
            border: "none",
            borderRadius: "9px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {saved && (
          <span style={{ color: "#16A34A", fontSize: "13px", fontWeight: 600 }}>
            ✓ Saved
          </span>
        )}
        {error && (
          <span style={{ color: "#DC2626", fontSize: "13px" }}>{error}</span>
        )}
      </div>
    </form>
  );
}
