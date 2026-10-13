import { registerModel } from "@/lib/register-model";
import { Schema, Types } from "mongoose";

export interface PageSection {
  id: string;
  type: string;
  visible: boolean;
  order: number;
  data: Record<string, unknown>;
}

export interface IPageContent {
  pageKey: string;
  title: string;
  metaDescription?: string;
  sections: PageSection[];
  heroMediaId?: Types.ObjectId | null;
  heroMobileMediaId?: Types.ObjectId | null;
}

const PageSectionSchema = new Schema(
  {
    id: String,
    type: String,
    visible: { type: Boolean, default: true },
    order: Number,
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const PageContentSchema = new Schema<IPageContent>(
  {
    pageKey: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    metaDescription: String,
    sections: [PageSectionSchema],
    heroMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", default: null },
    heroMobileMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", default: null },
  },
  { timestamps: true }
);

export const PageContent =
  registerModel<IPageContent>("PageContent", PageContentSchema);
