import { registerModel } from "@/lib/register-model";
import { Schema } from "mongoose";

export interface IAdminAudit {
  adminEmail: string;
  action: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
}

const AdminAuditSchema = new Schema<IAdminAudit>(
  {
    adminEmail: { type: String, required: true, index: true },
    action: { type: String, required: true },
    entityType: String,
    entityId: String,
    summary: String,
  },
  { timestamps: true }
);

export const AdminAudit =
  registerModel<IAdminAudit>("AdminAudit", AdminAuditSchema);
