import { Company } from "@/types";

export const COMPANIES: Company[] = [];

export function getCompaniesByCategory(categorySlug: string): Company[] {
  return COMPANIES.filter(
    (c) => c.category === categorySlug || c.secondaryCategory === categorySlug
  ).sort((a, b) => {
    const order: Record<string, number> = {
      elite: 0,
      select: 1,
      free: 2,
    };
    return order[a.tier] - order[b.tier];
  });
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}

export function getFeaturedCompanies(): Company[] {
  return COMPANIES.filter((c) =>
    c.tier === "elite" || c.tier === "select"
  ).slice(0, 8);
}
