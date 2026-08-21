import Link from "next/link";
import { Company } from "@/types";
import ContactForm from "@/app/vendor/[slug]/ContactForm";
import ConsultantsProfileTabs from "./ConsultantsProfileTabs";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const INK = "#1A1A1A";
const VARIANT = "#414943";

interface Props {
  company: Company;
  similar: Company[];
}

export default function ConsultantsProfile({ company, similar }: Props) {
  const verified = company.tier === "elite" || company.tier === "select";

  const pills = [
    verified ? { icon: "check_circle", label: "Industry Verified" } : null,
    (company.certifications ?? []).length > 0 ? { icon: "verified_user", label: "Background Checked" } : null,
    company.insuranceOnFile ? { icon: "shield", label: "Insurance on File" } : null,
    (company.yearsInCannabis ?? 0) >= 5 ? { icon: "workspace_premium", label: "5+ Yrs Cannabis" } : null,
  ].filter(Boolean) as { icon: string; label: string }[];

  const contactItems = [
    company.phone ? { icon: "phone", label: company.phone, href: `tel:${company.phone}` } : null,
    company.email ? { icon: "mail", label: company.email, href: `mailto:${company.email}` } : null,
    company.website
      ? { icon: "language", label: company.website.replace(/^https?:\/\//, ""), href: company.website }
      : null,
  ].filter(Boolean) as { icon: string; label: string; href: string }[];

  return (
    <div style={{ background: "#FBF9F8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b", paddingTop: "70px" }}>
      <style>{`
        .cnp-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .cnp-container { padding-left: 64px; padding-right: 64px; } }
        .cnp-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 1024px) { .cnp-grid { grid-template-columns: 8fr 4fr; } }
        .cnp-identity { display: flex; flex-direction: column; gap: 24px; }
        @media (min-width: 768px) { .cnp-identity { flex-direction: row; align-items: center; justify-content: space-between; } }
        .cnp-sidebar { position: static; }
        @media (min-width: 1024px) { .cnp-sidebar { position: sticky; top: 96px; align-self: start; } }
      `}</style>

      <div style={{ padding: "16px 0" }}>
        <div className="cnp-container" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 600, color: VARIANT, flexWrap: "wrap" }}>
          <Link href="/" style={{ color: VARIANT, textDecoration: "none" }}>Home</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          <Link href="/directory" style={{ color: VARIANT, textDecoration: "none" }}>Directory</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          <Link href="/directory/consultants-advisors" style={{ color: VARIANT, textDecoration: "none" }}>Consultants &amp; Advisors</Link>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>chevron_right</span>
          <span style={{ color: DF }}>{company.name}</span>
        </div>
      </div>

      <div style={{ position: "relative", width: "100%", height: "288px" }}>
        {company.bannerImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={company.bannerImageUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${company.logoColor} 0%, #001c10 100%)` }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: DF, opacity: 0.4 }} />
        <div className="cnp-container" style={{ position: "relative", height: "100%" }}>
          <div style={{ position: "absolute", top: "24px", left: "20px" }}>
            <Link href="/directory/consultants-advisors" style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", fontSize: "14px", fontWeight: 500, background: "rgba(0,0,0,0.2)", padding: "8px 16px", borderRadius: "0.5rem", backdropFilter: "blur(4px)", textDecoration: "none" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
              <span>Back to Consultants &amp; Advisors</span>
            </Link>
          </div>
        </div>
      </div>

      <main className="cnp-container" style={{ position: "relative", paddingBottom: "96px" }}>
        <div className="cnp-identity" style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", boxShadow: "0 10px 25px -5px rgba(0,51,32,0.1)", padding: "32px", marginTop: "-96px", position: "relative", zIndex: 20, marginBottom: "48px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "96px", height: "96px", borderRadius: "0.5rem", background: "#efedec", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${PARCHMENT}`, overflow: "hidden" }}>
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logoUrl} alt={company.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: company.logoColor, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "28px", fontWeight: 800 }}>{company.logoPlaceholder}</div>
                )}
              </div>
              <div>
                <h1 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: INK, margin: "0 0 4px", letterSpacing: "-0.01em" }}>{company.name}</h1>
                <p style={{ fontSize: "16px", color: VARIANT, margin: "0 0 12px" }}>{company.shortDescription}</p>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", fontSize: "12px", fontWeight: 600 }}>
                  {(company.location.city || company.location.state) && (
                    <span style={{ display: "flex", alignItems: "center", color: VARIANT }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", marginRight: "4px" }}>location_on</span>
                      {[company.location.city, company.location.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {verified && (
                    <span style={{ display: "flex", alignItems: "center", color: SAGE, background: "rgba(187,238,209,0.2)", padding: "4px 8px", borderRadius: "0.75rem" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px", marginRight: "4px" }}>verified</span>
                      {company.verifiedDate ? `Verified ${company.verifiedDate}` : "Verified"}
                    </span>
                  )}
                  {typeof company.rating === "number" && (
                    <span style={{ display: "flex", alignItems: "center", color: INK }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#f59e0b", marginRight: "4px", fontVariationSettings: "'FILL' 1" }}>star</span>
                      {company.rating}{company.reviewCount ? ` (${company.reviewCount} Reviews)` : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "200px" }}>
            <a href="#get-in-touch" style={{ background: DF, color: "white", borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, padding: "12px 24px", textAlign: "center", textDecoration: "none" }}>Book Free Consultation</a>
            <a href="#get-in-touch" style={{ border: `1px solid ${DF}`, color: DF, borderRadius: "0.25rem", fontSize: "14px", fontWeight: 500, padding: "12px 24px", textAlign: "center", textDecoration: "none" }}>View Case Studies</a>
          </div>
        </div>

        {pills.length > 0 && (
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px", marginBottom: "32px" }}>
            {pills.map((p) => (
              <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.75rem", padding: "8px 16px", whiteSpace: "nowrap", fontSize: "12px", fontWeight: 600, color: VARIANT }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: SAGE }}>{p.icon}</span> {p.label}
              </div>
            ))}
          </div>
        )}

        <div className="cnp-grid">
          <div>
            <ConsultantsProfileTabs company={company} similar={similar} />
          </div>

          <div className="cnp-sidebar">
            <div id="get-in-touch" style={{ scrollMarginTop: "96px" }}>
              <ContactForm companyName={company.name} serviceTags={company.serviceTags ?? []} />
            </div>
            {contactItems.length > 0 && (
              <div style={{ background: "white", border: `1px solid ${PARCHMENT}`, borderRadius: "0.5rem", padding: "24px" }}>
                <h3 style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 16px" }}>Get In Touch</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {contactItems.map((c) => (
                    <a key={c.label} href={c.href} target={c.icon === "language" ? "_blank" : undefined} rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "16px", color: INK, textDecoration: "none" }}>
                      <span className="material-symbols-outlined" style={{ color: VARIANT }}>{c.icon}</span> {c.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <div style={{ width: "100%", background: DF, padding: "64px 0", textAlign: "center" }}>
        <div className="cnp-container">
          <h2 style={{ fontSize: "clamp(24px, 4vw, 32px)", fontWeight: 600, color: "white", margin: "0 0 24px" }}>Are you a cannabis industry consultant or advisor?</h2>
          <Link href="/signup" style={{ background: "white", color: DF, borderRadius: "0.25rem", fontSize: "14px", fontWeight: 700, padding: "12px 32px", textDecoration: "none", display: "inline-block" }}>Join the Verified Directory</Link>
        </div>
      </div>
    </div>
  );
}
