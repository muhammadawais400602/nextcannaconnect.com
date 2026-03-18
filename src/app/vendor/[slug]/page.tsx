import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPANIES, getCompanyBySlug } from "@/data/companies";
import { getCategoryBySlug } from "@/data/categories";
import CompanyHeader from "@/components/vendor/CompanyHeader";
import LeadForm from "@/components/vendor/LeadForm";
import VerifiedBox from "@/components/vendor/VerifiedBox";
import { Star, Package, Briefcase, User, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

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

// ── Shared tab bar ────────────────────────────────────────────────────────────
function TabBar({ activeTab, tabs }: { activeTab: string; tabs: { key: string; label: string }[] }) {
  return (
    <div
      className="flex gap-0 border-b mb-7"
      style={{ borderColor: "#E5E7EB" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className="px-5 py-3 font-medium relative whitespace-nowrap"
          style={{
            fontSize: "14px",
            color: tab.key === activeTab ? "#111827" : "#9CA3AF",
            fontWeight: tab.key === activeTab ? 700 : 500,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {tab.label}
          {tab.key === activeTab && (
            <span
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "2.5px", backgroundColor: "#F7941D", borderRadius: "2px 2px 0 0" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Template 1: Products & Equipment ─────────────────────────────────────────
function Template1({ company }: { company: ReturnType<typeof getCompanyBySlug> & object }) {
  if (!company) return null;
  return (
    <div
      className="rounded-2xl p-7"
      style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
    >
      <TabBar activeTab="overview" tabs={[
        { key: "overview", label: "Overview" },
        { key: "services", label: "Services" },
        { key: "reviews", label: "Reviews" },
      ]} />

      {company.fullDescription && (
        <div className="mb-8">
          <h3 className="font-bold mb-3" style={{ fontSize: "15px", color: "#111827" }}>About</h3>
          <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.75 }}>{company.fullDescription}</p>
        </div>
      )}

      {company.productLines && company.productLines.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold mb-4 flex items-center gap-2" style={{ fontSize: "15px", color: "#111827" }}>
            <Package size={15} style={{ color: "#F7941D" }} /> Product Lines
          </h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
            {company.productLines.map((product) => (
              <div
                key={product}
                className="rounded-xl p-4 text-center card-hover"
                style={{ border: "1px solid #E5E7EB", backgroundColor: "#F8FAF8" }}
              >
                <div
                  className="mx-auto mb-2 rounded-xl flex items-center justify-center"
                  style={{ width: "40px", height: "40px", backgroundColor: company.logoColor + "18" }}
                >
                  <Package size={18} style={{ color: company.logoColor }} />
                </div>
                <p className="font-semibold" style={{ fontSize: "13px", color: "#111827" }}>{product}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-bold mb-4" style={{ fontSize: "15px", color: "#111827" }}>Specifications</h3>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E5E7EB" }}>
          <table className="w-full">
            <tbody>
              {[
                ["Service Area", company.serviceArea],
                ["Minimum Order", company.minOrderQty],
                ["Lead Time", company.leadTime],
                ["Certifications", company.certifications?.join(", ")],
              ].filter(([, v]) => v).map(([label, value], i, arr) => (
                <tr key={label as string} style={{ borderBottom: i < arr.length - 1 ? "1px solid #E5E7EB" : "none" }}>
                  <td className="px-5 py-3.5 font-medium" style={{ fontSize: "13px", color: "#9CA3AF", width: "38%", backgroundColor: "#F8FAF8" }}>
                    {label}
                  </td>
                  <td className="px-5 py-3.5" style={{ fontSize: "13px", color: "#111827" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold mb-4" style={{ fontSize: "15px", color: "#111827" }}>Services Offered</h3>
        <div className="flex flex-wrap gap-2">
          {company.serviceTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full font-medium"
              style={{ backgroundColor: "#F3F4F6", border: "1px solid #E5E7EB", fontSize: "13px", color: "#374151" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {company.rating && <ReviewSummary rating={company.rating} count={company.reviewCount} />}
    </div>
  );
}

// ── Template 2: Services & Agencies ──────────────────────────────────────────
function Template2({ company }: { company: ReturnType<typeof getCompanyBySlug> & object }) {
  if (!company) return null;
  return (
    <div
      className="rounded-2xl p-7"
      style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
    >
      <TabBar activeTab="overview" tabs={[
        { key: "overview", label: "Overview" },
        { key: "services", label: "Services" },
        { key: "about", label: "About" },
        { key: "reviews", label: "Reviews" },
      ]} />

      {company.fullDescription && (
        <div className="mb-8">
          <h3 className="font-bold mb-3 flex items-center gap-2" style={{ fontSize: "15px", color: "#111827" }}>
            <Briefcase size={15} style={{ color: "#F7941D" }} /> Our Approach
          </h3>
          <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.75 }}>{company.fullDescription}</p>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-bold mb-4" style={{ fontSize: "15px", color: "#111827" }}>Services</h3>
        <div className="flex flex-col gap-3">
          {company.serviceTags.map((tag) => (
            <div
              key={tag}
              className="flex items-start gap-3 p-4 rounded-xl"
              style={{ border: "1px solid #E5E7EB", backgroundColor: "#F8FAF8" }}
            >
              <div
                className="rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ width: "28px", height: "28px", backgroundColor: "rgba(26,74,53,0.09)" }}
              >
                <span style={{ color: "#1A4A35", fontSize: "12px", fontWeight: 700 }}>✓</span>
              </div>
              <div>
                <p className="font-semibold" style={{ fontSize: "14px", color: "#111827" }}>{tag}</p>
                <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "2px" }}>
                  Professional {tag.toLowerCase()} services for cannabis industry operators.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {company.statesServed && (
        <div className="mb-8">
          <h3 className="font-bold mb-4" style={{ fontSize: "15px", color: "#111827" }}>States Served</h3>
          <div className="flex flex-wrap gap-2">
            {company.statesServed.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full font-semibold" style={{ backgroundColor: "#1A4A35", color: "white", fontSize: "12px" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {company.caseStudies && company.caseStudies.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold mb-4" style={{ fontSize: "15px", color: "#111827" }}>Case Studies</h3>
          {company.caseStudies.map((cs) => (
            <div key={cs.title} className="mb-3 p-5 rounded-xl" style={{ border: "1px solid #E5E7EB" }}>
              <h4 className="font-bold mb-1" style={{ fontSize: "14px", color: "#111827" }}>{cs.title}</h4>
              <p style={{ fontSize: "13px", color: "#6B7280" }}>{cs.summary}</p>
            </div>
          ))}
        </div>
      )}

      {company.rating && <ReviewSummary rating={company.rating} count={company.reviewCount} />}
    </div>
  );
}

// ── Template 3: Consultants & Advisors ───────────────────────────────────────
function Template3({ company }: { company: ReturnType<typeof getCompanyBySlug> & object }) {
  if (!company) return null;
  return (
    <div
      className="rounded-2xl p-7"
      style={{ backgroundColor: "white", border: "1px solid #E5E7EB" }}
    >
      <TabBar activeTab="overview" tabs={[
        { key: "overview", label: "Overview" },
        { key: "services", label: "Services" },
        { key: "about", label: "About" },
        { key: "reviews", label: "Reviews" },
      ]} />

      {(company.bio || company.fullDescription) && (
        <div className="flex items-start gap-5 p-5 rounded-xl mb-8" style={{ backgroundColor: "#F8FAF8", border: "1px solid #E5E7EB" }}>
          <div
            className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ width: "56px", height: "56px", backgroundColor: company.logoColor, fontSize: "18px" }}
          >
            <User size={22} />
          </div>
          <div>
            <h3 className="font-bold mb-2" style={{ fontSize: "15px", color: "#111827" }}>{company.name}</h3>
            <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.75 }}>
              {company.bio || company.fullDescription}
            </p>
          </div>
        </div>
      )}

      {company.specialtyAreas && (
        <div className="mb-8">
          <h3 className="font-bold mb-4" style={{ fontSize: "15px", color: "#111827" }}>Specialty Areas</h3>
          <div className="flex flex-wrap gap-2">
            {company.specialtyAreas.map((area) => (
              <span
                key={area}
                className="px-3 py-1.5 rounded-full font-medium"
                style={{ backgroundColor: "#1A4A35", color: "white", fontSize: "13px" }}
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {company.credentials && (
        <div className="mb-8">
          <h3 className="font-bold mb-4" style={{ fontSize: "15px", color: "#111827" }}>Credentials</h3>
          <div className="flex flex-col gap-2.5">
            {company.credentials.map((cred) => (
              <div key={cred} className="flex items-center gap-2.5">
                <span style={{ color: "#5CB85C", fontSize: "16px" }}>✓</span>
                <span style={{ fontSize: "14px", color: "#374151" }}>{cred}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {company.yearsExperience && (
          <div className="p-5 rounded-xl text-center" style={{ backgroundColor: "#F8FAF8", border: "1px solid #E5E7EB" }}>
            <p className="font-extrabold" style={{ fontSize: "26px", color: "#1A4A35" }}>{company.yearsExperience}</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>Years Experience</p>
          </div>
        )}
        {company.hourlyRate && (
          <div className="p-5 rounded-xl text-center" style={{ backgroundColor: "#F8FAF8", border: "1px solid #E5E7EB" }}>
            <p className="font-extrabold" style={{ fontSize: "20px", color: "#1A4A35" }}>{company.hourlyRate}</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>Hourly Rate</p>
          </div>
        )}
        {company.availability && (
          <div className="p-5 rounded-xl text-center" style={{ backgroundColor: "#F8FAF8", border: "1px solid #E5E7EB" }}>
            <p className="font-semibold" style={{ fontSize: "14px", color: "#5CB85C" }}>{company.availability}</p>
            <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>Availability</p>
          </div>
        )}
      </div>

      {company.rating && <ReviewSummary rating={company.rating} count={company.reviewCount} />}
    </div>
  );
}

// ── Shared review summary ────────────────────────────────────────────────────
function ReviewSummary({ rating, count }: { rating: number; count?: number }) {
  return (
    <div>
      <h3 className="font-bold mb-4" style={{ fontSize: "15px", color: "#111827" }}>Client Reviews</h3>
      <div
        className="flex items-center gap-5 p-5 rounded-xl"
        style={{ backgroundColor: "#F8FAF8", border: "1px solid #E5E7EB" }}
      >
        <span className="font-extrabold" style={{ fontSize: "42px", color: "#111827" }}>{rating}</span>
        <div>
          <div className="flex gap-0.5 mb-1">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={18} fill={s <= Math.round(rating) ? "#F9C31A" : "#E5E7EB"} stroke="none" />
            ))}
          </div>
          <p style={{ fontSize: "13px", color: "#6B7280" }}>{count} verified reviews</p>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function VendorPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const category = getCategoryBySlug(company.category);
  const template = category?.template || "services-agencies";

  return (
    <div style={{ backgroundColor: "#F8FAF8", minHeight: "100vh" }}>
      <div className="mx-auto px-6 py-8" style={{ maxWidth: "1180px" }}>

        {/* Breadcrumb + nav */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2" style={{ fontSize: "13px", color: "#9CA3AF" }}>
            <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</Link>
            <span>/</span>
            <Link href={`/directory/${company.category}`} style={{ color: "#9CA3AF", textDecoration: "none" }}>
              {category?.label}
            </Link>
            <span>/</span>
            <span style={{ color: "#374151" }}>{company.name}</span>
          </div>
          <Link
            href={`/directory/${company.category}`}
            className="hidden sm:flex items-center gap-1.5 font-semibold"
            style={{ color: "#6B7280", fontSize: "13px", textDecoration: "none" }}
          >
            <ArrowLeft size={14} />
            Back to Results
          </Link>
        </div>

        {/* Company header */}
        <CompanyHeader company={company} />

        {/* Two-column layout */}
        <div className="flex gap-7" style={{ alignItems: "flex-start" }}>
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {template === "products-equipment" && <Template1 company={company} />}
            {template === "services-agencies" && <Template2 company={company} />}
            {template === "consultants-advisors" && <Template3 company={company} />}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:flex flex-col gap-5 flex-shrink-0" style={{ width: "300px" }}>
            <LeadForm companyName={company.name} serviceTags={company.serviceTags} />
            <VerifiedBox
              certifications={company.certifications}
              credentials={company.credentials}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
