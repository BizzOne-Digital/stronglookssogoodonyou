import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { PublicGalleryImage } from "@/lib/data/public";
import {
  categoryToPresentation,
  presentationClasses,
} from "@/lib/image-presentations";

function PreviewTile({ img }: { img: PublicGalleryImage }) {
  const kind = categoryToPresentation(img.category);
  const { aspect, frame, image } = presentationClasses(kind);

  return (
    <Link
      href="/gallery"
      className={`group relative ${aspect} ${frame} focus-visible:outline focus-visible:outline-2 focus-visible:outline-hot-fuchsia`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className={image}
        sizes="(max-width:768px) 50vw, 33vw"
      />
      {img.caption && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-power-black/80 to-transparent p-3 pt-8 text-xs uppercase tracking-widest text-clean-white opacity-0 transition-opacity group-hover:opacity-100">
          {img.caption}
        </span>
      )}
    </Link>
  );
}

export function HomeGalleryPreview({ images }: { images: PublicGalleryImage[] }) {
  const personal = images.filter((i) => i.category !== "Competition");
  const competition = images.filter((i) => i.category === "Competition");

  return (
    <section className="bg-clean-white py-20 text-power-black md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xs tracking-[0.4em] text-hot-fuchsia">GALLERY</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-tight md:text-5xl">
              On stage &amp; in the gym
            </h2>
            <p className="mt-4 max-w-xl text-power-black/75">
              Personal training moments and competition highlights from Joanna&apos;s journey. See the full collection on the gallery page.
            </p>
          </div>
          <Button href="/gallery" variant="secondary" className="shrink-0 self-start md:self-auto">
            View full gallery
          </Button>
        </div>

        {personal.length > 0 && (
          <div className="mt-12">
            <p className="font-display text-xs tracking-[0.35em] text-power-black/50">LIFE &amp; TRAINING</p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {personal.map((img) => (
                <PreviewTile key={img.id} img={img} />
              ))}
            </div>
          </div>
        )}

        {competition.length > 0 && (
          <div className="mt-10">
            <p className="font-display text-xs tracking-[0.35em] text-power-black/50">COMPETITION</p>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4">
              {competition.map((img) => (
                <PreviewTile key={img.id} img={img} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
