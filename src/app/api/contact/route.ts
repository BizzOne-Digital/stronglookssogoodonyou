import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { contactSchema } from "@/schemas/forms";
import { ContactInquiry } from "@/models/ContactInquiry";
import { sendBusinessNotification } from "@/lib/email";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { NotificationLog } from "@/models/NotificationLog";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(rateLimitKey("contact", ip), 8, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  await connectMongo();
  const doc = await ContactInquiry.create({
    ...parsed.data,
    notificationStatus: "pending",
  });

  const text = `New contact inquiry\nName: ${parsed.data.name}\nEmail: ${parsed.data.email}\nTopic: ${parsed.data.topic}\n\n${parsed.data.message}\n\nView in admin: /admin/inquiries/${doc._id}`;
  const mail = await sendBusinessNotification({
    subject: `Contact: ${parsed.data.topic}`,
    text,
    replyTo: parsed.data.email,
  });

  doc.notificationStatus = mail.ok ? "sent" : "failed";
  if (!mail.ok) doc.notificationError = mail.error;
  await doc.save();

  await NotificationLog.create({
    entityType: "ContactInquiry",
    entityId: doc._id,
    channel: "email",
    status: mail.ok ? "sent" : "failed",
    error: mail.ok ? undefined : mail.error,
    subject: `Contact: ${parsed.data.topic}`,
  });

  return NextResponse.json({ ok: true, id: doc._id.toString() });
}
