"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { StoredUploadFolder } from "@/models/StoredUpload";
import { resolvePublicImageSrc } from "@/lib/image-url";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif";

async function deleteManagedUpload(url: string) {
  if (!url.startsWith("/api/uploads/")) return;
  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

type Toast = { type: "success" | "error"; message: string };

export function AdminImageField({
  value,
  onChange,
  folder,
  label = "Image",
  fallbackPreview = "/images/ambient/01-gym-power-rack.jpg",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: StoredUploadFolder;
  label?: string;
  fallbackPreview?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((next: Toast) => {
    setToast(next);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(t);
  }, [toast]);

  const previewSrc = value
    ? resolvePublicImageSrc(value, fallbackPreview)
    : "";

  const uploadFile = async (file: File) => {
    if (!ACCEPT.split(",").includes(file.type)) {
      showToast({ type: "error", message: "Use PNG, JPEG, WebP, or GIF." });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      showToast({ type: "error", message: "Max file size is 8MB." });
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showToast({
          type: "error",
          message: typeof data.error === "string" ? data.error : "Upload failed",
        });
        return;
      }

      const nextUrl = typeof data.url === "string" ? data.url : "";
      if (!nextUrl) {
        showToast({ type: "error", message: "Upload response was invalid." });
        return;
      }

      if (value && value !== nextUrl) {
        await deleteManagedUpload(value);
      }

      onChange(nextUrl);
      showToast({ type: "success", message: "Image uploaded." });
    } catch {
      showToast({ type: "error", message: "Upload failed. Try again." });
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    if (!value) return;
    if (value.startsWith("/api/uploads/")) {
      setUploading(true);
      try {
        const res = await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
        if (!res.ok) {
          showToast({ type: "error", message: "Could not remove stored image." });
          return;
        }
      } catch {
        showToast({ type: "error", message: "Could not remove stored image." });
        return;
      } finally {
        setUploading(false);
      }
    }
    onChange("");
    showToast({ type: "success", message: "Image removed." });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase text-black/70">{label}</p>

      {previewSrc ? (
        <div className="relative aspect-video max-w-sm overflow-hidden rounded border bg-black/5">
          {previewSrc.startsWith("/api/uploads/") ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview of Mongo-backed bytes
            <img
              src={previewSrc}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={previewSrc}
              alt=""
              fill
              className="object-cover"
              sizes="320px"
            />
          )}
        </div>
      ) : (
        <p className="text-sm text-black/50">No image selected.</p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label
          className={`cursor-pointer bg-power-black px-4 py-2 text-xs text-white uppercase ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
          <input
            type="file"
            accept={ACCEPT}
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) uploadFile(f);
            }}
          />
        </label>
        {value && (
          <button
            type="button"
            className="text-xs text-hot-fuchsia disabled:opacity-50"
            disabled={uploading}
            onClick={remove}
          >
            Remove
          </button>
        )}
      </div>

      {value && (
        <p className="break-all text-xs text-black/45">{value}</p>
      )}

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[100] max-w-sm rounded px-4 py-3 text-sm shadow-lg ${
            toast.type === "success"
              ? "bg-power-black text-white"
              : "bg-hot-fuchsia text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
