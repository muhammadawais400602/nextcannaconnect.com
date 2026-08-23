"use client";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "profile", label: "Profile" },
  { key: "listing", label: "Listing Details" },
  { key: "media", label: "Media" },
  { key: "analytics", label: "Analytics" },
  { key: "account", label: "Account" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

export default function TabNavigation({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <>
      {/* Desktop tabs */}
      <div
        className="hidden sm:flex"
        style={{
          gap: "0",
          borderBottom: "2px solid #E5E7EB",
          marginBottom: "24px",
          overflowX: "auto",
        }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              style={{
                padding: "10px 18px",
                fontSize: "12px",
                fontWeight: isActive ? 700 : 500,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: isActive ? "#1A4A35" : "#6B7280",
                background: "none",
                border: "none",
                borderBottom: isActive
                  ? "2px solid #1A4A35"
                  : "2px solid transparent",
                marginBottom: "-2px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden" style={{ marginBottom: "20px" }}>
        <select
          value={active}
          onChange={(e) => onChange(e.target.value as TabKey)}
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1A4A35",
            background: "white",
            outline: "none",
          }}
        >
          {TABS.map((tab) => (
            <option key={tab.key} value={tab.key}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
