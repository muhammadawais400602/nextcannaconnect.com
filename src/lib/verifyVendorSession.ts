import crypto from "crypto";
import mongoose from "mongoose";
import type { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export const VENDOR_SESSION_COOKIE = "vendor_session";
export const VENDOR_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * Secret used to sign vendor sessions. Prefer a dedicated VENDOR_SESSION_SECRET
 * so that changing the admin password (ADMIN_SECRET) does not log out vendors.
 * There is deliberately no hardcoded fallback: a missing secret must fail closed.
 */
function getSecret(): string {
  const secret = process.env.VENDOR_SESSION_SECRET || process.env.ADMIN_SECRET;
  if (!secret) throw new Error("VENDOR_SESSION_SECRET (or ADMIN_SECRET) is not configured");
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createVendorSession(userId: string, sessionVersion = 0): string {
  const payload = `${userId}:${Date.now()}:${sessionVersion}`;
  return `nc-vendor:${payload}:${sign(payload)}`;
}

export function setVendorSessionCookie(response: NextResponse, userId: string, sessionVersion = 0) {
  response.cookies.set(VENDOR_SESSION_COOKIE, createVendorSession(userId, sessionVersion), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: VENDOR_SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

export function clearVendorSessionCookie(response: NextResponse) {
  response.cookies.set(VENDOR_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/** Checks the signature and age of a session token. Does not touch the database. */
export function parseVendorSession(sessionValue: string): { userId: string; version: number } | null {
  if (!sessionValue?.startsWith("nc-vendor:")) return null;
  const rest = sessionValue.slice("nc-vendor:".length);
  const lastColon = rest.lastIndexOf(":");
  if (lastColon === -1) return null;
  const payload = rest.slice(0, lastColon);
  const sig = rest.slice(lastColon + 1);
  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return null;
  }
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

  // payload = userId:issuedAt[:sessionVersion] (older tokens have no version)
  const [userId, issuedAt, version] = payload.split(":");
  const ts = Number(issuedAt);
  if (!userId || !Number.isFinite(ts)) return null;
  if (Date.now() - ts > VENDOR_SESSION_MAX_AGE_SECONDS * 1000) return null;
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  return { userId, version: Number(version ?? 0) || 0 };
}

/**
 * Verifies a vendor session and returns the user id, or null.
 * Also checks the account is still active and the session has not been
 * revoked (logout / password change bump the user's sessionVersion).
 */
export async function verifyVendorSession(sessionValue: string | undefined): Promise<string | null> {
  if (!sessionValue) return null;
  const parsed = parseVendorSession(sessionValue);
  if (!parsed) return null;
  await connectDB();
  const user = await User.findById(parsed.userId).select("isActive sessionVersion").lean();
  if (!user?.isActive) return null;
  if ((user.sessionVersion ?? 0) !== parsed.version) return null;
  return parsed.userId;
}
