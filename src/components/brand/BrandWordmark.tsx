import Image from "next/image";
import { LOGO_IMAGE } from "@/lib/hero-assets";

type Props = {
  priority?: boolean;
  className?: string;
};

/** Full brush-style wordmark (same asset as the site logo). */
export function BrandWordmark({ priority, className = "" }: Props) {
  return (
    <Image
      src={LOGO_IMAGE}
      alt="Strong Looks Good On You"
      width={480}
      height={480}
      priority={priority}
      className={`h-auto w-full max-w-[min(100%,22rem)] object-contain md:max-w-md ${className}`}
    />
  );
}
