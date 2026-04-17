import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCompanyBySlugFresh, getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import { getCategoryBySlug } from "@/data/categories";
import { MapPin, ArrowLeft } from "lucide-react";
import { Company } from "@/types";
import ContactForm from "./ContactForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlugFresh(slug);
  if (!company) return {};
  return {
    title: `${company.name} | NextCanna Connect`,
    description: company.shortDescription,
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

  const certs = company.certifications ?? company.credentials ?? [];
  const services = company.serviceTags ?? [];
  const products = company.products ?? [];

  // Stats row
  const stats = [
    { label: "Founded",          value: company.foundedYear?.toString() },
    { label: "Employees",        value: company.teamSize },
    { label: "Certification",    value: certs[0] },
    { label: "Regions",          value: company.serviceArea },
    { label: "Years in Cannabis", value: company.yearsInCannabis?.toString() },
  ].filter(s => s.value);

  return (
    <div style={{ backgroundColor: "#fbf9f8", minHeight: "100vh" }}>

      {/* Back nav */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 24px 0" }}>
        <Link
          href={`/directory/${company.category}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6B7280", textDecoration: "none", fontWeight: 600 }}
        >
          <ArrowLeft size={14} />
          Back to {category?.label ?? "Directory"}
        </Link>
      </div>

      {/* Main */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 24px 80px" }}>

        {/* Two-column grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "28px", alignItems: "flex-start" }}>

          {/* ── Left column ── */}
          <div>

            {/* Hero banner image */}
            <div style={{ position: "relative", height: "360px", borderRadius: "14px", overflow: "hidden", marginBottom: "24px", background: company.logoColor }}>
              {company.bannerImageUrl ? (
                <Image
                  src={company.bannerImageUrl}
                  alt={`${company.name} banner`}
                  fill
                  sizes="(max-width: 1100px) 100vw, 770px"
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
              {/* Dark gradient at bottom */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 60%)" }} />
              {/* Name / badge / location overlay */}
              <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "20px" }}>
                {company.bannerCaption && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ width: "3px", height: "14px", background: "#E8821E", borderRadius: "2px" }} />
                    <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>{company.bannerCaption}</span>
                  </div>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                  <h1 style={{ fontSize: "clamp(22px, 3.5vw, 32px)", fontWeight: "800", color: "white", letterSpacing: "-0.5px", margin: 0, fontFamily: "'Inter', sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
                    {company.name}
                  </h1>
                  {(() => {
                    const BADGE: Record<string, { label: string; bg: string; color: string }> = {
                      featured: { label: "Verified Pro",      bg: "rgba(26,74,53,0.85)",    color: "#6ee7b7" },
                      elite:    { label: "Verified Pro",      bg: "rgba(26,74,53,0.85)",    color: "#6ee7b7" },
                      select:   { label: "Select Member",     bg: "rgba(29,78,216,0.85)",   color: "#bfdbfe" },
                      claimed:  { label: "Claimed Listing",   bg: "rgba(109,40,217,0.85)",  color: "#ddd6fe" },
                      free:     { label: "Unclaimed Listing", bg: "rgba(0,0,0,0.5)",        color: "#D1D5DB" },
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
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", marginBottom: "32px", background: "white" }}>
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{ padding: "18px 20px", borderLeft: i > 0 ? "1px solid #E5E7EB" : "none" }}
                  >
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#9CA3AF", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>{stat.label}</div>
                    <div style={{ fontSize: "18px", fontWeight: "800", color: "#111827", fontFamily: "'Inter', sans-serif" }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>
              Market Leadership Overview
            </h2>
            <div style={{ fontSize: "15px", color: "#4B5563", lineHeight: 1.8, marginBottom: "40px" }}>
              {(company.fullDescription || company.shortDescription).split("\n\n").map((para, i) => (
                <p key={i} style={{ marginBottom: "16px" }}>{para}</p>
              ))}
            </div>

            {/* YouTube Video */}
            {company.youtubeUrl && (() => {
              const ytMatch = company.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
              const videoId = ytMatch?.[1];
              if (!videoId) return null;
              return (
                <div style={{ marginBottom: "40px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>
                    Watch Our Video
                  </h2>
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

            {/* Product Offerings */}
            {products.length > 0 && (
              <div style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", fontFamily: "'Inter', sans-serif" }}>
                    Product Offerings
                  </h2>
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "#003320", fontWeight: "600", textDecoration: "none" }}>
                      View Full Catalog →
                    </a>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {products.map((product) => (
                    <div key={product.name} style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #E5E7EB", background: "white" }}>
                      <div style={{ position: "relative", height: "160px", background: company.logoColor + "33" }}>
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill sizes="200px" style={{ objectFit: "cover" }} unoptimized />
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
          <div style={{ position: "sticky", top: "24px" }}>

            {/* Contact form */}
            <ContactForm companyName={company.name} serviceTags={services} />

            {/* Certifications */}
            {certs.length > 0 && (
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

            {/* Core Services */}
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

            {/* Location map */}
            {(() => {
              const parts = [
                company.location.address,
                company.location.city,
                company.location.state,
                company.location.zip,
              ].filter(Boolean);
              const hasLocation = parts.length > 0;
              const query = encodeURIComponent(parts.join(", "));
              return hasLocation ? (
                <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #E5E7EB", height: "220px" }}>
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
              ) : (
                <div style={{ background: "#F9FAFB", borderRadius: "12px", border: "1px solid #E5E7EB", height: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "13px", color: "#9CA3AF" }}>No location set</span>
                </div>
              );
            })()}

            {/* Social links */}
            {(company.linkedinUrl || company.instagramUrl) && (
              <div style={{ background: "white", borderRadius: "12px", padding: "20px 24px", border: "1px solid #E5E7EB", marginTop: "16px" }}>
                <div style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.12em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: "14px" }}>
                  Follow Us
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  {company.linkedinUrl && (
                    <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 16px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#0A66C2", textDecoration: "none", flex: 1, justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                  )}
                  {company.instagramUrl && (
                    <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 16px", border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", fontWeight: "600", color: "#E1306C", textDecoration: "none", flex: 1, justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Similar companies */}
      {similar.length > 0 && (
        <section style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "56px 24px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "24px", fontFamily: "'Inter', sans-serif" }}>
              Similar Listings
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
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
