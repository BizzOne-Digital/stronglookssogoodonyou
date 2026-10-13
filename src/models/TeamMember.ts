import { registerModel } from "@/lib/register-model";
import { Schema, Types } from "mongoose";

export interface ITeamMember {
  name: string;
  role: string;
  bio: string;
  photoMediaId?: Types.ObjectId | null;
  order: number;
  published: boolean;
  isFounder: boolean;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    photoMediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset", default: null },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
    isFounder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const TeamMember =
  registerModel<ITeamMember>("TeamMember", TeamMemberSchema);
