"use client";

import { useState } from "react";
import { Suspense } from "react";
import { Category } from "@/types";
import { Company } from "@/types";
import FiltersPanel from "@/components/directory/FiltersPanel";
import DirectoryListings from "@/components/directory/DirectoryListings";

interface Props {
  category: Category;
  companies: Company[];
}

export default function DirectoryContent({ category, companies }: Props) {
  const [verificationFilters, setVerificationFilters] = useState<string[]>([]);
  const [serviceFilters, setServiceFilters] = useState<string[]>([]);

  return (
    <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
      {/* Sidebar */}
      <div className="hidden lg:block" style={{ width: "220px", flexShrink: 0 }}>
        <FiltersPanel
          category={category}
          verificationFilters={verificationFilters}
          onVerificationChange={setVerificationFilters}
          serviceFilters={serviceFilters}
          onServiceChange={setServiceFilters}
        />
      </div>

      {/* Listings */}
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
            categoryShortLabel={category.shortLabel}
            verificationFilters={verificationFilters}
            serviceFilters={serviceFilters}
          />
        </Suspense>
      </div>
    </div>
  );
}
