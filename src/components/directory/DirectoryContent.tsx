"use client";

import { useState } from "react";
import { Suspense } from "react";
import { Company } from "@/types";
import FiltersPanel from "@/components/directory/FiltersPanel";
import DirectoryListings from "@/components/directory/DirectoryListings";

interface Props {
  companies: Company[];
}

export default function DirectoryContent({ companies }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verificationFilters, setVerificationFilters] = useState<string[]>([]);
  const [serviceFilters, setServiceFilters] = useState<string[]>([]);

  function handleCategoryChange(slug: string | null) {
    setSelectedCategory(slug);
    setServiceFilters([]);
  }

  return (
    <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
      <div className="hidden lg:block" style={{ width: "220px", flexShrink: 0 }}>
        <FiltersPanel
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          verificationFilters={verificationFilters}
          onVerificationChange={setVerificationFilters}
          serviceFilters={serviceFilters}
          onServiceChange={setServiceFilters}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <Suspense
          fallback={
            <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}>
              Loading listings…
            </div>
          }
        >
          <DirectoryListings
            companies={companies}
            categoryFilter={selectedCategory}
            verificationFilters={verificationFilters}
            serviceFilters={serviceFilters}
          />
        </Suspense>
      </div>
    </div>
  );
}
