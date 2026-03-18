import Link from "next/link";
import { getFeaturedCompanies } from "@/data/companies";
import { MapPin, ArrowRight } from "lucide-react";
import TierBadge from "@/components/ui/TierBadge";

const TIER_BORDER_COLORS: Record<string, string> = {
  elite: "#1A4A35",
  select: "#5CB85C",
  claimed: "#F9C31A",
  featured: "#F7941D",
  free: "#E8EDE8",
};

export default function FeaturedVendors() {
  const companies = getFeaturedCompanies();

  return (
    <section className="py-16 px-8" style={{ backgroundColor: "white" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="text-center mb-10">
          <p
            className="font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#F7941D", fontSize: "11px", letterSpacing: "2px" }}
          >
            Featured Vendors
          </p>
          <h2
            className="font-bold"
            style={{ fontSize: "28px", color: "#1A4A35", fontWeight: 700 }}
          >
            Top Verified Businesses
          </h2>
        </div>

        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {companies.map((company) => {
            const borderColor = TIER_BORDER_COLORS[company.tier] || "#E8EDE8";
            return (
              <div
                key={company.id}
                className="card-hover rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E8EDE8",
                  borderTop: `4px solid ${borderColor}`,
                }}
              >
                <div className="p-6">
                  {/* Logo + name row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0"
                        style={{
                          width: "48px",
                          height: "48px",
                          backgroundColor: company.logoColor,
                          fontSize: "14px",
                        }}
                      >
                        {company.logoPlaceholder}
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ fontSize: "15px", color: "#1A2E1A", fontWeight: 700 }}>
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5" style={{ color: "#4A5E4A", fontSize: "12px" }}>
                          <MapPin size={11} />
                          {company.location.city}, {company.location.state}
                        </div>
                      </div>
                    </div>
                    <TierBadge tier={company.tier} />
                  </div>

                  <p style={{ color: "#4A5E4A", fontSize: "13px", lineHeight: 1.5, marginBottom: "12px" }}>
                    {company.shortDescription.slice(0, 100)}...
                  </p>

                  {/* Service tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {company.serviceTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#F7F9F7", color: "#4A5E4A", fontSize: "11px", border: "1px solid #E8EDE8" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/vendor/${company.slug}`}
                    className="group inline-flex items-center gap-1 font-semibold"
                    style={{ color: "#F7941D", fontSize: "13px" }}
                  >
                    View Company Page
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link href="/directory" className="btn-primary" style={{ fontSize: "14px" }}>
            Browse Full Directory →
          </Link>
        </div>
      </div>
    </section>
  );
}
