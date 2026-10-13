import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { PublicGalleryImage } from "@/lib/data/public";

export function HomeGalleryPreview({ images }: { images: PublicGalleryImage[] }) {
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
              Competition wins, training days, and brand moments from Joanna&apos;s journey—see the full collection on the gallery page.
            </p>
          </div>
          <Button href="/gallery" variant="secondary" className="shrink-0 self-start md:self-auto">
            View full gallery
          </Button>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {images.map((img) => (
            <Link
              key={img.id}
              href="/gallery"
              className="group relative aspect-[4/5] overflow-hidden bg-power-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-hot-fuchsia md:aspect-[3/4]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width:768px) 50vw, 33vw"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-power-black/80 to-transparent p-3 pt-8 text-xs uppercase tracking-widest text-clean-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.caption}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
