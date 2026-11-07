import type { Company } from "@/types";
import { SITE_URL } from "@/lib/siteUrl";

/** schema.org Organization data so search engines can show business details. */
export default function VendorJsonLd({ company }: { company: Company }) {
  const url = `${SITE_URL}/vendor/${company.slug}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": url,
    name: company.name,
    url: company.website || url,
    description: company.shortDescription,
    ...(company.logoUrl ? { logo: company.logoUrl } : {}),
    ...(company.phone ? { telephone: company.phone } : {}),
    ...(company.foundedYear ? { foundingDate: String(company.foundedYear) } : {}),
    ...(company.location?.city || company.location?.state
      ? {
          address: {
            "@type": "PostalAddress",
            ...(company.location.address ? { streetAddress: company.location.address } : {}),
            ...(company.location.city ? { addressLocality: company.location.city } : {}),
            ...(company.location.state ? { addressRegion: company.location.state } : {}),
            ...(company.location.zip ? { postalCode: company.location.zip } : {}),
          },
        }
      : {}),
  };
  const sameAs = [company.linkedinUrl, company.instagramUrl, company.youtubeUrl].filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;

  return (
    <script
      type="application/ld+json"
      // Escape "<" so company text can't close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
