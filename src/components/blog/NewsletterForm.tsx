"use client";

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{ display: "flex", gap: "12px", maxWidth: "440px", margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}
    >
      <input
        type="email"
        placeholder="professional@company.com"
        style={{
          flex: 1,
          minWidth: "220px",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid rgba(136,185,158,0.3)",
          backgroundColor: "rgba(255,255,255,0.07)",
          color: "white",
          fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
          outline: "none",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "12px 24px",
          backgroundColor: "white",
          color: "#003320",
          border: "none",
          borderRadius: "8px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.05em",
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer",
        }}
      >
        Subscribe
      </button>
    </form>
  );
}
