import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Your Business | NextCanna Connect",
  description: "Create a free or premium listing for your cannabis business and get found by licensed cannabis operators.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
