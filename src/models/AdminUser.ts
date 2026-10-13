import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface IAdminUser {
  email: string;
  name: string;
  passwordHash: string;
  failedLoginAttempts: number;
  lockUntil?: Date | null;
  lastLoginAt?: Date | null;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const AdminUser =
  registerModel<IAdminUser>("AdminUser", AdminUserSchema);
