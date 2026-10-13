import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "cancelled"
  | "completed";

export interface IBooking {
  type: "consultation";
  status: BookingStatus;
  name: string;
  email: string;
  visitorTimeZone: string;
  preferredNotes?: string;
  startUtc?: Date | null;
  endUtc?: Date | null;
  slotKey?: string | null;
  meetingLink?: string;
  adminNotes?: string;
  notificationStatus: "pending" | "sent" | "failed";
  notificationError?: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    type: { type: String, default: "consultation", enum: ["consultation"] },
    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    visitorTimeZone: { type: String, required: true },
    preferredNotes: String,
    startUtc: { type: Date, default: null, index: true },
    endUtc: { type: Date, default: null },
    slotKey: { type: String, default: null, sparse: true, unique: true },
    meetingLink: String,
    adminNotes: String,
    notificationStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    notificationError: String,
  },
  { timestamps: true }
);

BookingSchema.index({ startUtc: 1, endUtc: 1, status: 1 });

export const Booking =
  registerModel<IBooking>("Booking", BookingSchema);
