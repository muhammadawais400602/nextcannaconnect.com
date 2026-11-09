import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit, clientIp, tooManyRequests } from "@/lib/rateLimit";

/** Constant-time comparison so response timing doesn't leak the password. */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function generateToken(secret: string): string {
  const nonce = crypto.randomUUID();
  const ts = Date.now();
  const payload = `${nonce}:${ts}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `nc-admin:${payload}:${sig}`;
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (!(await rateLimit(`admin-login:${ip}`, 5, 60_000)) || !(await rateLimit(`admin-login-h:${ip}`, 20, 60 * 60_000))) {
    return tooManyRequests("Too many login attempts. Please wait and try again.", 60);
  }
  const { password } = await request.json().catch(() => ({}));
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || typeof password !== "string" || !safeEqual(password, adminSecret)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = generateToken(adminSecret);
  const response = NextResponse.json({ ok: true });

  response.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  // Non-secret marker so public pages only probe the admin session when signed in.
  response.cookies.set("nc_admin", "1", {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_session");
  response.cookies.delete("nc_admin");
  return response;
}
