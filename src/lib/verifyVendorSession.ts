import crypto from "crypto";

export function verifyVendorSession(sessionValue: string): string | null {
  if (!sessionValue.startsWith("nc-vendor:")) return null;
  const rest = sessionValue.slice("nc-vendor:".length);
  const lastColon = rest.lastIndexOf(":");
  if (lastColon === -1) return null;
  const payload = rest.slice(0, lastColon);
  const sig = rest.slice(lastColon + 1);
  const secret = process.env.ADMIN_SECRET || "fallback-vendor-secret";
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const firstColon = payload.indexOf(":");
  if (firstColon === -1) return null;
  return payload.slice(0, firstColon);
}
