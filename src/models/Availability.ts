import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface DayAvailability {
  enabled: boolean;
  start: string;
  end: string;
}

export interface IAvailabilitySettings {
  key: string;
  weekly: Record<string, DayAvailability>;
}

export interface IAvailabilityException {
  date: string;
  type: "blackout" | "custom";
  start?: string;
  end?: string;
  note?: string;
}

const DaySchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    start: { type: String, default: "09:00" },
    end: { type: String, default: "17:00" },
  },
  { _id: false }
);

const AvailabilitySettingsSchema = new Schema<IAvailabilitySettings>(
  {
    key: { type: String, default: "default", unique: true },
    weekly: {
      monday: { type: DaySchema, default: () => ({}) },
      tuesday: { type: DaySchema, default: () => ({}) },
      wednesday: { type: DaySchema, default: () => ({}) },
      thursday: { type: DaySchema, default: () => ({}) },
      friday: { type: DaySchema, default: () => ({}) },
      saturday: { type: DaySchema, default: () => ({}) },
      sunday: { type: DaySchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

const AvailabilityExceptionSchema = new Schema<IAvailabilityException>(
  {
    date: { type: String, required: true, index: true },
    type: { type: String, enum: ["blackout", "custom"], required: true },
    start: String,
    end: String,
    note: String,
  },
  { timestamps: true }
);

export const AvailabilitySettings =
  registerModel<IAvailabilitySettings>("AvailabilitySettings", AvailabilitySettingsSchema);

export const AvailabilityException =
  registerModel<IAvailabilityException>("AvailabilityException", AvailabilityExceptionSchema);
