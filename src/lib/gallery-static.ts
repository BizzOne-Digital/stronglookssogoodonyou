import type { GalleryImage } from "@/components/gallery/GalleryGrid";

const base = "/images/gallery";

/** Joanna-approved gallery assets (also manageable via admin when uploaded to Cloudinary). */
export const STATIC_GALLERY_IMAGES: GalleryImage[] = [
  {
    id: "static-01",
    src: `${base}/01-competition-award.jpg`,
    alt: "Joanna Michel on stage at a Canadian physique competition with overall award",
    category: "Competition",
    caption: "Competition stage — overall celebration",
  },
  {
    id: "static-02",
    src: `${base}/02-competition-backstage.jpg`,
    alt: "Joanna Michel backstage with fellow athletes and medals",
    category: "Competition",
    caption: "Backstage with the team",
  },
  {
    id: "static-03",
    src: `${base}/03-competition-stage.jpg`,
    alt: "Joanna Michel posing on stage in competition bikini with medal",
    category: "Competition",
    caption: "On stage — natural championship",
  },
  {
    id: "static-04",
    src: `${base}/04-portraits-editorial.png`,
    alt: "Joanna Michel editorial fitness portrait",
    category: "Portraits",
    caption: "Editorial portrait",
  },
  {
    id: "static-05",
    src: `${base}/05-training-batl.jpg`,
    alt: "Joanna Michel at BATL axe throwing in training gear",
    category: "Training",
    caption: "Strength off the platform — BATL",
  },
  {
    id: "static-06",
    src: `${base}/06-brand-pink-shirt.jpg`,
    alt: "Joanna Michel wearing STRONG LOOKS GOOD ON YOU branded shirt",
    category: "Brand",
    caption: "STRONG LOOKS GOOD ON YOU™",
  },
  {
    id: "static-07",
    src: `${base}/07-portrait-travel.jpg`,
    alt: "Joanna Michel portrait",
    category: "Portraits",
    caption: "Portrait",
  },
  {
    id: "static-08",
    src: `${base}/08-training-pool.jpg`,
    alt: "Joanna Michel poolside celebrating fitness lifestyle",
    category: "Training",
    caption: "Recovery & confidence",
  },
  {
    id: "static-09",
    src: `${base}/09-training-studio.jpg`,
    alt: "Joanna Michel mirror photo in training studio",
    category: "Training",
    caption: "Studio session",
  },
  {
    id: "static-10",
    src: `${base}/10-competition-lineup.jpg`,
    alt: "Competition lineup on stage at Natural Canada event",
    category: "Competition",
    caption: "Natural Canada — stage lineup",
  },
  {
    id: "static-11",
    src: `${base}/11-competition-victory.jpg`,
    alt: "Joanna Michel victory pose on competition stage with medal",
    category: "Competition",
    caption: "Victory on stage",
  },
];

const HOME_PREVIEW_IDS = [
  "static-01",
  "static-11",
  "static-06",
  "static-08",
  "static-03",
  "static-04",
] as const;

export const HOME_GALLERY_PREVIEW = HOME_PREVIEW_IDS.map(
  (id) => STATIC_GALLERY_IMAGES.find((img) => img.id === id)!,
);
