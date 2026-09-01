"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import TierGate from "./TierGate";
import { inputStyle, labelStyle, cardStyle, sectionTitle } from "./shared";
import type { CompanyData } from "./shared";

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
      if (!res.ok) throw new Error(data.error || "Upload failed");
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
            <Image src={value} alt="Preview" fill style={{ objectFit: "cover" }} />
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
            <p style={{ color: "#6B7280", fontSize: "13px", margin: 0 }}>Uploading...</p>
          ) : (
            <>
              <p style={{ color: "#1A4A35", fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>Click to upload image</p>
              <p style={{ color: "#9CA3AF", fontSize: "12px", margin: 0 }}>JPG, PNG, WebP — max 5 MB</p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} style={{ display: "none" }} />
      {hint && !value && <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "5px" }}>{hint}</p>}
      {error && <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "5px" }}>{error}</p>}
    </div>
  );
}

export default function MediaTab({
  company,
  tier,
  onSaved,
}: {
  company: CompanyData;
  tier: string;
  onSaved: () => void;
}) {
  const [logoUrl, setLogoUrl] = useState(company.logoUrl ?? "");
  const [bannerUrl, setBannerUrl] = useState(company.bannerImageUrl ?? "");
  const [bannerCaption, setBannerCaption] = useState(company.bannerCaption ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/vendor/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoUrl, bannerImageUrl: bannerUrl, bannerCaption }),
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

  return (
    <form onSubmit={handleSave}>
      {/* Logo */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>Company Logo</h2>
        <ImageUploader
          value={logoUrl}
          onChange={(url) => { setLogoUrl(url); setSaved(false); }}
          hint="Square image recommended (e.g. 400x400px)"
        />
      </div>

      {/* Banner */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>Hero Banner</h2>
        {tier === "free" ? (
          <TierGate requiredTier="select" currentTier={tier} label="Upgrade to Select to add a hero banner">
            <div />
          </TierGate>
        ) : (
          <>
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>
                Banner Image{" "}
                <span style={{ color: "#9CA3AF", fontWeight: 400, textTransform: "none" }}>
                  — recommended 1200 x 400 px
                </span>
              </label>
              <ImageUploader
                value={bannerUrl}
                onChange={(url) => { setBannerUrl(url); setSaved(false); }}
              />
            </div>
            <div>
              <label style={labelStyle}>Banner Caption</label>
              <input
                style={inputStyle}
                value={bannerCaption}
                onChange={(e) => { setBannerCaption(e.target.value); setSaved(false); }}
                placeholder="e.g. Premium Cannabis Solutions"
                maxLength={120}
              />
            </div>
          </>
        )}
      </div>

      {/* Gallery - tier gated */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>Gallery Images</h2>
        {tier === "free" ? (
          <TierGate requiredTier="select" currentTier={tier} label="Upgrade to Select to add gallery images">
            <div />
          </TierGate>
        ) : (
          <div style={{ textAlign: "center", padding: "24px", color: "#9CA3AF", fontSize: "13px" }}>
            Gallery upload coming soon.
            {tier === "select" && " Select plan: up to 10 photos."}
            {tier === "elite" && " Verified Pro: unlimited photos."}
          </div>
        )}
      </div>

      {/* Video - elite only */}
      <div style={{ ...cardStyle, marginBottom: "16px" }}>
        <h2 style={sectionTitle}>Video</h2>
        {tier === "elite" ? (
          <div>
            <label style={labelStyle}>Video URL (YouTube or Vimeo)</label>
            <input style={inputStyle} placeholder="https://youtube.com/watch?v=..." disabled />
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "6px" }}>Video embedding coming soon.</p>
          </div>
        ) : (
          <TierGate requiredTier="elite" currentTier={tier} label="Upgrade to Verified Pro to embed videos">
            <div />
          </TierGate>
        )}
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
          {saving ? "Saving..." : "Save Media"}
        </button>
        {saved && <span style={{ color: "#16A34A", fontSize: "13px", fontWeight: 600 }}>✓ Saved</span>}
        {error && <span style={{ color: "#DC2626", fontSize: "13px" }}>{error}</span>}
      </div>
    </form>
  );
}
