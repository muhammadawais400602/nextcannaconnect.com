export default function VendorLoading() {
  return (
    <div style={{ backgroundColor: "#fbf9f8", minHeight: "100vh" }}>
      {/* Banner skeleton */}
      <div style={{ height: "280px", background: "#1a4a35" }} className="animate-pulse" />

      <div className="mx-auto px-4 md:px-8" style={{ maxWidth: "1200px", marginTop: "-60px", position: "relative", zIndex: 10 }}>
        {/* Header card */}
        <div style={{ background: "white", borderRadius: "16px", padding: "32px", marginBottom: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }} className="animate-pulse">
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "12px", background: "#E5E7EB", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: "24px", background: "#E5E7EB", borderRadius: "4px", width: "35%", marginBottom: "12px" }} />
              <div style={{ height: "14px", background: "#F3F4F6", borderRadius: "4px", width: "60%", marginBottom: "8px" }} />
              <div style={{ height: "14px", background: "#F3F4F6", borderRadius: "4px", width: "45%" }} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ background: "white", borderRadius: "12px", padding: "28px", height: "160px" }} className="animate-pulse">
                <div style={{ height: "14px", background: "#E5E7EB", borderRadius: "4px", width: "30%", marginBottom: "16px" }} />
                <div style={{ height: "12px", background: "#F3F4F6", borderRadius: "4px", width: "90%", marginBottom: "8px" }} />
                <div style={{ height: "12px", background: "#F3F4F6", borderRadius: "4px", width: "75%", marginBottom: "8px" }} />
                <div style={{ height: "12px", background: "#F3F4F6", borderRadius: "4px", width: "60%" }} />
              </div>
            ))}
          </div>
          <div style={{ background: "white", borderRadius: "12px", padding: "24px", height: "320px" }} className="animate-pulse">
            <div style={{ height: "16px", background: "#E5E7EB", borderRadius: "4px", width: "50%", marginBottom: "20px" }} />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: "12px", background: "#F3F4F6", borderRadius: "4px", marginBottom: "12px", width: `${70 + i * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
