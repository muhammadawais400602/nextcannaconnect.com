import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCompanyBySlug, getCompaniesByCategory } from "@/lib/getCompaniesFromDB";
import { getCategoryBySlug } from "@/data/categories";
import { MapPin, ArrowLeft } from "lucide-react";
import { Company } from "@/types";
import ContactForm from "./ContactForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 1800;
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return {};
  return {
    title: `${company.name} | NextCanna Connect`,
    description: company.shortDescription,
  };
}

const TIER_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  featured:  { label: "Verified Pro",       bg: "rgba(26,74,53,0.1)",  color: "#003320" },
  elite:     { label: "Verified Pro",       bg: "rgba(26,74,53,0.1)",  color: "#003320" },
  select:    { label: "Select Member",      bg: "rgba(37,99,235,0.08)", color: "#1d4ed8" },
  claimed:   { label: "Claimed Listing",    bg: "rgba(124,58,237,0.08)", color: "#6d28d9" },
  free:      { label: "Unclaimed Listing",  bg: "#F3F4F6",              color: "#6B7280" },
};

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
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const category = getCategoryBySlug(company.category);
  const allInCategory = await getCompaniesByCategory(company.category);
  const similar = allInCategory.filter((c) => c.slug !== company.slug).slice(0, 4);

  const badge = TIER_BADGE[company.tier] ?? TIER_BADGE.free;
  const certs = company.certifications ?? company.credentials ?? [];
  const services = company.serviceTags ?? [];
  const products = company.products ?? [];

  // Stats row
  const stats = [
    { label: "Founded",       value: company.foundedYear?.toString() },
    { label: "Employees",     value: company.teamSize },
    { label: "Certification", value: certs[0] },
    { label: "Regions",       value: company.serviceArea },
  ].filter(s => s.value);

  return (
    <div style={{ backgroundColor: "#fbf9f8", minHeight: "100vh" }}>

      {/* Back nav */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px 0" }}>
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

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <span style={{ display: "inline-block", fontSize: "10px", fontWeight: "800", letterSpacing: "0.12em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "20px", background: badge.bg, color: badge.color, marginBottom: "14px" }}>
            {badge.label}
          </span>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: "800", color: "#111827", letterSpacing: "-0.5px", marginBottom: "10px", fontFamily: "'Inter', sans-serif" }}>
            {company.name}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "20px", fontSize: "14px", color: "#6B7280" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9CA3AF" }}>category</span>
              {company.shortDescription}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <MapPin size={14} style={{ color: "#9CA3AF" }} />
              {company.location.city}, {company.location.state}
            </span>
          </div>
        </div>

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
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
              {/* Caption overlay */}
              {company.bannerCaption && (
                <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div style={{ width: "3px", height: "14px", background: "#E8821E", borderRadius: "2px" }} />
                    <span style={{ fontSize: "10px", fontWeight: "800", letterSpacing: "0.15em", color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>Featured Installation</span>
                  </div>
                  <p style={{ fontSize: "14px", fontStyle: "italic", color: "white", fontFamily: "'Noto Serif', serif", margin: 0 }}>
                    {company.bannerCaption}
                  </p>
                </div>
              )}
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

            {/* Location map placeholder */}
            <div style={{ background: "#1a2e22", borderRadius: "12px", overflow: "hidden", border: "1px solid #E5E7EB", height: "160px", position: "relative" }}>
              {/* Grid pattern */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              {/* Pin */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#E8821E", boxShadow: "0 0 0 4px rgba(232,130,30,0.2)" }} />
                <span style={{ background: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", color: "#111827", whiteSpace: "nowrap" }}>
                  {company.name.split(" ")[0].toUpperCase()} HQ
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>
                  {company.location.city}, {company.location.state}
                </span>
              </div>
            </div>

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
