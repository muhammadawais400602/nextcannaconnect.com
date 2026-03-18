"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Directory", href: "/directory" },
  { label: "Membership", href: "/membership" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/directory") return pathname.startsWith("/directory");
    return pathname === href;
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid #E5E7EB",
        height: "68px",
      }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between px-6"
        style={{ maxWidth: "1180px" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 select-none flex-shrink-0">
          <div
            className="flex items-center justify-center rounded-lg font-black text-white"
            style={{ width: "32px", height: "32px", backgroundColor: "#1A4A35", fontSize: "14px" }}
          >
            N
          </div>
          <span className="font-extrabold tracking-tight" style={{ color: "#111827", fontSize: "17px", letterSpacing: "-0.4px" }}>
            NextCanna
          </span>
          <span className="font-extrabold tracking-tight" style={{ color: "#F7941D", fontSize: "17px", letterSpacing: "-0.4px" }}>
            Connect
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              style={{
                color: isActive(link.href) ? "#F7941D" : "#4B5563",
                backgroundColor: isActive(link.href) ? "rgba(247,148,29,0.07)" : "transparent",
                fontSize: "14px",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/signup"
            className="btn-ghost"
            style={{ fontSize: "13px", padding: "8px 16px" }}
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="btn-primary"
            style={{ fontSize: "13px", padding: "9px 18px" }}
          >
            List Your Business
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: "#374151" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-[68px] left-0 right-0 z-50 shadow-lg"
          style={{ backgroundColor: "white", borderBottom: "1px solid #E5E7EB" }}
        >
          <div className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium py-3 px-4 rounded-lg transition-colors text-sm"
                style={{
                  color: isActive(link.href) ? "#F7941D" : "#374151",
                  backgroundColor: isActive(link.href) ? "rgba(247,148,29,0.07)" : "transparent",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 pb-2 flex flex-col gap-2 border-t mt-2" style={{ borderColor: "#E5E7EB" }}>
              <Link href="/signup" className="btn-ghost w-full justify-center" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary w-full justify-center" onClick={() => setMobileOpen(false)}>
                List Your Business
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
