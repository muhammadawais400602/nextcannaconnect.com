import type { Company } from "@/types";
import { SITE_URL } from "@/lib/siteUrl";

/** schema.org Organization data so search engines can show business details. */
export default function VendorJsonLd({ company }: { company: Company }) {
  const url = `${SITE_URL}/vendor/${company.slug}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    // LocalBusiness (address, phone, area served) helps local search; national /
    // online businesses without an address stay Organization.
    "@type": company.location?.city || company.location?.address ? "LocalBusiness" : "Organization",
    "@id": url,
    name: company.name,
    url,
    ...(company.website ? { sameAs: [company.website] } : {}),
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
  const served = (company.statesServed ?? []).filter(Boolean);
  if (served.length) data.areaServed = served.map((s) => ({ "@type": "AdministrativeArea", name: s }));
  else if (company.location?.state) data.areaServed = { "@type": "AdministrativeArea", name: company.location.state };
  const sameAs = [company.linkedinUrl, company.instagramUrl, company.youtubeUrl].filter(Boolean);
  if (sameAs.length) data.sameAs = [...((data.sameAs as string[]) ?? []), ...sameAs];

  return (
    <script
      type="application/ld+json"
      // Escape "<" so company text can't close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
