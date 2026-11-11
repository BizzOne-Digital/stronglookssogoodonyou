import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ChallengeSubscriber } from "@/models/ChallengeSubscriber";
import { isToken, siteUrl } from "@/lib/site-url";

async function unsubscribe(token: string | null) {
  if (!isToken(token)) return false;
  await connectMongo();
  const res = await ChallengeSubscriber.updateOne(
    { unsubscribeToken: token },
    { $set: { marketingConsent: false, unsubscribedAt: new Date() } }
  );
  return res.matchedCount > 0;
}

/** Link in every marketing email. Also supports one-click POST (RFC 8058). */
export async function GET(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("t"));
  return NextResponse.redirect(`${siteUrl()}/free-challenge?unsubscribed=${ok ? "1" : "0"}`);
}

export async function POST(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("t"));
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
