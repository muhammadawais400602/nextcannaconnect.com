import HeroSection from "@/components/home/HeroSection";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import OurCategories from "@/components/home/OurCategories";
import OurStory from "@/components/home/OurStory";
import StatsBar from "@/components/home/StatsBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedVendors />
      <OurCategories />
      <OurStory />
      <StatsBar />
    </>
  );
}
