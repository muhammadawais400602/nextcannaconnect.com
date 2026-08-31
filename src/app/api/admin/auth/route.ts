import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function generateToken(secret: string): string {
  const nonce = crypto.randomUUID();
  const ts = Date.now();
  const payload = `${nonce}:${ts}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `nc-admin:${payload}:${sig}`;
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret || password !== adminSecret) {
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

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("admin_session");
  return response;
}
