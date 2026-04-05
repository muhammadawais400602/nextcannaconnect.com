import HeroSection from "@/components/home/HeroSection";
import FeaturedVendors from "@/components/home/FeaturedVendors";
import OurCategories from "@/components/home/OurCategories";
import OurStory from "@/components/home/OurStory";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedVendors />
      <OurCategories />
      <OurStory />
    </>
  );
}
