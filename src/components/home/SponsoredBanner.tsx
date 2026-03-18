import Link from "next/link";

interface SponsoredBannerProps {
  companyName?: string;
  tagline?: string;
  logoInitials?: string;
  destinationUrl?: string;
  ctaText?: string;
}

export default function SponsoredBanner({
  companyName = "Apex Cannabis Equipment",
  tagline = "The industry's most trusted trimming and packaging equipment. Built for scale.",
  logoInitials = "AX",
  destinationUrl = "/vendor/apex-cannabis-equipment",
  ctaText = "Learn More →",
}: SponsoredBannerProps) {
  return (
    <div
      className="w-full py-8 px-8"
      style={{
        background: "linear-gradient(135deg, #1A4A35 0%, #1C2B3A 100%)",
      }}
    >
      <div
        className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{ maxWidth: "1100px" }}
      >
        <div className="flex items-center gap-5">
          {/* Logo */}
          <div
            className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
            style={{ width: "56px", height: "56px", backgroundColor: "rgba(255,255,255,0.15)", fontSize: "16px" }}
          >
            {logoInitials}
          </div>
          <div>
            <span
              className="font-semibold uppercase"
              style={{ color: "#F7941D", fontSize: "10px", letterSpacing: "2px" }}
            >
              SPONSORED LISTING
            </span>
            <h3 className="font-bold text-white" style={{ fontSize: "18px", fontWeight: 700 }}>
              {companyName}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", marginTop: "2px" }}>
              {tagline}
            </p>
          </div>
        </div>

        <Link
          href={destinationUrl}
          className="btn-primary flex-shrink-0"
          style={{ whiteSpace: "nowrap" }}
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
}
