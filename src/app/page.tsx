import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import OurCategories from "@/components/home/OurCategories";
import OurStory from "@/components/home/OurStory";
import { getFeaturedCompanies } from "@/lib/getCompaniesFromDB";

export const metadata: Metadata = {
  title: "NextCanna Connect — Where Cannabis Operators Connect",
  description:
    "The B2B cannabis marketplace connecting licensed operators with cultivators, manufacturers, retailers and service providers. Find partners in your state — or businesses that serve every state.",
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
      "The B2B cannabis marketplace. Find cultivators, manufacturers, retailers and service providers for your cannabis business.",
    type: "website",
    siteName: "NextCanna Connect",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextCanna Connect — Where Cannabis Operators Connect",
    description:
      "The B2B cannabis marketplace. Find cannabis industry partners in your state.",
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
