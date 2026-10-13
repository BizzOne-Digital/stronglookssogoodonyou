import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getUploadSignature } from "@/lib/cloudinary";

export async function POST() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sig = await getUploadSignature({ folder: "slgoy" });
  if (!sig) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 });
  }

  return NextResponse.json(sig);
}
