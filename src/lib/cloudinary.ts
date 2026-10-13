import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return true;
}

export async function getUploadSignature(params: {
  folder: string;
  publicId?: string;
}): Promise<{ timestamp: number; signature: string; apiKey: string; cloudName: string; folder: string } | null> {
  if (!configureCloudinary()) return null;

  const timestamp = Math.round(Date.now() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const apiKey = process.env.CLOUDINARY_API_KEY!;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;

  const toSign: Record<string, string | number> = {
    timestamp,
    folder: params.folder,
  };
  if (params.publicId) {
    toSign.public_id = params.publicId;
  }

  const signature = cloudinary.utils.api_sign_request(toSign, apiSecret);

  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder: params.folder,
  };
}

export async function destroyCloudinaryAsset(publicId: string) {
  if (!configureCloudinary()) {
    throw new Error("Cloudinary not configured");
  }
  return cloudinary.uploader.destroy(publicId, { invalidate: true });
}

export function cloudinaryUrl(
  publicId: string,
  options?: { width?: number; height?: number; crop?: string }
): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  const w = options?.width ? `w_${options.width},` : "";
  const h = options?.height ? `h_${options.height},` : "";
  const crop = options?.crop || "fill";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${w}${h}c_${crop},f_auto,q_auto/${publicId}`;
}
