import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { TRACK_EVENTS } from "@/lib/challenge";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { clientIp } from "@/lib/site-url";

/** Anonymous funnel counters only: no cookies, no IP or personal data stored. */
export async function POST(req: Request) {
  const rl = await checkRateLimit(rateLimitKey("track", clientIp(req)), 120, 60 * 60 * 1000);
  if (!rl.allowed) return NextResponse.json({ ok: false }, { status: 429 });

  let body: { name?: unknown; path?: unknown; source?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const name = typeof body.name === "string" ? body.name : "";
  if (!(TRACK_EVENTS as readonly string[]).includes(name)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await connectMongo();
  await AnalyticsEvent.create({
    name,
    path: typeof body.path === "string" ? body.path.slice(0, 200) : undefined,
    source: typeof body.source === "string" ? body.source.slice(0, 100) : undefined,
  });
  return NextResponse.json({ ok: true });
}
