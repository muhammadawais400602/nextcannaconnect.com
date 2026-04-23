import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome to NextCanna Connect",
  description: "Your subscription is confirmed. Your listing will be live within 1–2 business days.",
};

export default function SignupSuccessPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F7F9F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#1A4A35",
          borderRadius: "20px",
          padding: "56px 48px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          color: "white",
        }}
      >
        {/* Checkmark */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 24px",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontFamily: "'Noto Serif', serif",
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "12px",
            lineHeight: 1.2,
          }}
        >
          You&apos;re in!
        </h1>

        <p
          style={{
            opacity: 0.85,
            fontSize: "15px",
            lineHeight: 1.65,
            marginBottom: "32px",
          }}
        >
          Your payment was confirmed and your application is under review.
          We&apos;ll have your listing live within{" "}
          <strong style={{ color: "white" }}>1–2 business days</strong>.
          Check your inbox for a confirmation email.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/directory"
            style={{
              display: "block",
              backgroundColor: "white",
              color: "#1A4A35",
              textDecoration: "none",
              padding: "13px 24px",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.04em",
            }}
          >
            Browse the Directory →
          </Link>
          <Link
            href="/"
            style={{
              display: "block",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              padding: "10px 24px",
              fontSize: "14px",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
