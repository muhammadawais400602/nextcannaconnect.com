import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post an RFP | NextCanna Connect",
  description: "Post a request for proposals and receive responses from verified cannabis vendors.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
