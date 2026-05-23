import crypto from "crypto";

function getSecret(key: string): string {
  const secret = process.env[key];
  if (!secret) throw new Error(`Missing env var: ${key}`);
  return secret;
}

// ── Admin session ─────────────────────────────────────────────────────────────

export function generateAdminToken(): string {
  const secret = getSecret("ADMIN_SECRET");
  return "nc-admin:" + crypto.createHmac("sha256", secret).update("admin-session").digest("hex");
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const expected = generateAdminToken();
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ── Vendor session ────────────────────────────────────────────────────────────

export function generateVendorToken(userId: string): string {
  const secret = getSecret("VENDOR_SESSION_SECRET");
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${userId}:${nonce}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `nc-vendor:${payload}:${sig}`;
}

export function verifyVendorToken(token: string | undefined): string | null {
  if (!token || !token.startsWith("nc-vendor:")) return null;
  try {
    const secret = getSecret("VENDOR_SESSION_SECRET");
    // Format: nc-vendor:<userId>:<nonce>:<sig>
    const rest = token.slice("nc-vendor:".length);
    const lastColon = rest.lastIndexOf(":");
    if (lastColon === -1) return null;
    const payload = rest.slice(0, lastColon);
    const sig = rest.slice(lastColon + 1);
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
    const userId = payload.split(":")[0];
    return userId || null;
  } catch {
    return null;
  }
}
