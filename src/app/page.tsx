import HeroSection from "@/components/home/HeroSection";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import OurCategories from "@/components/home/OurCategories";
import OurStory from "@/components/home/OurStory";
import OurServices from "@/components/home/OurServices";
import StatsBar from "@/components/home/StatsBar";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedVendors />
      <OurCategories />
      <OurStory />
      <OurServices />
      <StatsBar />
    </>
  );
}
