const WP_BASE = "https://wp.nextcannaconnect.com/wp-json/wp/v2";

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
    author?: Array<{ name: string; avatar_urls?: Record<string, string> }>;
    "wp:term"?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

async function wpFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_BASE}${path}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`WP API error: ${res.status} ${path}`);
  return res.json();
}

export async function getPosts(params?: {
  page?: number;
  perPage?: number;
  categorySlug?: string;
  search?: string;
}): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  const { page = 1, perPage = 9, categorySlug, search } = params ?? {};

  let categoryId: number | undefined;
  if (categorySlug && categorySlug !== "all") {
    try {
      const cats = await wpFetch<WPCategory[]>(`/categories?slug=${categorySlug}`);
      categoryId = cats[0]?.id;
    } catch {
      // ignore
    }
  }

  const qs = new URLSearchParams({
    _embed: "1",
    per_page: String(perPage),
    page: String(page),
    ...(categoryId ? { categories: String(categoryId) } : {}),
    ...(search ? { search } : {}),
  });

  const res = await fetch(`${WP_BASE}/posts?${qs}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return { posts: [], total: 0, totalPages: 0 };

  const posts: WPPost[] = await res.json();
  const total = Number(res.headers.get("X-WP-Total") ?? 0);
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 0);
  return { posts, total, totalPages };
}

export async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const posts = await wpFetch<WPPost[]>(`/posts?slug=${slug}&_embed=1`);
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  try {
    return await wpFetch<WPCategory[]>("/categories?per_page=20&hide_empty=true");
  } catch {
    return [];
  }
}

export function getFeaturedImage(post: WPPost): string | null {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
}

export function getAuthor(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? "NextCanna Connect";
}

export function getAuthorSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getAuthorAvatar(post: WPPost): string | null {
  const avatars = post._embedded?.author?.[0]?.avatar_urls;
  return avatars ? (avatars["96"] ?? avatars["48"] ?? null) : null;
}

export function getPostCategories(post: WPPost): string[] {
  return (post._embedded?.["wp:term"]?.[0]?.map((t) => t.name) ?? []).filter(
    (name) => name.toLowerCase() !== "uncategorized"
  );
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

export function readingTime(content: string): number {
  const words = stripHtml(content).split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
