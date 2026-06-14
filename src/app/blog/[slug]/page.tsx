import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPost,
  getPosts,
  getFeaturedImage,
  getAuthor,
  getAuthorAvatar,
  getPostCategories,
  formatDate,
  readingTime,
  stripHtml,
} from "@/lib/wordpress";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found | NextCanna Connect" };
  return {
    title: `${post.title.rendered} | NextCanna Connect`,
    description: stripHtml(post.excerpt.rendered).slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, { posts: relatedPosts }] = await Promise.all([
    getPost(slug),
    getPosts({ perPage: 3 }),
  ]);

  if (!post) notFound();

  const featuredImage = getFeaturedImage(post);
  const author = getAuthor(post);
  const authorAvatar = getAuthorAvatar(post);
  const cats = getPostCategories(post);
  const related = relatedPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div style={{ backgroundColor: "#f6f3f2", paddingTop: "90px" }}>
        <div className="mx-auto px-4 md:px-8 py-4" style={{ maxWidth: "1440px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
            <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/blog" style={{ color: "#9CA3AF", textDecoration: "none" }}>Blog</Link>
            <span>›</span>
            <span style={{ color: "#374151" }}>{post.title.rendered}</span>
          </nav>
        </div>
      </div>

      {/* ── Article Header ── */}
      <div style={{ backgroundColor: "#f6f3f2", paddingBottom: "0" }}>
        <div className="mx-auto px-4 md:px-8 pt-6 pb-8" style={{ maxWidth: "1440px" }}>
          {cats[0] && (
            <span style={{ display: "inline-block", fontSize: "9px", fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "#003320", backgroundColor: "rgba(0,51,32,0.08)", padding: "4px 10px", borderRadius: "4px", fontFamily: "'Inter', sans-serif", marginBottom: "16px" }}>
              {cats[0]}
            </span>
          )}
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.2,
              marginBottom: "20px",
              maxWidth: "820px",
            }}
          >
            {post.title.rendered}
          </h1>
          {/* Author row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#003320", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {authorAvatar ? (
                <Image src={authorAvatar} alt={author} width={40} height={40} style={{ objectFit: "cover" }} unoptimized />
              ) : (
                <span style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>{author.charAt(0)}</span>
              )}
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", fontFamily: "'Inter', sans-serif", margin: 0 }}>{author}</p>
              <p style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                {formatDate(post.date)} · {readingTime(post.content.rendered)} min read
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Image ── */}
      {featuredImage && (
        <div style={{ position: "relative", height: "460px", backgroundColor: "#003320" }}>
          <Image
            src={featuredImage}
            alt={post.title.rendered}
            fill
            style={{ objectFit: "cover" }}
            priority
            unoptimized
          />
        </div>
      )}

      {/* ── Body ── */}
      <div style={{ backgroundColor: "#f6f3f2" }}>
        <div className="mx-auto px-4 md:px-8 py-12" style={{ maxWidth: "1440px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "48px", alignItems: "flex-start" }} className="article-layout">

            {/* Article content */}
            <article>
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />

              {/* ── Share bar ── */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "32px", marginTop: "32px", borderTop: "1px solid #e5e7eb", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => typeof navigator !== "undefined" && navigator.share?.({ title: post.title.rendered, url: window.location.href })}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#374151", fontFamily: "'Inter', sans-serif", background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>share</span>
                    Share
                  </button>
                </div>
                <Link href="/blog" style={{ fontSize: "12px", fontWeight: 600, color: "#003320", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
                  ← Back to Blog
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside style={{ position: "sticky", top: "100px" }}>
              {/* Find a Partner CTA */}
              <div style={{ backgroundColor: "#003320", borderRadius: "16px", padding: "28px", marginBottom: "32px" }}>
                <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "20px", fontWeight: 700, color: "white", marginBottom: "10px" }}>Find a Partner</h3>
                <p style={{ fontSize: "13px", color: "rgba(136,185,158,0.8)", lineHeight: 1.65, fontFamily: "'Inter', sans-serif", marginBottom: "20px" }}>
                  Access the world&apos;s most compliant B2B marketplace for institutional cannabis operators.
                </p>
                <Link
                  href="/directory"
                  style={{
                    display: "block",
                    textAlign: "center",
                    backgroundColor: "rgba(136,185,158,0.15)",
                    color: "rgba(136,185,158,0.9)",
                    textDecoration: "none",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    padding: "12px",
                    borderRadius: "8px",
                    fontFamily: "'Inter', sans-serif",
                    border: "1px solid rgba(136,185,158,0.2)",
                  }}
                >
                  Explore Directory
                </Link>
              </div>

              {/* Most Read */}
              <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e5e7eb" }}>
                <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(65,73,67,0.4)", fontFamily: "'Inter', sans-serif", marginBottom: "20px" }}>
                  Most Read Articles
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {related.map((p) => (
                    <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                      <div>
                        {getPostCategories(p)[0] && (
                          <p style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#D97706", fontFamily: "'Inter', sans-serif", marginBottom: "4px" }}>
                            {getPostCategories(p)[0]}
                          </p>
                        )}
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", fontFamily: "'Noto Serif', serif", lineHeight: 1.35 }}>
                          {p.title.rendered}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── Related Insights ── */}
      {related.length > 0 && (
        <section style={{ backgroundColor: "white", padding: "64px 0" }}>
          <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1440px" }}>
            <h2 style={{ fontFamily: "'Noto Serif', serif", fontSize: "26px", fontWeight: 700, color: "#111827", marginBottom: "32px" }}>
              Related Insights
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="related-grid">
              {related.map((p) => {
                const img = getFeaturedImage(p);
                const pCats = getPostCategories(p);
                return (
                  <Link key={p.id} href={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                    <article style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
                      <div style={{ position: "relative", height: "180px", backgroundColor: "#f3f4f6" }}>
                        {img ? (
                          <Image src={img} alt={p.title.rendered} fill style={{ objectFit: "cover" }} unoptimized />
                        ) : (
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #003320 0%, #1A4A35 100%)" }} />
                        )}
                      </div>
                      <div style={{ padding: "20px" }}>
                        {pCats[0] && (
                          <p style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#D97706", fontFamily: "'Inter', sans-serif", marginBottom: "8px" }}>
                            {pCats[0]}
                          </p>
                        )}
                        <h3 style={{ fontFamily: "'Noto Serif', serif", fontSize: "16px", fontWeight: 700, color: "#111827", lineHeight: 1.35 }}>
                          {p.title.rendered}
                        </h3>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .article-body {
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          line-height: 1.8;
          color: #374151;
        }
        .article-body h2 {
          font-family: 'Noto Serif', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 2rem 0 1rem;
          line-height: 1.3;
        }
        .article-body h3 {
          font-family: 'Noto Serif', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #111827;
          margin: 1.5rem 0 0.75rem;
        }
        .article-body p { margin-bottom: 1.25rem; }
        .article-body blockquote {
          border-left: 3px solid #003320;
          padding: 16px 24px;
          margin: 2rem 0;
          background: rgba(0,51,32,0.04);
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #374151;
        }
        .article-body ul, .article-body ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .article-body li { margin-bottom: 0.5rem; }
        .article-body a { color: #003320; }
        .article-body img { max-width: 100%; border-radius: 8px; margin: 1rem 0; }
        @media (max-width: 900px) {
          .article-layout { grid-template-columns: 1fr !important; }
          .related-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 901px) and (max-width: 1100px) {
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}
