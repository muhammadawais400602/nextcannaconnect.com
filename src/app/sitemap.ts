import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { getAllCompanies } from "@/lib/getCompaniesFromDB";
import { getPosts } from "@/lib/wordpress";

const BASE_URL = "https://nextcannaconnect.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/directory`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/membership`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/signin`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Category pages ────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/directory/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // ── Vendor pages ──────────────────────────────────────────────
  let vendorPages: MetadataRoute.Sitemap = [];
  try {
    const companies = await getAllCompanies();
    vendorPages = companies
      .filter((c) => c.tier !== "free")
      .map((c) => ({
        url: `${BASE_URL}/vendor/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    // skip if DB unavailable
  }

  // ── Blog posts ────────────────────────────────────────────────
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { posts } = await getPosts({ perPage: 100 });
    blogPages = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // skip if WordPress unavailable
  }

  return [...staticPages, ...categoryPages, ...vendorPages, ...blogPages];
}
