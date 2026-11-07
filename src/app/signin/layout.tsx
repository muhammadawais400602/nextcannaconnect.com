import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | NextCanna Connect",
  description: "Sign in to manage your NextCanna Connect listing, leads and RFPs.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
