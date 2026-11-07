/** Public base URL of the site, used in emails, Stripe redirects and metadata. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://nextcannaconnect.com"
).replace(/\/+$/, "");
