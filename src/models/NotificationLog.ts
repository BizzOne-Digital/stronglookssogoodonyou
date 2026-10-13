import { registerModel } from "@/lib/register-model";
import { Schema, Types } from "mongoose";

export interface INotificationLog {
  entityType: string;
  entityId: Types.ObjectId;
  channel: "email";
  status: "sent" | "failed";
  error?: string;
  subject?: string;
}

const NotificationLogSchema = new Schema<INotificationLog>(
  {
    entityType: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    channel: { type: String, enum: ["email"], default: "email" },
    status: { type: String, enum: ["sent", "failed"], required: true },
    error: String,
    subject: String,
  },
  { timestamps: true }
);

export const NotificationLog =
  registerModel<INotificationLog>("NotificationLog", NotificationLogSchema);
