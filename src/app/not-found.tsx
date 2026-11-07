import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | NextCanna Connect",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 16px 80px", background: "#fbf9f8", textAlign: "center" }}>
      <div style={{ maxWidth: "520px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#88b99e", marginBottom: "12px" }}>
          404 — Page not found
        </p>
        <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, color: "#003320", marginBottom: "16px" }}>
          We couldn&apos;t find that page
        </h1>
        <p style={{ color: "#5a6360", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px" }}>
          The listing or page may have moved or been removed. Try browsing the directory instead.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/directory" className="btn-primary">Browse the directory</Link>
          <Link href="/" className="btn-secondary">Go home</Link>
        </div>
      </div>
    </section>
  );
}
