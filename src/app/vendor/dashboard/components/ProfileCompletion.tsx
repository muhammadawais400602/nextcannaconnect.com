"use client";

import type { CompanyData } from "./shared";

interface IncompleteField {
  label: string;
  tab: string;
}

export function getProfileCompletion(company: CompanyData | null): {
  percent: number;
  incomplete: IncompleteField[];
} {
  if (!company) return { percent: 0, incomplete: [] };

  const fields: { key: string; label: string; tab: string }[] = [
    { key: "category", label: "Business Category", tab: "profile" },
    { key: "shortDescription", label: "Tagline", tab: "profile" },
    { key: "fullDescription", label: "About Your Business", tab: "profile" },
    { key: "phone", label: "Public Phone", tab: "profile" },
    { key: "website", label: "Website URL", tab: "profile" },
    { key: "location.state", label: "State / Province", tab: "profile" },
    { key: "bannerImageUrl", label: "Hero Banner Image", tab: "media" },
    { key: "logoUrl", label: "Logo", tab: "media" },
  ];

  const incomplete: IncompleteField[] = [];

  for (const f of fields) {
    let val: unknown;
    if (f.key.includes(".")) {
      const [a, b] = f.key.split(".");
      val = (company[a] as Record<string, unknown>)?.[b];
    } else {
      val = company[f.key];
    }
    if (!val || (typeof val === "string" && !val.trim())) {
      incomplete.push({ label: f.label, tab: f.tab });
    }
  }

  const filled = fields.length - incomplete.length;
  const percent = Math.round((filled / fields.length) * 100);

  return { percent, incomplete };
}

export default function ProfileCompletionBar({
  percent,
}: {
  percent: number;
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#1A4A35",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Profile Completion
        </span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: percent === 100 ? "#16A34A" : "#1A4A35",
          }}
        >
          {percent}%
        </span>
      </div>
      <div
        style={{
          height: "8px",
          borderRadius: "4px",
          background: "#E5E7EB",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${percent}%`,
            borderRadius: "4px",
            background:
              percent === 100
                ? "linear-gradient(90deg, #16A34A, #22C55E)"
                : "linear-gradient(90deg, #1A4A35, #2d6e52)",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}
