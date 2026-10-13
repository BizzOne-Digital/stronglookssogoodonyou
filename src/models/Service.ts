import { registerModel } from "@/lib/register-model";
import { Schema, Types } from "mongoose";

export interface IService {
  slug: string;
  name: string;
  durationLabel: string;
  tagline: string;
  description: string;
  inclusions: string[];
  idealFor: string;
  exclusions?: string;
  priceCents: number;
  currency: "CAD";
  showPrice: boolean;
  order: number;
  published: boolean;
  imageMediaId?: Types.ObjectId | null;
  imageUrl?: string;
  positioning?: string;
}

const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    durationLabel: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    inclusions: [{ type: String }],
    idealFor: { type: String, required: true },
    exclusions: String,
    priceCents: { type: Number, required: true },
    currency: { type: String, default: "CAD", enum: ["CAD"] },
    showPrice: { type: Boolean, default: true },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
    imageMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", default: null },
    imageUrl: String,
    positioning: String,
  },
  { timestamps: true }
);

export const Service =
  registerModel<IService>("Service", ServiceSchema);
