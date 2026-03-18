import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative w-full flex items-center"
      style={{
        minHeight: "580px",
        background: `linear-gradient(135deg, rgba(26,74,53,0.92) 0%, rgba(26,74,53,0.6) 60%, transparent 100%), url('https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1400&q=80') center/cover no-repeat`,
      }}
    >
      <div
        className="mx-auto px-8 py-20 w-full"
        style={{ maxWidth: "1100px" }}
      >
        <div style={{ maxWidth: "580px" }}>
          <h1
            className="font-extrabold text-white mb-4 leading-tight"
            style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800 }}
          >
            The Verified Marketplace for the Cannabis Industry
          </h1>
          <p
            className="mb-8"
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "18px",
              maxWidth: "480px",
              lineHeight: 1.6,
            }}
          >
            Connect with trusted manufacturers, consultants, and service providers across 12 cannabis industry categories.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/directory" className="btn-primary" style={{ fontSize: "15px", padding: "12px 28px" }}>
              Browse Directory
            </Link>
            <Link href="/signup" className="btn-secondary" style={{ fontSize: "15px", padding: "12px 28px" }}>
              List Your Business
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
