import Link from "next/link";
import CompanyForm from "../_CompanyForm";

export default function NewCompanyPage() {
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
          Add New Company
        </h1>
      </div>
      <CompanyForm mode="new" />
    </div>
  );
}
