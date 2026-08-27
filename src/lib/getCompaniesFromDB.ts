import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Company, { ICompany } from "@/lib/models/Company";
import type { Company as CompanyType } from "@/types";

const TIER_ORDER: Record<string, number> = { elite: 0, select: 1, free: 2 };

function docToCompany(doc: Partial<ICompany> & { _id?: unknown }): CompanyType {
  return {
    id: String(doc._id ?? doc.slug),
    slug: doc.slug!,
    name: doc.name!,
    tier: doc.tier!,
    category: doc.category as CompanyType["category"],
    secondaryCategory: doc.secondaryCategory as CompanyType["category"] | undefined,
    location: doc.location!,
    shortDescription: doc.shortDescription!,
    fullDescription: doc.fullDescription,
    serviceTags: doc.serviceTags ?? [],
    logoPlaceholder: doc.logoPlaceholder!,
    logoColor: doc.logoColor ?? "#1A4A35",
    logoUrl: doc.logoUrl,
    bannerImageUrl: doc.bannerImageUrl,
    bannerCaption: doc.bannerCaption,
    foundedYear: doc.foundedYear,
    products: doc.products,
    website: doc.website,
    phone: doc.phone,
    email: doc.email,
    linkedinUrl: doc.linkedinUrl,
    instagramUrl: doc.instagramUrl,
    youtubeUrl: doc.youtubeUrl,
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
    licenseNumber: doc.licenseNumber,
    licenseType: doc.licenseType,
    delivery: doc.delivery,
    hours: doc.hours,
    insuranceOnFile: doc.insuranceOnFile,
    metrcIntegrated: doc.metrcIntegrated,
    verifiedDate: doc.verifiedDate,
    locationsCount: doc.locationsCount,
    faqs: doc.faqs,
    vehicleCount: doc.vehicleCount,
    transportType: doc.transportType,
    loadsPerMonth: doc.loadsPerMonth,
    statesActive: doc.statesActive,
    cargoInsurance: doc.cargoInsurance,
    gpsTracked: doc.gpsTracked,
    dispatchHours: doc.dispatchHours,
    licensesTable: doc.licensesTable,
    accreditation: doc.accreditation,
    turnaroundTime: doc.turnaroundTime,
    panelCount: doc.panelCount,
    licenseStatus: doc.licenseStatus,
    facilitySize: doc.facilitySize,
    samplesTested: doc.samplesTested,
    sampleTypes: doc.sampleTypes,
    rushService: doc.rushService,
    sampleIntakeHours: doc.sampleIntakeHours,
    accreditations: doc.accreditations,
    capabilities: doc.capabilities,
    certTable: doc.certTable,
    securityFeatures: doc.securityFeatures,
    screenshots: doc.screenshots,
    features: doc.features,
    projectsCompleted: doc.projectsCompleted,
    credentialHeadline: doc.credentialHeadline,
    insurance: doc.insurance,
    processSteps: doc.processSteps,
  };
}

// ─── Cached DB fetchers ────────────────────────────────────────────────────

// Card-level fields used by the category page grids. Heavy detail-only fields
// (fullDescription, faqs, caseStudies, bio, …) are excluded so large categories
// stay under the Next.js data cache 2MB-per-entry limit.
const CATEGORY_CARD_FIELDS =
  "slug name tier category secondaryCategory location shortDescription " +
  "logoPlaceholder logoColor logoUrl bannerImageUrl serviceTags " +
  "accreditation accreditations availability certifications credentialHeadline credentials " +
  "delivery dispatchHours facilitySize foundedYear hours leadTime " +
  "licenseNumber licenseStatus licenseType minOrderQty panelCount pricingModel " +
  "projectsCompleted rating reviewCount serviceArea specialtyAreas statesServed " +
  "teamSize transportType turnaroundTime vehicleCount yearsInCannabis";

async function queryCompaniesByCategory(categorySlug: string): Promise<CompanyType[]> {
  await connectDB();
  const docs = await Company.find({
    $or: [{ category: categorySlug }, { secondaryCategory: categorySlug }],
  })
    .select(CATEGORY_CARD_FIELDS)
    .lean();

  return docs
    .map(docToCompany)
    .sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
}

const fetchCompaniesByCategory = unstable_cache(
  queryCompaniesByCategory,
  ["companies-by-category"],
  { revalidate: 1800, tags: ["companies"] }
);

const fetchFeaturedCompanies = unstable_cache(
  async (): Promise<CompanyType[]> => {
    await connectDB();
    const docs = await Company.find({ tier: "select" })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("-__v")
      .lean();
    return docs.map(docToCompany);
  },
  ["featured-companies"],
  { revalidate: 3600, tags: ["companies"] }
);

const fetchCompanyBySlug = unstable_cache(
  async (slug: string): Promise<CompanyType | undefined> => {
    await connectDB();
    const doc = await Company.findOne({ slug }).select("-__v").lean();
    return doc ? docToCompany(doc) : undefined;
  },
  ["company-by-slug"],
  { revalidate: 1800, tags: ["companies"] }
);

// ─── Public API ────────────────────────────────────────────────────────────

export async function getCompaniesByCategory(categorySlug: string): Promise<CompanyType[]> {
  try {
    return await fetchCompaniesByCategory(categorySlug);
  } catch (err) {
    // The cached path can fail even when the DB is fine (e.g. result exceeds
    // the data cache's 2MB-per-entry limit) — fall back to a direct query.
    console.error(`[getCompaniesByCategory] Cached fetch failed for "${categorySlug}", querying directly:`, err);
    try {
      return await queryCompaniesByCategory(categorySlug);
    } catch (dbErr) {
      console.error(`[getCompaniesByCategory] Direct query failed for "${categorySlug}":`, dbErr);
      return [];
    }
  }
}

export async function getFeaturedCompanies(): Promise<CompanyType[]> {
  try {
    return await fetchFeaturedCompanies();
  } catch (err) {
    console.error("[getFeaturedCompanies] Failed:", err);
    return [];
  }
}

export async function getCompanyBySlug(slug: string): Promise<CompanyType | undefined> {
  try {
    return await fetchCompanyBySlug(slug);
  } catch (err) {
    console.error(`[getCompanyBySlug] Failed for "${slug}":`, err);
    return undefined;
  }
}

// Fields needed for listing cards + sidebar filters — excludes heavy detail-only fields
const LISTING_FIELDS =
  "slug name tier category secondaryCategory location shortDescription " +
  "logoPlaceholder logoColor logoUrl bannerImageUrl " +
  "serviceTags statesServed serviceArea minOrderQty certifications yearsInCannabis leadTime " +
  "rating reviewCount";

async function queryAllCompanies(): Promise<CompanyType[]> {
  await connectDB();
  const docs = await Company.find({}).select(LISTING_FIELDS).lean();
  return docs
    .map(docToCompany)
    .sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
}

const fetchAllCompanies = unstable_cache(
  queryAllCompanies,
  ["all-companies"],
  { revalidate: 300, tags: ["companies"] }
);

export async function getAllCompanies(): Promise<CompanyType[]> {
  try {
    return await fetchAllCompanies();
  } catch (err) {
    console.error("[getAllCompanies] Cached fetch failed, querying directly:", err);
    try {
      return await queryAllCompanies();
    } catch (dbErr) {
      console.error("[getAllCompanies] Direct query failed:", dbErr);
      return [];
    }
  }
}

export async function getAllCompaniesFresh(): Promise<CompanyType[]> {
  try {
    await connectDB();
    const docs = await Company.find({}).select("-__v").lean();
    return docs
      .map(docToCompany)
      .sort((a, b) => (TIER_ORDER[a.tier] ?? 9) - (TIER_ORDER[b.tier] ?? 9));
  } catch (err) {
    console.error("[getAllCompaniesFresh] Failed:", err);
    return [];
  }
}

/** Direct DB query — no cache. Use where stale data is unacceptable (e.g. vendor listing page). */
export async function getCompanyBySlugFresh(slug: string): Promise<CompanyType | undefined> {
  try {
    await connectDB();
    const doc = await Company.findOne({ slug }).select("-__v").lean();
    return doc ? docToCompany(doc) : undefined;
  } catch (err) {
    console.error(`[getCompanyBySlugFresh] Failed for "${slug}":`, err);
    return undefined;
  }
}
