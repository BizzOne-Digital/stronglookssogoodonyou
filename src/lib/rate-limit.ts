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

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  await connectMongo();
  const now = Date.now();
  const doc = await RateLimitModel.findOne({ key });

  if (!doc) {
    await RateLimitModel.create({ key, count: 1, windowStart: new Date(now) });
    return { allowed: true };
  }

  const windowStart = doc.windowStart.getTime();
  if (now - windowStart > windowMs) {
    doc.count = 1;
    doc.windowStart = new Date(now);
    await doc.save();
    return { allowed: true };
  }

  if (doc.count >= limit) {
    return {
      allowed: false,
      retryAfterMs: windowMs - (now - windowStart),
    };
  }

  doc.count += 1;
  await doc.save();
  return { allowed: true };
}

export function rateLimitKey(
  action: string,
  identifier: string
): string {
  return `${action}:${identifier}`;
}
