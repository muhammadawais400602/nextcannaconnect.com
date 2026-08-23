import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCompanyBySlugFresh, getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import { getCategoryBySlug } from "@/data/categories";
import { MapPin, ArrowLeft, Lock } from "lucide-react";
import { Company } from "@/types";
import { showSimilarPartners } from "@/lib/tier";
import ContactForm from "./ContactForm";
import ProfileViewTracker from "@/components/ProfileViewTracker";
import ClaimBanner from "@/components/ClaimBanner";
import RetailProfile from "@/components/vendor/retail/RetailProfile";
import TransportProfile from "@/components/vendor/transport/TransportProfile";
import TestingProfile from "@/components/vendor/testing/TestingProfile";
import TechProfile from "@/components/vendor/tech/TechProfile";
import RealEstateProfile from "@/components/vendor/realestate/RealEstateProfile";
import CultivationProfile from "@/components/vendor/cultivation/CultivationProfile";
import ManufacturersProfile from "@/components/vendor/manufacturers/ManufacturersProfile";
import ExtractionProfile from "@/components/vendor/extraction/ExtractionProfile";
import ConsultantsProfile from "@/components/vendor/consultants/ConsultantsProfile";
import MarketingProfile from "@/components/vendor/marketing/MarketingProfile";
import ComplianceProfile from "@/components/vendor/compliance/ComplianceProfile";
import FinanceProfile from "@/components/vendor/finance/FinanceProfile";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlugFresh(slug);
  if (!company) return {};
  const title = `${company.name} | NextCanna Connect`;
  const description = company.shortDescription || `${company.name} — verified cannabis business on NextCanna Connect.`;
  const location = [company.location?.city, company.location?.state].filter(Boolean).join(", ");
  const fullDescription = location ? `${description} Located in ${location}.` : description;
  return {
    title,
    description: fullDescription,
    openGraph: {
      title,
      description: fullDescription,
      type: "profile",
      url: `https://nextcannaconnect.com/vendor/${slug}`,
      siteName: "NextCanna Connect",
      ...(company.bannerImageUrl && !company.bannerImageUrl.includes("picsum.photos")
        ? { images: [{ url: company.bannerImageUrl, width: 1200, height: 630, alt: company.name }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: fullDescription,
    },
  };
}

function SimilarCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/vendor/${company.slug}`}
      style={{ textDecoration: "none", display: "block", background: "white", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden" }}
    >
      <div style={{ height: "72px", background: company.logoColor + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "800", fontSize: "14px" }}>
          {company.logoPlaceholder}
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: "14px", fontWeight: "700", color: "#111827", marginBottom: "4px" }}>{company.name}</div>
        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{company.shortDescription}</div>
        {company.location && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "8px", fontSize: "11px", color: "#9CA3AF" }}>
            <MapPin size={10} />
            {company.location.city}, {company.location.state}
          </div>
        )}
      </div>
    </Link>
  );
}

export default async function VendorPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyBySlugFresh(slug);
  if (!company) notFound();

  const category = getCategoryBySlug(company.category);
  const allInCategory = await getCompaniesByCategory(company.category);
  const similar = allInCategory.filter((c) => c.slug !== company.slug).slice(0, 4);

  const tracker = <ProfileViewTracker slug={company.slug} />;
  const claimBanner = company.tier === "free" ? <ClaimBanner slug={company.slug} /> : null;

  // UNCLAIMED — show claim page instead of full profile
  if (company.tier === "free") {
    return (
      <div style={{ backgroundColor: "#F7F9F7", minHeight: "100vh" }}>
        {tracker}
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "120px 20px 80px", textAlign: "center" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%", background: company.logoColor || "#E5E7EB",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontWeight: 700, color: "white", margin: "0 auto 20px",
            overflow: "hidden",
          }}>
            {company.logoUrl ? (
              <Image src={company.logoUrl} alt={company.name} width={64} height={64} style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius: "50%" }} unoptimized />
            ) : (
              company.logoPlaceholder
            )}
          </div>
          <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "28px", fontWeight: 700, color: "#0D2818", marginBottom: "6px" }}>
            {company.name}
          </h1>
          {(company.location.city || company.location.state) && (
            <p style={{ fontSize: "14px", color: "#6B7280", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
              <MapPin size={14} />
              {[company.location.city, company.location.state].filter(Boolean).join(", ")}
            </p>
          )}
          <div style={{
            background: "white", borderRadius: "14px", border: "1px solid #E5E7EB", padding: "32px 28px", marginBottom: "24px",
          }}>
            <p style={{ fontSize: "15px", color: "#6B7280", lineHeight: 1.7, marginBottom: "20px" }}>
              This listing has not been claimed yet.
            </p>
            <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, marginBottom: "24px" }}>
              Are you the owner? Claim it free and upgrade anytime to unlock your full company profile, contact form, analytics, and more.
            </p>
            <Link
              href={`/signup?claim=${company.slug}&category=${company.category}`}
              style={{
                display: "inline-block", padding: "14px 32px", borderRadius: "8px",
                fontSize: "14px", fontWeight: 700, textDecoration: "none",
                background: "#1A4A35", color: "white",
              }}
            >
              Claim This Listing &rarr;
            </Link>
          </div>
          <Link href={`/directory/${company.category}`} style={{ fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 600 }}>
            &larr; Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  if (company.category === "retail-dispensary") {
    return <>{claimBanner}{tracker}<RetailProfile company={company} similar={similar} /></>;
  }

  if (company.category === "transportation-logistics") {
    return <>{claimBanner}{tracker}<TransportProfile company={company} /></>;
  }

  if (company.category === "testing-science") {
    return <>{claimBanner}{tracker}<TestingProfile company={company} /></>;
  }

  if (company.category === "technology-software") {
    return <>{claimBanner}{tracker}<TechProfile company={company} /></>;
  }

  if (company.category === "real-estate-construction") {
    return <>{claimBanner}{tracker}<RealEstateProfile company={company} /></>;
  }

  if (company.category === "cultivation-growing") {
    return <>{claimBanner}{tracker}<CultivationProfile company={company} similar={similar} /></>;
  }

  if (company.category === "manufacturers-suppliers") {
    return <>{claimBanner}{tracker}<ManufacturersProfile company={company} similar={similar} /></>;
  }

  if (company.category === "extraction-processing") {
    return <>{claimBanner}{tracker}<ExtractionProfile company={company} similar={similar} /></>;
  }

  if (company.category === "consultants-advisors") {
    return <>{claimBanner}{tracker}<ConsultantsProfile company={company} similar={similar} /></>;
  }

  if (company.category === "marketing-branding-packaging") {
    return <>{claimBanner}{tracker}<MarketingProfile company={company} similar={similar} /></>;
  }

  if (company.category === "compliance-legal") {
    return <>{claimBanner}{tracker}<ComplianceProfile company={company} similar={similar} /></>;
  }

  if (company.category === "finance-insurance") {
    return <>{claimBanner}{tracker}<FinanceProfile company={company} similar={similar} /></>;
  }

  const isVerifiedPro = company.tier === "elite";

  const certs = company.certifications ?? company.credentials ?? [];
  const services = company.serviceTags ?? [];
  const products = company.products ?? [];

  const stats = [
    { label: "Founded",           value: company.foundedYear?.toString() },
    { label: "Employees",         value: company.teamSize },
    isVerifiedPro ? { label: "Certification", value: certs[0] } : null,
    { label: "Regions",           value: company.serviceArea },
    { label: "Years in Cannabis", value: company.yearsInCannabis?.toString() },
  ].filter((s): s is { label: string; value: string } => !!s?.value);

  return (
    <div style={{ backgroundColor: "#fbf9f8", minHeight: "100vh" }}>
      {claimBanner}
      {tracker}
      <style>{`
        .vp-backnav  { max-width:1100px; margin:0 auto; padding:100px 20px 0; }
        .vp-main     { max-width:1100px; margin:0 auto; padding:24px 20px 80px; }
        .vp-grid     { display:grid; grid-template-columns:1fr 300px; gap:28px; align-items:flex-start; }
        .vp-hero     { position:relative; height:360px; border-radius:14px; overflow:hidden; margin-bottom:24px; }
        .vp-stats    { display:grid; grid-template-columns:repeat(${stats.length || 1},1fr); border:1px solid #E5E7EB; border-radius:12px; overflow:hidden; margin-bottom:32px; background:white; }
        .vp-products { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .vp-sidebar  { position:sticky; top:24px; }
        .vp-similar  { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; }
        @media (max-width:768px) {
          .vp-backnav  { padding:80px 16px 0; }
          .vp-main     { padding:16px 16px 60px; }
          .vp-grid     { grid-template-columns:1fr; gap:20px; }
          .vp-hero     { height:220px; border-radius:10px; margin-bottom:16px; }
          .vp-stats    { grid-template-columns:repeat(2,1fr); }
          .vp-products { grid-template-columns:1fr; }
          .vp-sidebar  { position:static; }
          .vp-similar  { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:12px; }
          .vp-stat-cell { border-left:none !important; border-top:1px solid #E5E7EB; }
          .vp-stat-cell:nth-child(odd) { border-left:none !important; }
          .vp-stat-cell:nth-child(even) { border-left:1px solid #E5E7EB !important; }
          .vp-stat-cell:nth-child(-n+2)  { border-top:none !important; }
        }
      `}</style>

      {/* Back nav */}
      <div className="vp-backnav">
        <Link
          href={`/directory/${company.category}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 600 }}
        >
          <ArrowLeft size={14} />
          Back to {category?.label ?? "Directory"}
        </Link>
      </div>

      {/* Main */}
      <div className="vp-main">
        <div className="vp-grid">

          {/* ── Left column ── */}
          <div>

            {/* Hero banner */}
            <div className="vp-hero" style={{ background: company.logoColor }}>
              {company.bannerImageUrl ? (
                <Image
                  src={company.bannerImageUrl}
                  alt={`${company.name} banner`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 100vw, 770px"
                  style={{ objectFit: "cover" }}
                  priority
                  unoptimized
                />
              ) : (
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(160deg, ${company.logoColor} 0%, #0f1a12 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: "80px", fontWeight: "900", color: "rgba(255,255,255,0.08)", fontFamily: "'Inter', sans-serif" }}>
                    {company.logoPlaceholder}
                  </div>
                </div>
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)" }} />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px" }}>
                {company.bannerCaption && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ width: "3px", height: "14px", background: "#E8821E", borderRadius: "2px" }} />
                    <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>{company.bannerCaption}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                  <h1 style={{ fontSize: "clamp(18px, 4vw, 32px)", fontWeight: "800", color: "white", letterSpacing: "-0.5px", margin: 0, fontFamily: "'Inter', sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.4)", width: "100%" }}>
                    {company.name}
                  </h1>
                  {(() => {
                    const BADGE: Record<string, { label: string; bg: string; color: string }> = {
                      elite:  { label: "Verified Pro", bg: "rgba(26,74,53,0.85)",  color: "#6ee7b7" },
                      select: { label: "Select",       bg: "rgba(45,110,82,0.85)", color: "#d1fae5" },
                      free:   { label: "Unclaimed",    bg: "rgba(0,0,0,0.5)",      color: "#D1D5DB" },
                    };
                    const b = BADGE[company.tier] ?? BADGE.free;
                    return (
                      <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "20px", background: b.bg, color: b.color, backdropFilter: "blur(4px)" }}>
                        {b.label}
                      </span>
                    );
                  })()}
                  {category && (
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.12)", padding: "4px 10px", borderRadius: "20px", backdropFilter: "blur(4px)" }}>
                      {category.label}
                    </span>
                  )}
                  {(company.location.city || company.location.state) && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>
                      <MapPin size={12} />
                      {[company.location.city, company.location.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            {stats.length > 0 && (
              <div className="vp-stats">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className="vp-stat-cell"
                    style={{ padding: "16px 18px", borderLeft: i > 0 ? "1px solid #E5E7EB" : "none" }}
                  >
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>{stat.label}</div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#111827", fontFamily: "'Inter', sans-serif" }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>
              About
            </h2>
            <div style={{ fontSize: "15px", color: "#4B5563", lineHeight: 1.8, marginBottom: "40px" }}>
              {(company.fullDescription || company.shortDescription).split("\n\n").map((para, i) => (
                <p key={i} style={{ marginBottom: "16px" }}>{para}</p>
              ))}
            </div>

            {/* YouTube — Verified Pro only */}
            {isVerifiedPro && company.youtubeUrl && (() => {
              const ytMatch = company.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
              const videoId = ytMatch?.[1];
              if (!videoId) return null;
              return (
                <div style={{ marginBottom: "40px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>Watch Our Video</h2>
                  <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="Company video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Product Offerings — Verified Pro only */}
            {isVerifiedPro && products.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", fontFamily: "'Inter', sans-serif", margin: 0 }}>Product Offerings</h2>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "#003320", fontWeight: "600", textDecoration: "none" }}>
                      View Full Catalog →
                    </a>
                  )}
                </div>
                <div className="vp-products">
                  {products.map((product) => (
                    <div key={product.name} style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #E5E7EB", background: "white" }}>
                      <div style={{ position: "relative", height: "160px", background: company.logoColor + "33" }}>
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width:768px) 100vw, 200px" style={{ objectFit: "cover" }} unoptimized />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${company.logoColor}44, ${company.logoColor}22)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "36px", color: company.logoColor, opacity: 0.4 }}>inventory_2</span>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "14px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#111827", marginBottom: "6px" }}>{product.name}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{product.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── Right sidebar ── */}
          <div className="vp-sidebar">

            <ContactForm companyName={company.name} vendorSlug={company.slug} serviceTags={services} />

            {isVerifiedPro && certs.length > 0 && (
              <div style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid #E5E7EB", marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.12em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "14px" }}>
                  Certifications & Compliance
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {certs.map((cert) => (
                    <span key={cert} style={{ padding: "6px 14px", border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "13px", fontWeight: "600", color: "#374151", background: "white" }}>
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {services.length > 0 && (
              <div style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid #E5E7EB", marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.12em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "14px" }}>
                  Core Services
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {services.map((s) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#003320" }}>check_circle</span>
                      <span style={{ fontSize: "13px", color: "#374151" }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(() => {
              const parts = [company.location.address, company.location.city, company.location.state, company.location.zip].filter(Boolean);
              const hasLocation = parts.length > 0;
              const query = encodeURIComponent(parts.join(", "));
              return hasLocation ? (
                <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #E5E7EB", height: "220px", marginBottom: "16px" }}>
                  <iframe
                    title={`${company.name} location`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${query}&output=embed&zoom=14`}
                  />
                </div>
              ) : null;
            })()}

            {isVerifiedPro && (company.instagramUrl || company.facebookUrl || company.twitterUrl || company.yelpUrl || company.leaflyUrl) && (
              <div style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.12em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "14px" }}>
                  Find Us Online
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: "600", color: "#003320", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>language</span>
                      Website
                    </a>
                  )}
                  {company.instagramUrl && (
                    <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: "600", color: "#E1306C", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>photo_camera</span>
                      Instagram
                    </a>
                  )}
                  {company.facebookUrl && (
                    <a href={company.facebookUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: "600", color: "#1877F2", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>thumb_up</span>
                      Facebook
                    </a>
                  )}
                  {company.twitterUrl && (
                    <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: "600", color: "#1DA1F2", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>alternate_email</span>
                      Twitter / X
                    </a>
                  )}
                  {company.yelpUrl && (
                    <a href={company.yelpUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: "600", color: "#D32323", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>star</span>
                      Yelp
                    </a>
                  )}
                  {company.leaflyUrl && (
                    <a href={company.leaflyUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", fontWeight: "600", color: "#4caf50", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>local_florist</span>
                      Leafly
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Similar companies — Verified Pro only */}
      {showSimilarPartners(company.tier) && similar.length > 0 && (
        <section style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "48px 20px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "24px", fontFamily: "'Inter', sans-serif" }}>
              Similar Partners
            </h2>
            <div className="vp-similar">
              {similar.map((c) => (
                <SimilarCard key={c.slug} company={c} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
