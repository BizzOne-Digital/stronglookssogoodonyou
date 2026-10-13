import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  /** full = edge-to-edge band; split = image beside copy */
  variant?: "full" | "split";
  imagePosition?: "left" | "right";
  aspect?: "video" | "square" | "portrait";
  className?: string;
  children?: ReactNode;
  dark?: boolean;
};

const aspectClass = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
};

export function SectionImageBand({
  src,
  alt,
  className = "",
}: Pick<Props, "src" | "alt" | "className">) {
  return (
    <div className={`relative h-[40vh] min-h-[240px] max-h-[520px] w-full overflow-hidden md:h-[50vh] ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" priority={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-power-black/50 via-transparent to-power-black/20" aria-hidden />
    </div>
  );
}

export function SectionImageSplit({
  src,
  alt,
  imagePosition = "right",
  aspect = "portrait",
  dark = false,
  children,
}: Props) {
  const bg = dark ? "bg-power-black text-clean-white" : "bg-clean-white text-power-black";
  const imageFirst = imagePosition === "left";

  return (
    <section className={`py-16 md:py-24 ${bg}`}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 md:gap-16 md:px-8">
        <div
          className={`relative ${aspectClass[aspect]} overflow-hidden ${imageFirst ? "md:order-1" : "md:order-2"}`}
        >
          <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
        </div>
        <div className={imageFirst ? "md:order-2" : "md:order-1"}>{children}</div>
      </div>
    </section>
  );
}
