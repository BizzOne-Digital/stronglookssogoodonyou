import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface ISiteSettings {
  key: string;
  showCoachingPrices: boolean;
  showShop: boolean;
  bookingMode: "request_only" | "available_slots";
  coachingTimeZone: string;
  consultationDurationMinutes: number;
  minimumNoticeHours: number;
  bookingHorizonDays: number;
  bufferMinutes: number;
  packageTermsHtml: string;
  seoDefaults: {
    title?: string;
    description?: string;
  };
  footerTagline?: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, default: "default", unique: true },
    showCoachingPrices: { type: Boolean, default: false },
    showShop: { type: Boolean, default: false },
    bookingMode: {
      type: String,
      enum: ["request_only", "available_slots"],
      default: "request_only",
    },
    coachingTimeZone: { type: String, default: "America/Toronto" },
    consultationDurationMinutes: { type: Number, default: 30 },
    minimumNoticeHours: { type: Number, default: 24 },
    bookingHorizonDays: { type: Number, default: 60 },
    bufferMinutes: { type: Number, default: 15 },
    packageTermsHtml: { type: String, default: "" },
    seoDefaults: {
      title: String,
      description: String,
    },
    footerTagline: String,
  },
  { timestamps: true }
);

export const SiteSettings =
  registerModel<ISiteSettings>("SiteSettings", SiteSettingsSchema);
