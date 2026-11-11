import { connectMongo } from "@/lib/mongodb";
import { Schema, model, models } from "mongoose";

interface RateLimitDoc {
  key: string;
  count: number;
  windowStart: Date;
}

const RateLimitSchema = new Schema<RateLimitDoc>(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, required: true, default: 0 },
    windowStart: { type: Date, required: true },
  },
  { timestamps: true }
);

const RateLimitModel =
  models.RateLimitEntry ||
  model<RateLimitDoc>("RateLimitEntry", RateLimitSchema);

/** Atomic fixed-window limiter (safe under concurrent requests). */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  await connectMongo();
  const now = Date.now();
  const cutoff = new Date(now - windowMs);

  // 1. Window expired: reset atomically.
  const reset = await RateLimitModel.updateOne(
    { key, windowStart: { $lt: cutoff } },
    { $set: { count: 1, windowStart: new Date(now) } }
  );
  if (reset.modifiedCount > 0) return { allowed: true };

  // 2. Inside the window and under the limit: increment atomically.
  const inc = await RateLimitModel.findOneAndUpdate(
    { key, windowStart: { $gte: cutoff }, count: { $lt: limit } },
    { $inc: { count: 1 } }
  );
  if (inc) return { allowed: true };

  // 3. No document yet: create it (a concurrent creator makes this fail with a duplicate key).
  try {
    await RateLimitModel.create({ key, count: 1, windowStart: new Date(now) });
    return { allowed: true };
  } catch {
    const retry = await RateLimitModel.findOneAndUpdate(
      { key, windowStart: { $gte: cutoff }, count: { $lt: limit } },
      { $inc: { count: 1 } }
    );
    if (retry) return { allowed: true };
  }

  const doc = await RateLimitModel.findOne({ key }).lean<RateLimitDoc>();
  const elapsed = doc ? now - doc.windowStart.getTime() : 0;
  return { allowed: false, retryAfterMs: Math.max(0, windowMs - elapsed) };
}

export function rateLimitKey(
  action: string,
  identifier: string
): string {
  return `${action}:${identifier}`;
}
