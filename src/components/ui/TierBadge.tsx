type Tier = "free" | "select" | "elite";

interface TierBadgeProps {
  tier: Tier;
}

const TIER_CONFIG: Record<Tier, { label: string; bg: string; color: string } | null> = {
  free:   null,
  select: { label: "SELECT",       bg: "rgba(45,110,82,0.12)",  color: "#2d6e52" },
  elite:  { label: "VERIFIED PRO", bg: "rgba(26,74,53,0.12)",   color: "#1A4A35" },
};

export default function TierBadge({ tier }: TierBadgeProps) {
  const config = TIER_CONFIG[tier];
  if (!config) return null;

  return (
    <span
      className="tier-badge"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}
