export default function DirectoryLoading() {
  return (
    <div style={{ backgroundColor: "#f6f3f2", minHeight: "60vh" }}>
      {/* Hero skeleton */}
      <div style={{ backgroundColor: "#003320", height: "160px" }} />

      <div className="mx-auto px-4 md:px-8 py-10" style={{ maxWidth: "1440px" }}>
        <div style={{ display: "flex", gap: "24px" }}>
          {/* Filters panel skeleton */}
          <div
            style={{
              width: "260px",
              flexShrink: 0,
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              height: "400px",
            }}
            className="hidden lg:block animate-pulse"
          />

          {/* Cards skeleton */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  padding: "24px",
                  height: "140px",
                  animationDelay: `${i * 80}ms`,
                }}
                className="animate-pulse"
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
      </div>
    </div>
  );
}
