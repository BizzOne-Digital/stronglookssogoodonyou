import Image from "next/image";
import {
  type PresentationKind,
  presentationClasses,
} from "@/lib/image-presentations";

type Props = {
  src: string;
  alt: string;
  presentation?: PresentationKind;
  priority?: boolean;
  sizes?: string;
  className?: string;
  quality?: number;
  objectPosition?: string;
};

export function FramedImage({
  src,
  alt,
  presentation = "ambient",
  priority,
  sizes = "(max-width:768px) 100vw, 50vw",
  className = "",
  quality = 90,
  objectPosition,
}: Props) {
  const { aspect, frame, image } = presentationClasses(presentation);
  const position = objectPosition ?? "object-center";
  const imageClass = image.replace(/\bobject-(center|top|bottom|left|right)\b/g, "").trim();

  return (
    <div className={`relative ${aspect} ${frame} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        quality={quality}
        className={`${imageClass} ${position}`}
      />
    </div>
  );
}
