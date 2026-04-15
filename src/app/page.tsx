import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import OurCategories from "@/components/home/OurCategories";
import OurStory from "@/components/home/OurStory";
import { getFeaturedCompanies } from "@/lib/getCompaniesFromDB";

export const metadata: Metadata = {
  title: "NextCanna Connect — Where Cannabis Operators Connect",
  description:
    "The leading B2B cannabis marketplace connecting licensed operators, cultivators, manufacturers, retailers, and service providers across the US and Canada. Find verified partners in your state.",
  keywords: [
    "cannabis B2B marketplace",
    "cannabis suppliers",
    "cannabis wholesale",
    "dispensary directory",
    "cannabis operators",
    "licensed cannabis businesses",
    "cannabis vendor directory",
    "cannabis cultivation",
    "cannabis compliance",
    "cannabis technology",
  ],
  openGraph: {
    title: "NextCanna Connect — Where Cannabis Operators Connect",
    description:
      "The leading B2B cannabis marketplace. Find verified cultivators, manufacturers, retailers and service providers across North America.",
    type: "website",
    siteName: "NextCanna Connect",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextCanna Connect — Where Cannabis Operators Connect",
    description:
      "The leading B2B cannabis marketplace. Find verified partners across the US and Canada.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600; // revalidate featured listings every hour

export default async function HomePage() {
  const featuredCompanies = await getFeaturedCompanies();

  return (
    <>
      <HeroSection />
      <FeaturedVendors companies={featuredCompanies} />
      <OurCategories />
      <OurStory />
    </>
  );
}
