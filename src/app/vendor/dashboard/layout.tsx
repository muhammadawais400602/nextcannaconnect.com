import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Dashboard | NextCanna Connect",
  description: "Manage your NextCanna Connect listing.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
