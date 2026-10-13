import { z } from "zod";

const honeypot = z.string().max(0).optional();

export const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  topic: z.string().min(2).max(120),
  message: z.string().min(10).max(5000),
  privacyAcknowledged: z.literal(true),
  website: honeypot,
});

export const applicationSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  isAdult: z.literal(true),
  country: z.string().min(2).max(100),
  timeZone: z.string().min(2).max(100),
  preferredPackage: z.string().min(1).max(200),
  trainingExperience: z.string().min(2).max(2000),
  mainGoals: z.string().min(10).max(3000),
  trainingDays: z.string().min(2).max(500),
  equipmentAccess: z.string().min(2).max(2000),
  lifestyleNotes: z.string().min(2).max(3000),
  contactMethod: z.enum(["email", "instagram"]),
  instagramHandle: z.string().max(100).optional(),
  additionalMessage: z.string().max(3000).optional(),
  privacyAcknowledged: z.literal(true),
  website: honeypot,
});

export const bookingRequestSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  visitorTimeZone: z.string().min(2).max(100),
  preferredNotes: z.string().min(5).max(2000),
  privacyAcknowledged: z.literal(true),
  website: honeypot,
});

export const bookingSlotSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  visitorTimeZone: z.string().min(2).max(100),
  slotKey: z.string().min(1),
  startUtc: z.string().datetime(),
  privacyAcknowledged: z.literal(true),
  website: honeypot,
});
