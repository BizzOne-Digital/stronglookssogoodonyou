import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ChallengeSubscriber } from "@/models/ChallengeSubscriber";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { CHALLENGE } from "@/lib/challenge";
import { isToken } from "@/lib/site-url";
import { pdfResponse, readPrivatePdf } from "@/lib/private-files";

/** PDF is only available to registered participants who accepted the disclosure. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("t");
  if (!isToken(token)) {
    return NextResponse.json({ error: "Access link required" }, { status: 401 });
  }
  await connectMongo();
  const sub = await ChallengeSubscriber.findOne({ accessToken: token }).select("_id").lean();
  if (!sub) {
    return NextResponse.json({ error: "Access link not valid" }, { status: 403 });
  }
  const data = await readPrivatePdf(CHALLENGE.pdfFile);
  if (!data) {
    return NextResponse.json({ error: "Download is temporarily unavailable" }, { status: 503 });
  }
  await AnalyticsEvent.create({ name: "pdf_download", path: "/api/challenge/pdf" }).catch(() => {});
  return pdfResponse(data, CHALLENGE.pdfFile);
}
