import { FramedImage } from "@/components/ui/FramedImage";
import type { PackageImage } from "@/lib/service-images";

export function PackageImageGrid({
  images,
  sizes = "(max-width:768px) 100vw, 50vw",
}: {
  images: PackageImage[];
  sizes?: string;
}) {
  if (images.length === 1) {
    const img = images[0];
    return (
      <FramedImage
        src={img.src}
        alt={img.alt}
        presentation={img.presentation}
        objectPosition={img.objectPosition}
        className="w-full"
        sizes={sizes}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((img) => (
        <FramedImage
          key={img.src}
          src={img.src}
          alt={img.alt}
          presentation={img.presentation}
          objectPosition={img.objectPosition}
          className="w-full"
          sizes={sizes}
        />
      ))}
    </div>
  );
}
