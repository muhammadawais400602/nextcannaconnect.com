import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RFP Board — Cannabis Industry Requests for Proposals | NextCanna Connect",
  description: "Browse open requests for proposals from cannabis operators and respond as a verified vendor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
