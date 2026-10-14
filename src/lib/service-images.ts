import { SITE_IMAGES } from "@/lib/site-images";
import type { PresentationKind } from "@/lib/image-presentations";

export type PackageImage = {
  src: string;
  alt: string;
  presentation: PresentationKind;
};

/** Default package imagery (admin imageUrl overrides when set). */
export const PACKAGE_IMAGES_BY_SLUG: Record<string, PackageImage> = {
  "physique-reset": {
    src: SITE_IMAGES.gymPowerRack,
    alt: "Strength training in a commercial gym",
    presentation: "ambient",
  },
  "physique-transformation": {
    src: SITE_IMAGES.gymMatDumbbell,
    alt: "Focused gym training session",
    presentation: "ambient",
  },
  "lifestyle-transformation": {
    src: "/images/packages/lifestyle-transformation.png",
    alt: "Joanna Michel on stage at an IFBB professional league event in Toronto",
    presentation: "competition",
  },
  "bodybuilding-competition-prep": {
    src: "/images/packages/bodybuilding-competition-prep.png",
    alt: "Joanna Michel posing on stage at a natural bodybuilding championship",
    presentation: "competition",
  },
};

export function resolvePackageImage(
  slug: string,
  imageUrl?: string | null,
  name?: string
): PackageImage {
  const defaults = PACKAGE_IMAGES_BY_SLUG[slug];
  if (
    (slug === "bodybuilding-competition-prep" || slug === "lifestyle-transformation") &&
    defaults
  ) {
    return {
      src: defaults.src,
      alt: defaults.alt,
      presentation: defaults.presentation,
    };
  }
  if (imageUrl?.trim()) {
    return {
      src: imageUrl,
      alt: name || defaults?.alt || "Coaching package",
      presentation: defaults?.presentation ?? "ambient",
    };
  }
  return (
    defaults ?? {
      src: SITE_IMAGES.gymWide,
      alt: name || "Coaching package",
      presentation: "ambient",
    }
  );
}
