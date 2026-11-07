import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Your Password | NextCanna Connect",
  description: "Activate your NextCanna Connect account.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
