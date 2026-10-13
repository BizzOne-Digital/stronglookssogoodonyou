import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface IMediaAsset {
  cloudinaryPublicId: string;
  url: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  alt: string;
  focalX?: number;
  focalY?: number;
  folder?: string;
  usageCount: number;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    cloudinaryPublicId: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    width: Number,
    height: Number,
    format: String,
    bytes: Number,
    alt: { type: String, default: "" },
    focalX: { type: Number, default: 0.5 },
    focalY: { type: Number, default: 0.5 },
    folder: String,
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const MediaAsset =
  registerModel<IMediaAsset>("MediaAsset", MediaAssetSchema);
