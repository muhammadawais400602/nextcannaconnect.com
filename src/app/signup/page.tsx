"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SectionDivider from "@/components/ui/SectionDivider";
import { CATEGORIES } from "@/data/categories";
import { Check } from "lucide-react";

const TIERS = [
  { key: "free", name: "Free", price: "$0/mo", bg: "#F7F9F7", border: "#E8EDE8", textColor: "#1A2E1A" },
  { key: "claimed", name: "Claimed", price: "$4.99/mo", bg: "#FFF8E1", border: "#F9C31A", textColor: "#1A2E1A" },
  { key: "select", name: "Select", price: "$49.99/mo", bg: "#F0FAF0", border: "#5CB85C", textColor: "#1A2E1A" },
  { key: "elite", name: "Elite", price: "$99/mo", bg: "#1A4A35", border: "#1A4A35", textColor: "white" },
];

function SignUpForm() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get("tier") || "free";
  const initialListing = searchParams.get("listing") || "";

  const accountType = "vendor";
  const [selectedTier, setSelectedTier] = useState(initialTier);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    stateProvince: "",
    category: "",
    listing: initialListing,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #E8EDE8",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1A2E1A",
    backgroundColor: "white",
    outline: "none",
  };

  if (submitted) {
    const tier = TIERS.find((t) => t.key === selectedTier);
    return (
      <div
        className="rounded-2xl p-10 text-center mx-auto"
        style={{ backgroundColor: "#5CB85C", maxWidth: "480px", color: "white" }}
      >
        <div
          className="mx-auto mb-4 flex items-center justify-center rounded-full font-bold text-3xl"
          style={{ width: "72px", height: "72px", backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          ✓
        </div>
        <h2 className="font-bold text-2xl mb-2">You&apos;re on the list!</h2>
        <p style={{ opacity: 0.9, fontSize: "15px", lineHeight: 1.6 }}>
          Welcome, <strong>{form.fullName}</strong>! We&apos;ve received your application for the{" "}
          <strong>{tier?.name}</strong> tier. Check <strong>{form.email}</strong> for next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: "640px" }}>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Common fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
              Full Name *
            </label>
            <input
              required
              type="text"
              placeholder="Jane Smith"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
              Company Name *
            </label>
            <input
              required
              type="text"
              placeholder="Acme Cannabis Co."
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
              Email Address *
            </label>
            <input
              required
              type="email"
              placeholder="jane@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
              Phone
            </label>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
            State / Province
          </label>
          <input
            type="text"
            placeholder="e.g. Colorado"
            value={form.stateProvince}
            onChange={(e) => setForm({ ...form, stateProvince: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* Vendor-only fields */}
        {accountType === "vendor" && (
          <>
            <div>
              <label className="block font-semibold mb-1.5 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
                Business Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={inputStyle}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Tier selector */}
            <div>
              <label className="block font-semibold mb-3 uppercase tracking-wider" style={{ fontSize: "11px", color: "#4A5E4A", letterSpacing: "1px" }}>
                Membership Tier
              </label>
              <div className="grid grid-cols-2 gap-3">
                {TIERS.map((tier) => (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => setSelectedTier(tier.key)}
                    className="relative text-left p-4 rounded-xl transition-all"
                    style={{
                      backgroundColor: selectedTier === tier.key ? tier.bg : "white",
                      border: `2px solid ${selectedTier === tier.key ? tier.border : "#E8EDE8"}`,
                    }}
                  >
                    {selectedTier === tier.key && (
                      <div
                        className="absolute top-2 right-2 rounded-full flex items-center justify-center"
                        style={{ width: "20px", height: "20px", backgroundColor: "#F7941D" }}
                      >
                        <Check size={12} color="white" />
                      </div>
                    )}
                    <p
                      className="font-bold"
                      style={{
                        fontSize: "14px",
                        color: selectedTier === tier.key && tier.key === "elite" ? "white" : "#1A2E1A",
                        fontWeight: 700,
                      }}
                    >
                      {tier.name}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: selectedTier === tier.key && tier.key === "elite" ? "rgba(255,255,255,0.8)" : "#4A5E4A",
                      }}
                    >
                      {tier.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn-primary justify-center mt-2" style={{ padding: "14px", fontSize: "15px" }}>
          {accountType === "vendor" ? "Create My Listing →" : "Create Account →"}
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

export default function SignUpPage() {
  return (
    <>
      <SectionDivider />
      <div className="py-16 px-8" style={{ backgroundColor: "#F7F9F7" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="text-center mb-10">
            <p className="font-semibold uppercase tracking-widest mb-2" style={{ color: "#F7941D", fontSize: "11px", letterSpacing: "2px" }}>
              Join NextCanna Connect
            </p>
            <h1 className="font-bold mb-2" style={{ fontSize: "32px", color: "#1A4A35", fontWeight: 800 }}>
              Get Started Today
            </h1>
            <p style={{ color: "#4A5E4A", fontSize: "15px" }}>
              List your business or find verified cannabis vendors — all in one place.
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
