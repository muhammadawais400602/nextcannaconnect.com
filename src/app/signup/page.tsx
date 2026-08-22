"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SectionDivider from "@/components/ui/SectionDivider";
import { CATEGORIES } from "@/data/categories";
import { Check, X } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

const TIERS = [
  {
    key: "free",
    name: "Unclaimed",
    price: "$0",
    period: "/mo",
    badge: null,
    badgeBg: null,
    badgeColor: null,
    highlight: false,
    pill: null,
    description: "Get your business listed in our directory at no cost.",
    features: [
      { label: "Standard directory listing", included: true },
      { label: "Name, category & location visible", included: true },
      { label: "Contact information", included: false },
      { label: "Full company page", included: false },
      { label: "Tier badge", included: false },
    ],
  },
  {
    key: "select",
    name: "Select",
    price: "$49.99",
    period: "/mo",
    badge: "SELECT",
    badgeBg: "rgba(45,110,82,0.12)",
    badgeColor: "#2d6e52",
    highlight: false,
    pill: null,
    description: "A full company profile with the NextCanna Select Seal and reduced lead pricing.",
    features: [
      { label: "Full company page", included: true },
      { label: "NextCanna Select Seal badge", included: true },
      { label: "Contact info on profile", included: true },
      { label: "Enhanced directory card", included: true },
      { label: "Priority search placement", included: false },
    ],
  },
  {
    key: "elite",
    name: "Verified Pro",
    price: "$99",
    period: "/mo",
    badge: "VERIFIED PRO",
    badgeBg: "rgba(26,74,53,0.12)",
    badgeColor: "#1A4A35",
    highlight: true,
    pill: "BEST VALUE",
    description: "The highest tier — full vetting, premium placement, and real-time calendar sync.",
    features: [
      { label: "Premium company page", included: true },
      { label: "NextCanna Verified badge (full vetting)", included: true },
      { label: "Priority search placement", included: true },
      { label: "Real-time calendar sync", included: true },
      { label: "Dedicated account support", included: true },
      { label: "Links to social media (LinkedIn, Instagram)", included: true },
      { label: "Display of Certifications", included: true },
    ],
  },
];

// Category-specific fields shown in Step 3, keyed by category slug.
// The label is used both as the field caption and the key stored on the application.
interface CatField {
  label: string;
  type?: "text" | "select";
  options?: string[];
  placeholder?: string;
}

const CATEGORY_FIELDS: Record<string, CatField[]> = {
  "retail-dispensary": [
    { label: "License Number", placeholder: "e.g. 403-01234" },
    { label: "License Type", type: "select", options: ["Rec + Medical", "Recreational", "Medical Only"] },
    { label: "Delivery", type: "select", options: ["Yes", "No", "Delivery Only"] },
    { label: "Hours", placeholder: "e.g. 9AM - 10PM" },
  ],
  "transportation-logistics": [
    { label: "Number of Vehicles", placeholder: "e.g. 24" },
    { label: "Transport Type", type: "select", options: ["Temp Controlled", "Dry Goods", "Armored", "Refrigerated"] },
    { label: "Loads per Month", placeholder: "e.g. 480+" },
    { label: "Cargo Insurance", placeholder: "e.g. $5M Cargo Coverage" },
  ],
  "testing-science": [
    { label: "Accreditation", placeholder: "e.g. ISO/IEC 17025" },
    { label: "Turnaround Time", placeholder: "e.g. 48 Hours" },
    { label: "Sample Types", placeholder: "e.g. Flower, Oil, Edibles" },
    { label: "Test Panels", placeholder: "e.g. 11 Categories" },
  ],
  "technology-software": [
    { label: "Certification", placeholder: "e.g. SOC 2 Type II" },
    { label: "Integrations", placeholder: "e.g. Metrc, BioTrack, QuickBooks" },
    { label: "Pricing Model", placeholder: "e.g. Per Location/Seat" },
  ],
  "real-estate-construction": [
    { label: "Projects Completed", placeholder: "e.g. 120+" },
    { label: "Credential Headline", placeholder: "e.g. Credentialed in 5 States" },
    { label: "Service Focus", placeholder: "e.g. Architecture, HVAC, General Contracting" },
  ],
  "cultivation-growing": [
    { label: "Canopy Size", placeholder: "e.g. 50,000 sq ft" },
    { label: "Grow Type", type: "select", options: ["Indoor", "Outdoor", "Greenhouse", "Mixed"] },
    { label: "Team Size", placeholder: "e.g. 45 employees" },
    { label: "Wholesale", type: "select", options: ["Yes", "No"] },
  ],
  "manufacturers-suppliers": [
    { label: "Minimum Order Qty", placeholder: "e.g. 500 units" },
    { label: "Lead Time", placeholder: "e.g. 2-3 Weeks" },
    { label: "OEM Available", type: "select", options: ["Yes", "No"] },
    { label: "Ships To", placeholder: "e.g. Nationwide, West Coast" },
  ],
  "extraction-processing": [
    { label: "Extraction Method", type: "select", options: ["CO2", "Ethanol", "Hydrocarbon", "Solventless", "Multi-Method"] },
    { label: "Facility Size", placeholder: "e.g. 10,000 sq ft" },
    { label: "Turnaround Time", placeholder: "e.g. 5-7 Days" },
    { label: "White Label", type: "select", options: ["Yes", "No"] },
  ],
  "consultants-advisors": [
    { label: "Specialization", placeholder: "e.g. Licensing, Operations, Compliance" },
    { label: "Clients Served", placeholder: "e.g. 200+" },
    { label: "Free Consultation", type: "select", options: ["Yes", "No"] },
    { label: "Credentials", placeholder: "e.g. JD, MBA, CPA" },
  ],
  "marketing-branding-packaging": [
    { label: "Core Services", placeholder: "e.g. Branding, Packaging Design, SEO" },
    { label: "Project Minimum", placeholder: "e.g. $2,500" },
    { label: "Avg Turnaround", placeholder: "e.g. 2-4 Weeks" },
    { label: "States Served", placeholder: "e.g. Nationwide" },
  ],
  "compliance-legal": [
    { label: "Bar License", placeholder: "e.g. CA Bar #123456" },
    { label: "Practice Areas", placeholder: "e.g. Licensing, IP, Corporate" },
    { label: "States Practiced", placeholder: "e.g. CA, CO, OR" },
    { label: "Free Consultation", type: "select", options: ["Yes", "No"] },
  ],
  "finance-insurance": [
    { label: "License (NMLS)", placeholder: "e.g. NMLS #123456" },
    { label: "Service Type", type: "select", options: ["Banking", "Lending", "Insurance", "Tax & Accounting", "Payment Processing"] },
    { label: "States Served", placeholder: "e.g. All 50 States" },
    { label: "Avg Funding Time", placeholder: "e.g. 5-10 Business Days" },
  ],
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #E8EDE8",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#1A2E1A",
  backgroundColor: "white",
  outline: "none",
  boxSizing: "border-box" as const,
};

const labelStyle = {
  display: "block" as const,
  fontWeight: 600,
  marginBottom: "6px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  fontSize: "11px",
  color: "#4A5E4A",
};

function StepIndicator({ step }: { step: number }) {
  const steps = ["Your Info", "Choose Plan", "Final Details"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "40px" }}>
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <div key={label} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "13px",
                  backgroundColor: done ? "#5CB85C" : active ? "#1A4A35" : "#E8EDE8",
                  color: done || active ? "white" : "#4A5E4A",
                  transition: "all 0.2s",
                }}
              >
                {done ? <Check size={14} /> : num}
              </div>
              <span style={{ fontSize: "10px", fontWeight: 600, color: active ? "#1A4A35" : "#4A5E4A", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: "60px", height: "2px", backgroundColor: done ? "#5CB85C" : "#E8EDE8", margin: "0 8px", marginBottom: "20px", transition: "background-color 0.2s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SignUpForm() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get("tier") || "";

  const [step, setStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [basicForm, setBasicForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    phone: "",
    stateProvince: "",
    category: "",
  });

  const [tierForm, setTierForm] = useState({
    website: "",
    description: "",
    publicPhone: "",
    serviceArea: "",
    certifications: "",
    socialLink: "",
    contactName: "",
  });

  const [categoryDetails, setCategoryDetails] = useState<Record<string, string>>({});
  const categoryFields = CATEGORY_FIELDS[basicForm.category] ?? [];

  function handleBasicSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleTierSelect(key: string) {
    setSelectedTier(key);
  }

  async function submitApplication(extraFields = {}) {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basicForm, tier: selectedTier, ...extraFields }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || data.error || "Submission failed");
      }
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleTierContinue() {
    if (!selectedTier) return;
    if (selectedTier === "free") {
      submitApplication();
    } else {
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitApplication({ ...tierForm, categoryDetails });
  }

  const tier = TIERS.find((t) => t.key === selectedTier);

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-10 text-center mx-auto"
        style={{ backgroundColor: "#1A4A35", maxWidth: "480px", color: "white" }}
      >
        <div
          className="mx-auto mb-4 flex items-center justify-center rounded-full"
          style={{ width: "72px", height: "72px", backgroundColor: "rgba(255,255,255,0.15)", fontSize: "32px" }}
        >
          ✓
        </div>
        <h2 className="font-bold text-2xl mb-2">You&apos;re on the list!</h2>
        <p style={{ opacity: 0.85, fontSize: "15px", lineHeight: 1.6 }}>
          Welcome, <strong>{basicForm.fullName}</strong>! We&apos;ve received your application for the{" "}
          <strong>{tier?.name}</strong> plan. Check <strong>{basicForm.email}</strong> for next steps.
        </p>
      </div>
    );
  }

  // ── Step 1: Basic Info ──────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className="mx-auto" style={{ maxWidth: "640px" }}>
        <StepIndicator step={1} />
        <form onSubmit={handleBasicSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input required type="text" placeholder="Jane Smith" value={basicForm.fullName}
                onChange={(e) => setBasicForm({ ...basicForm, fullName: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Company Name *</label>
              <input required type="text" placeholder="Acme Cannabis Co." value={basicForm.companyName}
                onChange={(e) => setBasicForm({ ...basicForm, companyName: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input required type="email" placeholder="jane@company.com" value={basicForm.email}
                onChange={(e) => setBasicForm({ ...basicForm, email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password *</label>
              <input required type="password" placeholder="Min. 8 characters" minLength={8} value={basicForm.password}
                onChange={(e) => setBasicForm({ ...basicForm, password: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Phone</label>
            <input type="tel" placeholder="(555) 000-0000" value={basicForm.phone}
              onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })} style={inputStyle} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>State / Province</label>
              <CustomSelect
                value={basicForm.stateProvince}
                onChange={(e) => setBasicForm({ ...basicForm, stateProvince: e.target.value })}
                style={{ color: basicForm.stateProvince ? "#003320" : "#9CA3AF" }}
              >
                <option value="">Select State / Province</option>
                <optgroup label="United States">
                  <option value="all-us">All States (USA)</option>
                  {["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </optgroup>
                <optgroup label="Canada">
                  <option value="all-ca">All Provinces (Canada)</option>
                  {["Alberta","British Columbia","Manitoba","New Brunswick","Newfoundland and Labrador","Northwest Territories","Nova Scotia","Nunavut","Ontario","Prince Edward Island","Quebec","Saskatchewan","Yukon"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </optgroup>
              </CustomSelect>
            </div>
            <div>
              <label style={labelStyle}>Business Category</label>
              <CustomSelect value={basicForm.category} onChange={(e) => setBasicForm({ ...basicForm, category: e.target.value })}>
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </CustomSelect>
            </div>
          </div>

          <button type="submit" className="btn-primary justify-center mt-2" style={{ padding: "14px", fontSize: "15px" }}>
            Sign Up →
          </button>

          <p className="text-center" style={{ fontSize: "12px", color: "#4A5E4A" }}>
            By signing up you agree to our{" "}
            <a href="/terms" style={{ color: "#F7941D" }}>Terms & Conditions</a> and{" "}
            <a href="/privacy" style={{ color: "#F7941D" }}>Privacy Policy</a>.
          </p>
        </form>
      </div>
    );
  }

  // ── Step 2: Choose Tier ─────────────────────────────────────────────────────
  if (step === 2) {
    return (
      <div className="mx-auto" style={{ maxWidth: "960px" }}>
        <StepIndicator step={2} />
        <div className="text-center mb-8">
          <h2 className="font-bold mb-2" style={{ fontSize: "24px", color: "#1A4A35" }}>Choose Your Plan</h2>
          <p style={{ color: "#4A5E4A", fontSize: "15px" }}>Select the tier that best fits your business goals. <a href="/pricing" style={{ color: "#F7941D", fontWeight: 600, textDecoration: "none" }}>Compare plans →</a></p>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", marginBottom: "32px" }}>
          {TIERS.map((t) => (
            <div
              key={t.key}
              onClick={() => handleTierSelect(t.key)}
              className="relative flex flex-col rounded-xl p-6 cursor-pointer"
              style={{
                backgroundColor: "white",
                border: `2px solid ${selectedTier === t.key ? (t.highlight ? "#1A4A35" : "#5CB85C") : t.highlight ? "#1A4A35" : "#E8EDE8"}`,
                transform: t.highlight ? "scale(1.04)" : "scale(1)",
                boxShadow: selectedTier === t.key ? "0 8px 24px rgba(26,74,53,0.15)" : t.highlight ? "0 12px 32px rgba(26,74,53,0.18)" : "none",
                transition: "all 0.2s",
              }}
            >
              {t.pill && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-bold text-white"
                  style={{ backgroundColor: "#F7941D", fontSize: "10px", letterSpacing: "1px", whiteSpace: "nowrap" }}>
                  {t.pill}
                </div>
              )}

              {selectedTier === t.key && (
                <div className="absolute top-3 right-3 rounded-full flex items-center justify-center"
                  style={{ width: "22px", height: "22px", backgroundColor: "#5CB85C" }}>
                  <Check size={13} color="white" />
                </div>
              )}

              {t.badge && (
                <div className="mb-3">
                  <span className="tier-badge" style={{ backgroundColor: t.badgeBg!, color: t.badgeColor! }}>{t.badge}</span>
                </div>
              )}

              <h3 className="font-bold mb-1" style={{ fontSize: "20px", color: "#1A2E1A", fontWeight: 800 }}>{t.name}</h3>
              <div className="mb-3">
                <span className="font-extrabold" style={{ fontSize: "28px", color: "#1A4A35" }}>{t.price}</span>
                <span style={{ color: "#4A5E4A", fontSize: "14px" }}>{t.period}</span>
              </div>

              <p style={{ color: "#4A5E4A", fontSize: "13px", lineHeight: 1.5, marginBottom: "16px" }}>{t.description}</p>

              <ul className="flex flex-col gap-2 flex-1">
                {t.features.map((f) => (
                  <li key={f.label} className="flex items-start gap-2" style={{ fontSize: "13px", color: f.included ? "#1A2E1A" : "#C0C0C0" }}>
                    {f.included
                      ? <Check size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#5CB85C" }} />
                      : <X size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#E8EDE8" }} />}
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", maxWidth: "400px", margin: "0 auto" }}>
          <button
            type="button"
            onClick={() => setStep(1)}
            style={{ flex: 1, padding: "13px", border: "2px solid #E8EDE8", borderRadius: "8px", backgroundColor: "white", color: "#4A5E4A", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleTierContinue}
            disabled={!selectedTier || submitting}
            className="btn-primary justify-center"
            style={{ flex: 2, padding: "13px", fontSize: "15px", opacity: (selectedTier && !submitting) ? 1 : 0.5, cursor: (selectedTier && !submitting) ? "pointer" : "default" }}
          >
            {submitting ? "Processing…" : "Continue →"}
          </button>
        </div>
        {submitError && <p style={{ textAlign: "center", color: "#DC2626", fontSize: "13px", marginTop: "8px" }}>{submitError}</p>}
      </div>
    );
  }

  // ── Step 3: Profile details (driven by tier + category) ──────────────────────
  const categoryName = CATEGORIES.find((c) => c.slug === basicForm.category)?.label ?? "Your Business";

  return (
    <div className="mx-auto" style={{ maxWidth: "640px" }}>
      <StepIndicator step={3} />
      <div className="text-center mb-8">
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
          <span className="tier-badge" style={{ backgroundColor: tier?.badgeBg ?? "#E8EDE8", color: tier?.badgeColor ?? "#1A2E1A" }}>
            {tier?.name ?? ""}
          </span>
          {basicForm.category && (
            <span style={{ display: "inline-block", backgroundColor: "rgba(247,148,29,0.12)", color: "#C67200", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "100px", letterSpacing: "0.5px" }}>
              {categoryName}
            </span>
          )}
        </div>
        <h2 className="font-bold mt-1 mb-1" style={{ fontSize: "22px", color: "#1A4A35" }}>Complete Your {categoryName} Profile</h2>
        <p style={{ color: "#4A5E4A", fontSize: "14px" }}>This information will appear on your public listing.</p>
      </div>

      <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
        {/* ── Company profile fields (tier-gated) ── */}
        {(selectedTier === "select" || selectedTier === "elite") && (
          <>
            <p className="font-semibold uppercase tracking-widest mb-0" style={{ color: "#1A4A35", fontSize: "10px", letterSpacing: "1.5px" }}>
              Company Profile
            </p>

            <div>
              <label style={labelStyle}>Company Description *</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your business, services, and what sets you apart..."
                value={tierForm.description}
                onChange={(e) => setTierForm({ ...tierForm, description: e.target.value })}
                style={{ ...inputStyle, resize: "vertical" as const }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>Website URL</label>
                <input type="url" placeholder="https://yourcompany.com" value={tierForm.website}
                  onChange={(e) => setTierForm({ ...tierForm, website: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Public Phone</label>
                <input type="tel" placeholder="(555) 000-0000" value={tierForm.publicPhone}
                  onChange={(e) => setTierForm({ ...tierForm, publicPhone: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Service Area</label>
              <input type="text" placeholder="e.g. Western US, Nationwide" value={tierForm.serviceArea}
                onChange={(e) => setTierForm({ ...tierForm, serviceArea: e.target.value })} style={inputStyle} />
            </div>
          </>
        )}

        {/* ── Verified Pro extras ── */}
        {selectedTier === "elite" && (
          <>
            <div>
              <label style={labelStyle}>Certifications / Licenses</label>
              <input type="text" placeholder="e.g. METRC, ISO 9001, State License #..." value={tierForm.certifications}
                onChange={(e) => setTierForm({ ...tierForm, certifications: e.target.value })} style={inputStyle} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label style={labelStyle}>LinkedIn / Social URL</label>
                <input type="url" placeholder="https://linkedin.com/company/..." value={tierForm.socialLink}
                  onChange={(e) => setTierForm({ ...tierForm, socialLink: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Primary Contact Name</label>
                <input type="text" placeholder="Contact person for vetting" value={tierForm.contactName}
                  onChange={(e) => setTierForm({ ...tierForm, contactName: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </>
        )}

        {/* ── Category-specific business details ── */}
        {categoryFields.length > 0 && (
          <div style={{ borderTop: "1px solid #E8EDE8", paddingTop: "20px", marginTop: "4px" }}>
            <p className="font-semibold uppercase tracking-widest mb-1" style={{ color: "#F7941D", fontSize: "10px", letterSpacing: "1.5px" }}>
              {categoryName} Details
            </p>
            <p style={{ fontSize: "12px", color: "#4A5E4A", marginBottom: "16px" }}>
              These help us build your specialized {categoryName.toLowerCase()} listing.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categoryFields.map((f) => (
                <div key={f.label}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.type === "select" ? (
                    <CustomSelect
                      value={categoryDetails[f.label] ?? ""}
                      onChange={(e) => setCategoryDetails((prev) => ({ ...prev, [f.label]: e.target.value }))}
                      style={{ color: categoryDetails[f.label] ? "#003320" : "#9CA3AF" }}
                    >
                      <option value="">Select…</option>
                      {(f.options ?? []).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </CustomSelect>
                  ) : (
                    <input
                      type="text"
                      placeholder={f.placeholder ?? ""}
                      value={categoryDetails[f.label] ?? ""}
                      onChange={(e) => setCategoryDetails((prev) => ({ ...prev, [f.label]: e.target.value }))}
                      style={inputStyle}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={() => setStep(2)}
            style={{ padding: "13px 20px", border: "2px solid #E8EDE8", borderRadius: "8px", backgroundColor: "white", color: "#4A5E4A", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            ← Back
          </button>
          <button type="submit" disabled={submitting} className="btn-primary justify-center" style={{ flex: 1, padding: "14px", fontSize: "15px", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
            {submitting
              ? "Processing…"
              : (selectedTier === "free" ? "Complete Registration →" : "Proceed to Payment →")
            }
          </button>
        </div>
        {submitError && <p style={{ textAlign: "center", color: "#DC2626", fontSize: "13px", marginTop: "8px" }}>{submitError}</p>}

        <p className="text-center" style={{ fontSize: "12px", color: "#4A5E4A" }}>
          By signing up you agree to our{" "}
          <a href="/terms" style={{ color: "#F7941D" }}>Terms & Conditions</a> and{" "}
          <a href="/privacy" style={{ color: "#F7941D" }}>Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <>
      <SectionDivider />
      <div className="px-4 md:px-8" style={{ backgroundColor: "#F7F9F7", paddingTop: "120px", paddingBottom: "64px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="text-center mb-10">
            <p className="font-semibold uppercase tracking-widest mb-2" style={{ color: "#F7941D", fontSize: "11px", letterSpacing: "2px" }}>
              Join NextCanna Connect
            </p>
            <h1 className="font-bold mb-2" style={{ fontSize: "32px", color: "#1A4A35", fontWeight: 800 }}>
              Get Started Today
            </h1>
            <p style={{ color: "#4A5E4A", fontSize: "15px" }}>
              List your business and connect with verified cannabis vendors.
            </p>
          </div>

          <Suspense fallback={
            <div className="mx-auto" style={{ maxWidth: "640px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", opacity: 0.5 }}>
                <div style={{ height: "32px", width: "60%", margin: "0 auto", background: "#E8EDE8", borderRadius: "8px" }} />
                <div style={{ height: "48px", background: "#E8EDE8", borderRadius: "8px" }} />
                <div style={{ height: "48px", background: "#E8EDE8", borderRadius: "8px" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ height: "48px", background: "#E8EDE8", borderRadius: "8px" }} />
                  <div style={{ height: "48px", background: "#E8EDE8", borderRadius: "8px" }} />
                </div>
                <div style={{ height: "48px", background: "#1A4A35", borderRadius: "8px" }} />
              </div>
            </div>
          }>
            <SignUpForm />
          </Suspense>
        </div>
      </div>
      <SectionDivider reverse />
    </>
  );
}
