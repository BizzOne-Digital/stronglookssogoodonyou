import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface IContactInquiry {
  name: string;
  email: string;
  topic: string;
  message: string;
  privacyAcknowledged: boolean;
  read: boolean;
  notificationStatus: "pending" | "sent" | "failed";
  notificationError?: string;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    topic: { type: String, required: true },
    message: { type: String, required: true },
    privacyAcknowledged: { type: Boolean, required: true },
    read: { type: Boolean, default: false, index: true },
    notificationStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    notificationError: String,
  },
  { timestamps: true }
);

export const ContactInquiry =
  registerModel<IContactInquiry>("ContactInquiry", ContactInquirySchema);
