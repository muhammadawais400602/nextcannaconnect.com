import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob storage (vendor-uploaded images)
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Common external image hosts vendors may paste as URLs
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
