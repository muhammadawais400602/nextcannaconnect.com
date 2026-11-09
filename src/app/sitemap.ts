import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/data/categories";
import { getAllCompanies } from "@/lib/getCompaniesFromDB";
import { getPosts } from "@/lib/wordpress";

import { SITE_URL } from "@/lib/siteUrl";

const BASE_URL = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static pages ──────────────────────────────────────────────
  // No lastModified on static pages: a timestamp that changes on every request
  // tells crawlers nothing and makes them distrust the sitemap.
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/directory`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/rfp-board`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/signup`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookie-policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Category pages ────────────────────────────────────────────
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/directory/${cat.slug}`,
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
