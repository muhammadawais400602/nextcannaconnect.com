import { NextRequest, NextResponse } from "next/server";

async function hmacHex(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function isValidSession(request: NextRequest): Promise<boolean> {
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
  const expected = await hmacHex(secret, payload);
  return timingSafeEqual(sig, expected);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!(await isValidSession(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin")) {
    if (!(await isValidSession(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
