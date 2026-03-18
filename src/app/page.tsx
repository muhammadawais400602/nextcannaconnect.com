import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import HowItWorks from "@/components/home/HowItWorks";
import TierPreviewStrip from "@/components/home/TierPreviewStrip";
import FreeListingCTA from "@/components/home/FreeListingCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoryGrid />
      <FeaturedVendors />
      <HowItWorks />
      <TierPreviewStrip />
      <FreeListingCTA />
    </>
  );
}
