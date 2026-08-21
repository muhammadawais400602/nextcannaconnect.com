import Link from "next/link";

const DF = "#003320";
const SAGE = "#88B99E";
const PARCHMENT = "#EEEAE3";
const VARIANT = "#414943";
const OUTLINE = "#717973";

export interface HeroStat {
  icon: string;
  label: string;
}
export interface GuideItem {
  icon: string;
  title: string;
  body: string;
}
export interface RelatedItem {
  icon: string;
  label: string;
  slug: string;
}
export interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  categoryLabel: string;
  title: string;
  description: string;
  stats: HeroStat[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  guideTitle: string;
  guide: GuideItem[];
  related: RelatedItem[];
  faqs: FaqItem[];
  children: React.ReactNode; // the category-specific filter bar + listings grid
}

/**
 * Shared chrome for every directory category page:
 * breadcrumb → hero → buyer's guide → {grid} → related categories → FAQ.
 * Category-specific cards/filters are passed in as children.
 * Exposes .cat-container / .cat-grid / .cat-card utility classes for the grid.
 */
export default function CategoryPageShell({
  categoryLabel,
  title,
  description,
  stats,
  primaryCta,
  secondaryCta = { label: "Browse All Categories", href: "/directory" },
  guideTitle,
  guide,
  related,
  faqs,
  children,
}: Props) {
  return (
    <div style={{ background: "#fbf9f8", fontFamily: "'Inter', sans-serif", color: "#1b1c1b" }}>
      <style>{`
        .cat-container { max-width: 1280px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
        @media (min-width: 768px) { .cat-container { padding-left: 64px; padding-right: 64px; } }
        .cat-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 768px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .cat-grid { grid-template-columns: repeat(3, 1fr); } }
        .cat-card { transition: transform 0.3s, box-shadow 0.3s; }
        .cat-card:hover { transform: translateY(-6px); box-shadow: 0 10px 20px rgba(0,51,32,0.1); }
        .cat-guide-grid { display: grid; grid-template-columns: 1fr; gap: 32px; text-align: center; }
        @media (min-width: 640px) { .cat-guide-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 768px) { .cat-guide-grid { grid-template-columns: repeat(4, 1fr); } }
        .cat-related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (min-width: 768px) { .cat-related-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ background: "#FBF9F8", padding: "16px 0", borderBottom: `1px solid ${PARCHMENT}`, marginTop: "70px" }}>
        <div className="cat-container">
          <p style={{ fontSize: "12px", fontWeight: 600, color: VARIANT, margin: 0 }}>
            <Link href="/" style={{ color: VARIANT, textDecoration: "none" }}>Home</Link>
            {" / "}
            <Link href="/directory" style={{ color: VARIANT, textDecoration: "none" }}>Directory</Link>
            {" / "}
            <span style={{ color: DF }}>{categoryLabel}</span>
          </p>
        </div>
      </div>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "56vh", display: "flex", alignItems: "center", justifyContent: "center", background: DF, overflow: "hidden", padding: "64px 0" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${DF} 0%, #00160d 100%)` }} />
        <div className="cat-container" style={{ position: "relative", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ background: SAGE, color: DF, fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "0.75rem", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Verified Category</span>
          <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 700, color: "#FBF9F8", margin: "0 0 16px", lineHeight: 1.15 }}>{title}</h1>
          <p style={{ fontSize: "18px", color: "rgba(251,249,248,0.9)", maxWidth: "640px", margin: "0 0 32px", lineHeight: 1.5 }}>{description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "32px" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: "rgba(251,249,248,0.1)", backdropFilter: "blur(4px)", border: "1px solid rgba(251,249,248,0.2)", padding: "8px 16px", borderRadius: "0.5rem", display: "flex", alignItems: "center", gap: "8px", color: "#FBF9F8" }}>
                <span className="material-symbols-outlined" style={{ color: SAGE }}>{s.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: 500 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
            <Link href={primaryCta.href} style={{ fontSize: "14px", fontWeight: 500, background: SAGE, color: DF, padding: "12px 24px", borderRadius: "0.25rem", textDecoration: "none" }}>{primaryCta.label}</Link>
            <Link href={secondaryCta.href} style={{ fontSize: "14px", fontWeight: 500, border: "1px solid #FBF9F8", color: "#FBF9F8", padding: "12px 24px", borderRadius: "0.25rem", textDecoration: "none" }}>{secondaryCta.label}</Link>
          </div>
        </div>
      </section>

      {/* Buyer's guide */}
      {guide.length > 0 && (
        <section style={{ background: PARCHMENT, padding: "48px 0" }}>
          <div className="cat-container">
            <details style={{ background: "white", borderRadius: "0.75rem", border: `1px solid ${PARCHMENT}`, overflow: "hidden" }}>
              <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px", cursor: "pointer", listStyle: "none" }}>
                <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "26px", fontWeight: 700, color: DF, margin: 0 }}>{guideTitle}</h2>
                <span className="material-symbols-outlined" style={{ color: DF }}>expand_more</span>
              </summary>
              <div style={{ padding: "24px", borderTop: `1px solid ${PARCHMENT}`, background: "#FBF9F8" }}>
                <div className="cat-guide-grid">
                  {guide.map((g) => (
                    <div key={g.title} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: DF, color: SAGE, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>{g.icon}</span>
                      </div>
                      <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", margin: "0 0 8px" }}>{g.title}</h3>
                      <p style={{ fontSize: "14px", color: VARIANT, margin: 0, lineHeight: 1.5 }}>{g.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          </div>
        </section>
      )}

      {/* Category-specific filter bar + listings grid */}
      {children}

      {/* Related categories */}
      {related.length > 0 && (
        <section style={{ background: "#FBF9F8", padding: "64px 0", borderTop: `1px solid ${PARCHMENT}` }}>
          <div className="cat-container">
            <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "32px", fontWeight: 700, color: DF, margin: "0 0 32px" }}>Explore Related Categories</h2>
            <div className="cat-related-grid">
              {related.map((r) => (
                <Link key={r.slug} href={`/directory/${r.slug}`} style={{ background: "white", padding: "24px", borderRadius: "0.75rem", border: `1px solid ${PARCHMENT}`, textAlign: "center", textDecoration: "none", display: "block" }}>
                  <div style={{ width: "48px", height: "48px", margin: "0 auto 16px", borderRadius: "50%", background: "#efedec", display: "flex", alignItems: "center", justifyContent: "center", color: OUTLINE }}>
                    <span className="material-symbols-outlined">{r.icon}</span>
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#1b1c1b", margin: 0 }}>{r.label}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section style={{ background: "white", padding: "64px 0", borderTop: `1px solid ${PARCHMENT}` }}>
          <div className="cat-container" style={{ maxWidth: "768px" }}>
            <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "32px", fontWeight: 700, color: DF, margin: "0 0 32px", textAlign: "center" }}>Frequently Asked Questions</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {faqs.map((f) => (
                <details key={f.q} style={{ border: `1px solid ${PARCHMENT}`, borderRadius: "0.25rem", background: "#fbf9f8" }}>
                  <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", cursor: "pointer", fontSize: "14px", fontWeight: 500, color: "#1b1c1b", listStyle: "none" }}>
                    {f.q}
                    <span className="material-symbols-outlined" style={{ color: OUTLINE }}>expand_more</span>
                  </summary>
                  <div style={{ padding: "0 16px 16px", fontSize: "14px", color: VARIANT, lineHeight: 1.6 }}>{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
