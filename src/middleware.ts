import { NextRequest, NextResponse } from "next/server";

function isValidSession(request: NextRequest): boolean {
  const session = request.cookies.get("admin_session");
  return !!session?.value?.startsWith("nc-admin:");
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
