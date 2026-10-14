import { SITE_IMAGES } from "@/lib/site-images";
import type { PresentationKind } from "@/lib/image-presentations";

const gallery = "/images/gallery";

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
    src: SITE_IMAGES.gymBenchWindow,
    alt: "Training environment for long term lifestyle coaching",
    presentation: "ambient",
  },
  "bodybuilding-competition-prep": {
    src: `${gallery}/03-competition-stage.jpg`,
    alt: "Joanna Michel on stage in competition bikini",
    presentation: "competition",
  },
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
