import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { applicationSchema } from "@/schemas/forms";
import { CoachingApplication } from "@/models/CoachingApplication";
import { sendBusinessNotification } from "@/lib/email";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { NotificationLog } from "@/models/NotificationLog";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(rateLimitKey("apply", ip), 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  await connectMongo();
  const doc = await CoachingApplication.create({
    ...parsed.data,
    status: "new",
    read: false,
    notificationStatus: "pending",
  });

  const text = `New coaching application from ${parsed.data.fullName}\nEmail: ${parsed.data.email}\nPackage: ${parsed.data.preferredPackage}\n\nView full application in admin: /admin/applications/${doc._id}`;
  const mail = await sendBusinessNotification({
    subject: `Coaching application: ${parsed.data.fullName}`,
    text,
    replyTo: parsed.data.email,
  });

  doc.notificationStatus = mail.ok ? "sent" : "failed";
  if (!mail.ok) doc.notificationError = mail.error;
  await doc.save();

  await NotificationLog.create({
    entityType: "CoachingApplication",
    entityId: doc._id,
    channel: "email",
    status: mail.ok ? "sent" : "failed",
    error: mail.ok ? undefined : mail.error,
    subject: `Coaching application: ${parsed.data.fullName}`,
  });

  return NextResponse.json({ ok: true, id: doc._id.toString() });
}
