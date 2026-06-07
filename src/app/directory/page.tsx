import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllCompaniesFresh } from "@/lib/getCompaniesFromDB";
import DirectoryHero from "@/components/directory/DirectoryHero";
import DirectoryContent from "@/components/directory/DirectoryContent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "B2B Marketplace Directory | NextCanna Connect",
  description: "Browse verified cultivators, extractors, and logistics partners across North America.",
};

export default async function DirectoryPage() {
  const companies = await getAllCompaniesFresh();
  return (
    <>
      <DirectoryHero />
      <div style={{ backgroundColor: "#f6f3f2", minHeight: "60vh" }}>
        <div className="mx-auto px-4 md:px-8 py-10" style={{ maxWidth: "1440px" }}>
          <Suspense fallback={null}>
            <DirectoryContent companies={companies} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
