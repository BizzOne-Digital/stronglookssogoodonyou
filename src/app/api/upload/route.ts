import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prepareDb } from "@/lib/prepare-db";
import { StoredUpload } from "@/models/StoredUpload";
import {
  UPLOAD_MAX_BYTES,
  UPLOAD_MIME_TYPES,
  buildManagedUploadUrl,
  deleteStoredUploadByUrl,
  generateUploadFilename,
  isUploadFolder,
  parseManagedUploadUrl,
} from "@/lib/stored-uploads";

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const folderRaw = String(formData.get("folder") ?? "");
  if (!isUploadFolder(folderRaw)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }
  const folder = folderRaw;

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  let mimeType = file.type;
  if (!UPLOAD_MIME_TYPES[mimeType]) {
    const name = file.name.toLowerCase();
    if (name.endsWith(".jpg") || name.endsWith(".jpeg")) mimeType = "image/jpeg";
    else if (name.endsWith(".png")) mimeType = "image/png";
    else if (name.endsWith(".webp")) mimeType = "image/webp";
    else if (name.endsWith(".gif")) mimeType = "image/gif";
  }
  if (!UPLOAD_MIME_TYPES[mimeType]) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  if (file.size > UPLOAD_MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 8MB limit" }, { status: 400 });
  }

  const filename = generateUploadFilename(mimeType);
  if (!filename) {
    return NextResponse.json({ error: "Could not determine file extension" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const data = Buffer.from(arrayBuffer);

  await prepareDb();

  try {
    await StoredUpload.create({
      folder,
      filename,
      mimeType,
      size: data.length,
      data,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const url = buildManagedUploadUrl(folder, filename);

  return NextResponse.json({
    success: true,
    url,
    filename,
    size: data.length,
    folder,
  });
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let url: string | undefined;
  try {
    const body = await req.json();
    url = typeof body?.url === "string" ? body.url : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!url || !parseManagedUploadUrl(url)) {
    return NextResponse.json({ error: "Invalid upload URL" }, { status: 400 });
  }

  const deleted = await deleteStoredUploadByUrl(url);
  if (!deleted) {
    return NextResponse.json({ error: "Upload not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
