import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | NextCanna Connect",
  description:
    "Built from the inside out. NextCanna Connect was born from firsthand experience navigating a fragmented, relationship-driven industry.",
};

const GOLD = "#C8922A";

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#fbf9f8", color: "#1b1c1c", paddingTop: "70px" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          backgroundColor: "#003320",
          height: "clamp(300px, 45vh, 480px)",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        <img
          src="https://picsum.photos/seed/city-skyline-dark/1600/500"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.22,
            mixBlendMode: "luminosity",
          }}
        />
        <div
          style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, #003320 25%, rgba(0,51,32,0.65) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "1180px", margin: "0 auto",
            padding: "0 32px 60px", width: "100%",
          }}
        >
          <p
            style={{
              fontSize: "10px", fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase",
              color: GOLD, marginBottom: "18px",
            }}
          >
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(2.25rem, 5.5vw, 3.75rem)",
              fontWeight: 700, color: "white",
              lineHeight: 1.1, margin: 0,
            }}
          >
            Built from the
            <br />
            <em style={{ fontStyle: "italic", color: GOLD }}>inside out.</em>
          </h1>
          <div style={{ width: "48px", height: "3px", backgroundColor: GOLD, marginTop: "24px" }} />
        </div>
      </section>

      {/* ── Founder's Perspective ────────────────────────────── */}
      <section style={{ padding: "80px 0", backgroundColor: "#fbf9f8" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 32px" }}>
          <div className="about-two-col">
            {/* Left */}
            <div className="about-left-col">
              <p
                style={{
                  fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: GOLD, marginBottom: "20px",
                }}
              >
                The Founder&apos;s Perspective
              </p>
              <h2
                style={{
                  fontFamily: "'Noto Serif', serif",
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  fontWeight: 700, color: "#1b1c1c",
                  lineHeight: 1.25, margin: 0,
                }}
              >
                The hardest part wasn&apos;t the{" "}
                <em style={{ fontStyle: "italic" }}>regulations.</em>
              </h2>
            </div>

            {/* Right */}
            <div className="about-right-col" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <p style={{ color: "#414943", lineHeight: 1.75 }}>
                Building the NextCanna brand has been one of the most{" "}
                <strong>rewarding and frustrating experiences</strong> I&apos;ve had. Not because
                the opportunity isn&apos;t there—it absolutely is. But because the cannabis industry
                still runs on fragmented systems, closed networks, and relationships you&apos;re
                expected to already have. It&apos;s not very transparent, and it&apos;s definitely
                not built for scale.
              </p>
              <p style={{ color: "#414943", lineHeight: 1.75 }}>
                I felt that firsthand. The hardest part wasn&apos;t just navigating
                regulations—it was figuring out <strong>who I could trust</strong>, how to move
                quickly, and how to actually build something real when so much of the information
                is scattered or guarded.
              </p>
              <p style={{ color: "#414943", lineHeight: 1.75 }}>
                To build it, I pulled together a team of people I trust: cannabis insiders who know
                how this industry really works, along with close friends and business partners from
                outside the industry who bring a{" "}
                <strong>different level of discipline and perspective</strong>. That combination has
                been everything.
              </p>

              {/* Blockquote */}
              <blockquote
                style={{
                  margin: "8px 0",
                  padding: "24px 28px",
                  backgroundColor: "#f0eded",
                  borderRadius: "6px",
                  fontStyle: "italic",
                  color: "#414943",
                  lineHeight: 1.75,
                  fontSize: "15px",
                }}
              >
                NextCanna Connect came out of that experience. It&apos;s the platform I wish I had
                when I started—a place where credible operators can actually find each other, where
                trust isn&apos;t a guessing game, and where doing business doesn&apos;t feel harder
                than it should be.
              </blockquote>

              <p style={{ color: "#414943", lineHeight: 1.75 }}>
                And a special thanks to{" "}
                <strong>Mike and the United team</strong>. You&apos;ve been great partners from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Commitment ───────────────────────────────────── */}
      <section style={{ padding: "80px 0", backgroundColor: "#f6f3f2" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "0 32px" }}>

          {/* Header row */}
          <div className="about-two-col" style={{ marginBottom: "48px" }}>
            {/* Left */}
            <div className="about-left-col">
              <p
                style={{
                  fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: GOLD, marginBottom: "20px",
                }}
              >
                Our Commitment
              </p>
              <h2
                style={{
                  fontFamily: "'Noto Serif', serif",
                  fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                  fontWeight: 700, color: "#1b1c1c",
                  lineHeight: 1.1, margin: 0,
                }}
              >
                Credible.
                <br />
                <em style={{ fontStyle: "italic" }}>Transparent.</em>
                <br />
                Useful.
              </h2>
            </div>

            {/* Right */}
            <div className="about-right-col" style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center" }}>
              <p style={{ color: "#414943", lineHeight: 1.75 }}>
                We built NextCanna Connect to solve a problem we ran into ourselves.
              </p>
              <p style={{ color: "#414943", lineHeight: 1.75 }}>
                Our commitment is simple:{" "}
                <strong>keep this platform credible, transparent, and useful.</strong> We focus on
                real operators, accurate information, and connections that actually matter.
              </p>
              <p style={{ color: "#414943", lineHeight: 1.75 }}>
                We&apos;re not trying to be the biggest directory. We&apos;re building{" "}
                <strong>the one people trust</strong> to do business.
              </p>
            </div>
          </div>

          {/* 3-card row */}
          <div className="about-three-cards">
            {[
              {
                num: "01",
                title: "Real Operators",
                desc: "Every listing on this platform represents a legitimate business. We verify so you don't have to guess.",
              },
              {
                num: "02",
                title: "Accurate Information",
                desc: "We maintain clean, up-to-date data. No noise. No stale profiles. No guesswork about who's still in business.",
              },
              {
                num: "03",
                title: "Connections That Matter",
                desc: "We're not optimizing for scale—we're optimizing for trust. Every connection should move your business forward.",
              },
            ].map((card, i) => (
              <div
                key={card.num}
                className={`about-card${i < 2 ? " about-card-border" : ""}`}
              >
                <p
                  style={{
                    fontSize: "11px", fontWeight: 700,
                    color: GOLD, marginBottom: "14px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {card.num}
                </p>
                <h3
                  style={{
                    fontFamily: "'Noto Serif', serif",
                    fontWeight: 700, fontSize: "15px",
                    color: "#1b1c1c", marginBottom: "10px",
                  }}
                >
                  {card.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.65 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Special Thanks Banner ─────────────────────────────── */}
      <section style={{ backgroundColor: "#003320", padding: "36px 32px" }}>
        <div
          style={{
            maxWidth: "1180px", margin: "0 auto",
            display: "flex", alignItems: "center", gap: "20px",
          }}
        >
          <span style={{ fontSize: "22px", flexShrink: 0, color: GOLD }}>♥</span>
          <p
            style={{
              fontStyle: "italic",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.7, fontSize: "15px", margin: 0,
            }}
          >
            A special thank you to{" "}
            <strong style={{ fontStyle: "normal", color: "white" }}>
              Mike and the United team
            </strong>{" "}
            — you&apos;ve been exceptional partners from day one. Your support has been
            instrumental in making NextCanna Connect what it is today.
          </p>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: "100px 32px", textAlign: "center", backgroundColor: "#fbf9f8" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 700, color: "#1b1c1c",
              lineHeight: 1.15, marginBottom: "14px",
            }}
          >
            Ready to do business
            <br />
            <em style={{ fontStyle: "italic" }}>the right way?</em>
          </h2>
          <p
            style={{
              color: "#6b7280", fontSize: "15px",
              lineHeight: 1.65, marginBottom: "40px",
            }}
          >
            Join a network built on trust, transparency, and real operators.
          </p>
          <Link
            href="/signup"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              backgroundColor: "#1b1c1c", color: "white",
              padding: "14px 32px", borderRadius: "6px",
              fontWeight: 600, textDecoration: "none",
              fontSize: "14px", letterSpacing: "0.02em",
            }}
          >
            List Your Business →
          </Link>
        </div>
      </section>

      <style>{`
        .about-two-col {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 64px;
          align-items: start;
        }
        .about-three-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid rgba(0,51,32,0.12);
          border-radius: 8px;
          overflow: hidden;
          background: white;
        }
        .about-card {
          padding: 32px 28px;
        }
        .about-card-border {
          border-right: 1px solid rgba(0,51,32,0.12);
        }
        @media (max-width: 768px) {
          .about-two-col {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .about-three-cards {
            grid-template-columns: 1fr;
          }
          .about-card-border {
            border-right: none;
            border-bottom: 1px solid rgba(0,51,32,0.12);
          }
        }
      `}</style>
    </div>
  );
}
