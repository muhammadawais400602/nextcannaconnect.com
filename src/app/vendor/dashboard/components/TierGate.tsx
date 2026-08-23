"use client";

export default function TierGate({
  requiredTier,
  currentTier,
  children,
  label,
}: {
  requiredTier: "select" | "elite";
  currentTier: string;
  children: React.ReactNode;
  label?: string;
}) {
  const tiers = ["free", "select", "elite"];
  const current = tiers.indexOf(currentTier);
  const required = tiers.indexOf(requiredTier);

  if (current >= required) return <>{children}</>;

  const tierLabel = requiredTier === "elite" ? "Verified Pro" : "Select";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(26,74,53,0.05)",
        border: "1px dashed #C6E0D0",
        borderRadius: "8px",
        padding: "12px 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "16px" }}>🔒</span>
        <div>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#1A4A35",
              margin: 0,
            }}
          >
            {tierLabel} Feature
          </p>
          <p style={{ fontSize: "11px", color: "#6B7280", margin: 0 }}>
            {label || `Upgrade to ${tierLabel} to unlock this feature`}
          </p>
        </div>
      </div>
      <a
        href="/membership"
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "white",
          background: "#1A4A35",
          textDecoration: "none",
          padding: "6px 14px",
          borderRadius: "6px",
          whiteSpace: "nowrap",
        }}
      >
        Upgrade →
      </a>
    </div>
  );
}
