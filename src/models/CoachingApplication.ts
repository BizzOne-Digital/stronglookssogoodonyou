import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface ICoachingApplication {
  fullName: string;
  email: string;
  isAdult: boolean;
  country: string;
  timeZone: string;
  preferredPackage: string;
  trainingExperience: string;
  mainGoals: string;
  trainingDays: string;
  equipmentAccess: string;
  lifestyleNotes: string;
  contactMethod: "email" | "instagram";
  instagramHandle?: string;
  additionalMessage?: string;
  privacyAcknowledged: boolean;
  status: "new" | "reviewed" | "archived";
  notificationStatus: "pending" | "sent" | "failed";
  notificationError?: string;
  read: boolean;
}

const CoachingApplicationSchema = new Schema<ICoachingApplication>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    isAdult: { type: Boolean, required: true },
    country: { type: String, required: true },
    timeZone: { type: String, required: true },
    preferredPackage: { type: String, required: true },
    trainingExperience: { type: String, required: true },
    mainGoals: { type: String, required: true },
    trainingDays: { type: String, required: true },
    equipmentAccess: { type: String, required: true },
    lifestyleNotes: { type: String, required: true },
    contactMethod: { type: String, enum: ["email", "instagram"], required: true },
    instagramHandle: String,
    additionalMessage: String,
    privacyAcknowledged: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["new", "reviewed", "archived"],
      default: "new",
      index: true,
    },
    notificationStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    notificationError: String,
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const CoachingApplication =
  registerModel<ICoachingApplication>("CoachingApplication", CoachingApplicationSchema);
