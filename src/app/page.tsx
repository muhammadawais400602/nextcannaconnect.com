import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import SectionDivider from "@/components/ui/SectionDivider";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import SponsoredBanner from "@/components/home/SponsoredBanner";
import TierPreviewStrip from "@/components/home/TierPreviewStrip";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <SectionDivider />
      <CategoryGrid />
      <SectionDivider reverse />
      <FeaturedVendors />
      <SectionDivider />
      <SponsoredBanner />
      <SectionDivider reverse />
      <TierPreviewStrip />
      <SectionDivider />
    </>
  );
}
