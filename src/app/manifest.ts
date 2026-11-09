import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NextCanna Connect",
    short_name: "NextCanna",
    description: "The B2B marketplace for the cannabis industry.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f8",
    theme_color: "#003320",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
