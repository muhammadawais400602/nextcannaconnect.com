import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompany extends Document {
  slug: string;
  name: string;
  tier: "free" | "select" | "elite";
  category: string;
  secondaryCategory?: string;
  location: { address?: string; city: string; state: string; zip?: string };
  shortDescription: string;
  fullDescription?: string;
  serviceTags: string[];
  logoUrl?: string;
  logoPlaceholder: string;
  logoColor: string;
  bannerImageUrl?: string;
  bannerCaption?: string;
  foundedYear?: number;
  products?: { name: string; description: string; imageUrl?: string }[];
  website?: string;
  phone?: string;
  email?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  yelpUrl?: string;
  leaflyUrl?: string;
  // Template 1 — Products & Equipment
  productLines?: string[];
  minOrderQty?: string;
  leadTime?: string;
  serviceArea?: string;
  certifications?: string[];
  // Template 2 — Services & Agencies
  statesServed?: string[];
  teamSize?: string;
  yearsInCannabis?: number;
  pricingModel?: string;
  caseStudies?: { title: string; summary: string }[];
  // Template 3 — Consultants
  specialtyAreas?: string[];
  credentials?: string[];
  yearsExperience?: number;
  hourlyRate?: string;
  availability?: string;
  bio?: string;
  rating?: number;
  reviewCount?: number;
  // Template 4 — Retail & Dispensary
  licenseNumber?: string;
  licenseType?: string;      // "Rec + Medical" | "Recreational" | "Medical Only"
  delivery?: string;         // "Yes" | "No" | "Only"
  hours?: string;            // "9AM - 10PM"
  insuranceOnFile?: boolean;
  metrcIntegrated?: boolean;
  verifiedDate?: string;     // "Oct 2025"
  locationsCount?: number;
  faqs?: { question: string; answer: string }[];
  // Template 5 — Transportation & Logistics
  vehicleCount?: number;
  transportType?: string;    // "Temp Controlled" | "Dry Goods" | "Armored"
  loadsPerMonth?: string;    // "480+"
  statesActive?: number;
  cargoInsurance?: string;   // "$5M Cargo Coverage"
  gpsTracked?: boolean;
  dispatchHours?: string;    // "24/7 Dispatch"
  licensesTable?: { type: string; authority: string; number: string; status: string }[];
  isFeatured: boolean;
  featuredExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    tier: {
      type: String,
      enum: ["free", "select", "elite"],
      default: "free",
    },
    category: { type: String, required: true, index: true },
    secondaryCategory: String,
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      zip: { type: String, default: "" },
    },
    shortDescription: { type: String, required: true },
    fullDescription: String,
    serviceTags: [String],
    logoUrl: String,
    logoPlaceholder: { type: String, required: true },
    logoColor: { type: String, default: "#1A4A35" },
    bannerImageUrl: String,
    bannerCaption: String,
    foundedYear: Number,
    products: [{ name: String, description: String, imageUrl: String }],
    website: String,
    phone: String,
    email: String,
    linkedinUrl: String,
    instagramUrl: String,
    youtubeUrl: String,
    facebookUrl: String,
    twitterUrl: String,
    yelpUrl: String,
    leaflyUrl: String,
    productLines: [String],
    minOrderQty: String,
    leadTime: String,
    serviceArea: String,
    certifications: [String],
    statesServed: [String],
    teamSize: String,
    yearsInCannabis: Number,
    pricingModel: String,
    caseStudies: [{ title: String, summary: String }],
    specialtyAreas: [String],
    credentials: [String],
    yearsExperience: Number,
    hourlyRate: String,
    availability: String,
    bio: String,
    rating: Number,
    reviewCount: Number,
    licenseNumber: String,
    licenseType: String,
    delivery: String,
    hours: String,
    insuranceOnFile: Boolean,
    metrcIntegrated: Boolean,
    verifiedDate: String,
    locationsCount: Number,
    faqs: [{ question: String, answer: String }],
    vehicleCount: Number,
    transportType: String,
    loadsPerMonth: String,
    statesActive: Number,
    cargoInsurance: String,
    gpsTracked: Boolean,
    dispatchHours: String,
    licensesTable: [{ type: { type: String }, authority: String, number: String, status: String }],
    isFeatured: { type: Boolean, default: false },
    featuredExpiresAt: Date,
  },
  { timestamps: true }
);

CompanySchema.index({ category: 1, tier: 1 });
CompanySchema.index({ name: "text", shortDescription: "text", serviceTags: "text" });

const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);

export default Company;
