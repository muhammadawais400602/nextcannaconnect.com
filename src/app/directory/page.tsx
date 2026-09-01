import type { Metadata } from "next";
import { Suspense } from "react";
import DirectoryHero from "@/components/directory/DirectoryHero";
import DirectoryLoader from "@/components/directory/DirectoryLoader";
import DirectoryLoadingSkeleton from "@/components/directory/DirectoryLoadingSkeleton";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "B2B Marketplace Directory | NextCanna Connect",
  description: "Browse verified cultivators, extractors, and logistics partners across North America.",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function DirectoryPage({ searchParams }: Props) {
  const { category } = await searchParams;
  return (
    <>
      <ScrollToTop />
      <DirectoryHero />
      <div style={{ backgroundColor: "#f6f3f2", minHeight: "60vh" }}>
        <div className="mx-auto px-4 md:px-8 py-10" style={{ maxWidth: "1440px" }}>
          <Suspense fallback={<DirectoryLoadingSkeleton />}>
            <DirectoryLoader category={category ?? null} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
