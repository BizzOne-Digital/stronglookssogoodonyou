"use server";

import { requireAdmin, logAdminAction } from "@/lib/admin";
import { prepareDb } from "@/lib/prepare-db";
import { revalidatePublicContent } from "@/lib/revalidate";
import { Service } from "@/models/Service";
import { Product } from "@/models/Product";
import { FAQ } from "@/models/FAQ";
import { Testimonial } from "@/models/Testimonial";
import { TeamMember } from "@/models/TeamMember";
import { GalleryItem } from "@/models/GalleryItem";
import { SiteSettings } from "@/models/SiteSettings";
import { PageContent } from "@/models/PageContent";
import { MediaAsset } from "@/models/MediaAsset";
import { CoachingApplication } from "@/models/CoachingApplication";
import { Booking } from "@/models/Booking";
import { sendBusinessNotification } from "@/lib/email";
import { destroyCloudinaryAsset } from "@/lib/cloudinary";
import { deleteStoredUploadByUrl } from "@/lib/stored-uploads";
import { adminTextToPlain } from "@/lib/admin-text";
import bcrypt from "bcryptjs";
import { AdminUser } from "@/models/AdminUser";
import { AvailabilitySettings, AvailabilityException } from "@/models/Availability";

async function guard() {
  const session = await requireAdmin();
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session;
}

export async function updateSiteSettings(data: {
  showCoachingPrices?: boolean;
  showShop?: boolean;
  bookingMode?: "request_only" | "available_slots";
  footerTagline?: string;
  packageTermsHtml?: string;
  seoDefaults?: { title?: string; description?: string };
}) {
  const session = await guard();
  await prepareDb();
  const payload = { ...data };
  if (payload.packageTermsHtml != null) {
    payload.packageTermsHtml = adminTextToPlain(payload.packageTermsHtml);
  }
  if (payload.footerTagline != null) {
    payload.footerTagline = adminTextToPlain(payload.footerTagline);
  }
  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    { $set: payload },
    { upsert: true }
  );
  await logAdminAction({
    adminEmail: session.user.email!,
    action: "update",
    entityType: "SiteSettings",
    summary: "Updated site settings",
  });
  revalidatePublicContent();
  return { ok: true };
}

export async function upsertService(id: string | null, payload: Record<string, unknown>) {
  const session = await guard();
  await prepareDb();
  const normalized = { ...payload };
  for (const key of [
    "description",
    "tagline",
    "idealFor",
    "exclusions",
    "name",
    "durationLabel",
  ] as const) {
    if (typeof normalized[key] === "string") {
      normalized[key] = adminTextToPlain(normalized[key] as string);
    }
  }
  if (Array.isArray(normalized.inclusions)) {
    normalized.inclusions = normalized.inclusions.map((line) =>
      typeof line === "string" ? adminTextToPlain(line) : line
    );
  }
  if (id) {
    await Service.findByIdAndUpdate(id, { $set: normalized });
  } else {
    await Service.create(normalized);
  }
  await logAdminAction({
    adminEmail: session.user.email!,
    action: id ? "update" : "create",
    entityType: "Service",
    entityId: id || undefined,
  });
  revalidatePublicContent();
  return { ok: true };
}

export async function deleteService(id: string) {
  const session = await guard();
  await prepareDb();
  await Service.findByIdAndDelete(id);
  await logAdminAction({
    adminEmail: session.user.email!,
    action: "delete",
    entityType: "Service",
    entityId: id,
  });
  revalidatePublicContent();
  return { ok: true };
}

export async function upsertProduct(id: string | null, payload: Record<string, unknown>) {
  await guard();
  await prepareDb();
  if (id) await Product.findByIdAndUpdate(id, { $set: payload });
  else await Product.create(payload);
  revalidatePublicContent();
  return { ok: true };
}

export async function deleteProduct(id: string) {
  await guard();
  await prepareDb();
  await Product.findByIdAndDelete(id);
  revalidatePublicContent();
  return { ok: true };
}

export async function upsertFaq(id: string | null, payload: Record<string, unknown>) {
  await guard();
  await prepareDb();
  const normalized = { ...payload };
  if (typeof normalized.answer === "string") {
    normalized.answer = adminTextToPlain(normalized.answer);
  }
  if (typeof normalized.question === "string") {
    normalized.question = adminTextToPlain(normalized.question);
  }
  if (id) await FAQ.findByIdAndUpdate(id, { $set: normalized });
  else await FAQ.create(normalized);
  revalidatePublicContent();
  return { ok: true };
}

export async function deleteFaq(id: string) {
  await guard();
  await prepareDb();
  await FAQ.findByIdAndDelete(id);
  revalidatePublicContent();
  return { ok: true };
}

export async function upsertTestimonial(id: string | null, payload: Record<string, unknown>) {
  await guard();
  await prepareDb();
  const normalized = { ...payload };
  if (typeof normalized.quote === "string") {
    normalized.quote = adminTextToPlain(normalized.quote);
  }
  if (typeof normalized.displayName === "string") {
    normalized.displayName = adminTextToPlain(normalized.displayName);
  }
  if (id) await Testimonial.findByIdAndUpdate(id, { $set: normalized });
  else await Testimonial.create(normalized);
  revalidatePublicContent();
  return { ok: true };
}

export async function deleteTestimonial(id: string) {
  await guard();
  await prepareDb();
  await Testimonial.findByIdAndDelete(id);
  revalidatePublicContent();
  return { ok: true };
}

export async function upsertTeamMember(id: string | null, payload: Record<string, unknown>) {
  await guard();
  await prepareDb();
  if (id) await TeamMember.findByIdAndUpdate(id, { $set: payload });
  else await TeamMember.create(payload);
  revalidatePublicContent();
  return { ok: true };
}

export async function deleteTeamMember(id: string) {
  await guard();
  await prepareDb();
  await TeamMember.findByIdAndDelete(id);
  revalidatePublicContent();
  return { ok: true };
}

export async function deleteManagedUpload(url: string) {
  await guard();
  const deleted = await deleteStoredUploadByUrl(url);
  return { ok: deleted };
}

export async function ensureLocalMediaAsset(secureUrl: string, alt: string) {
  await guard();
  await prepareDb();
  const publicId = `local${secureUrl.replace(/[^a-zA-Z0-9]+/g, "_")}`;
  const doc = await MediaAsset.findOneAndUpdate(
    { cloudinaryPublicId: publicId },
    {
      $set: {
        cloudinaryPublicId: publicId,
        url: secureUrl,
        secureUrl,
        alt,
      },
    },
    { upsert: true, new: true }
  );
  return { ok: true, id: doc._id.toString() };
}

export async function upsertGalleryItem(id: string | null, payload: Record<string, unknown>) {
  await guard();
  await prepareDb();
  if (id) await GalleryItem.findByIdAndUpdate(id, { $set: payload });
  else await GalleryItem.create(payload);
  revalidatePublicContent();
  return { ok: true };
}

export async function deleteGalleryItem(id: string) {
  await guard();
  await prepareDb();
  await GalleryItem.findByIdAndDelete(id);
  revalidatePublicContent();
  return { ok: true };
}

export async function savePageContent(
  pageKey: string,
  data: { title?: string; metaDescription?: string; sections?: unknown[] }
) {
  await guard();
  await prepareDb();
  const sections = data.sections?.map((section) => {
    const s = section as {
      type?: string;
      data?: { body?: string; html?: string };
    };
    if (s.type !== "text" && s.type !== "richText") return section;
    const raw = s.data?.body ?? s.data?.html ?? "";
    const body = adminTextToPlain(raw);
    return {
      ...(section as object),
      type: "text",
      data: { body },
    };
  });
  await PageContent.findOneAndUpdate(
    { pageKey },
    {
      $set: {
        ...data,
        sections: sections ?? data.sections,
        metaDescription: data.metaDescription
          ? adminTextToPlain(data.metaDescription)
          : data.metaDescription,
        title: data.title ? adminTextToPlain(data.title) : data.title,
      },
    },
    { upsert: true }
  );
  revalidatePublicContent();
  return { ok: true };
}

export async function registerMediaAsset(payload: {
  cloudinaryPublicId: string;
  url: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  alt?: string;
  folder?: string;
}) {
  await guard();
  await prepareDb();
  const doc = await MediaAsset.findOneAndUpdate(
    { cloudinaryPublicId: payload.cloudinaryPublicId },
    { $set: payload },
    { upsert: true, new: true }
  );
  return { ok: true, id: doc._id.toString() };
}

export async function deleteMediaAsset(id: string) {
  const session = await guard();
  await prepareDb();
  const asset = await MediaAsset.findById(id);
  if (!asset) throw new Error("Not found");
  if (asset.usageCount > 0) {
    throw new Error("Asset is still in use");
  }
  try {
    await destroyCloudinaryAsset(asset.cloudinaryPublicId);
  } catch {
    // cloudinary may be unconfigured in dev
  }
  await MediaAsset.findByIdAndDelete(id);
  await logAdminAction({
    adminEmail: session.user.email!,
    action: "delete",
    entityType: "MediaAsset",
    entityId: id,
  });
  return { ok: true };
}

export async function retryApplicationNotification(id: string) {
  const session = await guard();
  await prepareDb();
  const doc = await CoachingApplication.findById(id);
  if (!doc) throw new Error("Not found");
  const mail = await sendBusinessNotification({
    subject: `Coaching application: ${doc.fullName}`,
    text: `Application from ${doc.fullName} (${doc.email})\n\n/admin/applications/${id}`,
    replyTo: doc.email,
  });
  doc.notificationStatus = mail.ok ? "sent" : "failed";
  doc.notificationError = mail.ok ? undefined : mail.error;
  await doc.save();
  await logAdminAction({
    adminEmail: session.user.email!,
    action: "retry_notification",
    entityType: "CoachingApplication",
    entityId: id,
  });
  return { ok: mail.ok };
}

export async function updateBookingStatus(
  id: string,
  status: "pending" | "confirmed" | "declined" | "cancelled" | "completed",
  meetingLink?: string
) {
  await guard();
  await prepareDb();
  await Booking.findByIdAndUpdate(id, {
    $set: { status, meetingLink },
    ...(status === "cancelled" ? { slotKey: null } : {}),
  });
  return { ok: true };
}

export async function changeAdminPassword(currentPassword: string, newPassword: string) {
  const session = await guard();
  if (newPassword.length < 12) throw new Error("Password too short");
  await prepareDb();
  const user = await AdminUser.findById(session.user.id);
  if (!user) throw new Error("User not found");
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new Error("Current password incorrect");
  user.passwordHash = await bcrypt.hash(newPassword, 12);
  await user.save();
  return { ok: true };
}

export async function saveAvailabilityWeekly(weekly: Record<string, unknown>) {
  await guard();
  await prepareDb();
  await AvailabilitySettings.findOneAndUpdate(
    { key: "default" },
    { $set: { weekly } },
    { upsert: true }
  );
  return { ok: true };
}

export async function addAvailabilityException(payload: {
  date: string;
  type: "blackout" | "custom";
  start?: string;
  end?: string;
  note?: string;
}) {
  await guard();
  await prepareDb();
  await AvailabilityException.create(payload);
  return { ok: true };
}
