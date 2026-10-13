import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongodb";
import { AdminAudit } from "@/models/AdminAudit";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session;
}

export async function logAdminAction(params: {
  adminEmail: string;
  action: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
}) {
  try {
    await connectMongo();
    await AdminAudit.create(params);
  } catch {
    // non-blocking
  }
}
