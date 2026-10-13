import { PLACEHOLDER_IMAGES } from "@/lib/assets";

export type UploadFolderName = "products" | "gallery" | "pages" | "misc";

export const UPLOAD_FOLDER_NAMES: readonly UploadFolderName[] = [
  "products",
  "gallery",
  "pages",
  "misc",
];

export function isUploadFolderName(value: string): value is UploadFolderName {
  return (UPLOAD_FOLDER_NAMES as readonly string[]).includes(value);
}

export function parseManagedUploadUrl(
  url: string
): { folder: UploadFolderName; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match) return null;
  const folder = match[1];
  const filename = match[2];
  if (!isUploadFolderName(folder)) return null;
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  return { folder, filename };
}

export function buildManagedUploadUrl(folder: UploadFolderName, filename: string) {
  return `/api/uploads/${folder}/${filename}`;
}

export function isLegacyDiskUploadUrl(url: string) {
  return url.startsWith("/uploads/") && !url.startsWith("/api/uploads/");
}

export function isManagedUploadUrl(url: string) {
  return url.startsWith("/api/uploads/");
}

/** Use for `<Image src>` when stored URLs may point at removed disk uploads. */
export function resolvePublicImageSrc(
  url?: string | null,
  fallback: string = PLACEHOLDER_IMAGES.coaching
): string {
  if (!url?.trim()) return fallback;
  if (isLegacyDiskUploadUrl(url)) return fallback;
  return url;
}

/** Returns empty string when URL is missing or a broken legacy disk path. */
export function resolvePublicImageSrcOrEmpty(url?: string | null): string {
  if (!url?.trim()) return "";
  if (isLegacyDiskUploadUrl(url)) return "";
  return url;
}
