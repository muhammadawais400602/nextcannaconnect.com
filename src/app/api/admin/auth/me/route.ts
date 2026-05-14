import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function generateToken(secret: string): string {
  return "nc-admin:" + crypto.createHmac("sha256", secret).update("admin-session").digest("hex");
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!token || !adminSecret || token !== generateToken(adminSecret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
