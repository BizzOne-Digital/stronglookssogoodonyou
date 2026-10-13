"use client";

import { MediaUploader } from "@/components/admin/MediaUploader";

export function MediaUploadSection() {
  return (
    <div className="mt-6 rounded border bg-white p-4">
      <p className="text-sm font-medium">Upload image</p>
      <MediaUploader onUploaded={() => window.location.reload()} />
    </div>
  );
}
