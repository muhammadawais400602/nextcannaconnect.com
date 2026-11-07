import mongoose, { Schema } from "mongoose";
import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";

/**
 * Fixed-window rate limiter backed by MongoDB, so limits hold across
 * serverless instances (an in-memory Map resets on every cold start).
 * Falls back to a per-instance in-memory counter if the database is unreachable.
 */
interface IRateLimit {
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});
RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RateLimitModel =
  (mongoose.models.RateLimit as mongoose.Model<IRateLimit>) ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);

const memory = new Map<string, { count: number; resetAt: number }>();

function memoryLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now > entry.resetAt) {
    memory.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= limit;
}

/** Returns true if the request is allowed, false if the limit is exceeded. */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const window = Math.floor(Date.now() / windowMs);
  const bucket = `${key}:${windowMs}:${window}`;
  try {
    await connectDB();
    const doc = await RateLimitModel.findOneAndUpdate(
      { key: bucket },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((window + 1) * windowMs + 60_000) } },
      { upsert: true, new: true },
    ).lean();
    return (doc?.count ?? 1) <= limit;
  } catch (err) {
    console.error("[rateLimit] falling back to memory:", err);
    return memoryLimit(bucket, limit, windowMs);
  }
}

export function clientIp(request: NextRequest | Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
