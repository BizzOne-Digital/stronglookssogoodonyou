"use client";

import Image from "next/image";
import {
  deleteGalleryItem,
  ensureLocalMediaAsset,
  upsertGalleryItem,
} from "@/lib/actions/admin";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { resolvePublicImageSrc } from "@/lib/image-url";
import { useState } from "react";

const CATEGORIES = ["Training", "Competition", "Portraits", "Brand"] as const;

export type GalleryAdminItem = {
  id: string;
  imageUrl: string;
  alt: string;
  category: string;
  caption?: string;
  order: number;
  published: boolean;
};

export function GalleryAdmin({ items }: { items: GalleryAdminItem[] }) {
  const [list, setList] = useState(items);
  const [draft, setDraft] = useState({
    imageUrl: "",
    alt: "",
    category: "Competition" as string,
    caption: "",
    order: list.length,
    published: true,
  });

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((item) => (
          <div key={item.id} className="rounded border bg-white p-3 text-sm">
            <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
              {item.imageUrl.startsWith("/api/uploads/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={resolvePublicImageSrc(item.imageUrl)}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              )}
            </div>
            <p className="mt-2 font-medium">{item.category}</p>
            <p className="text-black/60">{item.caption || item.alt}</p>
            <p className="text-xs text-black/45">
              Order {item.order} · {item.published ? "Published" : "Hidden"}
            </p>
            <button
              type="button"
              className="mt-2 text-hot-fuchsia"
              onClick={async () => {
                if (confirm("Delete this gallery item?")) {
                  await deleteGalleryItem(item.id);
                  setList(list.filter((x) => x.id !== item.id));
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="rounded border bg-white p-4">
        <p className="font-medium">Add gallery image</p>
        <p className="mt-1 text-xs text-black/55">
          Uploads are stored in MongoDB and served from <code>/api/uploads/gallery/…</code> (safe on Vercel).
        </p>

        <AdminImageField
          label="Gallery photo"
          folder="gallery"
          value={draft.imageUrl}
          onChange={(url) => setDraft({ ...draft, imageUrl: url })}
        />

        <input
          className="input-field"
          placeholder="Alt text"
          value={draft.alt}
          onChange={(e) => setDraft({ ...draft, alt: e.target.value })}
        />
        <input
          className="input-field"
          placeholder="Caption (optional)"
          value={draft.caption}
          onChange={(e) => setDraft({ ...draft, caption: e.target.value })}
        />
        <select
          className="input-field"
          value={draft.category}
          onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
          />
          Published
        </label>
        <button
          type="button"
          className="mt-4 bg-power-black px-4 py-2 text-xs text-white uppercase disabled:opacity-50"
          disabled={!draft.imageUrl}
          onClick={async () => {
            const alt = draft.alt || draft.caption || "Gallery image";
            const media = await ensureLocalMediaAsset(draft.imageUrl, alt);
            await upsertGalleryItem(null, {
              mediaId: media.id,
              category: draft.category,
              caption: draft.caption,
              order: draft.order,
              published: draft.published,
            });
            window.location.reload();
          }}
        >
          Save image
        </button>
      </div>
    </div>
  );
}
