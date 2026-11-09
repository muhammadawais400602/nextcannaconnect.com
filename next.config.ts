import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // /membership duplicated /pricing — keep one canonical page.
  async headers() {
    // CSP starts in report-only mode (violations are logged in the browser
    // console, nothing is blocked); switch to Content-Security-Policy once clean.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://wp.nextcannaconnect.com https://api.stripe.com",
      "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://player.vimeo.com https://js.stripe.com https://checkout.stripe.com",
      "frame-ancestors 'self'",
      "form-action 'self' https://checkout.stripe.com",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Content-Security-Policy-Report-Only", value: csp },
        ],
      },
    ];
  },
  async redirects() {
    return [{ source: "/membership", destination: "/pricing", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.wp.com",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
