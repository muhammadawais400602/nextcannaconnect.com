import Link from "next/link";

export const authInputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", border: "1px solid #E8EDE8",
  borderRadius: "8px", fontSize: "16px", color: "#1A2E1A",
  backgroundColor: "white", outline: "none", boxSizing: "border-box",
};

export const authLabelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700, color: "#4A5E4A",
  textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px",
};

export const authButtonStyle = (busy: boolean): React.CSSProperties => ({
  width: "100%", padding: "13px", background: "#1A4A35", color: "white", border: "none",
  borderRadius: "8px", fontSize: "15px", fontWeight: 700, cursor: busy ? "not-allowed" : "pointer",
  opacity: busy ? 0.7 : 1, marginTop: "4px",
});

/** Centered card layout shared by the forgot / reset password pages. */
export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F9F7", display: "flex", alignItems: "center", justifyContent: "center", padding: "110px 16px 48px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E8EDE8", padding: "32px 28px", boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1A4A35", margin: "0 0 6px", fontFamily: "'Noto Serif', serif" }}>{title}</h1>
          {subtitle && <p style={{ color: "#6B7280", fontSize: "14px", lineHeight: 1.6, margin: "0 0 24px" }}>{subtitle}</p>}
          {children}
        </div>
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
          <Link href="/signin" style={{ color: "#1A4A35", fontWeight: 600, textDecoration: "none" }}>← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
