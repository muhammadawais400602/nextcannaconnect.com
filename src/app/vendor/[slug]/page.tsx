import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPANIES, getCompanyBySlug } from "@/data/companies";
import { getCategoryBySlug } from "@/data/categories";
import CompanyHeader from "@/components/vendor/CompanyHeader";
import LeadForm from "@/components/vendor/LeadForm";
import VerifiedBox from "@/components/vendor/VerifiedBox";
import SectionDivider from "@/components/ui/SectionDivider";
import { Star, Package, Briefcase, User } from "lucide-react";
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

function TabBar({ activeTab, tabs }: { activeTab: string; tabs: { key: string; label: string }[] }) {
  return (
    <div
      className="flex gap-0 border-b mb-6"
      style={{ borderColor: "#E8EDE8" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className="px-5 py-3 font-medium relative"
          style={{
            fontSize: "14px",
            color: tab.key === activeTab ? "#F7941D" : "#4A5E4A",
            fontWeight: tab.key === activeTab ? 600 : 400,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {tab.label}
          {tab.key === activeTab && (
            <span
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "3px", backgroundColor: "#F7941D", borderRadius: "2px 2px 0 0" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Template 1: Products & Equipment ───────────────────────────────────────
function Template1({ company }: { company: ReturnType<typeof getCompanyBySlug> & object }) {
  if (!company) return null;
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: "white", border: "1px solid #E8EDE8" }}>
      <TabBar activeTab="overview" tabs={[
        { key: "overview", label: "Overview" },
        { key: "services", label: "Services" },
        { key: "reviews", label: "Reviews" },
      ]} />

      {/* Description */}
      {company.fullDescription && (
        <div className="mb-6">
          <h3 className="font-bold mb-2" style={{ fontSize: "16px", color: "#1A4A35" }}>About</h3>
          <p style={{ color: "#4A5E4A", fontSize: "14px", lineHeight: 1.7 }}>{company.fullDescription}</p>
        </div>
      )}

      {/* Product Lines */}
      {company.productLines && company.productLines.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>
            <Package size={16} className="inline mr-1" /> Product Lines
          </h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
            {company.productLines.map((product) => (
              <div
                key={product}
                className="card-hover rounded-xl p-4 text-center"
                style={{ border: "1px solid #E8EDE8", backgroundColor: "#F7F9F7" }}
              >
                <div
                  className="mx-auto mb-2 rounded-lg flex items-center justify-center"
                  style={{ width: "44px", height: "44px", backgroundColor: company.logoColor + "20" }}
                >
                  <Package size={20} style={{ color: company.logoColor }} />
                </div>
                <p className="font-semibold" style={{ fontSize: "13px", color: "#1A2E1A" }}>{product}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specs table */}
      <div className="mb-6">
        <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>Specifications</h3>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E8EDE8" }}>
          <table className="w-full">
            <tbody>
              {[
                ["Service Area", company.serviceArea],
                ["Minimum Order", company.minOrderQty],
                ["Lead Time", company.leadTime],
                ["Certifications", company.certifications?.join(", ")],
              ].filter(([, v]) => v).map(([label, value]) => (
                <tr key={label as string} style={{ borderBottom: "1px solid #E8EDE8" }}>
                  <td className="px-4 py-3 font-medium" style={{ fontSize: "13px", color: "#4A5E4A", width: "40%", backgroundColor: "#F7F9F7" }}>
                    {label}
                  </td>
                  <td className="px-4 py-3" style={{ fontSize: "13px", color: "#1A2E1A" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Services */}
      <div className="mb-6">
        <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>Services Offered</h3>
        <div className="flex flex-wrap gap-2">
          {company.serviceTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full font-medium transition-colors cursor-default"
              style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8", fontSize: "13px", color: "#1A4A35" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {company.rating && (
        <div>
          <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>
            <Star size={15} className="inline mr-1" style={{ color: "#F9C31A" }} />
            Reviews
          </h3>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8" }}>
            <span className="font-extrabold" style={{ fontSize: "36px", color: "#1A4A35" }}>{company.rating}</span>
            <div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} fill={s <= Math.round(company.rating!) ? "#F9C31A" : "#E8EDE8"} stroke="none" />
                ))}
              </div>
              <p style={{ fontSize: "13px", color: "#4A5E4A" }}>{company.reviewCount} verified reviews</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Template 2: Services & Agencies ────────────────────────────────────────
function Template2({ company }: { company: ReturnType<typeof getCompanyBySlug> & object }) {
  if (!company) return null;
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: "white", border: "1px solid #E8EDE8" }}>
      <TabBar activeTab="overview" tabs={[
        { key: "overview", label: "Overview" },
        { key: "services", label: "Services" },
        { key: "about", label: "About" },
        { key: "reviews", label: "Reviews" },
      ]} />

      {company.fullDescription && (
        <div className="mb-6">
          <h3 className="font-bold mb-2" style={{ fontSize: "16px", color: "#1A4A35" }}>
            <Briefcase size={15} className="inline mr-1" /> Professional Approach
          </h3>
          <p style={{ color: "#4A5E4A", fontSize: "14px", lineHeight: 1.7 }}>{company.fullDescription}</p>
        </div>
      )}

      {/* Services list */}
      <div className="mb-6">
        <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>Services</h3>
        <div className="flex flex-col gap-3">
          {company.serviceTags.map((tag) => (
            <div key={tag} className="flex items-start gap-3 p-4 rounded-xl" style={{ border: "1px solid #E8EDE8", backgroundColor: "#F7F9F7" }}>
              <span style={{ color: "#5CB85C", marginTop: "2px" }}>●</span>
              <div>
                <p className="font-semibold" style={{ fontSize: "14px", color: "#1A2E1A" }}>{tag}</p>
                <p style={{ fontSize: "13px", color: "#4A5E4A", marginTop: "2px" }}>
                  Professional {tag.toLowerCase()} services tailored for cannabis industry operators.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* States served */}
      {company.statesServed && (
        <div className="mb-6">
          <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>States Served</h3>
          <div className="flex flex-wrap gap-2">
            {company.statesServed.map((s) => (
              <span key={s} className="px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#1A4A35", color: "white", fontSize: "12px" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Case studies */}
      {company.caseStudies && company.caseStudies.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>Case Studies</h3>
          {company.caseStudies.map((cs) => (
            <div key={cs.title} className="mb-3 p-4 rounded-xl" style={{ border: "1px solid #E8EDE8" }}>
              <h4 className="font-semibold mb-1" style={{ fontSize: "14px", color: "#1A2E1A" }}>{cs.title}</h4>
              <p style={{ fontSize: "13px", color: "#4A5E4A" }}>{cs.summary}</p>
            </div>
          ))}
        </div>
      )}

      {company.rating && (
        <div>
          <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>Reviews</h3>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8" }}>
            <span className="font-extrabold" style={{ fontSize: "36px", color: "#1A4A35" }}>{company.rating}</span>
            <div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} fill={s <= Math.round(company.rating!) ? "#F9C31A" : "#E8EDE8"} stroke="none" />
                ))}
              </div>
              <p style={{ fontSize: "13px", color: "#4A5E4A" }}>{company.reviewCount} verified reviews</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Template 3: Consultants & Advisors ─────────────────────────────────────
function Template3({ company }: { company: ReturnType<typeof getCompanyBySlug> & object }) {
  if (!company) return null;
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: "white", border: "1px solid #E8EDE8" }}>
      <TabBar activeTab="overview" tabs={[
        { key: "overview", label: "Overview" },
        { key: "services", label: "Services" },
        { key: "about", label: "About" },
        { key: "reviews", label: "Reviews" },
      ]} />

      {/* Bio front and center */}
      {(company.bio || company.fullDescription) && (
        <div className="mb-6">
          <div className="flex items-start gap-4 p-5 rounded-xl" style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8" }}>
            <div
              className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{ width: "56px", height: "56px", backgroundColor: company.logoColor, fontSize: "16px" }}
            >
              <User size={22} />
            </div>
            <div>
              <h3 className="font-bold mb-2" style={{ fontSize: "16px", color: "#1A4A35" }}>{company.name}</h3>
              <p style={{ color: "#4A5E4A", fontSize: "14px", lineHeight: 1.7 }}>
                {company.bio || company.fullDescription}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Specialty areas */}
      {company.specialtyAreas && (
        <div className="mb-6">
          <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>Specialty Areas</h3>
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

      {/* Credentials */}
      {company.credentials && (
        <div className="mb-6">
          <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>Credentials</h3>
          <div className="flex flex-col gap-2">
            {company.credentials.map((cred) => (
              <div key={cred} className="flex items-center gap-2">
                <span style={{ color: "#5CB85C", fontSize: "16px" }}>✓</span>
                <span style={{ fontSize: "14px", color: "#1A2E1A" }}>{cred}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engagement details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {company.yearsExperience && (
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8" }}>
            <p className="font-extrabold" style={{ fontSize: "24px", color: "#1A4A35" }}>{company.yearsExperience}</p>
            <p style={{ fontSize: "12px", color: "#4A5E4A" }}>Years Experience</p>
          </div>
        )}
        {company.hourlyRate && (
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8" }}>
            <p className="font-extrabold" style={{ fontSize: "18px", color: "#1A4A35" }}>{company.hourlyRate}</p>
            <p style={{ fontSize: "12px", color: "#4A5E4A" }}>Hourly Rate</p>
          </div>
        )}
        {company.availability && (
          <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8" }}>
            <p className="font-semibold" style={{ fontSize: "13px", color: "#5CB85C" }}>{company.availability}</p>
            <p style={{ fontSize: "12px", color: "#4A5E4A" }}>Availability</p>
          </div>
        )}
      </div>

      {company.rating && (
        <div>
          <h3 className="font-bold mb-3" style={{ fontSize: "16px", color: "#1A4A35" }}>Client Reviews</h3>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#F7F9F7", border: "1px solid #E8EDE8" }}>
            <span className="font-extrabold" style={{ fontSize: "36px", color: "#1A4A35" }}>{company.rating}</span>
            <div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={16} fill={s <= Math.round(company.rating!) ? "#F9C31A" : "#E8EDE8"} stroke="none" />
                ))}
              </div>
              <p style={{ fontSize: "13px", color: "#4A5E4A" }}>{company.reviewCount} verified reviews</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function VendorPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const category = getCategoryBySlug(company.category);
  const template = category?.template || "services-agencies";

  return (
    <>
      <SectionDivider />
      <div className="px-8 py-8" style={{ backgroundColor: "#F7F9F7" }}>
        <div className="mx-auto" style={{ maxWidth: "1100px" }}>
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center gap-2" style={{ fontSize: "13px", color: "#4A5E4A" }}>
            <Link href="/" style={{ color: "#4A5E4A" }}>Home</Link>
            <span>/</span>
            <Link href={`/directory/${company.category}`} style={{ color: "#4A5E4A" }}>
              {category?.label}
            </Link>
            <span>/</span>
            <span style={{ color: "#1A2E1A" }}>{company.name}</span>
          </div>

          {/* Company header */}
          <CompanyHeader company={company} />

          {/* Main layout */}
          <div className="flex gap-6" style={{ alignItems: "flex-start" }}>
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {template === "products-equipment" && <Template1 company={company} />}
              {template === "services-agencies" && <Template2 company={company} />}
              {template === "consultants-advisors" && <Template3 company={company} />}
            </div>

            {/* Right sidebar */}
            <div className="hidden lg:flex flex-col gap-4 flex-shrink-0" style={{ width: "290px" }}>
              <LeadForm companyName={company.name} serviceTags={company.serviceTags} />
              <VerifiedBox
                certifications={company.certifications}
                credentials={company.credentials}
              />
            </div>
          </div>
        </div>
      </div>
      <SectionDivider reverse />
    </>
  );
}
