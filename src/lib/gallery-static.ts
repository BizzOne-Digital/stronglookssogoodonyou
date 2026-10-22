import type { GalleryImage } from "@/components/gallery/GalleryGrid";

const base = "/images/gallery";

/** Competition block first, then personal categories (gallery page & fallbacks). */
export const STATIC_GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "static-01",
    src: `${base}/01-competition-award.jpg`,
    alt: "Joanna Michel on stage at a Canadian physique competition with overall award",
    category: "Competition",
    caption: "Competition stage, overall celebration",
    presentation: "competition",
  },
  {
    id: "static-11",
    src: `${base}/11-competition-victory.jpg`,
    alt: "Joanna Michel victory pose on competition stage with medal",
    category: "Competition",
    caption: "Victory on stage",
    presentation: "competition",
  },
  {
    id: "static-03",
    src: `${base}/03-competition-stage.jpg`,
    alt: "Joanna Michel posing on stage in competition bikini with medal",
    category: "Competition",
    caption: "On stage, natural championship",
    presentation: "competition",
  },
  {
    id: "static-10",
    src: `${base}/10-competition-lineup.jpg`,
    alt: "Competition lineup on stage at Natural Canada event",
    category: "Competition",
    caption: "Natural Canada, stage lineup",
    presentation: "competition",
  },
  {
    id: "static-12",
    src: `${base}/12-competition-natural-canada-lineup.jpg`,
    alt: "Joanna Michel with competitors on stage at the Natural Canada IFBB Pro League",
    category: "Competition",
    caption: "Natural Canada IFBB Pro League",
    presentation: "ambient",
  },
  {
    id: "static-13",
    src: `${base}/13-competition-canfitpro-stage.jpg`,
    alt: "Joanna Michel posing on stage at the canfitpro natural championship",
    category: "Competition",
    caption: "canfitpro natural championship",
    presentation: "ambient",
  },
  {
    id: "static-14",
    src: `${base}/14-pro-qualifier-top-five.png`,
    alt: "Joanna Michel with Canada's national pro qualifier top five on stage",
    category: "Competition",
    caption: "National pro qualifier, top five",
    presentation: "ambient",
  },
  {
    id: "static-15",
    src: `${base}/15-competition-backstage.jpg`,
    alt: "Joanna Michel backstage at a physique competition with fellow athletes",
    category: "Competition",
    caption: "Backstage, show day",
    presentation: "competition",
  },
  {
    id: "static-16",
    src: `${base}/13-portrait-tropical.jpg`,
    alt: "Joanna Michel portrait outdoors",
    category: "Portraits",
    caption: "Portrait",
    presentation: "personal",
  },
  {
    id: "static-04",
    src: `${base}/04-portraits-editorial.png`,
    alt: "Joanna Michel editorial fitness portrait",
    category: "Portraits",
    caption: "Editorial portrait",
    presentation: "personal",
  },
  {
    id: "static-07",
    src: `${base}/07-portrait-travel.jpg`,
    alt: "Joanna Michel portrait",
    category: "Portraits",
    caption: "Portrait",
    presentation: "personal",
  },
  {
    id: "static-06",
    src: `${base}/06-brand-pink-shirt.jpg`,
    alt: "Joanna Michel wearing STRONG LOOKS GOOD ON YOU branded shirt",
    category: "Brand",
    caption: "STRONG LOOKS GOOD ON YOU™",
    presentation: "personal",
  },
  {
    id: "static-05",
    src: `${base}/05-training-batl.jpg`,
    alt: "Joanna Michel at BATL axe throwing in training gear",
    category: "Training",
    caption: "Strength off the platform, BATL",
    presentation: "personal",
  },
  {
    id: "static-08",
    src: `${base}/08-training-pool.jpg`,
    alt: "Joanna Michel poolside celebrating fitness lifestyle",
    category: "Training",
    caption: "Recovery & confidence",
    presentation: "personal",
  },
  {
    id: "static-09",
    src: `${base}/09-training-studio.jpg`,
    alt: "Joanna Michel mirror photo in training studio",
    category: "Training",
    caption: "Studio session",
    presentation: "personal",
  },
];

const HOME_PREVIEW_PERSONAL = ["static-16", "static-06", "static-04", "static-08"] as const;
const HOME_PREVIEW_COMPETITION = ["static-14", "static-15"] as const;

export const HOME_GALLERY_PREVIEW = [
  ...HOME_PREVIEW_PERSONAL,
  ...HOME_PREVIEW_COMPETITION,
].map((id) => STATIC_GALLERY_IMAGES.find((img) => img.id === id)!);

export function getHomeCompetitionGalleryPreview() {
  return HOME_PREVIEW_COMPETITION.map((id) => {
    const img = STATIC_GALLERY_IMAGES.find((i) => i.id === id)!;
    return {
      id: img.id,
      src: img.src,
      alt: img.alt,
      caption: img.caption,
      category: img.category,
      presentation: img.presentation,
    };
  });
}

export const GALLERY_CATEGORY_ORDER = [
  "Competition",
  "Portraits",
  "Brand",
  "Training",
] as const;

/** Not shown on /gallery (duplicate lineup + solo canfitpro stage). */
const GALLERY_PAGE_EXCLUDED_STATIC_IDS = new Set(["static-10", "static-13"]);

const GALLERY_PAGE_EXCLUDED_FILENAMES = new Set([
  "10-competition-lineup.jpg",
  "13-competition-canfitpro-stage.jpg",
]);

/** Skip seeding these into Mongo gallery (home preview still uses static paths). */
export const GALLERY_SEED_SKIP_SRC = new Set([
  "/images/gallery/10-competition-lineup.jpg",
  "/images/gallery/13-competition-canfitpro-stage.jpg",
]);

const LINEUP_GALLERY_FILENAMES = [
  "10-competition-lineup.jpg",
  "12-competition-natural-canada-lineup.jpg",
] as const;

export function galleryImageFilename(src: string): string {
  return (src.split("?")[0]?.split("/").pop() ?? src).toLowerCase();
}

/** One gallery tile for Toronto / Natural Canada lineup variants (Mongo + static). */
export function galleryDedupeKey(src: string, id: string): string {
  const file = galleryImageFilename(src);
  if (
    LINEUP_GALLERY_FILENAMES.some((name) => file === name) ||
    file.includes("lineup")
  ) {
    return "competition-lineup-slot";
  }
  return file || id;
}

export function lineupGalleryRank(src: string): number {
  const file = galleryImageFilename(src);
  if (file === "12-competition-natural-canada-lineup.jpg") return 0;
  if (file === "10-competition-lineup.jpg") return 1;
  if (file.includes("lineup")) return 2;
  return 3;
}

export function filterImagesForGalleryPage<T extends { id: string; src: string }>(
  images: T[]
): T[] {
  return images.filter((img) => {
    if (GALLERY_PAGE_EXCLUDED_STATIC_IDS.has(img.id)) return false;
    const file = galleryImageFilename(img.src);
    return !GALLERY_PAGE_EXCLUDED_FILENAMES.has(file);
  });
}

export function sortGalleryImages<T extends { category: string; order?: number }>(
  images: T[]
): T[] {
  return [...images].sort((a, b) => {
    const ai = GALLERY_CATEGORY_ORDER.indexOf(
      a.category as (typeof GALLERY_CATEGORY_ORDER)[number]
    );
    const bi = GALLERY_CATEGORY_ORDER.indexOf(
      b.category as (typeof GALLERY_CATEGORY_ORDER)[number]
    );
    const ca = ai === -1 ? 99 : ai;
    const cb = bi === -1 ? 99 : bi;
    if (ca !== cb) return ca - cb;
    return (a.order ?? 0) - (b.order ?? 0);
  });
}
