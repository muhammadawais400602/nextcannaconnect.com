"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User } from "lucide-react";

const NAV_LINKS = [
  { label: "Directory", href: "/directory" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

interface AuthUser {
  email: string;
  fullName?: string;
  companyName?: string;
  tier?: string;
  isAdmin?: boolean;
}

function ProfileMenu({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user.fullName
    ? user.fullName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  const displayName = user.fullName || user.companyName || user.email;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        title={displayName}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "1px solid rgba(0,51,32,0.2)",
          borderRadius: "999px",
          padding: "5px 12px 5px 6px",
          cursor: "pointer",
          transition: "border-color 0.2s",
        }}
        onMouseLeave={() => {}}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#003320",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#003320", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {displayName}
        </span>
      </button>

      {open && (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: "180px",
            backgroundColor: "white",
            border: "1px solid rgba(192,201,193,0.5)",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          {/* User info header */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {displayName}
            </p>
            <p style={{ fontSize: "11px", color: "#9CA3AF", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.email}
            </p>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px" }}>
            {!user.isAdmin && (
              <>
                <Link
                  href="/vendor/dashboard"
                  onClick={() => setOpen(false)}
                  style={menuItemStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f3f7f5"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <User size={14} />
                  Profile
                </Link>
                <Link
                  href="/vendor/dashboard"
                  onClick={() => setOpen(false)}
                  style={menuItemStyle}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f3f7f5"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
                >
                  <span style={{ fontSize: "14px" }}>🏢</span>
                  My Listing
                </Link>
              </>
            )}
            {user.isAdmin && (
              <Link
                href="/admin/dashboard"
                onClick={() => setOpen(false)}
                style={menuItemStyle}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#f3f7f5"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
              >
                <span style={{ fontSize: "14px" }}>▦</span>
                Admin Panel
              </Link>
            )}
          </div>

          <div style={{ padding: "6px", borderTop: "1px solid #f3f4f6" }}>
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              style={{ ...menuItemStyle, width: "100%", background: "none", border: "none", cursor: "pointer", color: "#EF4444", textAlign: "left" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "#fef2f2"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              <span style={{ fontSize: "14px" }}>↪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 10px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 500,
  color: "#374151",
  textDecoration: "none",
  backgroundColor: "transparent",
  transition: "background-color 0.15s",
};

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/vendor-me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.user) {
          setAuthUser(data.user);
        } else {
          // Check admin session
          fetch("/api/admin/auth/me")
            .then((r) => r.ok ? r.json() : null)
            .then((adminData) => {
              if (adminData?.ok) setAuthUser({ email: "admin@nextcanna.com", fullName: "Super Admin", isAdmin: true });
            })
            .catch(() => {})
            .finally(() => setAuthLoading(false));
          return;
        }
        setAuthLoading(false);
      })
      .catch(() => setAuthLoading(false));
  }, [pathname]);

  async function handleLogout() {
    if (authUser?.isAdmin) {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setAuthUser(null);
      router.push("/");
    } else {
      await fetch("/api/auth/vendor-logout", { method: "POST" });
      setAuthUser(null);
      router.push("/");
    }
  }

  const isActive = (href: string) => {
    if (href === "/directory") return pathname.startsWith("/directory");
    if (href === "/blog") return pathname.startsWith("/blog");
    return pathname === href;
  };

  if (pathname.startsWith("/vendor/dashboard") || pathname.startsWith("/vendor/login") || pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed top-0 w-full z-50 glass-panel"
      style={{
        borderBottom: "1px solid rgba(192,201,193,0.3)",
        boxShadow: "0 4px 60px rgba(27,28,28,0.05)",
      }}
    >
      <div
        className="flex justify-between items-center w-full px-8 py-4 mx-auto"
        style={{ maxWidth: "1440px" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="select-none flex-shrink-0"
          style={{
            fontFamily: "'Noto Serif', serif",
            fontStyle: "italic",
            fontSize: "20px",
            fontWeight: 400,
            color: "#003320",
            textDecoration: "none",
          }}
        >
          NextCanna Connect
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive(link.href) ? "#003320" : "#6b7280",
                borderBottom: isActive(link.href) ? "2px solid #003320" : "2px solid transparent",
                paddingBottom: "2px",
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.color = "#003320"; }}
              onMouseLeave={(e) => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-6">
          {!authLoading && (
            authUser ? (
              <ProfileMenu user={authUser} onLogout={handleLogout} />
            ) : (
              <>
                <Link
                  href="/signin"
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#6b7280",
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#003320"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary"
                  style={{ fontSize: "11px", padding: "10px 20px" }}
                >
                  List Your Business
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "#003320" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: "rgba(251,249,248,0.98)",
            borderBottom: "1px solid rgba(192,201,193,0.4)",
          }}
        >
          <div className="flex flex-col px-8 py-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 font-medium"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: isActive(link.href) ? "#003320" : "#6b7280",
                  fontWeight: isActive(link.href) ? 700 : 500,
                  textDecoration: "none",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 flex flex-col gap-3 border-t mt-2" style={{ borderColor: "rgba(192,201,193,0.4)" }}>
              {authUser ? (
                <>
                  {!authUser.isAdmin && (
                    <>
                      <Link href="/vendor/dashboard" className="btn-ghost w-full justify-center" onClick={() => setMobileOpen(false)}>
                        Profile
                      </Link>
                      <Link href="/vendor/dashboard" className="btn-ghost w-full justify-center" onClick={() => setMobileOpen(false)}>
                        My Listing
                      </Link>
                    </>
                  )}
                  {authUser.isAdmin && (
                    <Link href="/admin/dashboard" className="btn-ghost w-full justify-center" onClick={() => setMobileOpen(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="btn-ghost w-full justify-center"
                    style={{ color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="btn-ghost w-full justify-center" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/signup" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>
                    List Your Business
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
