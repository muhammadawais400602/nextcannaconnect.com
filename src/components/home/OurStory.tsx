"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";

export default function OurStory() {
  const [ref, inView] = useInView();

  return (
    <section
      className="relative py-14 md:py-24 px-4 md:px-8 overflow-hidden"
      style={{ backgroundColor: "#fbf9f8" }}
    >
      {/* Decorative background icon */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{ width: "33%", height: "100%", opacity: 0.025, overflow: "hidden" }}
      >
        <span
          className="material-symbols-outlined absolute"
          style={{ fontSize: "600px", lineHeight: 1, right: "-96px", top: 0 }}
        >
          all_inclusive
        </span>
      </div>

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24 relative z-10"
        style={{ maxWidth: "1440px", margin: "0 auto" }}
      >
        {/* Left: Text */}
        <div
          className="w-full lg:w-1/2"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(-32px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <span className="section-label" style={{ marginBottom: "12px" }}>
            Established Excellence
          </span>
          <h2
            style={{
              fontFamily: "'Noto Serif', serif",
              fontSize: "clamp(32px, 3.5vw, 48px)",
              fontWeight: 700,
              color: "#003320",
              lineHeight: 1.15,
              marginBottom: "32px",
            }}
          >
            The Mission Behind{" "}
            <br />
            <span style={{ fontStyle: "italic", color: "#88b99e" }}>NextCanna Connect</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
            <p style={{ fontSize: "16px", color: "#414943", lineHeight: 1.75 }}>
              To eliminate fragmentation in the cannabis industry and enable a more connected,
              transparent, and efficient marketplace for all participants.
            </p>
          </div>

          <Link
            href="/about"
            className="group flex items-center gap-3"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#003320",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Learn more about our mission
            <span className="material-symbols-outlined" style={{ fontSize: "18px", transition: "transform 0.2s" }}>
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Right: Image */}
        <div
          className="w-full lg:w-1/2 relative"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
          }}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{ boxShadow: "0 24px 80px rgba(0,51,32,0.15)" }}
          >
            <div
              style={{
                height: "clamp(300px, 50vw, 520px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src="/mission.jpg"
                alt="Cannabis cultivation professional"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,51,32,0.4) 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Floating quote card */}
          <div
            className="absolute hidden xl:block"
            style={{
              top: "50%",
              right: "-48px",
              transform: "translateY(-50%)",
              zIndex: 20,
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 8px 32px rgba(0,51,32,0.12)",
              border: "1px solid rgba(255,255,255,0.6)",
              maxWidth: "220px",
            }}
          >
            <p
              style={{
                fontFamily: "'Noto Serif', serif",
                fontSize: "12px",
                fontStyle: "italic",
                color: "#003320",
                lineHeight: 1.7,
              }}
            >
              &ldquo;The first platform that mirrors the professionalism of traditional finance in the cannabis space.&rdquo;
            </p>
            <p
              style={{
                marginTop: "12px",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(65,73,67,0.55)",
              }}
            >
              — Executive Member
            </p>
          </div>

          {/* Decorative blurs */}
          <div
            style={{
              position: "absolute",
              bottom: "-40px",
              left: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              backgroundColor: "rgba(26,74,53,0.12)",
              filter: "blur(60px)",
              zIndex: 0,
            }}
          />
        </div>
      </div>
    </section>
  );
}
