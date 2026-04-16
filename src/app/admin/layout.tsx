"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ExternalLink } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "▦" },
  { href: "/admin/companies", label: "Companies", icon: "🏢" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/leads", label: "Leads", icon: "📋" },
  { href: "/admin/signups", label: "Signups", icon: "📝" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "240px",
          flexShrink: 0,
          background: "#0D1F14",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 50,
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "24px 20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "#E8821E",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: "800",
                color: "white",
              }}
            >
              N
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "white" }}>
                NextCanna
              </div>
              <div style={{ fontSize: "11px", color: "#86A898", fontWeight: "500" }}>
                Admin Portal
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              color: "#4B7A60",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "0 8px",
              marginBottom: "8px",
            }}
          >
            Main Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  marginBottom: "2px",
                  textDecoration: "none",
                  background: isActive ? "#1A4A35" : "transparent",
                  color: isActive ? "white" : "#86A898",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "400",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                {item.label}
                {isActive && (
                  <span
                    style={{
                      marginLeft: "auto",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#E8821E",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <Link
            href="/"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#86A898",
              fontSize: "13px",
              marginBottom: "4px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#86A898")}
          >
            <ExternalLink size={14} /> View Site
          </Link>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.15)",
              cursor: "pointer",
              color: "#F87171",
              fontSize: "13px",
              fontWeight: 600,
              width: "100%",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.18)";
              (e.currentTarget as HTMLButtonElement).style.color = "#FCA5A5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
              (e.currentTarget as HTMLButtonElement).style.color = "#F87171";
            }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ marginLeft: "240px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header
          style={{
            height: "60px",
            background: "white",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "14px", color: "#6B7280" }}>
              {NAV_ITEMS.find((n) => pathname.startsWith(n.href))?.label ?? "Admin"} &rsaquo;{" "}
              <span style={{ color: "#111827", fontWeight: "500" }}>
                NextCanna Connect
              </span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#F3F4F6",
                padding: "6px 12px",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  background: "#1A4A35",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                SA
              </div>
              <span style={{ fontSize: "13px", fontWeight: "500", color: "#374151" }}>
                Super Admin
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.15)",
                cursor: "pointer",
                color: "#EF4444",
                fontSize: "13px",
                fontWeight: 600,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.07)";
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, background: "#F4F7F5", padding: "28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
