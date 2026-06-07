"use client";

export default function DirectoryLoadingSkeleton() {
  return (
    <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
      {/* Sidebar skeleton */}
      <div className="hidden lg:block" style={{ width: "220px", flexShrink: 0 }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "24px" }}>
          {[100, 80, 90, 70, 85, 75, 95].map((w, i) => (
            <div
              key={i}
              className="animate-pulse"
              style={{
                height: "14px",
                background: i === 0 ? "#E5E7EB" : "#F3F4F6",
                borderRadius: "4px",
                width: `${w}%`,
                marginBottom: "14px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Cards skeleton */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
        {[0, 80, 160, 240, 320].map((delay) => (
          <div
            key={delay}
            className="animate-pulse"
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              height: "140px",
              animationDelay: `${delay}ms`,
            }}
          >
            <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "10px", background: "#E5E7EB", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: "16px", background: "#E5E7EB", borderRadius: "4px", width: "40%", marginBottom: "10px" }} />
                <div style={{ height: "12px", background: "#F3F4F6", borderRadius: "4px", width: "70%", marginBottom: "8px" }} />
                <div style={{ height: "12px", background: "#F3F4F6", borderRadius: "4px", width: "55%" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
