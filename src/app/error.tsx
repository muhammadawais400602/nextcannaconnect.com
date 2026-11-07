"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "140px 16px 80px", background: "#fbf9f8", textAlign: "center" }}>
      <div style={{ maxWidth: "520px" }}>
        <h1 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 400, color: "#003320", marginBottom: "16px" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#5a6360", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px" }}>
          This page didn&apos;t load properly. Please try again — if it keeps happening, email{" "}
          <a href="mailto:help@nextcannaconnect.com" style={{ color: "#003320", fontWeight: 600 }}>help@nextcannaconnect.com</a>.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" onClick={reset} className="btn-primary">Try again</button>
          <Link href="/" className="btn-secondary">Go home</Link>
        </div>
        {error.digest && <p style={{ marginTop: "24px", fontSize: "12px", color: "#9CA3AF" }}>Error reference: {error.digest}</p>}
      </div>
    </section>
  );
}
