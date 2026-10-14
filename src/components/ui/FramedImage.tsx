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
};

export function FramedImage({
  src,
  alt,
  presentation = "ambient",
  priority,
  sizes = "(max-width:768px) 100vw, 50vw",
  className = "",
}: Props) {
  const { aspect, frame, image } = presentationClasses(presentation);

  return (
    <div className={`relative ${aspect} ${frame} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={image}
      />
    </div>
  );
}
