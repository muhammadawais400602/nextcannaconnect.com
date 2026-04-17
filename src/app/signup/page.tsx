"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SectionDivider from "@/components/ui/SectionDivider";
import { CATEGORIES } from "@/data/categories";
import { Check, X } from "lucide-react";

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
    submitApplication(tierForm);
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
              <label style={labelStyle}>Phone</label>
              <input type="tel" placeholder="(555) 000-0000" value={basicForm.phone}
                onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>State / Province</label>
              <select value={basicForm.stateProvince}
                onChange={(e) => setBasicForm({ ...basicForm, stateProvince: e.target.value })}
                style={{ ...inputStyle, color: basicForm.stateProvince ? "#003320" : "#9CA3AF" }}>
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
              </select>
            </div>
            <div>
              <label style={labelStyle}>Business Category</label>
              <select value={basicForm.category} onChange={(e) => setBasicForm({ ...basicForm, category: e.target.value })} style={inputStyle}>
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </select>
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
          <p style={{ color: "#4A5E4A", fontSize: "15px" }}>Select the tier that best fits your business goals.</p>
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
            {submitting ? "Submitting…" : "Continue →"}
          </button>
        </div>
        {submitError && <p style={{ textAlign: "center", color: "#DC2626", fontSize: "13px", marginTop: "8px" }}>{submitError}</p>}
      </div>
    );
  }

  // ── Step 3: Tier-specific details ────────────────────────────────────────────
  return (
    <div className="mx-auto" style={{ maxWidth: "640px" }}>
      <StepIndicator step={3} />
      <div className="text-center mb-8">
        <span className="tier-badge" style={{ backgroundColor: tier?.badgeBg ?? "#E8EDE8", color: tier?.badgeColor ?? "#1A2E1A" }}>
          {tier?.name ?? ""}
        </span>
        <h2 className="font-bold mt-3 mb-1" style={{ fontSize: "22px", color: "#1A4A35" }}>Complete Your Profile</h2>
        <p style={{ color: "#4A5E4A", fontSize: "14px" }}>This information will appear on your public listing.</p>
      </div>

      <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
        {/* Select + Verified Pro */}
        {(selectedTier === "select" || selectedTier === "elite") && (
          <>
            <div>
              <label style={labelStyle}>Website URL</label>
              <input type="url" placeholder="https://yourcompany.com" value={tierForm.website}
                onChange={(e) => setTierForm({ ...tierForm, website: e.target.value })} style={inputStyle} />
            </div>

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
                <label style={labelStyle}>Public Phone</label>
                <input type="tel" placeholder="(555) 000-0000" value={tierForm.publicPhone}
                  onChange={(e) => setTierForm({ ...tierForm, publicPhone: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Service Area</label>
                <input type="text" placeholder="e.g. Western US, Nationwide" value={tierForm.serviceArea}
                  onChange={(e) => setTierForm({ ...tierForm, serviceArea: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </>
        )}

        {/* Verified Pro only */}
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

        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <button
            type="button"
            onClick={() => setStep(2)}
            style={{ padding: "13px 20px", border: "2px solid #E8EDE8", borderRadius: "8px", backgroundColor: "white", color: "#4A5E4A", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            ← Back
          </button>
          <button type="submit" disabled={submitting} className="btn-primary justify-center" style={{ flex: 1, padding: "14px", fontSize: "15px", opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
            {submitting ? "Submitting…" : "Complete Registration →"}
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

          <Suspense fallback={<div>Loading...</div>}>
            <SignUpForm />
          </Suspense>
        </div>
      </div>
      <SectionDivider reverse />
    </>
  );
}
