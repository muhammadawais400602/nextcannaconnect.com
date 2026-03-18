type Tier = "free" | "claimed" | "select" | "elite" | "featured";

interface TierBadgeProps {
  tier: Tier;
}

const TIER_CONFIG: Record<Tier, { label: string; bg: string; color: string } | null> = {
  free: null,
  claimed: { label: "CLAIMED", bg: "#F9C31A", color: "#1A2E1A" },
  select: { label: "SELECT SEAL", bg: "#5CB85C", color: "white" },
  elite: { label: "VERIFIED ✓", bg: "#1A4A35", color: "#F9C31A" },
  featured: { label: "FEATURED", bg: "#F7941D", color: "white" },
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
