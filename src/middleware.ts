import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function isValidSession(request: NextRequest): boolean {
  const session = request.cookies.get("admin_session");
  const val = session?.value;
  if (!val?.startsWith("nc-admin:")) return false;
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const parts = val.slice("nc-admin:".length);
  const lastColon = parts.lastIndexOf(":");
  if (lastColon === -1) return false;
  const payload = parts.slice(0, lastColon);
  const sig = parts.slice(lastColon + 1);
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API through
  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  // Protect all /admin page routes
  if (pathname.startsWith("/admin")) {
    if (!isValidSession(request)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  // Protect all /api/admin/* routes
  if (pathname.startsWith("/api/admin")) {
    if (!isValidSession(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
