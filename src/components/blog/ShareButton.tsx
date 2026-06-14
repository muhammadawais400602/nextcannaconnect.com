"use client";

interface Props {
  title: string;
}

export default function ShareButton({ title }: Props) {
  function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  }

  return (
    <button
      onClick={handleShare}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#374151",
        fontFamily: "'Inter', sans-serif",
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 16px",
        cursor: "pointer",
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>share</span>
      Share
    </button>
  );
}
