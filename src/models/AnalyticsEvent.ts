import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface IAnalyticsEvent {
  name: string;
  path?: string;
  source?: string;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    name: { type: String, required: true, index: true },
    path: String,
    source: String,
  },
  { timestamps: true }
);
AnalyticsEventSchema.index({ createdAt: -1 });

export const AnalyticsEvent = registerModel<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);
