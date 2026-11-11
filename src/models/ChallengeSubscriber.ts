import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface IChallengeSubscriber {
  firstName: string;
  email: string;
  accessToken: string;
  unsubscribeToken: string;
  disclaimerAcceptedAt: Date;
  disclaimerVersion: string;
  signupIp?: string;
  signupUserAgent?: string;
  source?: string;
  marketingConsent: boolean;
  marketingConsentAt?: Date;
  marketingConsentText?: string;
  unsubscribedAt?: Date;
  welcomeEmailStatus: "pending" | "sent" | "failed";
  followUpSentAt?: Date;
  followUpClaimedAt?: Date;
  createdAt?: Date;
}

const ChallengeSubscriberSchema = new Schema<IChallengeSubscriber>(
  {
    firstName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true },
    accessToken: { type: String, required: true, unique: true, index: true },
    unsubscribeToken: { type: String, required: true, unique: true, index: true },
    disclaimerAcceptedAt: { type: Date, required: true },
    disclaimerVersion: { type: String, required: true },
    signupIp: String,
    signupUserAgent: String,
    source: String,
    marketingConsent: { type: Boolean, default: false, index: true },
    marketingConsentAt: Date,
    marketingConsentText: String,
    unsubscribedAt: Date,
    welcomeEmailStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    followUpSentAt: Date,
    followUpClaimedAt: Date,
  },
  { timestamps: true }
);

export const ChallengeSubscriber = registerModel<IChallengeSubscriber>(
  "ChallengeSubscriber",
  ChallengeSubscriberSchema
);
