"use client";

import { useState } from "react";

export function MediaUploader({
  onUploaded,
}: {
  onUploaded: (asset: {
    id: string;
    secureUrl: string;
    cloudinaryPublicId: string;
  }) => void;
}) {
  const [progress, setProgress] = useState<string>("");

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/") || file.type.includes("svg")) {
      setProgress("Only non-SVG images allowed.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setProgress("Max 8MB.");
      return;
    }

    setProgress("Preparing…");
    const sigRes = await fetch("/api/admin/upload/signature", { method: "POST" });
    if (!sigRes.ok) {
      setProgress("Upload not configured.");
      return;
    }
    const sig = await sigRes.json();

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.apiKey);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);
    form.append("folder", sig.folder);

    setProgress("Uploading…");
    const up = await fetch(
      `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
      { method: "POST", body: form }
    );
    const data = await up.json();
    if (!up.ok) {
      setProgress(data.error?.message || "Upload failed");
      return;
    }

    const confirm = await fetch("/api/admin/media/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cloudinaryPublicId: data.public_id,
        url: data.url,
        secureUrl: data.secure_url,
        width: data.width,
        height: data.height,
        format: data.format,
        bytes: data.bytes,
        alt: file.name,
      }),
    });
    const confirmed = await confirm.json();
    if (!confirm.ok) {
      setProgress("Could not save media record.");
      return;
    }

    setProgress("Uploaded.");
    onUploaded({
      id: confirmed.id,
      secureUrl: data.secure_url,
      cloudinaryPublicId: data.public_id,
    });
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
        }}
      />
      {progress && <p className="mt-2 text-sm text-black/60">{progress}</p>}
    </div>
  );
}
