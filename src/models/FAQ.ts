import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface IFAQ {
  question: string;
  answer: string;
  group: string;
  order: number;
  published: boolean;
  isDraft: boolean;
}

const FAQSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    group: { type: String, default: "General", index: true },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: false, index: true },
    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FAQ = registerModel<IFAQ>("FAQ", FAQSchema);
