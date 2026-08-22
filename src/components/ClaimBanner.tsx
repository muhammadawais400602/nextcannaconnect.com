import Link from "next/link";

export default function ClaimBanner({ slug }: { slug: string }) {
  return (
    <div style={{
      position: "sticky",
      top: "70px",
      zIndex: 45,
      background: "linear-gradient(90deg, #F7941D 0%, #e68317 100%)",
      color: "white",
      textAlign: "center",
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: 600,
      fontFamily: "'Inter', sans-serif",
    }}>
      Is this your business?{" "}
      <Link
        href={`/signup?claim=${slug}`}
        style={{ color: "white", textDecoration: "underline", fontWeight: 700 }}
      >
        Claim this listing →
      </Link>
    </div>
  );
}
