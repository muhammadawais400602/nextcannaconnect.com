import { ImageResponse } from "next/og";
import { getCategoryBySlug } from "@/data/categories";

export const alt = "NextCanna Connect category directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share image per category (e.g. "Testing & Science") instead of the site-wide default.
export default async function CategoryOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const label = category?.label ?? "Cannabis Industry Directory";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #003320 0%, #1a4a35 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#88b99e", textTransform: "uppercase", marginBottom: 24 }}>
          NextCanna Connect Directory
        </div>
        <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.1 }}>{label}</div>
        {category?.description && (
          <div style={{ fontSize: 30, marginTop: 28, color: "#d8e6dd", maxWidth: 1000 }}>{category.description.slice(0, 140)}</div>
        )}
      </div>
    ),
    size,
  );
}
