import { registerModel } from "@/lib/register-model";
import { Schema, Types } from "mongoose";

export interface IProduct {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: "CAD";
  category?: string;
  published: boolean;
  order: number;
  imageMediaId?: Types.ObjectId | null;
  imageUrl?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    priceCents: { type: Number, required: true },
    currency: { type: String, default: "CAD", enum: ["CAD"] },
    category: String,
    published: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0 },
    imageMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", default: null },
    imageUrl: String,
  },
  { timestamps: true }
);

export const Product =
  registerModel<IProduct>("Product", ProductSchema);
