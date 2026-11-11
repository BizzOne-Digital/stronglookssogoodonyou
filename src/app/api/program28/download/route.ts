import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ProgramPurchase } from "@/models/ProgramPurchase";
import { PROGRAM_28 } from "@/lib/challenge";
import { isToken } from "@/lib/site-url";
import { pdfResponse, readPrivatePdf } from "@/lib/private-files";

/** Only available after a verified Stripe payment created a purchase record. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("t");
  if (!isToken(token)) {
    return NextResponse.json({ error: "Access link required" }, { status: 401 });
  }
  await connectMongo();
  const purchase = await ProgramPurchase.findOne({ accessToken: token }).select("_id").lean();
  if (!purchase) {
    return NextResponse.json({ error: "Access link not valid" }, { status: 403 });
  }
  const data = await readPrivatePdf(PROGRAM_28.pdfFile);
  if (!data) {
    return NextResponse.json(
      { error: "Your program file is being prepared. Please contact us and we will send it right away." },
      { status: 503 }
    );
  }
  return pdfResponse(data, PROGRAM_28.pdfFile);
}
