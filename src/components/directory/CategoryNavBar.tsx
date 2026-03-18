"use client";

import Link from "next/link";
import { CATEGORIES } from "@/data/categories";

interface CategoryNavBarProps {
  activeSlug?: string;
}

export default function CategoryNavBar({ activeSlug }: CategoryNavBarProps) {
  return (
    <div
      className="w-full border-b overflow-x-auto category-nav-scroll"
      style={{ backgroundColor: "white", borderColor: "#E8EDE8" }}
    >
      <div
        className="mx-auto flex items-center gap-1 px-8"
        style={{ maxWidth: "1100px", minWidth: "max-content" }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat.slug === activeSlug;
          return (
            <Link
              key={cat.slug}
              href={`/directory/${cat.slug}`}
              className="relative flex items-center px-3 py-4 font-medium whitespace-nowrap transition-colors"
              style={{
                fontSize: "13px",
                color: isActive ? "#F7941D" : "#4A5E4A",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {cat.shortLabel}
              {isActive && (
                <span
                  className="absolute bottom-0 left-0 right-0"
                  style={{ height: "3px", backgroundColor: "#F7941D", borderRadius: "2px 2px 0 0" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
