import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { ChallengeSubscriber } from "@/models/ChallengeSubscriber";
import { ProgramPurchase } from "@/models/ProgramPurchase";
import { NotificationLog } from "@/models/NotificationLog";
import { sendVisitorEmail } from "@/lib/email";
import { followUpEmail } from "@/lib/challenge-email";
import { CHALLENGE } from "@/lib/challenge";

/**
 * Daily job (see vercel.json). Sends the 28-Day Program follow-up only to participants who
 * opted in to marketing, have not unsubscribed, have not bought, and have not already been sent it.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongo();
  const now = Date.now();
  const cutoff = new Date(now - CHALLENGE.followUpDelayDays * 24 * 60 * 60 * 1000);
  const staleClaim = new Date(now - 60 * 60 * 1000);

  const candidates = await ChallengeSubscriber.find({
    marketingConsent: true,
    unsubscribedAt: { $exists: false },
    followUpSentAt: { $exists: false },
    createdAt: { $lte: cutoff },
    $or: [{ followUpClaimedAt: { $exists: false } }, { followUpClaimedAt: { $lt: staleClaim } }],
  })
    .limit(50)
    .lean();

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const c of candidates) {
    // Claim atomically so overlapping runs never double-send.
    const claimed = await ChallengeSubscriber.findOneAndUpdate(
      {
        _id: c._id,
        followUpSentAt: { $exists: false },
        $or: [{ followUpClaimedAt: { $exists: false } }, { followUpClaimedAt: { $lt: staleClaim } }],
      },
      { $set: { followUpClaimedAt: new Date() } }
    );
    if (!claimed) continue;

    if (await ProgramPurchase.exists({ email: c.email })) {
      await ChallengeSubscriber.updateOne({ _id: c._id }, { $set: { followUpSentAt: new Date() } });
      skipped++;
      continue;
    }

    const mail = followUpEmail({
      firstName: c.firstName,
      accessToken: c.accessToken,
      unsubscribeToken: c.unsubscribeToken,
    });
    const result = await sendVisitorEmail({ to: c.email, subject: mail.subject, text: mail.text, html: mail.html });
    if (result.ok) {
      await ChallengeSubscriber.updateOne({ _id: c._id }, { $set: { followUpSentAt: new Date() } });
      sent++;
    } else {
      await ChallengeSubscriber.updateOne({ _id: c._id }, { $unset: { followUpClaimedAt: 1 } });
      failed++;
    }
    await NotificationLog.create({
      entityType: "ChallengeSubscriber",
      entityId: c._id,
      channel: "email",
      status: result.ok ? "sent" : "failed",
      error: result.ok ? undefined : result.error,
      subject: mail.subject,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, sent, skipped, failed });
}
