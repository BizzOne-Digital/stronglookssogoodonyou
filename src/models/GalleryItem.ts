import { registerModel } from "@/lib/register-model";
import { Schema, Types } from "mongoose";

export type GalleryCategory =
  | "Training"
  | "Competition"
  | "Portraits"
  | "Brand";

export interface IGalleryItem {
  mediaId: Types.ObjectId;
  category: GalleryCategory;
  caption?: string;
  order: number;
  published: boolean;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", required: true },
    category: {
      type: String,
      enum: ["Training", "Competition", "Portraits", "Brand"],
      required: true,
      index: true,
    },
    caption: String,
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const GalleryItem =
  registerModel<IGalleryItem>("GalleryItem", GalleryItemSchema);
