import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import { bookingRequestSchema, bookingSlotSchema } from "@/schemas/forms";
import { Booking } from "@/models/Booking";
import { SiteSettings } from "@/models/SiteSettings";
import { sendBusinessNotification } from "@/lib/email";
import { checkRateLimit, rateLimitKey } from "@/lib/rate-limit";
import { reserveSlot } from "@/lib/booking/slots";
import { NotificationLog } from "@/models/NotificationLog";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tz = searchParams.get("tz") || "America/Toronto";
  await connectMongo();
  const settings = await SiteSettings.findOne({ key: "default" }).lean();
  if (!settings || settings.bookingMode !== "available_slots") {
    return NextResponse.json({ mode: "request_only", slots: [] });
  }
  const { getAvailableSlots } = await import("@/lib/booking/slots");
  const slots = await getAvailableSlots(tz);
  return NextResponse.json({ mode: "available_slots", slots });
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(rateLimitKey("booking", ip), 6, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  await connectMongo();
  const settings = await SiteSettings.findOne({ key: "default" }).lean();
  const body = await req.json();

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  if (settings?.bookingMode === "available_slots" && body.slotKey) {
    const parsed = bookingSlotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const start = new Date(parsed.data.startUtc);
    const duration = settings.consultationDurationMinutes;
    const end = new Date(start.getTime() + duration * 60 * 1000);

    const result = await reserveSlot({
      slotKey: parsed.data.slotKey,
      startUtc: start,
      endUtc: end,
      name: parsed.data.name,
      email: parsed.data.email,
      visitorTimeZone: parsed.data.visitorTimeZone,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 409 });
    }

    const text = `Consultation booked\n${parsed.data.name}, ${parsed.data.email}\n${start.toISOString()}\nAdmin: /admin/bookings/${result.id}`;
    const mail = await sendBusinessNotification({
      subject: `Booking confirmed request: ${parsed.data.name}`,
      text,
      replyTo: parsed.data.email,
    });

    await Booking.findByIdAndUpdate(result.id, {
      notificationStatus: mail.ok ? "sent" : "failed",
      notificationError: mail.ok ? undefined : mail.error,
    });

    return NextResponse.json({ ok: true, mode: "slot", id: result.id });
  }

  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const doc = await Booking.create({
    type: "consultation",
    status: "pending",
    name: parsed.data.name,
    email: parsed.data.email,
    visitorTimeZone: parsed.data.visitorTimeZone,
    preferredNotes: parsed.data.preferredNotes,
    notificationStatus: "pending",
  });

  const text = `Consultation request (awaiting confirmation)\n${parsed.data.name}\n${parsed.data.email}\nTZ: ${parsed.data.visitorTimeZone}\n\n${parsed.data.preferredNotes}\n\n/admin/bookings/${doc._id}`;
  const mail = await sendBusinessNotification({
    subject: `Consultation request: ${parsed.data.name}`,
    text,
    replyTo: parsed.data.email,
  });

  doc.notificationStatus = mail.ok ? "sent" : "failed";
  if (!mail.ok) doc.notificationError = mail.error;
  await doc.save();

  await NotificationLog.create({
    entityType: "Booking",
    entityId: doc._id,
    channel: "email",
    status: mail.ok ? "sent" : "failed",
    error: mail.ok ? undefined : mail.error,
  });

  return NextResponse.json({ ok: true, mode: "request", id: doc._id.toString() });
}
