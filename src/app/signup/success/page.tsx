"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

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
        {/* Demo mode banner */}
        {isDemo && (
          <div
            style={{
              backgroundColor: "rgba(247,148,29,0.2)",
              border: "1px solid rgba(247,148,29,0.5)",
              borderRadius: "8px",
              padding: "10px 16px",
              marginBottom: "28px",
              fontSize: "12px",
              color: "#F7941D",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            DEMO MODE — No real payment was charged
          </div>
        )}

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
          {isDemo
            ? "This was a demo run — the signup flow worked end-to-end. Connect a real Stripe key to charge subscriptions."
            : <>Your payment was confirmed and your application is under review. We&apos;ll have your listing live within{" "}<strong style={{ color: "white" }}>1–2 business days</strong>. Check your inbox for a confirmation email.</>
          }
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

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#F7F9F7" }} />}>
      <SuccessContent />
    </Suspense>
  );
}
