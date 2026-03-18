import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

const PERKS = [
  "Free standard directory listing — forever",
  "Claim your profile and unlock contact features",
  "Upgrade anytime to boost visibility",
];

export default function FreeListingCTA() {
  return (
    <section
      className="w-full relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1A4A35 0%, #1C2B3A 100%)" }}
    >
      {/* Subtle background circles */}
      <div
        className="absolute rounded-full opacity-5"
        style={{
          width: "600px",
          height: "600px",
          backgroundColor: "white",
          top: "-200px",
          right: "-200px",
        }}
      />
      <div
        className="absolute rounded-full opacity-5"
        style={{
          width: "400px",
          height: "400px",
          backgroundColor: "white",
          bottom: "-150px",
          left: "-100px",
        }}
      />

      <div
        className="relative mx-auto px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-10"
        style={{ maxWidth: "1180px" }}
      >
        {/* Left */}
        <div style={{ maxWidth: "560px" }}>
          <span
            className="inline-block px-3 py-1 rounded-full font-bold mb-4"
            style={{
              backgroundColor: "rgba(247,148,29,0.2)",
              color: "#F7941D",
              fontSize: "11px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            100% Free to Start
          </span>
          <h2
            className="font-extrabold text-white mb-3"
            style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.5px" }}
          >
            Is your cannabis business listed?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", lineHeight: 1.65, marginBottom: "24px" }}>
            Join 50,000+ cannabis businesses on the industry&apos;s most trusted B2B
            directory. Getting listed is completely free — no credit card needed.
          </p>

          <ul className="flex flex-col gap-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-3">
                <CheckCircle size={17} style={{ color: "#5CB85C", flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px" }}>{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3 flex-shrink-0">
          <Link
            href="/signup"
            className="btn-primary"
            style={{ fontSize: "15px", padding: "14px 32px" }}
          >
            Claim Your Free Listing
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/membership"
            className="btn-white"
            style={{ fontSize: "14px", padding: "12px 28px" }}
          >
            Compare Membership Plans
          </Link>
          <p
            className="text-center"
            style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}
          >
            Free forever. Upgrade anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
