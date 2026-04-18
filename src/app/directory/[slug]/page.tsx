import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

// All category-specific URLs redirect to the unified directory page.
// Category filtering is handled client-side in the sidebar.
export default async function CategoryPage({ params }: Props) {
  await params; // consume params to avoid Next.js warning
  redirect("/directory");
}
