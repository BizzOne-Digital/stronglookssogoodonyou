import { connectMongo } from "@/lib/mongodb";
import { SiteSettings } from "@/models/SiteSettings";
import { AvailabilitySettings, AvailabilityException } from "@/models/Availability";
import { Booking } from "@/models/Booking";

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

function parseTimeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export async function getAvailableSlots(
  visitorTimeZone: string,
  fromDate = new Date()
): Promise<{ slotKey: string; startUtc: string; endUtc: string; label: string }[]> {
  await connectMongo();
  const settings = await SiteSettings.findOne({ key: "default" }).lean();
  if (!settings || settings.bookingMode !== "available_slots") {
    return [];
  }

  const availability =
    (await AvailabilitySettings.findOne({ key: "default" }).lean()) ||
    (await AvailabilitySettings.create({ key: "default" }));

  const duration = settings.consultationDurationMinutes;
  const buffer = settings.bufferMinutes;
  const horizonDays = settings.bookingHorizonDays;
  const minNoticeMs = settings.minimumNoticeHours * 60 * 60 * 1000;
  const exceptions = await AvailabilityException.find().lean();
  const blackoutDates = new Set(
    exceptions.filter((e) => e.type === "blackout").map((e) => e.date)
  );

  const slots: { slotKey: string; startUtc: string; endUtc: string; label: string }[] = [];
  const now = Date.now();

  for (let d = 0; d < horizonDays; d++) {
    const day = new Date(fromDate);
    day.setUTCDate(day.getUTCDate() + d);
    const dateStr = day.toISOString().slice(0, 10);
    if (blackoutDates.has(dateStr)) continue;

    const dayKey = DAY_KEYS[day.getUTCDay()];
    const dayConfig = availability.weekly?.[dayKey];
    if (!dayConfig?.enabled) continue;

    const startMin = parseTimeToMinutes(dayConfig.start);
    const endMin = parseTimeToMinutes(dayConfig.end);
    const step = duration + buffer;

    for (let m = startMin; m + duration <= endMin; m += step) {
      const slotStart = buildUtcFromCoachLocal(dateStr, m);
      const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);

      if (slotStart.getTime() < now + minNoticeMs) continue;

      const slotKey = `${slotStart.toISOString()}_${duration}`;
      const taken = await Booking.findOne({
        slotKey,
        status: { $in: ["pending", "confirmed"] },
      }).lean();
      if (taken) continue;

      const label = formatSlotLabel(slotStart, slotEnd, visitorTimeZone);
      slots.push({
        slotKey,
        startUtc: slotStart.toISOString(),
        endUtc: slotEnd.toISOString(),
        label,
      });
    }
  }

  return slots.slice(0, 80);
}

function buildUtcFromCoachLocal(
  dateStr: string,
  minutesFromMidnight: number
): Date {
  const h = Math.floor(minutesFromMidnight / 60);
  const m = minutesFromMidnight % 60;
  const isoLocal = `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  return new Date(isoLocal + "Z");
}

function formatSlotLabel(start: Date, end: Date, tz: string): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    const fmtEnd = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
    });
    return `${fmt.format(start)} – ${fmtEnd.format(end)} (${tz})`;
  } catch {
    return start.toISOString();
  }
}

export async function reserveSlot(params: {
  slotKey: string;
  startUtc: Date;
  endUtc: Date;
  name: string;
  email: string;
  visitorTimeZone: string;
}): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  await connectMongo();

  const existing = await Booking.findOne({
    slotKey: params.slotKey,
    status: { $in: ["pending", "confirmed"] },
  });

  if (existing) {
    return { ok: false, message: "That time was just taken. Please choose another slot." };
  }

  try {
    const booking = await Booking.create({
      type: "consultation",
      status: "confirmed",
      name: params.name,
      email: params.email,
      visitorTimeZone: params.visitorTimeZone,
      startUtc: params.startUtc,
      endUtc: params.endUtc,
      slotKey: params.slotKey,
      notificationStatus: "pending",
    });
    return { ok: true, id: booking._id.toString() };
  } catch (e) {
    if ((e as { code?: number }).code === 11000) {
      return { ok: false, message: "That time was just taken. Please choose another slot." };
    }
    throw e;
  }
}
