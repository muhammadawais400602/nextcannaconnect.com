import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPANIES, getCompanyBySlug, getCompaniesByCategory } from "@/data/companies";
import { getCategoryBySlug } from "@/data/categories";
import { Star, MapPin, Globe, Phone, Mail, ChevronDown, ArrowLeft, ArrowRight, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { Company } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPANIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return {};
  return {
    title: `${company.name} | NextCanna Connect`,
    description: company.shortDescription,
  };
}

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= Math.round(rating) ? "#F9C31A" : "#D1D5DB"}
          stroke="none"
        />
      ))}
    </div>
  );
}

// ── Capability Row (accordion-style display) ──────────────────────────────────
function CapabilityRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div
      className="flex items-center justify-between py-3 px-4 cursor-pointer"
      style={{ borderBottom: "1px solid #E5E7EB" }}
    >
      <span
        className="font-semibold uppercase tracking-wide"
        style={{ fontSize: "11px", color: "#374151", letterSpacing: "0.8px" }}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: "12px", color: "#6B7280", maxWidth: "120px", textAlign: "right" }}>
          {value}
        </span>
        <ChevronDown size={13} style={{ color: "#9CA3AF", flexShrink: 0 }} />
      </div>
    </div>
  );
}

// ── Project Card (placeholder) ────────────────────────────────────────────────
function ProjectCard({ color, index }: { color: string; index: number }) {
  const gradients = [
    "linear-gradient(135deg, #1A4A35 0%, #2d6b50 100%)",
    "linear-gradient(135deg, #2d4a2d 0%, #3d6e3d 100%)",
    "linear-gradient(135deg, #1a3a2a 0%, #2a5a3f 100%)",
    "linear-gradient(135deg, #0f2d1e 0%, #1A4A35 100%)",
    "linear-gradient(135deg, #244d35 0%, #3a6e4f 100%)",
    "linear-gradient(135deg, #1d4030 0%, #2d5e45 100%)",
  ];
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: gradients[index % gradients.length],
        aspectRatio: "4/3",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ opacity: 0.3 }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="4" y="20" width="32" height="16" rx="2" fill="white" />
          <polygon points="2,20 20,6 38,20" fill="white" />
          <rect x="14" y="26" width="12" height="10" fill={color} />
        </svg>
      </div>
    </div>
  );
}

// ── Certification Card ────────────────────────────────────────────────────────
function CertCard({ name }: { name: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg p-3 text-center"
      style={{
        border: "1.5px solid #E5E7EB",
        background: "white",
        minWidth: "100px",
        minHeight: "80px",
      }}
    >
      <div
        className="mb-1.5 rounded"
        style={{
          width: "36px",
          height: "28px",
          background: "linear-gradient(135deg, #f0f4f0, #e0e8e0)",
          border: "1px solid #D1D5DB",
        }}
      />
      <span style={{ fontSize: "11px", color: "#374151", fontWeight: 600, lineHeight: 1.3 }}>
        {name}
      </span>
    </div>
  );
}

// ── "You Might Also Like" Card ────────────────────────────────────────────────
function SimilarCard({ company }: { company: Company }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "white", border: "1px solid #E5E7EB" }}
    >
      {/* Logo banner */}
      <div
        className="flex items-center justify-center"
        style={{ height: "90px", background: company.logoColor + "22", borderBottom: "1px solid #E5E7EB" }}
      >
        <div
          className="rounded-xl flex items-center justify-center font-black text-white"
          style={{ width: "56px", height: "56px", backgroundColor: company.logoColor, fontSize: "16px" }}
        >
          {company.logoPlaceholder}
        </div>
      </div>
      <div className="p-4">
        {company.rating && (
          <div className="flex items-center gap-1.5 mb-1">
            <StarRating rating={company.rating} size={12} />
            <span style={{ fontSize: "11px", color: "#6B7280" }}>
              {company.rating} ({company.reviewCount})
            </span>
          </div>
        )}
        <h4 className="font-bold mb-1" style={{ fontSize: "14px", color: "#111827" }}>
          {company.name}
        </h4>
        <p
          className="mb-3"
          style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {company.shortDescription}
        </p>
        {company.location && (
          <div className="flex items-center gap-1 mb-3" style={{ color: "#9CA3AF", fontSize: "11px" }}>
            <MapPin size={10} />
            {company.location.city}, {company.location.state}
          </div>
        )}
        <div className="flex gap-2">
          <button
            className="flex-1 py-1.5 rounded-lg font-semibold text-white text-center"
            style={{ fontSize: "12px", backgroundColor: "#F7941D" }}
          >
            Contact ›
          </button>
          <Link
            href={`/vendor/${company.slug}`}
            className="flex-1 py-1.5 rounded-lg font-semibold text-center"
            style={{ fontSize: "12px", border: "1px solid #E5E7EB", color: "#374151" }}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function VendorPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const category = getCategoryBySlug(company.category);

  // Get similar companies (same category, excluding current)
  const similar = getCompaniesByCategory(company.category)
    .filter((c) => c.slug !== company.slug)
    .slice(0, 4);

  // Navigate to next/prev company
  const allInCategory = getCompaniesByCategory(company.category);
  const currentIndex = allInCategory.findIndex((c) => c.slug === company.slug);
  const nextCompany = allInCategory[currentIndex + 1] || allInCategory[0];

  // Build capability rows from company data
  const capabilities = [
    { label: "Category", value: category?.label },
    { label: "Service Types", value: company.serviceTags?.slice(0, 2).join(", ") },
    { label: "States Served", value: company.statesServed?.join(", ") || company.serviceArea },
    { label: "Team Size", value: company.teamSize },
    { label: "Pricing Model", value: company.pricingModel },
    { label: "Certifications", value: company.certifications?.join(", ") },
    { label: "Specialty Areas", value: company.specialtyAreas?.join(", ") },
    { label: "Availability", value: company.availability },
  ].filter((c) => c.value);

  const heroGradient = `linear-gradient(160deg, ${company.logoColor}cc 0%, #0f1a12 60%, #111827 100%)`;

  return (
    <div style={{ backgroundColor: "#F0F2F0", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          height: "260px",
          background: heroGradient,
          overflow: "hidden",
        }}
      >
        {/* Decorative pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 70% 50%, rgba(255,255,255,0.04) 0%, transparent 60%)",
          }}
        />
        {/* Back / Next nav */}
        <div
          className="mx-auto flex items-center justify-between px-6"
          style={{ maxWidth: "1180px", paddingTop: "28px" }}
        >
          <Link
            href={`/directory/${company.category}`}
            className="flex items-center gap-2 font-semibold"
            style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", textDecoration: "none" }}
          >
            <ArrowLeft size={14} />
            Back to Results
          </Link>
          <Link
            href={`/vendor/${nextCompany.slug}`}
            className="flex items-center gap-2 font-semibold"
            style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", textDecoration: "none" }}
          >
            Show Next
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="mx-auto px-6" style={{ maxWidth: "1180px", marginTop: "-80px", paddingBottom: "64px" }}>
        <div className="flex gap-6" style={{ alignItems: "flex-start" }}>

          {/* ══ Left Column ══ */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Company Card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #E5E7EB" }}>
              <div className="p-6">
                {/* Logo + Name + Buttons row */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Logo */}
                  <div
                    className="rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
                    style={{ width: "72px", height: "72px", backgroundColor: company.logoColor, fontSize: "20px", border: "3px solid white", boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}
                  >
                    {company.logoPlaceholder}
                  </div>

                  {/* Name + rating + buttons */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h1 className="font-extrabold" style={{ fontSize: "22px", color: "#111827", letterSpacing: "-0.3px" }}>
                          {company.name}
                        </h1>
                        {company.rating && (
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={company.rating} />
                            <span style={{ fontSize: "13px", color: "#6B7280" }}>{company.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          className="font-semibold rounded-lg px-4 py-2 text-white"
                          style={{ backgroundColor: "#F7941D", fontSize: "13px" }}
                        >
                          Contact ›
                        </button>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold rounded-lg px-4 py-2"
                            style={{ border: "1.5px solid #D1D5DB", color: "#374151", fontSize: "13px", textDecoration: "none" }}
                          >
                            Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {company.yearsExperience && (
                    <span className="px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#F3F4F6", color: "#374151", fontSize: "12px", border: "1px solid #E5E7EB" }}>
                      {company.yearsExperience} Years Of Experience
                    </span>
                  )}
                  {company.yearsInCannabis && (
                    <span className="px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#F3F4F6", color: "#374151", fontSize: "12px", border: "1px solid #E5E7EB" }}>
                      {company.yearsInCannabis} Years In Cannabis
                    </span>
                  )}
                  {company.pricingModel && (
                    <span className="px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#F3F4F6", color: "#374151", fontSize: "12px", border: "1px solid #E5E7EB" }}>
                      {company.pricingModel}
                    </span>
                  )}
                  {company.teamSize && (
                    <span className="px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#F3F4F6", color: "#374151", fontSize: "12px", border: "1px solid #E5E7EB" }}>
                      {company.teamSize}
                    </span>
                  )}
                  {!company.yearsExperience && !company.yearsInCannabis && category && (
                    <span className="px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#EEF7F0", color: "#1A4A35", fontSize: "12px", border: "1px solid #C8E0CC" }}>
                      {category.shortLabel}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.75, marginBottom: "20px" }}>
                  {company.fullDescription || company.shortDescription}
                </p>

                {/* Social icons */}
                <div className="flex items-center gap-3">
                  {[
                    { Icon: Linkedin, label: "LinkedIn" },
                    { Icon: Facebook, label: "Facebook" },
                    { Icon: Instagram, label: "Instagram" },
                    { Icon: Youtube, label: "YouTube" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center justify-center rounded-full cursor-pointer"
                      style={{ width: "32px", height: "32px", border: "1.5px solid #E5E7EB", color: "#6B7280" }}
                      title={label}
                    >
                      <Icon size={14} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Area */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #E5E7EB" }}>
              <div className="p-6">
                <h2 className="font-bold mb-4" style={{ fontSize: "16px", color: "#111827" }}>
                  Service Area
                </h2>

                {/* Location row */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div className="flex items-center gap-2" style={{ color: "#6B7280", fontSize: "13px" }}>
                    <MapPin size={14} style={{ color: "#F7941D" }} />
                    {company.location.city}, {company.location.state}
                    {company.serviceArea && (
                      <span className="ml-1" style={{ color: "#9CA3AF" }}>• {company.serviceArea}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: "#EEF7F0", color: "#1A4A35", fontSize: "12px", border: "1px solid #C8E0CC" }}
                    >
                      Availability For Your Area
                    </span>
                    <button
                      className="px-3 py-1 rounded-lg font-semibold text-white"
                      style={{ backgroundColor: "#F7941D", fontSize: "12px" }}
                    >
                      Change Zip
                    </button>
                  </div>
                </div>

                {/* States served */}
                {(company.statesServed && company.statesServed.length > 0) ? (
                  <div>
                    <p className="font-semibold mb-3" style={{ fontSize: "13px", color: "#374151" }}>
                      {company.name} Serving These States:
                    </p>
                    <div className="flex gap-8">
                      <div className="flex-1">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                          {company.statesServed.map((state) => (
                            <span key={state} style={{ fontSize: "13px", color: "#6B7280" }}>
                              {state}
                            </span>
                          ))}
                        </div>
                        <button className="mt-3 font-semibold" style={{ fontSize: "12px", color: "#F7941D", background: "none", border: "none", cursor: "pointer" }}>
                          Show Full List ›
                        </button>
                      </div>
                      {/* Simple US map placeholder */}
                      <div
                        className="hidden sm:flex rounded-lg items-center justify-center flex-shrink-0"
                        style={{ width: "160px", height: "100px", background: "#F0F6F2", border: "1px solid #E5E7EB" }}
                      >
                        <svg viewBox="0 0 200 130" width="140" height="88" fill="none">
                          <path d="M20 40 L60 20 L140 15 L180 30 L190 60 L170 90 L140 105 L80 110 L30 95 Z" fill="#D1E8D8" stroke="#A3C4A8" strokeWidth="1.5" />
                          <circle cx="45" cy="65" r="8" fill="#1A4A35" opacity="0.6" />
                          <text x="45" y="68" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
                            {company.location.state}
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <div
                      className="px-3 py-1 rounded-full font-medium"
                      style={{ backgroundColor: "#F3F4F6", color: "#374151", fontSize: "12px" }}
                    >
                      {company.serviceArea || `${company.location.city}, ${company.location.state}`}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Projects */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #E5E7EB" }}>
              <div className="p-6">
                <h2 className="font-bold mb-4" style={{ fontSize: "16px", color: "#111827" }}>
                  Featured Projects
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <ProjectCard key={i} color={company.logoColor} index={i} />
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications */}
            {(company.certifications && company.certifications.length > 0) || (company.credentials && company.credentials.length > 0) ? (
              <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #E5E7EB" }}>
                <div className="p-6">
                  <h2 className="font-bold mb-4" style={{ fontSize: "16px", color: "#111827" }}>
                    Certifications
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {(company.certifications || company.credentials || []).map((cert) => (
                      <CertCard key={cert} name={cert} />
                    ))}
                  </div>
                  <button className="mt-4 font-semibold" style={{ fontSize: "12px", color: "#F7941D", background: "none", border: "none", cursor: "pointer" }}>
                    Show More ›
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* ══ Right Sidebar ══ */}
          <div className="hidden lg:flex flex-col gap-5 flex-shrink-0" style={{ width: "272px" }}>

            {/* Capabilities card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #E5E7EB" }}>
              <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid #E5E7EB" }}
              >
                <h3 className="font-bold" style={{ fontSize: "14px", color: "#111827" }}>
                  Capabilities
                </h3>
              </div>
              <div>
                {capabilities.length > 0 ? (
                  capabilities.map((cap) => (
                    <CapabilityRow key={cap.label} label={cap.label} value={cap.value} />
                  ))
                ) : (
                  company.serviceTags.map((tag) => (
                    <CapabilityRow key={tag} label={tag} value="View Details" />
                  ))
                )}
              </div>
            </div>

            {/* Contact card */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "white", border: "1px solid #E5E7EB" }}>
              <div
                className="px-4 py-3"
                style={{ borderBottom: "1px solid #E5E7EB" }}
              >
                <h3 className="font-bold" style={{ fontSize: "14px", color: "#111827" }}>
                  {company.name}
                </h3>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {company.email && (
                  <a
                    href={`mailto:${company.email}`}
                    className="flex items-center gap-2"
                    style={{ color: "#6B7280", fontSize: "13px", textDecoration: "none" }}
                  >
                    <Mail size={13} style={{ color: "#9CA3AF" }} />
                    {company.email}
                  </a>
                )}
                {company.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="flex items-center gap-2"
                    style={{ color: "#6B7280", fontSize: "13px", textDecoration: "none" }}
                  >
                    <Phone size={13} style={{ color: "#9CA3AF" }} />
                    {company.phone}
                  </a>
                )}
                <button
                  className="w-full py-2.5 rounded-lg font-semibold text-white mt-1"
                  style={{ backgroundColor: "#F7941D", fontSize: "13px" }}
                >
                  Contact ›
                </button>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center font-medium"
                    style={{ color: "#6B7280", fontSize: "13px", textDecoration: "none" }}
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contact CTA Banner ── */}
      <section
        style={{
          background: `linear-gradient(100deg, #111827 55%, ${company.logoColor}88 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative overlay */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "45%",
            background: `linear-gradient(135deg, ${company.logoColor}44, #1a4a3588)`,
            clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        />
        <div className="mx-auto px-6 py-16 relative" style={{ maxWidth: "1180px" }}>
          <div style={{ maxWidth: "480px" }}>
            <h2 className="font-extrabold mb-3 text-white" style={{ fontSize: "28px", letterSpacing: "-0.4px" }}>
              Contact {company.name}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: 1.7, marginBottom: "28px" }}>
              {company.shortDescription}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <button
                className="font-semibold rounded-lg px-6 py-3 text-white"
                style={{ backgroundColor: "#F7941D", fontSize: "14px" }}
              >
                Contact ›
              </button>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold"
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", textDecoration: "none" }}
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── You Might Also Like ── */}
      {similar.length > 0 && (
        <section style={{ background: "white", borderTop: "1px solid #E5E7EB" }}>
          <div className="mx-auto px-6 py-16" style={{ maxWidth: "1180px" }}>
            <h2
              className="font-extrabold text-center mb-10"
              style={{ fontSize: "26px", color: "#111827", letterSpacing: "-0.3px" }}
            >
              You Might Also Like
            </h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((c) => (
                <SimilarCard key={c.slug} company={c} />
              ))}
            </div>
            <div className="flex justify-center mt-10">
              <Link
                href={`/directory/${company.category}`}
                className="flex items-center gap-2 font-semibold px-6 py-2.5 rounded-lg"
                style={{ border: "1.5px solid #D1D5DB", color: "#374151", fontSize: "14px", textDecoration: "none" }}
              >
                <ArrowLeft size={14} />
                Back to Results
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Email Newsletter ── */}
      <section
        style={{
          background: `linear-gradient(160deg, #0f1a12 0%, #1A4A35 50%, #111827 100%)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 30% 60%, rgba(92,184,92,0.1) 0%, transparent 60%)",
          }}
        />
        <div className="mx-auto px-6 py-20 text-center relative" style={{ maxWidth: "680px" }}>
          <h2
            className="font-extrabold text-white mb-4"
            style={{ fontSize: "36px", letterSpacing: "-0.5px" }}
          >
            Email Newsletter
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", marginBottom: "32px" }}>
            Stay up to date with the latest cannabis industry news, vendor spotlights, and platform updates.
          </p>
          <div className="flex gap-0 max-w-md mx-auto" style={{ border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: "10px", overflow: "hidden" }}>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.08)",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "14px",
                padding: "14px 18px",
              }}
            />
            <button
              className="font-semibold text-white px-5"
              style={{ backgroundColor: "#F7941D", fontSize: "14px", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Sign Up ›
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
