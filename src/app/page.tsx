import HeroSection from "@/components/home/HeroSection";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import CategoryGrid from "@/components/home/CategoryGrid";
import OurCategories from "@/components/home/OurCategories";
import OurStory from "@/components/home/OurStory";
import OurServices from "@/components/home/OurServices";
import StatsBar from "@/components/home/StatsBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedVendors />
      <CategoryGrid />
      <OurCategories />
      <OurStory />
      <OurServices />
      <StatsBar />
    </>
  );
}
