import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-noto-serif",
});

// Self-hosted, subsetted Material Symbols (only the icons used on the site).
// Regenerate with `scripts/update-icon-font.sh` after adding new icon names.
const materialSymbols = localFont({
  src: "./fonts/material-symbols-outlined.woff2",
  variable: "--font-material-symbols",
  weight: "300 400",
  display: "block",
  preload: false,
  adjustFontFallback: false,
  fallback: [],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "NextCanna Connect — The Verified Marketplace for the Cannabis Industry",
  description:
    "Find and connect with verified cannabis manufacturers, consultants, suppliers, and service providers across 12 industry categories.",
  keywords: "cannabis marketplace, cannabis directory, cannabis manufacturers, cannabis consultants, cannabis suppliers",
  verification: {
    google: "O_FEgDygtJCPaz2oReiIc1Qq9SMZNnivXVwhBzh2nm8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable} ${materialSymbols.variable}`}>
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
