import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/blog/NewsletterForm";
import {
  getPosts,
  getCategories,
  getFeaturedImage,
  getAuthor,
  getAuthorSlug,
  getPostCategories,
  formatDate,
  readingTime,
  stripHtml,
} from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cannabis Industry Insights | NextCanna Connect",
  description: "Expert analysis, regulatory updates, and strategic intelligence for the professional cannabis industry.",
};

const BLOG_CATEGORIES = [
  { slug: "all", label: "All Articles" },
  { slug: "market-trends", label: "Market Trends" },
  { slug: "regulatory-updates", label: "Regulatory Updates" },
  { slug: "cultivation-growing", label: "Cultivation & Growing" },
  { slug: "extraction-processing", label: "Extraction & Processing" },
  { slug: "technology", label: "Technology" },
  { slug: "finance-banking", label: "Finance & Banking" },
  { slug: "compliance-legal", label: "Compliance & Legal" },
  { slug: "supply-chain", label: "Supply Chain" },
  { slug: "operations", label: "Operations" },
];

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { category = "all", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));

  const [{ posts, totalPages }, categories] = await Promise.all([
    getPosts({ page: currentPage, perPage: 9, categorySlug: category !== "all" ? category : undefined }),
    getCategories(),
  ]);

  const featuredPost = currentPage === 1 && category === "all" ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  const availableCategories = BLOG_CATEGORIES.filter(
    (bc) => bc.slug === "all" || categories.some((c) => c.slug === bc.slug) || true
  );

  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          height: "480px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          backgroundColor: "#003320",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,51,32,0.4) 0%, rgba(0,51,32,0.85) 100%)",
            zIndex: 1,
          }}
        />
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(136,185,158,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(136,185,158,0.06) 0%, transparent 50%)",
            zIndex: 0,
          }}
        />
        <div
          className="mx-auto px-4 md:px-8 pb-16"
          style={{ maxWidth: "1440px", width: "100%", position: "relative", zIndex: 2 }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(136,185,158,0.8)",
              marginBottom: "16px",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            NextCanna Connect
          </p>
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              marginBottom: "16px",
              maxWidth: "700px",
            }}
          >
            Cannabis Industry Insights
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.65,
              maxWidth: "520px",
              fontFamily: "'Inter', sans-serif",
              marginBottom: "32px",
            }}
          >
            Expert analysis, regulatory updates, and strategic intelligence designed for the professional cannabis ecosystem.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link
              href="#newsletter"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "white",
                color: "#003320",
                textDecoration: "none",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "12px 24px",
                borderRadius: "8px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Subscribe Now
            </Link>
            <Link
              href="/directory"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "transparent",
                color: "white",
                textDecoration: "none",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "12px 24px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.35)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category Tabs ── */}
      <div
        style={{
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "white",
          position: "sticky",
          top: "65px",
          zIndex: 40,
        }}
      >
        <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1440px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0", overflowX: "auto", scrollbarWidth: "none" }}>
            {availableCategories.map((cat) => {
              const isActive = category === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/blog${cat.slug !== "all" ? `?category=${cat.slug}` : ""}`}
                  style={{
                    display: "inline-block",
                    padding: "16px 20px",
                    fontSize: "12px",
                    fontWeight: isActive ? 700 : 500,
                    fontFamily: "'Inter', sans-serif",
                    color: isActive ? "#003320" : "#6B7280",
                    textDecoration: "none",
                    borderBottom: isActive ? "2px solid #003320" : "2px solid transparent",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#f6f3f2", minHeight: "60vh" }}>
        <div className="mx-auto px-4 md:px-8 py-12" style={{ maxWidth: "1440px" }}>

          {/* ── Featured Post ── */}
          {featuredPost && (
            <div style={{ marginBottom: "64px" }}>
              <Link href={`/blog/${featuredPost.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0",
                    backgroundColor: "white",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                  }}
                  className="featured-post-grid"
                >
                  {/* Image */}
                  <div style={{ position: "relative", minHeight: "380px", backgroundColor: "#003320" }}>
                    {getFeaturedImage(featuredPost) ? (
                      <Image
                        src={getFeaturedImage(featuredPost)!}
                        alt={featuredPost.title.rendered}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #003320 0%, #1A4A35 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Noto Serif', serif", fontSize: "48px", fontStyle: "italic", color: "rgba(255,255,255,0.15)" }}>NC</span>
                      </div>
                    )}
                    <div style={{ position: "absolute", top: "20px", left: "20px" }}>
                      {getPostCategories(featuredPost)[0] && (
                        <span style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "white", backgroundColor: "rgba(0,51,32,0.8)", padding: "4px 10px", borderRadius: "4px", fontFamily: "'Inter', sans-serif" }}>
                          Featured Analysis
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Content */}
                  <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    {getPostCategories(featuredPost)[0] && (
                      <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#D97706", marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>
                        {getPostCategories(featuredPost)[0]}
                      </p>
                    )}
                    <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#111827", lineHeight: 1.25, marginBottom: "16px" }}>
                      {featuredPost.title.rendered}
                    </h2>
                    <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.7, fontFamily: "'Inter', sans-serif", marginBottom: "24px" }}>
                      {stripHtml(featuredPost.excerpt.rendered).slice(0, 160)}…
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#003320", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "white", fontFamily: "'Inter', sans-serif" }}>
                          {getAuthor(featuredPost).charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", fontFamily: "'Inter', sans-serif", margin: 0 }}>{getAuthor(featuredPost)}</p>
                        <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                          {formatDate(featuredPost.date)} · {readingTime(featuredPost.content.rendered)} min read
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ── Grid heading ── */}
          {gridPosts.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "22px", fontWeight: 700, color: "#111827" }}>
                {category === "all" ? "Latest Intelligence" : availableCategories.find(c => c.slug === category)?.label ?? "Articles"}
              </h2>
            </div>
          )}

          {/* ── Post Grid ── */}
          {gridPosts.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
                marginBottom: "48px",
              }}
              className="blog-grid"
            >
              {gridPosts.map((post, i) => {
                const isExpertCard = i === 4;
                if (isExpertCard && category === "all") {
                  return (
                    <div key="expert" style={{ backgroundColor: "#003320", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "22px", fontWeight: 700, color: "white", marginBottom: "12px" }}>Expert Contributions</h3>
                      <p style={{ fontSize: "13px", color: "rgba(136,185,158,0.8)", lineHeight: 1.7, fontFamily: "'Inter', sans-serif", marginBottom: "24px" }}>
                        Are you an industry leader with insights to share? We welcome high-level analysis from verified professionals.
                      </p>
                      <Link
                        href="/signup"
                        style={{ display: "inline-block", border: "1px solid rgba(136,185,158,0.5)", color: "rgba(136,185,158,0.9)", textDecoration: "none", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", padding: "10px 20px", borderRadius: "8px", fontFamily: "'Inter', sans-serif", alignSelf: "flex-start" }}
                      >
                        Submit an Article
                      </Link>
                    </div>
                  );
                }

                const img = getFeaturedImage(post);
                const cats = getPostCategories(post);
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <article className="blog-card" style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #e5e7eb", height: "100%", display: "flex", flexDirection: "column" }}>
                      {/* Image */}
                      <div style={{ position: "relative", height: "200px", backgroundColor: "#f3f4f6", flexShrink: 0 }}>
                        {img ? (
                          <Image src={img} alt={post.title.rendered} fill style={{ objectFit: "cover" }} unoptimized />
                        ) : (
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #003320 0%, #1A4A35 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: "'Noto Serif', serif", fontSize: "28px", fontStyle: "italic", color: "rgba(255,255,255,0.15)" }}>NC</span>
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div style={{ padding: "20px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                          {cats[0] && (
                            <span style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#003320", backgroundColor: "rgba(0,51,32,0.07)", padding: "3px 8px", borderRadius: "4px", fontFamily: "'Inter', sans-serif" }}>
                              {cats[0]}
                            </span>
                          )}
                          <span style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
                            {readingTime(post.content.rendered)} min read
                          </span>
                        </div>
                        <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "17px", fontWeight: 700, color: "#111827", lineHeight: 1.35, marginBottom: "10px" }}>
                          {post.title.rendered}
                        </h3>
                        <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.65, fontFamily: "'Inter', sans-serif", marginBottom: "16px", flex: 1 }}>
                          {stripHtml(post.excerpt.rendered).slice(0, 110)}…
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "14px", borderTop: "1px solid #f3f4f6" }}>
                          <div style={{ width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "#003320", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: "9px", fontWeight: 700, color: "white" }}>{getAuthor(post).charAt(0)}</span>
                          </div>
                          <div>
                            <p style={{ fontSize: "11px", fontWeight: 600, color: "#374151", fontFamily: "'Inter', sans-serif", margin: 0 }}>{getAuthor(post)}</p>
                            <p style={{ fontSize: "10px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif", margin: 0 }}>{formatDate(post.date)}</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
              <p style={{ fontSize: "15px" }}>No articles yet in this category. Check back soon.</p>
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "64px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/blog?${category !== "all" ? `category=${category}&` : ""}page=${p}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: p === currentPage ? 700 : 400,
                    fontFamily: "'Inter', sans-serif",
                    textDecoration: "none",
                    backgroundColor: p === currentPage ? "#003320" : "white",
                    color: p === currentPage ? "white" : "#374151",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}

          {/* ── Newsletter ── */}
          <section id="newsletter" style={{ backgroundColor: "#003320", borderRadius: "20px", padding: "64px 48px", textAlign: "center", marginTop: "32px" }}>
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "clamp(1.6rem, 3vw, 2.5rem)", fontWeight: 700, color: "white", marginBottom: "14px" }}>
              Stay Connected
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(136,185,158,0.8)", lineHeight: 1.65, fontFamily: "'Inter', sans-serif", marginBottom: "32px", maxWidth: "460px", margin: "0 auto 32px" }}>
              Join our growing community of industry professionals receiving our weekly briefing on essential cannabis business developments.
            </p>
            <NewsletterForm />
            <p style={{ fontSize: "11px", color: "rgba(136,185,158,0.5)", fontFamily: "'Inter', sans-serif", marginTop: "14px" }}>
              No spam. Only high-value intelligence. Unsubscribe at any time.
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .blog-card { transition: box-shadow 0.2s; }
        .blog-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        @media (max-width: 768px) {
          .featured-post-grid { grid-template-columns: 1fr !important; }
          .blog-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
