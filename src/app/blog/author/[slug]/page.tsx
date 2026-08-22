import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  getPosts,
  getFeaturedImage,
  getAuthor,
  getAuthorSlug,
  getPostCategories,
  formatDate,
  readingTime,
  stripHtml,
} from "@/lib/wordpress";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const displayName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Articles by ${displayName} | NextCanna Connect`,
    description: `Read the latest cannabis industry insights from ${displayName} on NextCanna Connect.`,
  };
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));
  const displayName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const { posts: allPosts, total, totalPages } = await getPosts({
    page: currentPage,
    perPage: 12,
  });

  const posts = allPosts.filter((p) => getAuthorSlug(getAuthor(p)) === slug);

  return (
    <>
      <div style={{ backgroundColor: "#f6f3f2", paddingTop: "100px", paddingBottom: "48px" }}>
        <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1440px" }}>
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif", marginBottom: "32px" }}>
            <Link href="/" style={{ color: "#9CA3AF", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/blog" style={{ color: "#9CA3AF", textDecoration: "none" }}>Blog</Link>
            <span>›</span>
            <span style={{ color: "#374151" }}>{displayName}</span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              backgroundColor: "#003320", display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color: "white", fontFamily: "'Inter', sans-serif" }}>
                {displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
              </span>
            </div>
            <div>
              <h1 style={{
                fontFamily: "'Noto Serif', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 700, color: "#111827", marginBottom: "4px",
              }}>
                {displayName}
              </h1>
              <p style={{ fontSize: "13px", color: "#6B7280", fontFamily: "'Inter', sans-serif", margin: 0 }}>
                Contributor at NextCanna Connect
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#f6f3f2", minHeight: "40vh" }}>
        <div className="mx-auto px-4 md:px-8 pb-16" style={{ maxWidth: "1440px" }}>
          {posts.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }} className="author-grid">
              {posts.map((post) => {
                const img = getFeaturedImage(post);
                const cats = getPostCategories(post);
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                    <article className="blog-card" style={{ backgroundColor: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #e5e7eb", height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ position: "relative", height: "200px", backgroundColor: "#f3f4f6", flexShrink: 0 }}>
                        {img ? (
                          <Image src={img} alt={post.title.rendered} fill style={{ objectFit: "cover" }} unoptimized />
                        ) : (
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #003320 0%, #1A4A35 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: "'Noto Serif', serif", fontSize: "28px", fontStyle: "italic", color: "rgba(255,255,255,0.15)" }}>NC</span>
                          </div>
                        )}
                      </div>
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
                        <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1.65, fontFamily: "'Inter', sans-serif", flex: 1 }}>
                          {stripHtml(post.excerpt.rendered).slice(0, 110)}…
                        </p>
                        <p style={{ fontSize: "11px", color: "#9CA3AF", fontFamily: "'Inter', sans-serif", paddingTop: "14px", borderTop: "1px solid #f3f4f6", margin: 0 }}>
                          {formatDate(post.date)}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
              <p style={{ fontSize: "15px" }}>No articles found for this author.</p>
              <Link href="/blog" style={{ color: "#003320", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>
                ← Back to Blog
              </Link>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .blog-card { transition: box-shadow 0.2s; }
        .blog-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
        @media (max-width: 768px) { .author-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1024px) { .author-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </>
  );
}
