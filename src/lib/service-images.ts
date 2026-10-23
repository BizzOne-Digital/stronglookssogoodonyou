import { SITE_IMAGES } from "@/lib/site-images";
import type { PresentationKind } from "@/lib/image-presentations";

export type PackageImage = {
  src: string;
  alt: string;
  presentation: PresentationKind;
  /** Keeps faces visible in crops (e.g. package cards). */
  objectPosition?: string;
};

const POOL_LIFESTYLE = "/images/packages/lifestyle-transformation.png";

/** Fallback package imagery when admin has not set imageUrl. */
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
    src: "/images/packages/lifestyle-studio-red.png",
    alt: "Joanna Michel training in a gym studio",
    presentation: "personal",
    objectPosition: "object-top",
  },
  "bodybuilding-competition-prep": {
    src: "/images/packages/bodybuilding-top-five.png",
    alt: "Joanna Michel with Canada's national pro qualifier top five on stage",
    presentation: "competition",
    objectPosition: "object-top",
  },
};

/** Extra package photos on Services when admin has not set a custom primary image. */
export const PACKAGE_GALLERY_BY_SLUG: Record<string, PackageImage[]> = {
  "lifestyle-transformation": [
    {
      src: POOL_LIFESTYLE,
      alt: "Joanna Michel poolside celebrating fitness lifestyle",
      presentation: "personal",
      objectPosition: "object-top",
    },
  ],
  "bodybuilding-competition-prep": [
    {
      src: "/images/packages/bodybuilding-top-five.png",
      alt: "Joanna Michel with Canada's national pro qualifier top five on stage",
      presentation: "competition",
      objectPosition: "object-top",
    },
    {
      src: "/images/gallery/16-competition-stage-solo.png",
      alt: "Joanna Michel posing on stage at a regional physique championship",
      presentation: "competition",
      objectPosition: "object-top",
    },
  ],
};

export function resolvePackageImage(
  slug: string,
  imageUrl?: string | null,
  name?: string
): PackageImage {
  const defaults = PACKAGE_IMAGES_BY_SLUG[slug];

  if (imageUrl?.trim()) {
    return {
      src: imageUrl,
      alt: name || defaults?.alt || "Coaching package",
      presentation: defaults?.presentation ?? "ambient",
      objectPosition: defaults?.objectPosition,
    };
  }

  if (defaults) {
    return {
      src: defaults.src,
      alt: defaults.alt,
      presentation: defaults.presentation,
      objectPosition: defaults.objectPosition,
    };
  }

  return {
    src: SITE_IMAGES.gymWide,
    alt: name || "Coaching package",
    presentation: "ambient",
  };
}

export function resolvePackageGallery(
  slug: string,
  imageUrl?: string | null,
  name?: string
): PackageImage[] {
  const primary = resolvePackageImage(slug, imageUrl, name);
  const extras = PACKAGE_GALLERY_BY_SLUG[slug] ?? [];

  if (imageUrl?.trim()) {
    const additional = extras.filter((img) => img.src !== primary.src);
    return additional.length ? [primary, ...additional] : [primary];
  }

  if (extras.length) {
    return extras;
  }

  return [primary];
}
