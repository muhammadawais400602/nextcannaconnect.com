"use client";

import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

interface CategoryNavBarProps {
  activeSlug?: string;
}

export default function CategoryNavBar({ activeSlug }: CategoryNavBarProps) {
  return (
    <div
      className="w-full overflow-x-auto category-nav-scroll"
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <div
        className="mx-auto flex items-center gap-0 px-6"
        style={{ maxWidth: "1180px", minWidth: "max-content" }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat.slug === activeSlug;
          return (
            <Link
              key={cat.slug}
              href={`/directory/${cat.slug}`}
              className="relative flex items-center px-4 py-4 whitespace-nowrap transition-colors"
              style={{
                fontSize: "13px",
                color: isActive ? "#1A4A35" : "#6B7280",
                fontWeight: isActive ? 700 : 500,
                textDecoration: "none",
              }}
            >
              {cat.shortLabel}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: "2.5px",
                    backgroundColor: "#1A4A35",
                    borderRadius: "2px 2px 0 0",
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
