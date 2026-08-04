import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | NextCanna Connect",
  description:
    "Get in touch with the NextCanna Connect team. We're here to help cannabis businesses grow.",
};

export default function ContactPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fbf9f8", color: "#1b1c1c", paddingTop: "70px" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#003320",
          height: "clamp(260px, 38vh, 400px)",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, #003320 25%, rgba(0,51,32,0.8) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "1180px", margin: "0 auto",
            padding: "0 32px 56px", width: "100%",
          }}
        >
          <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,146,42,0.9)", marginBottom: "14px" }}>
            Get in touch
          </p>
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontStyle: "italic",
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 400,
              color: "white",
              lineHeight: 1.15,
              margin: 0,
              maxWidth: "600px",
            }}
          >
            We&apos;d love to hear from you
          </h1>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "80px 32px 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>

          {/* Left — info */}
          <div>
            <h2
              style={{
                fontFamily: "'Noto Serif', serif",
                fontStyle: "italic",
                fontSize: "28px",
                fontWeight: 400,
                color: "#003320",
                marginBottom: "20px",
              }}
            >
              Let&apos;s talk
            </h2>
            <p style={{ fontSize: "15px", lineHeight: 1.8, color: "#4b5563", marginBottom: "48px", maxWidth: "420px" }}>
              Whether you&apos;re looking to list your business, have a question about our platform, or want to explore a partnership — our team is ready to help.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(0,51,32,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "18px" }}>✉️</span>
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 4px" }}>Email</p>
                  <a href="mailto:hello@nextcannaconnect.com" style={{ fontSize: "15px", fontWeight: 500, color: "#003320", textDecoration: "none" }}>
                    hello@nextcannaconnect.com
                  </a>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(0,51,32,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "18px" }}>🌎</span>
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 4px" }}>Based in</p>
                  <p style={{ fontSize: "15px", fontWeight: 500, color: "#1b1c1c", margin: 0 }}>United States</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "rgba(0,51,32,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "18px" }}>🕐</span>
                </div>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9ca3af", margin: "0 0 4px" }}>Response time</p>
                  <p style={{ fontSize: "15px", fontWeight: 500, color: "#1b1c1c", margin: 0 }}>Within 1–2 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
