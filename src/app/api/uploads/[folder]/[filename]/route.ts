import { NextResponse } from "next/server";
import { prepareDb } from "@/lib/prepare-db";
import { StoredUpload } from "@/models/StoredUpload";
import {
  bufferFromStoredUploadData,
  isUploadFolder,
  sanitizeUploadFilename,
} from "@/lib/stored-uploads";

export async function GET(
  _req: Request,
  context: { params: Promise<{ folder: string; filename: string }> }
) {
  const { folder, filename } = await context.params;

  if (!isUploadFolder(folder) || !sanitizeUploadFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  await prepareDb();
  const doc = await StoredUpload.findOne({ folder, filename })
    .select("data mimeType size")
    .lean();
  if (!doc?.data) {
    return new NextResponse("Not found", { status: 404 });
  }

  const buf = bufferFromStoredUploadData(doc.data);
  if (!buf?.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = new Uint8Array(buf);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Length": String(doc.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
