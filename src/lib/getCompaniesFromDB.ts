import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";
import type { Company as CompanyType } from "@/types";

const TIER_ORDER: Record<string, number> = { featured: 0, elite: 1, select: 2, claimed: 3, free: 4 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function docToCompany(doc: any): CompanyType {
  return {
    id: doc._id?.toString() ?? doc.slug,
    slug: doc.slug,
    name: doc.name,
    tier: doc.tier,
    category: doc.category,
    secondaryCategory: doc.secondaryCategory,
    location: doc.location,
    shortDescription: doc.shortDescription,
    fullDescription: doc.fullDescription,
    serviceTags: doc.serviceTags ?? [],
    logoPlaceholder: doc.logoPlaceholder,
    logoColor: doc.logoColor ?? "#1A4A35",
    bannerColor: doc.bannerImageUrl,
    website: doc.website,
    phone: doc.phone,
    email: doc.email,
    productLines: doc.productLines,
    minOrderQty: doc.minOrderQty,
    leadTime: doc.leadTime,
    serviceArea: doc.serviceArea,
    certifications: doc.certifications,
    statesServed: doc.statesServed,
    teamSize: doc.teamSize,
    yearsInCannabis: doc.yearsInCannabis,
    pricingModel: doc.pricingModel,
    caseStudies: doc.caseStudies,
    specialtyAreas: doc.specialtyAreas,
    credentials: doc.credentials,
    yearsExperience: doc.yearsExperience,
    hourlyRate: doc.hourlyRate,
    availability: doc.availability,
    bio: doc.bio,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
  };
}

export async function getCompaniesByCategory(categorySlug: string): Promise<CompanyType[]> {
  try {
    await connectDB();
    const docs = await Company.find({
      $or: [{ category: categorySlug }, { secondaryCategory: categorySlug }],
    })
      .select("-__v")
      .lean();

    return docs
      .map(docToCompany)
      .sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
  } catch {
    return [];
  }
}

export async function getFeaturedCompanies(): Promise<CompanyType[]> {
  try {
    await connectDB();
    const docs = await Company.find({ tier: { $in: ["featured", "elite", "select"] } })
      .sort({ tier: 1 })
      .limit(8)
      .select("-__v")
      .lean();
    return docs.map(docToCompany);
  } catch {
    return [];
  }
}

export async function getCompanyBySlug(slug: string): Promise<CompanyType | undefined> {
  try {
    await connectDB();
    const doc = await Company.findOne({ slug }).select("-__v").lean();
    return doc ? docToCompany(doc) : undefined;
  } catch {
    return undefined;
  }
}
