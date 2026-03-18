"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Directory", href: "/directory" },
    { label: "Membership", href: "/membership" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{ backgroundColor: "#1C2B3A", height: "64px" }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between px-8"
        style={{ maxWidth: "1100px" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center select-none">
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "white", letterSpacing: "-0.5px" }}
          >
            NEXT
          </span>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "#5CB85C", letterSpacing: "-0.5px" }}
          >
            CANNA
          </span>
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ color: "#F7941D", letterSpacing: "-0.5px" }}
          >
            CONNECT
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors"
              style={{
                color: pathname === link.href ? "#F7941D" : "rgba(255,255,255,0.85)",
                fontSize: "13px",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/signup" className="btn-primary" style={{ padding: "8px 18px", fontSize: "13px" }}>
            List Your Business
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden absolute top-16 left-0 right-0 z-50 shadow-xl"
          style={{ backgroundColor: "#1C2B3A" }}
        >
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium py-3 px-4 rounded-lg transition-colors"
                style={{
                  color: pathname === link.href ? "#F7941D" : "rgba(255,255,255,0.85)",
                  backgroundColor: pathname === link.href ? "rgba(247,148,29,0.1)" : "transparent",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1">
              <Link
                href="/signup"
                className="btn-primary w-full justify-center"
                onClick={() => setMobileOpen(false)}
              >
                List Your Business
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
