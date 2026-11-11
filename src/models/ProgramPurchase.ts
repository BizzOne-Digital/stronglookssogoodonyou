import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface IProgramPurchase {
  stripeSessionId: string;
  email: string;
  amountCents: number;
  currency: string;
  product: string;
  accessToken: string;
  emailStatus: "pending" | "sent" | "failed";
}

const ProgramPurchaseSchema = new Schema<IProgramPurchase>(
  {
    stripeSessionId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    amountCents: { type: Number, required: true },
    currency: { type: String, required: true },
    product: { type: String, required: true },
    accessToken: { type: String, required: true, unique: true, index: true },
    emailStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export const ProgramPurchase = registerModel<IProgramPurchase>("ProgramPurchase", ProgramPurchaseSchema);
