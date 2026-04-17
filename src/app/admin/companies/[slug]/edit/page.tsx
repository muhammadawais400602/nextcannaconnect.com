import { notFound } from "next/navigation";
import Link from "next/link";
import CompanyForm from "../../_CompanyForm";
import { connectDB } from "@/lib/mongodb";
import Company from "@/lib/models/Company";

export default async function EditCompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  await connectDB();
  const doc = await Company.findOne({ slug }).lean();
  if (!doc) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const company: Record<string, any> = {
    ...doc,
    id: String((doc as any)._id),
  };

  return (
    <div>
      <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
        <Link
          href="/admin/companies"
          style={{ fontSize: "14px", color: "#6B7280", textDecoration: "none", fontFamily: "sans-serif" }}
        >
          ← Companies
        </Link>
        <span style={{ color: "#D1D5DB" }}>/</span>
        <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#0D2818", margin: 0, fontFamily: "sans-serif" }}>
          Edit: {company.name}
        </h1>
        <Link
          href={`/vendor/${slug}`}
          target="_blank"
          style={{
            marginLeft: "auto", fontSize: "13px", color: "#2563EB",
            textDecoration: "none", fontFamily: "sans-serif",
            background: "#EFF6FF", padding: "5px 12px", borderRadius: "6px",
          }}
        >
          ↗ View Live
        </Link>
      </div>
      <CompanyForm mode="edit" initial={company} />
    </div>
  );
}
