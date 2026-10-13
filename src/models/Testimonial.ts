import { registerModel } from "@/lib/register-model";
import { Schema, Types } from "mongoose";

export interface ITestimonial {
  displayName: string;
  quote: string;
  packageName?: string;
  photoMediaId?: Types.ObjectId | null;
  consent: boolean;
  featured: boolean;
  published: boolean;
  order: number;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    displayName: { type: String, required: true },
    quote: { type: String, required: true },
    packageName: String,
    photoMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", default: null },
    consent: { type: Boolean, default: false },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Testimonial =
  registerModel<ITestimonial>("Testimonial", TestimonialSchema);
