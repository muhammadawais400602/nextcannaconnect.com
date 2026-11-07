import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import {
  VENDOR_SESSION_COOKIE,
  clearVendorSessionCookie,
  verifyVendorSession,
} from "@/lib/verifyVendorSession";

export async function POST(request: NextRequest) {
  // Revoke the session server-side so a copied cookie stops working too.
  try {
    const userId = await verifyVendorSession(request.cookies.get(VENDOR_SESSION_COOKIE)?.value);
    if (userId) await User.findByIdAndUpdate(userId, { $inc: { sessionVersion: 1 } });
  } catch (err) {
    console.error("[vendor-logout]", err);
  }
  const response = NextResponse.json({ success: true });
  clearVendorSessionCookie(response);
  return response;
}
