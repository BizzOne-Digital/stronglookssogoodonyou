import { prepareDb } from "@/lib/prepare-db";
import { StoredUpload, type StoredUploadFolder } from "@/models/StoredUpload";
import {
  isUploadFolderName,
  parseManagedUploadUrl,
  type UploadFolderName,
} from "@/lib/image-url";
import { randomBytes } from "crypto";

export type { StoredUploadFolder };
export { parseManagedUploadUrl, buildManagedUploadUrl } from "@/lib/image-url";

export const UPLOAD_FOLDERS: readonly StoredUploadFolder[] = [
  "products",
  "gallery",
  "pages",
  "misc",
];

export const UPLOAD_MAX_BYTES = 8 * 1024 * 1024;

export const UPLOAD_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isUploadFolder(value: string): value is StoredUploadFolder {
  return isUploadFolderName(value);
}

export function extFromMime(mimeType: string): string | null {
  return UPLOAD_MIME_TYPES[mimeType] ?? null;
}

export function generateUploadFilename(mimeType: string): string | null {
  const ext = extFromMime(mimeType);
  if (!ext) return null;
  const hex = randomBytes(8).toString("hex");
  return `${Date.now()}-${hex}.${ext}`;
}

export function sanitizeUploadFilename(filename: string): boolean {
  if (!filename || filename.includes("..")) return false;
  if (filename.includes("/") || filename.includes("\\")) return false;
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

export async function deleteStoredUploadByUrl(url: string): Promise<boolean> {
  const parsed = parseManagedUploadUrl(url);
  if (!parsed) return false;
  await prepareDb();
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder as UploadFolderName,
    filename: parsed.filename,
  });
  return result.deletedCount > 0;
}
