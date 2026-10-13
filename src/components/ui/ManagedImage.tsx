import Image, { type ImageProps } from "next/image";
import { resolvePublicImageSrc } from "@/lib/image-url";

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallback: string;
};

/** next/image wrapper: legacy `/uploads/...` disk paths map to fallback. */
export function ManagedImage({ src, fallback, alt, ...rest }: Props) {
  const resolved = resolvePublicImageSrc(src, fallback);
  const unoptimized =
    rest.unoptimized ?? resolved.startsWith("/api/uploads/");

  return (
    <Image
      {...rest}
      src={resolved}
      alt={alt}
      unoptimized={unoptimized}
    />
  );
}
