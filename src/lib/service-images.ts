import { SITE_IMAGES } from "@/lib/site-images";
import type { PresentationKind } from "@/lib/image-presentations";

export type PackageImage = {
  src: string;
  alt: string;
  presentation: PresentationKind;
  /** Keeps faces visible in crops (e.g. package cards). */
  objectPosition?: string;
};

const POOL_LIFESTYLE = "/images/gallery/08-training-pool.jpg";

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

/** Extra package photos shown on Services (client-provided). */
export const PACKAGE_GALLERY_BY_SLUG: Record<string, PackageImage[]> = {
  "lifestyle-transformation": [
    {
      src: POOL_LIFESTYLE,
      alt: "Joanna Michel poolside celebrating fitness lifestyle",
      presentation: "personal",
      objectPosition: "object-top",
    },
    {
      src: "/images/packages/lifestyle-gym-mirror.png",
      alt: "Joanna Michel mirror selfie in a gym studio",
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
      src: "/images/packages/bodybuilding-stage-solo.png",
      alt: "Joanna Michel posing on stage at a national pro qualifier",
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
  if (
    (slug === "bodybuilding-competition-prep" || slug === "lifestyle-transformation") &&
    defaults
  ) {
    return {
      src: defaults.src,
      alt: defaults.alt,
      presentation: defaults.presentation,
      objectPosition: defaults.objectPosition,
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

export function resolvePackageGallery(
  slug: string,
  imageUrl?: string | null,
  name?: string
): PackageImage[] {
  const gallery = PACKAGE_GALLERY_BY_SLUG[slug];
  if (gallery?.length) {
    return gallery;
  }
  const primary = resolvePackageImage(slug, imageUrl, name);
  return [primary];
}
