import type { Company } from "@/types";

function youtubeId(url?: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m?.[1] ?? null;
}

/**
 * Verified Pro extras shown under every category profile: an embedded YouTube
 * video and the company's social links (both editable in the dashboard).
 */
export default function VendorMediaSection({ company }: { company: Company }) {
  if (company.tier !== "elite") return null;
  const videoId = youtubeId(company.youtubeUrl);
  const socials = [
    company.linkedinUrl ? { label: "LinkedIn", href: company.linkedinUrl } : null,
    company.instagramUrl ? { label: "Instagram", href: company.instagramUrl } : null,
    company.youtubeUrl ? { label: "YouTube", href: company.youtubeUrl } : null,
  ].filter((x): x is { label: string; href: string } => !!x && /^https?:\/\//i.test(x.href));
  if (!videoId && socials.length === 0) return null;

  return (
    <section style={{ background: "#fbf9f8", padding: "48px 0 64px" }} aria-label={`${company.name} video and social links`}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 20px" }}>
        {videoId && (
          <>
            <h2 style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: "26px", fontWeight: 400, color: "#003320", margin: "0 0 20px" }}>
              Watch {company.name}
            </h2>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "12px", overflow: "hidden", border: "1px solid #E5E7EB", background: "#000" }}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={`${company.name} video`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </>
        )}
        {socials.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: videoId ? "24px" : 0, alignItems: "center" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#414943", marginRight: "4px" }}>Follow {company.name}:</span>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "13px", fontWeight: 600, color: "#003320", border: "1px solid rgba(0,51,32,0.2)", borderRadius: "999px", padding: "6px 14px", textDecoration: "none", background: "white" }}
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
