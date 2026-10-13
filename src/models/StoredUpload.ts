import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export type StoredUploadFolder = "products" | "gallery" | "pages" | "misc";

export interface IStoredUpload {
  folder: StoredUploadFolder;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
}

const StoredUploadSchema = new Schema<IStoredUpload>(
  {
    folder: {
      type: String,
      required: true,
      enum: ["products", "gallery", "pages", "misc"],
      index: true,
    },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export const StoredUpload = registerModel<IStoredUpload>(
  "StoredUpload",
  StoredUploadSchema
);
