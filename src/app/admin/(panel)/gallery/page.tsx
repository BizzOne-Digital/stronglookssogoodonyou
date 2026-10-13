import { GalleryAdmin } from "@/components/admin/GalleryAdmin";
import { prepareDb } from "@/lib/prepare-db";
import { GalleryItem } from "@/models/GalleryItem";

export const instant = false;

export default async function GalleryAdminPage() {
  await prepareDb();
  const items = await GalleryItem.find().sort({ order: 1 }).populate("mediaId").lean();

  const rows = items
    .map((item) => {
      const media = item.mediaId as { secureUrl?: string; alt?: string } | null;
      if (!media?.secureUrl) return null;
      return {
        id: item._id.toString(),
        imageUrl: media.secureUrl,
        alt: media.alt || item.caption || "Gallery image",
        category: item.category,
        caption: item.caption,
        order: item.order,
        published: item.published,
      };
    })
    .filter(Boolean) as import("@/components/admin/GalleryAdmin").GalleryAdminItem[];

  return (
    <div>
      <h1 className="font-display text-3xl uppercase">Gallery</h1>
      <p className="mt-2 text-sm text-black/60">
        Images shown on the public gallery page. Reorder by editing order values (editor coming soon) or re-seed from static files.
      </p>
      <GalleryAdmin items={rows} />
    </div>
  );
}
