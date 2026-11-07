import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("admin_session")?.value;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!token || !adminSecret || !token.startsWith("nc-admin:")) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const rest = token.slice("nc-admin:".length);
  const lastColon = rest.lastIndexOf(":");
  if (lastColon === -1) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const payload = rest.slice(0, lastColon);
  const sig = rest.slice(lastColon + 1);
  const expected = crypto.createHmac("sha256", adminSecret).update(payload).digest("hex");

  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
