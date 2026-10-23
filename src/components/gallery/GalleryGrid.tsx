"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import {
  categoryToPresentation,
  galleryTilePresentation,
  presentationClasses,
  type PresentationKind,
} from "@/lib/image-presentations";
import {
  filterImagesForGalleryPage,
  galleryDedupeKey,
  lineupGalleryRank,
} from "@/lib/gallery-static";

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: string;
  presentation?: PresentationKind;
};

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(images.map((i) => i.category)))];

  const seen = new Set<string>();
  const uniqueImages = filterImagesForGalleryPage(
    [...images]
      .sort((a, b) => lineupGalleryRank(a.src) - lineupGalleryRank(b.src))
      .filter((img) => {
        const key = galleryDedupeKey(img.src, img.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
  );

  const filtered =
    filter === "All" ? uniqueImages : uniqueImages.filter((i) => i.category === filter);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => {
    if (active === null) return;
    setActive((active - 1 + filtered.length) % filtered.length);
  }, [active, filtered.length]);
  const next = useCallback(() => {
    if (active === null) return;
    setActive((active + 1) % filtered.length);
  }, [active, filtered.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, next, prev]);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={`px-4 py-2 text-xs font-display tracking-widest uppercase border ${
              filter === c
                ? "border-hot-fuchsia bg-hot-fuchsia text-clean-white"
                : "border-power-black/20"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((img, idx) => {
          const { aspect, frame, image } = galleryTilePresentation(img);
          return (
            <button
              key={img.id}
              type="button"
              className={`group relative w-full ${aspect} ${frame} focus-visible:outline focus-visible:outline-2 focus-visible:outline-hot-fuchsia`}
              onClick={() => setActive(idx)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className={image}
                sizes="(max-width:768px) 100vw, 33vw"
                quality={90}
              />
            </button>
          );
        })}
      </div>
      {active !== null && filtered[active] && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-power-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            className="absolute right-4 top-4 font-display text-sm text-clean-white"
            onClick={close}
          >
            Close
          </button>
          <button type="button" className="absolute left-4 text-clean-white" onClick={prev} aria-label="Previous">
            ‹
          </button>
          <button type="button" className="absolute right-12 text-clean-white" onClick={next} aria-label="Next">
            ›
          </button>
          <div className="max-h-[85vh] max-w-5xl">
            {(() => {
              const activeImg = filtered[active];
              const tile = galleryTilePresentation(activeImg);
              return (
            <div
              className={`relative mx-auto max-h-[80vh] w-full max-w-4xl overflow-hidden ${tile.aspect} ${tile.frame}`}
            >
              <Image
                src={activeImg.src}
                alt={activeImg.alt}
                fill
                className={tile.image}
                sizes="90vw"
                quality={92}
              />
            </div>
              );
            })()}
            {filtered[active].caption && (
              <p className="mt-4 text-center text-sm text-soft-silver">
                {filtered[active].caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
